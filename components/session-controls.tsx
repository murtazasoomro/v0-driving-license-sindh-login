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
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      {/* Status indicator */}
      <div className="mb-4 flex items-center justify-between sm:mb-6">
        <h2 className="text-base font-bold text-foreground sm:text-lg">Session Status</h2>
        <div className="flex items-center gap-2">
          <CircleDot
            className={`h-4 w-4 ${
              isSessionActive ? "text-green-500 animate-pulse" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-xs font-semibold sm:text-sm ${
              isSessionActive ? "text-green-600" : "text-muted-foreground"
            }`}
          >
            {isSessionActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Session info */}
      <div className="mb-4 grid grid-cols-1 gap-3 sm:mb-6 sm:grid-cols-3 sm:gap-4">
        <div className="rounded-lg bg-secondary/50 p-3 sm:p-4">
          <div className="mb-1 flex items-center gap-2">
            <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">Date</span>
          </div>
          <p className="text-xs font-semibold text-foreground sm:text-sm">{todayDate}</p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3 sm:p-4">
          <div className="mb-1 flex items-center gap-2">
            <Play className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">Started At</span>
          </div>
          <p className="text-xs font-semibold text-foreground sm:text-sm">
            {sessionStartTime || "--:--:--"}
          </p>
        </div>
        <div className="rounded-lg bg-secondary/50 p-3 sm:p-4">
          <div className="mb-1 flex items-center gap-2">
            <Timer className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-medium text-muted-foreground sm:text-xs">Duration</span>
          </div>
          <p className="text-xs font-semibold text-foreground sm:text-sm">{sessionDuration}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onStartSession}
          disabled={isSessionActive}
          className="h-11 flex-1 gap-2 rounded-lg bg-primary font-semibold text-primary-foreground shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 sm:h-12"
        >
          <Play className="h-4 w-4 sm:h-5 sm:w-5" />
          Start Session
        </Button>
        <Button
          onClick={onCloseSession}
          disabled={!isSessionActive}
          variant="outline"
          className="h-11 flex-1 gap-2 rounded-lg border-destructive/40 font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground disabled:border-border disabled:text-muted-foreground disabled:opacity-50 sm:h-12"
        >
          <Square className="h-4 w-4" />
          Close Session
        </Button>
      </div>
    </div>
  )
}
