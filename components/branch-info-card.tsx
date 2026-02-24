import { MapPin, Building2, Phone, Clock } from "lucide-react"

interface BranchInfoCardProps {
  branchName: string
  branchCode: string
  address: string
  phone: string
  timings: string
}

export function BranchInfoCard({
  branchName,
  branchCode,
  address,
  phone,
  timings,
}: BranchInfoCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Building2 className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">{branchName}</h2>
          <p className="text-xs text-muted-foreground">Branch Code: {branchCode}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-start gap-3">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm text-foreground">{address}</span>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm text-foreground">{phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="text-sm text-foreground">{timings}</span>
        </div>
      </div>
    </div>
  )
}
