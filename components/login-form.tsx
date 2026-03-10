"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn, AlertCircle, Database } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { loginUser } from "@/lib/api"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [useDatabase, setUseDatabase] = useState(true)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Try database login first if enabled
    if (useDatabase) {
      try {
        const result = await loginUser({ username, password })
        
        if (result.success && result.data?.user) {
          const user = result.data.user
          sessionStorage.setItem("dls_user", user.fullname || user.loginid)
          sessionStorage.setItem("dls_username", user.loginid)
          sessionStorage.setItem("dls_userid", String(user.userid))
          sessionStorage.setItem("dls_authenticated", "true")
          sessionStorage.setItem("dls_branch_name", user.busunitname || "DLS Branch Office")
          sessionStorage.setItem("dls_busunitid", String(user.busunitid))
          sessionStorage.setItem("dls_use_database", "true")
          router.push("/session")
          return
        } else if (result.error?.includes("credentials")) {
          setError("Invalid username or password")
          setIsLoading(false)
          return
        }
        // If database error (not auth error), fall through to demo mode
      } catch {
        // Database not available, continue to demo mode
        console.log("[v0] Database not available, using demo mode")
      }
    }

    // Demo mode fallback (admin / admin)
    if (username === "admin" && password === "admin") {
      sessionStorage.setItem("dls_user", "Administrator")
      sessionStorage.setItem("dls_username", "admin")
      sessionStorage.setItem("dls_authenticated", "true")
      sessionStorage.setItem("dls_branch_name", "DLS Branch Office - Clifton")
      sessionStorage.setItem("dls_branch_code", "BR-001")
      sessionStorage.setItem("dls_busunitid", "1")
      sessionStorage.setItem("dls_use_database", "false")
      setTimeout(() => router.push("/session"), 800)
    } else {
      setError("Invalid username or password")
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <Label htmlFor="username" className="text-sm font-medium text-foreground">
          Username / CNIC
        </Label>
        <Input
          id="username"
          type="text"
          placeholder="Enter your CNIC or username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-11 rounded-lg border-border bg-secondary/50 px-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="password" className="text-sm font-medium text-foreground">
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 rounded-lg border-border bg-secondary/50 px-4 pr-11 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={useDatabase}
            onChange={(e) => setUseDatabase(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Database className="h-3.5 w-3.5" />
            Use SQL Server
          </span>
        </label>
        <a
          href="#"
          className="text-sm font-medium text-primary transition-colors hover:text-primary/80"
        >
          Forgot password?
        </a>
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="h-11 w-full rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-70"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Signing in...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <LogIn className="h-4 w-4" />
            Sign In
          </span>
        )}
      </Button>

      {/* DB Status Link */}
      <div className="text-center">
        <a
          href="/db-status"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary"
        >
          <Database className="h-3 w-3" />
          Check Database Connection
        </a>
      </div>
    </form>
  )
}
