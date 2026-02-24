"use client"

import { useState } from "react"
import { CreditCard, BookOpen, Ticket, User, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SERVICES = [
  { id: "learner", label: "Learner", description: "Learner driving permit" },
  { id: "permanent", label: "Permanent", description: "Permanent driving license" },
  { id: "international", label: "International", description: "International driving permit" },
]

const TOKEN_TYPES = [
  {
    id: "normal",
    typeNumber: 1,
    label: "Normal",
    description: "Regular queue token",
    icon: User,
  },
  {
    id: "fast-track",
    typeNumber: 2,
    label: "Fast Track",
    description: "Senior citizens priority",
    icon: Zap,
  },
]

interface TokenIssuanceFormProps {
  onIssueToken: (
    docType: "cnic" | "passport",
    docNumber: string,
    service: string,
    tokenType: string,
    tokenTypeNumber: number
  ) => void
  isIssuing: boolean
}

export function TokenIssuanceForm({ onIssueToken, isIssuing }: TokenIssuanceFormProps) {
  const [docType, setDocType] = useState<"cnic" | "passport">("cnic")
  const [docNumber, setDocNumber] = useState("")
  const [selectedService, setSelectedService] = useState("")
  const [selectedTokenType, setSelectedTokenType] = useState("")

  const formatCNIC = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 13)
    if (digits.length <= 5) return digits
    if (digits.length <= 12) return `${digits.slice(0, 5)}-${digits.slice(5)}`
    return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12)}`
  }

  const handleDocNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (docType === "cnic") {
      setDocNumber(formatCNIC(e.target.value))
    } else {
      setDocNumber(e.target.value.toUpperCase())
    }
  }

  const isCnicValid = docType === "cnic" && docNumber.replace(/\D/g, "").length === 13
  const isPassportValid = docType === "passport" && docNumber.trim().length >= 6
  const isDocValid = isCnicValid || isPassportValid
  const canSubmit = isDocValid && selectedService && selectedTokenType && !isIssuing

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (canSubmit) {
      const tokenTypeDef = TOKEN_TYPES.find((t) => t.id === selectedTokenType)
      onIssueToken(
        docType,
        docNumber,
        selectedService,
        selectedTokenType,
        tokenTypeDef?.typeNumber || 1
      )
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Document Type & Number */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-foreground">Token Issuance</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Enter document number, select license type and token type.
        </p>

        {/* Document Type Toggle */}
        <div className="mb-5">
          <Label className="mb-2 block text-sm font-medium text-foreground">
            Document Type
          </Label>
          <div className="flex rounded-lg border border-border bg-secondary/30 p-1">
            <button
              type="button"
              onClick={() => {
                setDocType("cnic")
                setDocNumber("")
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                docType === "cnic"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <CreditCard className="h-4 w-4" />
              CNIC
            </button>
            <button
              type="button"
              onClick={() => {
                setDocType("passport")
                setDocNumber("")
              }}
              className={`flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                docType === "passport"
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BookOpen className="h-4 w-4" />
              Passport
            </button>
          </div>
        </div>

        {/* Document Number Input */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="doc-number" className="text-sm font-medium text-foreground">
            {docType === "cnic" ? "CNIC Number" : "Passport Number"}
          </Label>
          <Input
            id="doc-number"
            type="text"
            placeholder={
              docType === "cnic" ? "XXXXX-XXXXXXX-X" : "Enter passport number"
            }
            value={docNumber}
            onChange={handleDocNumberChange}
            required
            className="h-12 rounded-lg border-border bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary font-mono text-base tracking-wider"
          />
          <p className="text-xs text-muted-foreground">
            {docType === "cnic"
              ? "Enter 13-digit CNIC number (e.g., 42201-1234567-1)"
              : "Enter passport number (e.g., AB1234567)"}
          </p>
        </div>
      </div>

      {/* License Type Selection */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-foreground">License Type</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Select the license type for this token.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              type="button"
              onClick={() => setSelectedService(service.id)}
              className={`flex flex-col items-center rounded-lg border px-4 py-4 text-center transition-all ${
                selectedService === service.id
                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                  : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
              }`}
            >
              <span
                className={`text-base font-bold ${
                  selectedService === service.id ? "text-primary" : "text-foreground"
                }`}
              >
                {service.label}
              </span>
              <span className="mt-0.5 text-xs text-muted-foreground">{service.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Token Type Selection */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
        <h2 className="mb-1 text-lg font-bold text-foreground">Token Type</h2>
        <p className="mb-5 text-sm text-muted-foreground">
          Select Normal or Fast Track (senior citizens) token.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {TOKEN_TYPES.map((type) => {
            const Icon = type.icon
            return (
              <button
                key={type.id}
                type="button"
                onClick={() => setSelectedTokenType(type.id)}
                className={`flex items-center gap-4 rounded-lg border px-5 py-4 text-left transition-all ${
                  selectedTokenType === type.id
                    ? type.id === "fast-track"
                      ? "border-accent bg-accent/5 ring-2 ring-accent"
                      : "border-primary bg-primary/5 ring-2 ring-primary"
                    : "border-border bg-secondary/30 hover:border-primary/40 hover:bg-secondary/60"
                }`}
              >
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                    selectedTokenType === type.id
                      ? type.id === "fast-track"
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"
                      : "bg-secondary text-muted-foreground"
                  }`}
                >
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-base font-bold ${
                        selectedTokenType === type.id
                          ? type.id === "fast-track"
                            ? "text-accent"
                            : "text-primary"
                          : "text-foreground"
                      }`}
                    >
                      {type.label}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-bold ${
                        selectedTokenType === type.id
                          ? type.id === "fast-track"
                            ? "bg-accent/10 text-accent"
                            : "bg-primary/10 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {"Type "}{type.typeNumber}
                    </span>
                  </div>
                  <span className="mt-0.5 text-xs text-muted-foreground">{type.description}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Issue Token Button */}
      <Button
        type="submit"
        disabled={!canSubmit}
        className="h-13 w-full gap-2.5 rounded-xl bg-primary text-primary-foreground text-base font-bold shadow-lg transition-all hover:bg-primary/90 hover:shadow-xl disabled:opacity-50"
      >
        {isIssuing ? (
          <span className="flex items-center gap-2">
            <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
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
  )
}
