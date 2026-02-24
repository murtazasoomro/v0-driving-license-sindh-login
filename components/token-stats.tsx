import { Ticket, Clock, Timer } from "lucide-react"

interface TokenStatsProps {
  tokensIssued: number
  sessionStart: string
  sessionDuration: string
}

export function TokenStats({ tokensIssued, sessionStart, sessionDuration }: TokenStatsProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Ticket className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Tokens Issued</p>
          <p className="text-xl font-bold text-foreground">{tokensIssued}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Clock className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Session Start</p>
          <p className="text-sm font-bold text-foreground">{sessionStart}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Timer className="h-5 w-5 text-primary" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Duration</p>
          <p className="text-sm font-bold text-foreground font-mono">{sessionDuration}</p>
        </div>
      </div>
    </div>
  )
}
