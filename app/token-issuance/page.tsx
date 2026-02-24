"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield } from "lucide-react"
import { TokenHeader } from "@/components/token-header"
import { ApplicantSearch } from "@/components/applicant-search"
import { ApplicantDetails } from "@/components/applicant-details"
import type { Applicant } from "@/components/applicant-details"
import { ServiceSelector } from "@/components/service-selector"
import { TokenCard } from "@/components/token-card"
import type { TokenData } from "@/components/token-card"
import { TokenStats } from "@/components/token-stats"

// Mock applicant data for demo
const MOCK_APPLICANTS: Record<string, Applicant> = {
  "42201-1234567-1": {
    name: "Muhammad Ahmed Khan",
    fatherName: "Muhammad Ali Khan",
    cnic: "42201-1234567-1",
    passport: "AB1234567",
    dob: "15 March 1990",
    gender: "Male",
    address: "House 45, Block 5, Clifton, Karachi, Sindh",
    phone: "+92-300-1234567",
    licenseType: "LTV",
    photo: "",
  },
  "42301-9876543-2": {
    name: "Fatima Bibi",
    fatherName: "Abdul Rasheed",
    cnic: "42301-9876543-2",
    dob: "22 August 1995",
    gender: "Female",
    address: "Flat 12, Gulshan-e-Iqbal, Block 13, Karachi, Sindh",
    phone: "+92-321-9876543",
    licenseType: "Motorcycle",
    photo: "",
  },
  AB1234567: {
    name: "Muhammad Ahmed Khan",
    fatherName: "Muhammad Ali Khan",
    cnic: "42201-1234567-1",
    passport: "AB1234567",
    dob: "15 March 1990",
    gender: "Male",
    address: "House 45, Block 5, Clifton, Karachi, Sindh",
    phone: "+92-300-1234567",
    licenseType: "LTV",
    photo: "",
  },
}

const SERVICE_LABELS: Record<string, string> = {
  "new-license": "New License",
  renewal: "Renewal",
  duplicate: "Duplicate",
  international: "International DL",
  learner: "Learner Permit",
  endorsement: "Endorsement",
}

export default function TokenIssuancePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Search state
  const [isSearching, setIsSearching] = useState(false)
  const [applicant, setApplicant] = useState<Applicant | null>(null)
  const [searchError, setSearchError] = useState("")

  // Token state
  const [isIssuing, setIsIssuing] = useState(false)
  const [issuedToken, setIssuedToken] = useState<TokenData | null>(null)
  const [tokenCounter, setTokenCounter] = useState(0)

  // Session timer
  const [sessionStart, setSessionStart] = useState("")
  const [sessionDuration, setSessionDuration] = useState("00:00:00")
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)

  // Auth & session check
  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    const sessionActive = sessionStorage.getItem("dls_session_active")
    const sessionStartTime = sessionStorage.getItem("dls_session_start")
    const sessionStartTs = sessionStorage.getItem("dls_session_start_ts")

    if (auth !== "true" || sessionActive !== "true") {
      router.replace("/")
      return
    }

    setUsername(user || "Officer")
    setSessionStart(sessionStartTime || "--:--:--")
    setStartTimestamp(sessionStartTs ? Number(sessionStartTs) : Date.now())
    setIsAuthenticated(true)
  }, [router])

  // Duration timer
  useEffect(() => {
    if (!startTimestamp) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0")
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")
      const seconds = String(elapsed % 60).padStart(2, "0")
      setSessionDuration(`${hours}:${minutes}:${seconds}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [startTimestamp])

  const handleSearch = useCallback((_type: "cnic" | "passport", value: string) => {
    setIsSearching(true)
    setSearchError("")
    setApplicant(null)
    setIssuedToken(null)

    // Simulate API call
    setTimeout(() => {
      const found = MOCK_APPLICANTS[value]
      if (found) {
        setApplicant(found)
      } else {
        setSearchError(`No applicant found with the provided ${_type === "cnic" ? "CNIC" : "Passport"} number. Please verify and try again.`)
      }
      setIsSearching(false)
    }, 1200)
  }, [])

  const handleIssueToken = useCallback(
    (serviceId: string) => {
      if (!applicant) return
      setIsIssuing(true)

      setTimeout(() => {
        const newCount = tokenCounter + 1
        setTokenCounter(newCount)

        const now = new Date()
        const token: TokenData = {
          tokenNumber: `T-${String(newCount).padStart(4, "0")}`,
          applicantName: applicant.name,
          cnic: applicant.cnic,
          serviceType: SERVICE_LABELS[serviceId] || serviceId,
          counter: "Counter 03",
          issuedAt: now.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true,
          }),
          date: now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
        setIssuedToken(token)
        setIsIssuing(false)
      }, 1500)
    },
    [applicant, tokenCounter]
  )

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleNewToken = useCallback(() => {
    setApplicant(null)
    setIssuedToken(null)
    setSearchError("")
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.clear()
    router.replace("/")
  }, [router])

  const handleBack = useCallback(() => {
    router.push("/session")
  }, [router])

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TokenHeader username={username} onLogout={handleLogout} onBack={handleBack} />

      <main className="flex-1 px-4 py-6">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          {/* Session Stats Bar */}
          <TokenStats
            tokensIssued={tokenCounter}
            sessionStart={sessionStart}
            sessionDuration={sessionDuration}
          />

          {/* Main Content */}
          {issuedToken ? (
            /* Show issued token */
            <div className="mx-auto w-full max-w-md">
              <TokenCard
                token={issuedToken}
                onPrint={handlePrint}
                onNewToken={handleNewToken}
              />
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* Search Section */}
              <ApplicantSearch onSearch={handleSearch} isSearching={isSearching} />

              {/* Error Message */}
              {searchError && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4">
                  <p className="text-sm font-medium text-destructive">{searchError}</p>
                </div>
              )}

              {/* Applicant Details */}
              {applicant && (
                <>
                  <ApplicantDetails applicant={applicant} />
                  <ServiceSelector onIssueToken={handleIssueToken} isIssuing={isIssuing} />
                </>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card px-4 py-4">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secured by Sindh Police IT Department</span>
          </div>
          <p className="text-xs text-muted-foreground/60 text-center">
            {"Government of Sindh - All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  )
}
