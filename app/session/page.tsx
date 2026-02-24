"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { SessionHeader } from "@/components/session-header"
import { BranchInfoCard } from "@/components/branch-info-card"
import { SessionControls } from "@/components/session-controls"

export default function SessionPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null)
  const [sessionDuration, setSessionDuration] = useState("00:00:00")
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check authentication
  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") {
      router.replace("/")
      return
    }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  // Duration timer
  useEffect(() => {
    if (!isSessionActive || !startTimestamp) return

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0")
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")
      const seconds = String(elapsed % 60).padStart(2, "0")
      setSessionDuration(`${hours}:${minutes}:${seconds}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [isSessionActive, startTimestamp])

  const handleStartSession = useCallback(() => {
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    setSessionStartTime(timeStr)
    setStartTimestamp(Date.now())
    setIsSessionActive(true)
    setSessionDuration("00:00:00")
    // Store session info and navigate to token issuance
    sessionStorage.setItem("dls_session_active", "true")
    sessionStorage.setItem("dls_session_start", timeStr)
    sessionStorage.setItem("dls_session_start_ts", String(Date.now()))
    router.push("/token-issuance")
  }, [router])

  const handleCloseSession = useCallback(() => {
    setIsSessionActive(false)
    setStartTimestamp(null)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.removeItem("dls_authenticated")
    sessionStorage.removeItem("dls_user")
    router.replace("/")
  }, [router])

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SessionHeader username={username} onLogout={handleLogout} />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          {/* Welcome message */}
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              {"Welcome back, "}{username}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your branch session below. Start a session to begin processing applications.
            </p>
          </div>

          {/* Branch info */}
          <BranchInfoCard
            branchName="DLS Branch Office - Clifton"
            branchCode="KHI-CLF-001"
            address="Block 5, Clifton, Karachi, Sindh, Pakistan"
            phone="+92-21-35874590"
            timings="Mon - Sat: 9:00 AM - 5:00 PM"
          />

          {/* Session controls */}
          <SessionControls
            isSessionActive={isSessionActive}
            sessionStartTime={sessionStartTime}
            sessionDuration={sessionDuration}
            todayDate={todayDate}
            onStartSession={handleStartSession}
            onCloseSession={handleCloseSession}
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secured by Sindh Police IT Department</span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center">
            {"Government of Sindh - All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  )
}
