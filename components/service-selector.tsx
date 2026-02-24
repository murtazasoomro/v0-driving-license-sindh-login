"use client"

import { useState } from "react"
import { Ticket, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

const SERVICES = [
  { id: "new-license", label: "New License", description: "First time license issuance" },
  { id: "renewal", label: "Renewal", description: "Renew existing license" },
  { id: "duplicate", label: "Duplicate", description: "Lost or damaged license" },
  { id: "international", label: "International DL", description: "International driving permit" },
  { id: "learner", label: "Learner Permit", description: "Learner driving permit" },
  { id: "endorsement", label: "Endorsement", description: "Add vehicle category" },
]

interface ServiceSelectorProps {
  onIssueToken: (service: string) => void
  isIssuing: boolean
}

export function ServiceSelector({ onIssueToken, isIssuing }: ServiceSelectorProps) {
  const [selectedService, setSelectedService] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedService) {
      onIssueToken(selectedService)
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-bold text-foreground">Select Service</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-medium text-foreground">Service Type</Label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {SERVICES.map((service) => (
              <button
                key={service.id}
                type="button"
                onClick={() => setSelectedService(service.id)}
                className={`flex flex-col items-start rounded-lg border px-4 py-3 text-left transition-all ${
                  selectedService === service.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary"
                    : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
                }`}
              >
                <span
                  className={`text-sm font-semibold ${
                    selectedService === service.id ? "text-primary" : "text-foreground"
                  }`}
                >
                  {service.label}
                </span>
                <span className="text-xs text-muted-foreground">{service.description}</span>
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isIssuing || !selectedService}
          className="h-12 w-full gap-2 rounded-lg bg-primary text-primary-foreground font-semibold shadow-md transition-all hover:bg-primary/90 hover:shadow-lg disabled:opacity-60"
        >
          {isIssuing ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Generating Token...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <Ticket className="h-5 w-5" />
              Issue Token
            </span>
          )}
        </Button>
      </form>
    </div>
  )
}
