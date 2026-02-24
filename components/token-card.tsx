"use client"

import { Ticket, Printer, RotateCcw, Clock, Hash, User, CreditCard, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface TokenData {
  tokenNumber: string
  applicantName: string
  cnic: string
  serviceType: string
  counter: string
  issuedAt: string
  date: string
}

interface TokenCardProps {
  token: TokenData
  onPrint: () => void
  onNewToken: () => void
}

export function TokenCard({ token, onPrint, onNewToken }: TokenCardProps) {
  return (
    <div className="rounded-xl border-2 border-primary/20 bg-card p-6 shadow-sm">
      {/* Token Header */}
      <div className="mb-5 flex flex-col items-center gap-3 border-b border-border pb-5">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10">
          <Ticket className="h-7 w-7 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Token Number</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-primary font-mono">{token.tokenNumber}</p>
        </div>
      </div>

      {/* Token Details */}
      <div className="mb-5 flex flex-col gap-3">
        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Applicant</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.applicantName}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">CNIC</span>
          </div>
          <span className="text-sm font-semibold text-foreground font-mono">{token.cnic}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Service</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.serviceType}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Counter</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.counter}</span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-secondary/50 px-4 py-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Issued At</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{token.issuedAt}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onPrint}
          className="h-11 flex-1 gap-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg"
        >
          <Printer className="h-4 w-4" />
          Print Token
        </Button>
        <Button
          onClick={onNewToken}
          variant="outline"
          className="h-11 flex-1 gap-2 rounded-lg font-semibold transition-all"
        >
          <RotateCcw className="h-4 w-4" />
          New Token
        </Button>
      </div>
    </div>
  )
}
