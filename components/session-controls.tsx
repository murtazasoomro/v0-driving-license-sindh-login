"use client"

import { Play, Square, CircleDot, Timer, CalendarDays } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SessionControlsProps {
  isSessionActive: boolean
  sessionStartTime: string | null
  sessionDuration: string
  todayDate: string
  onStartSession: () => void
  onCloseSession: () => void
}

export function SessionControls({
  isSessionActive,
  sessionStartTime,
  sessionDuration,
  todayDate,
  onStartSession,
  onCloseSession,
}: SessionControlsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      {/* Status indicator */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-foreground">Session Status</h2>
        <div className="flex items-center gap-2">
          <CircleDot
            className={`h-4 w-4 ${
              isSessionActive ? "text-green-500 animate-pulse" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-sm font-semibold ${
              isSessionActive ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {isSessionActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Session info */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Date</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{todayDate}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Play className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Started At</span>
          </div>
          <p className="text-sm font-semibold text-foreground">
            {sessionStartTime || "--:--:--"}
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-4">
          <div className="flex items-center gap-2 mb-1">
            <Timer className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Duration</span>
          </div>
          <p className="text-sm font-semibold text-foreground">{sessionDuration}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onStartSession}
          disabled={isSessionActive}
          className="h-12 flex-1 gap-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50"
        >
          <Play className="h-5 w-5" />
          Start Session
        </Button>
        <Button
          onClick={onCloseSession}
          disabled={!isSessionActive}
          variant="outline"
          className="h-12 flex-1 gap-2 rounded-lg border-destructive/40 font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:border-border disabled:text-muted-foreground"
        >
          <Square className="h-4 w-4" />
          Close Session
        </Button>
      </div>
    </div>
  )
}
