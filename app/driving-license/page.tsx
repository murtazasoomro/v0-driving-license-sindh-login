"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Car, Settings, FileQuestion, ArrowLeftRight, FileBarChart, RefreshCw } from "lucide-react"
import { SetupPageHeader } from "@/components/setup-page-header"
import { SettingsTileGrid, type SettingsTile } from "@/components/settings-tile-grid"

// ===== SETUP TAB TILES =====
const SETUP_TILES: SettingsTile[] = [
  { id: "license-type", label: "License Type" },
  { id: "fee-type", label: "Fee Type" },
  { id: "process-configuration", label: "Process Configuration" },
  { id: "license-category", label: "License Category" },
  { id: "application-type", label: "Application Type" },
  { id: "required-document", label: "Required Document" },
  { id: "vehicle-category", label: "Vehicle Category" },
  { id: "fee-structure", label: "Fee Structure" },
  { id: "counter-setup", label: "Counter Setup" },
  { id: "card-template", label: "Card Template" },
]

// ===== QUESTIONNAIRE TAB TILES =====
const QUESTIONNAIRE_TILES: SettingsTile[] = [
  { id: "academic-test-new", label: "Academic Test (NEW)" },
  { id: "physical-test-new", label: "Physical Test (NEW)" },
  { id: "questionnaire-setup", label: "Questionnaire Setup" },
  { id: "test-configuration", label: "Test Configuration" },
]

// ===== TRANSACTION TAB TILES =====
const TRANSACTION_TILES: SettingsTile[] = [
  { id: "process-config-txn", label: "Process Configuration" },
  { id: "screening", label: "Screening" },
  { id: "registration", label: "Registration" },
  { id: "payment-challan", label: "Payment Challan" },
  { id: "session", label: "Session" },
  { id: "ticket", label: "Ticket" },
  { id: "payment", label: "Payment" },
  { id: "data-verification", label: "Data Verification" },
  { id: "license-approval", label: "License Approval" },
  { id: "screening-without-token", label: "Screening without Token" },
  { id: "condonation-request", label: "Condonation Request" },
  { id: "condonation-approval", label: "Condonation Approval" },
  { id: "license-status-request", label: "License Status Request" },
  { id: "license-status-approval", label: "License Status Approval" },
  { id: "complain", label: "Complain" },
  { id: "retest-approval", label: "Retest Approval" },
  { id: "retest-request", label: "Retest Request" },
  { id: "psv-approval", label: "PSV Approval" },
  { id: "license-printing", label: "License Printing" },
  { id: "dispatch-booking", label: "Dispatch Booking" },
  { id: "dispatch-booking-2", label: "Dispatch Booking" },
  { id: "license-printing-2", label: "License Printing" },
  { id: "dispatch-to-courier", label: "Dispatch to Courier" },
  { id: "card-template-txn", label: "Card Template" },
  { id: "card-template-txn-2", label: "Card Template" },
  { id: "dispatch-to-courier-2", label: "Dispatch to Courier" },
  { id: "dispatch-to-courier-3", label: "Dispatch to Courier" },
  { id: "license-issue", label: "License Issue" },
  { id: "license-issue-2", label: "License Issue" },
  { id: "book-license-approval", label: "Book License Approval" },
  { id: "down-category", label: "Down Category" },
  { id: "down-category-approval", label: "Down Category Approval" },
  { id: "token-change", label: "Token Change" },
  { id: "identity-verification", label: "Identity Verification" },
  { id: "identity-verification-2", label: "Identity Verification" },
  { id: "verification-approval", label: "Verification Approval" },
  { id: "verification-approval-2", label: "Verification Approval" },
  { id: "noc-verification-request", label: "NOC/Verification Request" },
  { id: "noc-verification-request-2", label: "NOC/Verification Request" },
  { id: "noc-approval", label: "NOC Approval" },
  { id: "noc-approval-2", label: "NOC Approval" },
  { id: "license-verification-approval", label: "License Verification Approval" },
]

// ===== REPORT TAB TILES =====
const REPORT_TILES: SettingsTile[] = [
  { id: "daily-report", label: "Daily Report" },
  { id: "token-report", label: "Token Report" },
  { id: "payment-report", label: "Payment Report" },
  { id: "dispatch-report", label: "Dispatch Report" },
  { id: "license-report", label: "License Report" },
  { id: "verification-report", label: "Verification Report" },
]

// ===== PERIODIC TAB TILES =====
const PERIODIC_TILES: SettingsTile[] = [
  { id: "expiry-processing", label: "Expiry Processing" },
  { id: "batch-printing", label: "Batch Printing" },
  { id: "data-purge", label: "Data Purge" },
  { id: "renewal-notice", label: "Renewal Notice" },
]

const TABS = [
  { id: "setup", label: "Setup", icon: Settings },
  { id: "questionnier", label: "Questionnier", icon: FileQuestion },
  { id: "transaction", label: "Transaction", icon: ArrowLeftRight },
  { id: "report", label: "Report", icon: FileBarChart },
  { id: "periodic", label: "Periodic", icon: RefreshCw },
]

const TAB_TILES: Record<string, SettingsTile[]> = {
  setup: SETUP_TILES,
  questionnier: QUESTIONNAIRE_TILES,
  transaction: TRANSACTION_TILES,
  report: REPORT_TILES,
  periodic: PERIODIC_TILES,
}

export default function DrivingLicensePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeTab, setActiveTab] = useState("setup")

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

  const handleLogout = () => {
    sessionStorage.clear()
    router.replace("/")
  }

  const handleBack = () => {
    router.push("/session")
  }

  const handleTileClick = (tileId: string) => {
    if (tileId === "license-type") {
      router.push("/driving-license/license-type")
    } else if (tileId === "fee-type") {
      router.push("/driving-license/fee-type")
    } else if (tileId === "process-configuration" || tileId === "process-config-txn") {
      router.push("/driving-license/process-configuration")
    } else if (tileId === "registration") {
      router.push("/driving-license/registration")
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const tilesWithHandlers = (TAB_TILES[activeTab] || []).map((tile) => ({
    ...tile,
    onClick: () => handleTileClick(tile.id),
  }))

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader
        title="Driving License"
        username={username}
        onLogout={handleLogout}
        onBack={handleBack}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        {/* Page Title */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Car className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Driving License</h1>
            <p className="text-sm text-muted-foreground">
              License configuration, transactions, and reporting
            </p>
          </div>
        </div>

        {/* Tab Bar - matching the teal style from screenshots */}
        <div className="mb-6 flex flex-wrap gap-1 rounded-lg border border-border bg-card p-1 shadow-sm">
          {TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-1 flex-col items-center gap-1 rounded-md px-3 py-3 text-xs font-semibold transition-all sm:flex-row sm:gap-2 sm:text-sm ${
                  isActive
                    ? "bg-[#2a8f7a] text-[#f7fafc] shadow-md"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-5 w-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tile Grid */}
        <SettingsTileGrid tiles={tilesWithHandlers} />
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Driving License Sindh - Sindh Police IT Department
        </p>
      </footer>
    </div>
  )
}
