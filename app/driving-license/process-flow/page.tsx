"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import {
  Ticket,
  FileText,
  Banknote,
  Stethoscope,
  BookOpen,
  Car,
  ShieldCheck,
  Printer,
  Package,
  Truck,
  ChevronRight,
  Users,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  Activity,
  BarChart3,
} from "lucide-react"

// ===== Process Steps =====
const PROCESS_STEPS = [
  {
    id: 1,
    key: "token",
    title: "Token Issuance",
    description: "Queue token generation",
    icon: Ticket,
    route: "/token-issuance",
    color: "bg-blue-500",
    lightColor: "bg-blue-50 dark:bg-blue-950/30",
    textColor: "text-blue-700 dark:text-blue-300",
    borderColor: "border-blue-200 dark:border-blue-800",
  },
  {
    id: 2,
    key: "registration",
    title: "Registration",
    description: "Applicant biodata entry",
    icon: FileText,
    route: "/driving-license/registration",
    color: "bg-indigo-500",
    lightColor: "bg-indigo-50 dark:bg-indigo-950/30",
    textColor: "text-indigo-700 dark:text-indigo-300",
    borderColor: "border-indigo-200 dark:border-indigo-800",
  },
  {
    id: 3,
    key: "payment",
    title: "Payment (NBP)",
    description: "Challan & fee collection",
    icon: Banknote,
    route: "/driving-license/payment-challan",
    color: "bg-emerald-500",
    lightColor: "bg-emerald-50 dark:bg-emerald-950/30",
    textColor: "text-emerald-700 dark:text-emerald-300",
    borderColor: "border-emerald-200 dark:border-emerald-800",
  },
  {
    id: 4,
    key: "medical",
    title: "Medical Test",
    description: "Health & eyesight check",
    icon: Stethoscope,
    route: "/driving-license/medical-test",
    color: "bg-rose-500",
    lightColor: "bg-rose-50 dark:bg-rose-950/30",
    textColor: "text-rose-700 dark:text-rose-300",
    borderColor: "border-rose-200 dark:border-rose-800",
  },
  {
    id: 5,
    key: "academic",
    title: "Academic Test",
    description: "Computer-based theory",
    icon: BookOpen,
    route: "/driving-license/academic-test",
    color: "bg-amber-500",
    lightColor: "bg-amber-50 dark:bg-amber-950/30",
    textColor: "text-amber-700 dark:text-amber-300",
    borderColor: "border-amber-200 dark:border-amber-800",
  },
  {
    id: 6,
    key: "physical",
    title: "Physical Test",
    description: "Driving assessment",
    icon: Car,
    route: "/driving-license/physical-test",
    color: "bg-orange-500",
    lightColor: "bg-orange-50 dark:bg-orange-950/30",
    textColor: "text-orange-700 dark:text-orange-300",
    borderColor: "border-orange-200 dark:border-orange-800",
  },
  {
    id: 7,
    key: "approval",
    title: "Approval",
    description: "DSP / Officer review",
    icon: ShieldCheck,
    route: "/driving-license/dsp-approval",
    color: "bg-purple-500",
    lightColor: "bg-purple-50 dark:bg-purple-950/30",
    textColor: "text-purple-700 dark:text-purple-300",
    borderColor: "border-purple-200 dark:border-purple-800",
  },
  {
    id: 8,
    key: "printing",
    title: "Printing",
    description: "Smart card printing",
    icon: Printer,
    route: "/driving-license/license-printing",
    color: "bg-cyan-500",
    lightColor: "bg-cyan-50 dark:bg-cyan-950/30",
    textColor: "text-cyan-700 dark:text-cyan-300",
    borderColor: "border-cyan-200 dark:border-cyan-800",
  },
  {
    id: 9,
    key: "tcs",
    title: "TCS Booked",
    description: "Courier dispatch booking",
    icon: Package,
    route: "/driving-license/dispatch-booking",
    color: "bg-teal-500",
    lightColor: "bg-teal-50 dark:bg-teal-950/30",
    textColor: "text-teal-700 dark:text-teal-300",
    borderColor: "border-teal-200 dark:border-teal-800",
  },
  {
    id: 10,
    key: "dispatched",
    title: "Dispatched",
    description: "Delivered & completed",
    icon: Truck,
    route: "/driving-license/dispatch-booking",
    color: "bg-green-600",
    lightColor: "bg-green-50 dark:bg-green-950/30",
    textColor: "text-green-700 dark:text-green-300",
    borderColor: "border-green-200 dark:border-green-800",
  },
]

// ===== Mock queue stats per step =====
const MOCK_STATS: Record<string, { pending: number; completed: number; failed: number }> = {
  token: { pending: 12, completed: 87, failed: 0 },
  registration: { pending: 8, completed: 79, failed: 0 },
  payment: { pending: 6, completed: 73, failed: 2 },
  medical: { pending: 15, completed: 58, failed: 4 },
  academic: { pending: 10, completed: 48, failed: 6 },
  physical: { pending: 7, completed: 41, failed: 3 },
  approval: { pending: 5, completed: 36, failed: 2 },
  printing: { pending: 4, completed: 32, failed: 0 },
  tcs: { pending: 8, completed: 24, failed: 0 },
  dispatched: { pending: 3, completed: 21, failed: 0 },
}

