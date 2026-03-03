"use client"

import { useRouter } from "next/navigation"
import {
  Play,
  Square,
  CircleDot,
  Timer,
  CalendarDays,
  Ticket,
  ClipboardList,
  LayoutGrid,
  Activity,
  Stethoscope,
  GraduationCap,
  Dumbbell,
  ShieldCheck,
  Printer,
  Truck,
  CreditCard,
  ArrowRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

interface SessionControlsProps {
  isSessionActive: boolean
  sessionStartTime: string | null
  sessionDuration: string
  todayDate: string
  onStartSession: () => void
  onCloseSession: () => void
}

const PROCESS_STEPS = [
  { label: "Token Issuance", path: "/token-issuance", icon: Ticket, color: "bg-blue-500/10 text-blue-600" },
  { label: "Registration", path: "/driving-license/registration", icon: ClipboardList, color: "bg-emerald-500/10 text-emerald-600" },
  { label: "Payment", path: "/driving-license/payment-challan", icon: CreditCard, color: "bg-amber-500/10 text-amber-600" },
  { label: "Medical Test", path: "/driving-license/medical-test", icon: Stethoscope, color: "bg-red-500/10 text-red-600" },
  { label: "Academic Test", path: "/driving-license/academic-test", icon: GraduationCap, color: "bg-violet-500/10 text-violet-600" },
  { label: "Physical Test", path: "/driving-license/physical-test", icon: Dumbbell, color: "bg-orange-500/10 text-orange-600" },
  { label: "DSP Approval", path: "/driving-license/dsp-approval", icon: ShieldCheck, color: "bg-indigo-500/10 text-indigo-600" },
  { label: "License Printing", path: "/driving-license/license-printing", icon: Printer, color: "bg-cyan-500/10 text-cyan-600" },
  { label: "TCS Dispatch", path: "/driving-license/dispatch-booking", icon: Truck, color: "bg-pink-500/10 text-pink-600" },
]

export function SessionControls({
  isSessionActive,
  sessionStartTime,
  sessionDuration,
  todayDate,
  onStartSession,
  onCloseSession,
}: SessionControlsProps) {
  const router = useRouter()

  return (
    <div className="flex flex-col gap-4">
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
            className="h-11 flex-1 gap-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-50 sm:h-12"
          >
            <Play className="h-4 w-4 sm:h-5 sm:w-5" />
            Start Session
          </Button>
          <Button
            onClick={onCloseSession}
            disabled={!isSessionActive}
            variant="outline"
            className="h-11 flex-1 gap-2 rounded-lg border-destructive/40 font-semibold text-destructive transition-all hover:bg-destructive hover:text-destructive-foreground disabled:opacity-50 disabled:border-border disabled:text-muted-foreground sm:h-12"
          >
            <Square className="h-4 w-4" />
            Close Session
          </Button>
        </div>
      </div>

      {/* Process Steps - Quick Launch (only visible when session is active) */}
      {isSessionActive && (
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground sm:text-base">Process Steps</h2>
            </div>
            <button
              type="button"
              onClick={() => router.push("/driving-license/process-flow")}
              className="flex items-center gap-1 text-[11px] font-medium text-primary hover:underline sm:text-xs"
            >
              Full Flow
              <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon
              return (
                <button
                  key={step.path}
                  type="button"
                  onClick={() => router.push(step.path)}
                  className="group flex flex-col items-center gap-2 rounded-lg border border-border p-3 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm active:scale-[0.97] sm:p-4"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${step.color} transition-transform group-hover:scale-110 sm:h-10 sm:w-10`}>
                    <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
                  </div>
                  <span className="text-center text-[10px] font-medium leading-tight text-foreground sm:text-xs">
                    {step.label}
                  </span>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => router.push("/driving-license")}
              className="group flex flex-col items-center gap-2 rounded-lg border border-dashed border-border p-3 transition-all hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm active:scale-[0.97] sm:p-4"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-secondary text-muted-foreground transition-transform group-hover:scale-110 sm:h-10 sm:w-10">
                <LayoutGrid className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
              <span className="text-center text-[10px] font-medium leading-tight text-foreground sm:text-xs">
                All Modules
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
