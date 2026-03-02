import { Ticket, Clock, Timer } from "lucide-react"

interface TokenStatsProps {
  tokensIssued: number
  sessionStart: string
  sessionDuration: string
}

export function TokenStats({ tokensIssued, sessionStart, sessionDuration }: TokenStatsProps) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
          <Ticket className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground sm:text-xs">Tokens Issued</p>
          <p className="text-lg font-bold text-foreground sm:text-xl">{tokensIssued}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
          <Clock className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground sm:text-xs">Session Start</p>
          <p className="truncate text-sm font-bold text-foreground">{sessionStart}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 sm:h-10 sm:w-10">
          <Timer className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] text-muted-foreground sm:text-xs">Duration</p>
          <p className="text-sm font-bold text-foreground font-mono">{sessionDuration}</p>
        </div>
      </div>
    </div>
  )
}
