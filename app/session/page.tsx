"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield, Building2, ChevronDown, MapPin, Phone } from "lucide-react"
import { SessionHeader } from "@/components/session-header"
import { BranchInfoCard } from "@/components/branch-info-card"
import { SessionControls } from "@/components/session-controls"
import { Label } from "@/components/ui/label"

// Branch list from DLS system
const BRANCHES = [
  { id: 1, code: "KRG", name: "DL Korangi", address: "Sector 6A, Mehran Town, Korangi Industrial Area Karachi", phone: "021-35114277" },
  { id: 2, code: "CFT", name: "DL Clifton", address: "Zamzama Street No. 11, Near Do Talwar Clifton Karachi", phone: "021-39925052" },
  { id: 3, code: "MPK", name: "DL Mirpur Khas", address: "Near SP Office Mirpur Khas", phone: "-" },
  { id: 4, code: "HYD", name: "DL Hyderabad", address: "Jamshoro Road Near Old HDA Filter Plant Hyderabad", phone: "-" },
  { id: 5, code: "LRK", name: "DL Larkana", address: "Driving License Branch Larkana", phone: "-" },
  { id: 6, code: "SBA", name: "DL Shaheed Benazirabad", address: "Driving License Branch SBA", phone: "-" },
  { id: 20, code: "NAZ", name: "DL Nazimabad", address: "Old Fire Brigade Station Building, Nazimabad Karachi", phone: "021-39926050" },
  { id: 30, code: "KHI-VAN", name: "DL Karachi Mobile Van", address: "Karachi Mobile Van", phone: "-" },
  { id: 38, code: "JMS", name: "DL Jamshoro", address: "Jamshoro Rd, Hyderabad, Sindh", phone: "-" },
  { id: 87, code: "NSF", name: "DL Noshero Feroz", address: "Driving License Branch Noshero Feroz", phone: "-" },
  { id: 88, code: "SKR", name: "DL Sukkur", address: "Driving License Branch Sukkur, Sindh", phone: "-" },
  { id: 89, code: "SNG", name: "DL Sanghar", address: "Driving License Branch Sanghar, Sindh", phone: "-" },
  { id: 90, code: "SKP", name: "DL Shikarpur", address: "Driving License Branch Shikarpur, Sindh", phone: "-" },
  { id: 91, code: "GHTKI", name: "DL Ghotki", address: "Driving License Branch Ghotki, Sindh", phone: "-" },
  { id: 92, code: "UMKT", name: "DL Umerkot", address: "Driving License Branch Umerkot, Sindh", phone: "-" },
  { id: 93, code: "MITHI", name: "DL Mithi", address: "Driving License Branch Mithi, Sindh", phone: "-" },
  { id: 94, code: "MITRI", name: "DL Matiari", address: "Driving License Branch Matiari, Sindh", phone: "-" },
  { id: 95, code: "THA", name: "DL Thatta", address: "Driving License Branch Thatta, Sindh", phone: "-" },
  { id: 96, code: "DADU", name: "DL Dadu", address: "Driving License Branch Dadu, Sindh", phone: "-" },
  { id: 97, code: "JC", name: "DL Jacobabad", address: "Driving License Branch Jacobabad, Sindh", phone: "-" },
  { id: 98, code: "KSH", name: "DL Kashmor", address: "Driving License Branch Kashmor, Sindh", phone: "-" },
  { id: 99, code: "KHR", name: "DL Khairpur", address: "Driving License Branch Khairpur, Sindh", phone: "-" },
  { id: 100, code: "TAYR", name: "DL Tando Allah Yar", address: "Driving License Branch Tando Allah Yar, Sindh", phone: "-" },
  { id: 101, code: "TMK", name: "DL Tando Muhammad Khan", address: "Driving License Branch Tando Muhammad Khan, Sindh", phone: "-" },
  { id: 102, code: "BDIN", name: "DL Badin", address: "Driving License Branch Badin, Sindh", phone: "-" },
  { id: 103, code: "SJL", name: "DL Sujawal", address: "Driving License Branch Sujawal, Sindh", phone: "-" },
  { id: 104, code: "PFC-HYD", name: "PFC Hyderabad", address: "Public Facilitation Center Hyderabad", phone: "-" },
  { id: 105, code: "PFC-SBA", name: "PFC SBA", address: "Public Facilitation Center SBA", phone: "-" },
  { id: 106, code: "PFC-SKR", name: "PFC Sukkur", address: "Public Facilitation Center Sukkur", phone: "-" },
  { id: 107, code: "PFC-LRK", name: "PFC Larkana", address: "Public Facilitation Center Larkana", phone: "-" },
  { id: 108, code: "PFC-MPK", name: "PFC Mirpur Khas", address: "Public Facilitation Center Mirpur Khas", phone: "-" },
  { id: 336, code: "QMBR", name: "DL Qambar", address: "Driving License Qambar", phone: "-" },
  { id: 337, code: "DIGL&T", name: "DIG L&T Office", address: "Deputy Inspector General Of Police Traffic (L&T)", phone: "-" },
]