export default function ProcessFlowPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentDate] = useState(
    new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  )

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

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const totalToday = Object.values(MOCK_STATS).reduce((sum, s) => sum + s.completed, 0)
  const totalPending = Object.values(MOCK_STATS).reduce((sum, s) => sum + s.pending, 0)
  const totalFailed = Object.values(MOCK_STATS).reduce((sum, s) => sum + s.failed, 0)

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SetupPageHeader
        title="Process Flow"
        username={username}
        onLogout={() => { sessionStorage.clear(); router.replace("/") }}
        onBack={() => router.push("/driving-license")}
      />

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto max-w-7xl">
          {/* Page Header */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-xl font-bold text-foreground sm:text-2xl text-balance">
                Driving License Process Flow
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">{currentDate}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => router.push("/driving-license/applicant-history")}
                className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Applicant History</span>
                <span className="sm:hidden">History</span>
              </button>
              <button
                type="button"
                onClick={() => router.push("/driving-license")}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">All Modules</span>
                <span className="sm:hidden">Modules</span>
              </button>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30 sm:h-10 sm:w-10">
                <Activity className="h-4 w-4 text-blue-600 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground sm:text-xl">{totalToday}</p>
                <p className="truncate text-xs text-muted-foreground">Completed Today</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30 sm:h-10 sm:w-10">
                <Clock className="h-4 w-4 text-amber-600 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground sm:text-xl">{totalPending}</p>
                <p className="truncate text-xs text-muted-foreground">In Queue</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/30 sm:h-10 sm:w-10">
                <CheckCircle2 className="h-4 w-4 text-green-600 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground sm:text-xl">
                  {Math.round((totalToday / (totalToday + totalFailed)) * 100)}%
                </p>
                <p className="truncate text-xs text-muted-foreground">Pass Rate</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 sm:p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 dark:bg-rose-900/30 sm:h-10 sm:w-10">
                <XCircle className="h-4 w-4 text-rose-600 sm:h-5 sm:w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-lg font-bold text-foreground sm:text-xl">{totalFailed}</p>
                <p className="truncate text-xs text-muted-foreground">Failed Today</p>
              </div>
            </div>
          </div>

          {/* Horizontal Flow - Desktop */}
          <div className="mb-6 hidden rounded-xl border border-border bg-card p-4 xl:block">
            <h2 className="mb-4 text-sm font-bold text-foreground">Complete Process Pipeline</h2>
            <div className="flex items-center gap-1">
              {PROCESS_STEPS.map((step, index) => {
                const Icon = step.icon
                const stats = MOCK_STATS[step.key]
                return (
                  <div key={step.id} className="flex items-center">
                    <button
                      type="button"
                      onClick={() => router.push(step.route)}
                      className={`group flex w-[108px] flex-col items-center gap-1.5 rounded-lg border p-2.5 transition-all hover:shadow-md ${step.borderColor} ${step.lightColor}`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${step.color}`}>
                        <Icon className="h-4 w-4 text-white" />
                      </div>
                      <span className={`text-center text-[10px] font-bold leading-tight ${step.textColor}`}>
                        {step.title}
                      </span>
                      <div className="flex w-full justify-between text-[9px]">
                        <span className="font-semibold text-amber-600">{stats.pending}</span>
                        <span className="font-semibold text-green-600">{stats.completed}</span>
                        {stats.failed > 0 && (
                          <span className="font-semibold text-rose-500">{stats.failed}</span>
                        )}
                      </div>
                    </button>
                    {index < PROCESS_STEPS.length - 1 && (
                      <ArrowRight className="mx-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                  </div>
                )
              })}
            </div>
            <div className="mt-3 flex items-center gap-4 border-t border-border pt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-amber-500" /> Pending</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-green-500" /> Completed</span>
              <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-rose-500" /> Failed</span>
            </div>
          </div>

          {/* Step Cards - All screens */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {PROCESS_STEPS.map((step, index) => {
              const Icon = step.icon
              const stats = MOCK_STATS[step.key]
              const total = stats.completed + stats.pending + stats.failed
              const completionPct = total > 0 ? Math.round((stats.completed / total) * 100) : 0

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => router.push(step.route)}
                  className={`group flex flex-col rounded-xl border p-4 text-left transition-all hover:shadow-lg active:scale-[0.98] ${step.borderColor} ${step.lightColor}`}
                >
                  {/* Step number + icon row */}
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${step.color} shadow-sm`}>
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <p className={`text-sm font-bold leading-tight ${step.textColor}`}>
                          {step.title}
                        </p>
                        <p className="text-[11px] text-muted-foreground">{step.description}</p>
                      </div>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-foreground/5 text-xs font-bold text-muted-foreground">
                      {String(index + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-foreground/5">
                    <div
                      className={`h-full rounded-full ${step.color} transition-all`}
                      style={{ width: `${completionPct}%` }}
                    />
                  </div>

                  {/* Stats row */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3 text-amber-500" />
                        <span className="font-semibold text-foreground">{stats.pending}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-500" />
                        <span className="font-semibold text-foreground">{stats.completed}</span>
                      </span>
                      {stats.failed > 0 && (
                        <span className="flex items-center gap-1">
                          <XCircle className="h-3 w-3 text-rose-500" />
                          <span className="font-semibold text-foreground">{stats.failed}</span>
                        </span>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                  </div>
                </button>
              )
            })}
          </div>

          {/* Status Flow Text */}
          <div className="mt-6 rounded-xl border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-bold text-foreground">Status Flow</h3>
            <div className="flex flex-wrap items-center gap-1.5">
              {PROCESS_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center gap-1.5">
                  <span className={`rounded-md px-2 py-1 text-xs font-semibold ${step.lightColor} ${step.textColor} border ${step.borderColor}`}>
                    {step.title}
                  </span>
                  {index < PROCESS_STEPS.length - 1 && (
                    <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Driving License Sindh - Sindh Police IT Department
        </p>
      </footer>
    </div>
  )
}
