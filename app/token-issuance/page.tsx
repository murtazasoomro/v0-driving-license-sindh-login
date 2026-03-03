"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Shield, ArrowRight, LayoutGrid } from "lucide-react"
import { TokenHeader } from "@/components/token-header"
import { TokenIssuanceForm } from "@/components/token-issuance-form"
import { TokenCard } from "@/components/token-card"
import type { TokenData } from "@/components/token-card"
import { TokenStats } from "@/components/token-stats"
import { Button } from "@/components/ui/button"

const SERVICE_LABELS: Record<string, string> = {
  learner: "Learner",
  permanent: "Permanent",
  international: "International",
}

const SERVICE_PREFIX: Record<string, string> = {
  learner: "L",
  permanent: "P",
  international: "I",
}

export default function TokenIssuancePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Token state
  const [isIssuing, setIsIssuing] = useState(false)
  const [issuedToken, setIssuedToken] = useState<TokenData | null>(null)
  const [tokenCounter, setTokenCounter] = useState(0)
  const [branchName, setBranchName] = useState("")

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
    const branch = sessionStorage.getItem("dls_branch_name")

    if (auth !== "true" || sessionActive !== "true") {
      router.replace("/")
      return
    }

    setUsername(user || "Officer")
    setSessionStart(sessionStartTime || "--:--:--")
    setStartTimestamp(sessionStartTs ? Number(sessionStartTs) : Date.now())
    setBranchName(branch || "DLS Branch Office")
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

  const handleIssueToken = useCallback(
    (
      docType: "cnic" | "passport",
      docNumber: string,
      serviceId: string,
      tokenType: string,
      tokenTypeNumber: number
    ) => {
      setIsIssuing(true)

      setTimeout(() => {
        const newCount = tokenCounter + 1
        setTokenCounter(newCount)

        const servicePrefix = SERVICE_PREFIX[serviceId] || "T"
        const typeIndicator = tokenTypeNumber === 2 ? "F" : ""
        const now = new Date()
        const token: TokenData = {
          tokenNumber: `${servicePrefix}${typeIndicator}-${String(newCount).padStart(4, "0")}`,
          docType,
          docNumber,
          serviceType: SERVICE_LABELS[serviceId] || serviceId,
          servicePrefix,
          tokenType,
          tokenTypeNumber,
          branchName,
          counter: tokenTypeNumber === 2 ? "Counter 01 (Priority)" : "Counter 03",
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
      }, 1000)
    },
    [tokenCounter, branchName]
  )

  const handlePrint = useCallback(() => {
    if (!issuedToken) return
    const t = issuedToken
    const isFT = t.tokenTypeNumber === 2
    const docLabel = t.docType === "cnic" ? "CNIC" : "Passport"
    const prefixLabel = t.servicePrefix === "L" ? "Learner" : t.servicePrefix === "P" ? "Permanent" : "International"
    const w = window.open("", "_blank", "width=320,height=600")
    if (!w) return
    w.document.write(`<!DOCTYPE html><html><head><title>Token ${t.tokenNumber}</title>
<style>
  @page { size: 80mm auto; margin: 0; }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:80mm; font-family:Arial,sans-serif; color:#000; background:#fff; }
  .receipt { width:100%; padding:0 4mm; }
  .center { text-align:center; }
  .sep { border-top:1px dashed #999; margin:4px 0; }
  .row { display:flex; justify-content:space-between; padding:2px 0; font-size:9px; }
  .row .lbl { color:#666; }
  .row .val { font-weight:600; }
  .mono { font-family:monospace; }
</style></head><body>
<div class="receipt">
  <div class="center" style="padding:8px 0 4px">
    <img src="/images/sindh-police-logo.png" width="40" height="40" style="object-fit:contain" />
    <div style="font-size:10px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;margin-top:3px">Driving License Sindh</div>
    <div style="font-size:8px;color:#666;margin-top:1px">${t.branchName}</div>
  </div>
  <div class="sep"></div>
  <div class="center" style="padding:4px 0 2px">
    <span style="display:inline-block;font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;padding:2px 8px;border:1px solid ${isFT ? "#c00" : "#333"};border-radius:2px">
      Type ${t.tokenTypeNumber} - ${isFT ? "Fast Track / Senior" : "Normal"}
    </span>
  </div>
  <div class="center" style="padding:2px 0">
    <div style="font-size:8px;font-weight:500;text-transform:uppercase;letter-spacing:0.1em;color:#666">Token No.</div>
    <div class="mono" style="font-size:36px;font-weight:900;line-height:1;letter-spacing:-0.02em;margin:2px 0">${t.tokenNumber}</div>
  </div>
  <div class="center" style="padding-bottom:4px">
    <span style="display:inline-block;font-size:9px;font-weight:700;padding:2px 10px;background:#eee;border-radius:2px">
      ${t.servicePrefix} - ${prefixLabel}
    </span>
  </div>
  <div class="sep"></div>
  <div style="padding:4px 0">
    <div class="row"><span class="lbl">${docLabel}</span><span class="val mono">${t.docNumber}</span></div>
    <div class="row"><span class="lbl">License Type</span><span class="val">${t.serviceType}</span></div>
    <div class="row"><span class="lbl">Counter</span><span class="val">${t.counter}</span></div>
    <div class="row"><span class="lbl">Time</span><span class="val mono">${t.issuedAt}</span></div>
    <div class="row"><span class="lbl">Date</span><span class="val">${t.date}</span></div>
  </div>
  <div class="sep"></div>
  <div class="center" style="padding:4px 0 8px">
    <div style="font-size:8px;color:#666">Please wait for your token number to be called.</div>
    <div style="font-size:7px;color:#999;margin-top:2px">Sindh Police - Proud to Serve</div>
  </div>
</div>
<script>window.onload=function(){window.print();window.onafterprint=function(){window.close()}}<\/script>
</body></html>`)
    w.document.close()
  }, [issuedToken])

  const handleNewToken = useCallback(() => {
    setIssuedToken(null)
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
        <div className="mx-auto flex max-w-5xl flex-col gap-5">
          <TokenStats
            tokensIssued={tokenCounter}
            sessionStart={sessionStart}
            sessionDuration={sessionDuration}
          />

          {/* Quick Navigation to Process Steps */}
          <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                After issuing tokens, proceed to process steps:
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/driving-license")}
                className="h-8 gap-1.5 text-xs"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
                DL Module
              </Button>
              <Button
                size="sm"
                onClick={() => router.push("/driving-license/registration")}
                className="h-8 gap-1.5 text-xs"
              >
                Registration
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/driving-license/screening")}
                className="h-8 gap-1.5 text-xs"
              >
                Screening
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push("/driving-license/process-flow")}
                className="h-8 gap-1.5 text-xs"
              >
                Process Flow
              </Button>
            </div>
          </div>

          {issuedToken ? (
            <div className="mx-auto w-full max-w-md">
              <TokenCard
                token={issuedToken}
                onPrint={handlePrint}
                onNewToken={handleNewToken}
              />
            </div>
          ) : (
            <TokenIssuanceForm onIssueToken={handleIssueToken} isIssuing={isIssuing} />
          )}
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