export default function SessionPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [sessionStartTime, setSessionStartTime] = useState<string | null>(null)
  const [sessionDuration, setSessionDuration] = useState("00:00:00")
  const [startTimestamp, setStartTimestamp] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Branch info
  const [selectedBranchId, setSelectedBranchId] = useState<number | null>(null)
  const [branchName, setBranchName] = useState("")
  const [branchCode, setBranchCode] = useState("")
  const [branchAddress, setBranchAddress] = useState("")
  const [branchPhone, setBranchPhone] = useState("")
  const [branchTimings, setBranchTimings] = useState("08:00 AM - 04:00 PM")

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") {
      router.replace("/")
      return
    }
    setUsername(user || "Officer")
    // Load saved branch or default to first
    const savedBranchId = sessionStorage.getItem("dls_branch_id")
    if (savedBranchId) {
      const branch = BRANCHES.find(b => b.id === Number(savedBranchId))
      if (branch) {
        setSelectedBranchId(branch.id)
        setBranchName(branch.name)
        setBranchCode(branch.code)
        setBranchAddress(branch.address)
        setBranchPhone(branch.phone)
      }
    }
    setIsAuthenticated(true)
  }, [router])

  // Duration timer
  useEffect(() => {
    if (!isSessionActive || !startTimestamp) return
    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimestamp) / 1000)
      const hours = String(Math.floor(elapsed / 3600)).padStart(2, "0")
      const minutes = String(Math.floor((elapsed % 3600) / 60)).padStart(2, "0")
      const seconds = String(elapsed % 60).padStart(2, "0")
      setSessionDuration(`${hours}:${minutes}:${seconds}`)
    }, 1000)
    return () => clearInterval(interval)
  }, [isSessionActive, startTimestamp])

  const handleStartSession = useCallback(() => {
    if (!selectedBranchId) {
      alert("Please select a branch before starting the session.")
      return
    }
    const now = new Date()
    const timeStr = now.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
    setSessionStartTime(timeStr)
    setStartTimestamp(Date.now())
    setIsSessionActive(true)
    setSessionDuration("00:00:00")

    sessionStorage.setItem("dls_session_active", "true")
    sessionStorage.setItem("dls_session_start", timeStr)
    sessionStorage.setItem("dls_session_start_ts", String(Date.now()))
    sessionStorage.setItem("dls_branch_name", branchName)
    router.push("/token-issuance")
  }, [branchName, router, selectedBranchId])

  const handleCloseSession = useCallback(() => {
    setIsSessionActive(false)
    setStartTimestamp(null)
    sessionStorage.removeItem("dls_session_active")
  }, [])

  const handleSelectBranch = useCallback((branchId: number) => {
    const branch = BRANCHES.find(b => b.id === branchId)
    if (!branch) return
    setSelectedBranchId(branch.id)
    setBranchName(branch.name)
    setBranchCode(branch.code)
    setBranchAddress(branch.address)
    setBranchPhone(branch.phone)
    sessionStorage.setItem("dls_branch_id", String(branch.id))
    sessionStorage.setItem("dls_branch_name", branch.name)
    sessionStorage.setItem("dls_branch_code", branch.code)
    sessionStorage.setItem("dls_branch_address", branch.address)
    sessionStorage.setItem("dls_branch_phone", branch.phone)
  }, [])

  const handleLogout = useCallback(() => {
    sessionStorage.clear()
    router.replace("/")
  }, [router])

  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SessionHeader username={username} onLogout={handleLogout} />

      <main className="flex-1 px-4 py-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground text-balance">
              {"Welcome back, "}{username}
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Manage your branch session below. Start a session to begin processing applications.
            </p>
          </div>

          {/* Branch Selector */}
          <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold text-foreground sm:text-base">Select Branch</h2>
            </div>
            <div className="flex flex-col gap-3">
              <div className="relative">
                <Label className="mb-1.5 block text-xs text-muted-foreground">Branch Office</Label>
                <div className="relative">
                  <select
                    value={selectedBranchId || ""}
                    onChange={(e) => handleSelectBranch(Number(e.target.value))}
                    className="h-10 w-full appearance-none rounded-lg border border-input bg-background px-3 pr-10 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">-- Select Branch --</option>
                    {BRANCHES.map(branch => (
                      <option key={branch.id} value={branch.id}>
                        {branch.code} - {branch.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              {selectedBranchId && (
                <div className="grid grid-cols-1 gap-2 rounded-lg bg-secondary/50 p-3 text-xs sm:grid-cols-2 sm:gap-3">
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{branchAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="text-muted-foreground">{branchPhone || "-"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <BranchInfoCard
            branchName={branchName || "Select a branch above"}
            branchCode={branchCode || "---"}
            address={branchAddress || "---"}
            phone={branchPhone || "---"}
            timings={branchTimings}
          />

          <SessionControls
            isSessionActive={isSessionActive}
            sessionStartTime={sessionStartTime}
            sessionDuration={sessionDuration}
            todayDate={todayDate}
            onStartSession={handleStartSession}
            onCloseSession={handleCloseSession}
          />
        </div>
      </main>

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
