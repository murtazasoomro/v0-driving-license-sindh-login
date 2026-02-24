"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [username, setUsername] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login, then redirect to session page
    setTimeout(() => {
      // Store user info in sessionStorage for the session page
      sessionStorage.setItem("dls_user", username || "Officer")
      sessionStorage.setItem("dls_authenticated", "true")
      router.push("/session")
    }, 1500)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
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
            className="h-4 w-4 rounded border-border accent-primary"
          />
          <span className="text-sm text-muted-foreground">Remember me</span>
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
    </form>
  )
}
