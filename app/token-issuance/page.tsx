"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  PhoneCall,
  SkipForward,
  PhoneForwarded,
  List,
  Users,
  LayoutGrid,
  ArrowRight,
  Trash2,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { TokenHeader } from "@/components/token-header"
import { TokenIssuanceForm } from "@/components/token-issuance-form"
import { TokenCard } from "@/components/token-card"
import type { TokenData } from "@/components/token-card"
import { TokenStats } from "@/components/token-stats"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

type TokenStatus = "Pending" | "Called" | "Serving" | "Skipped" | "Completed"

interface QueueToken {
  id: string
  tokenNumber: string
  cnic: string
  name: string
  serviceType: string
  servicePrefix: string
  tokenType: string
  tokenTypeNumber: number
  issuedAt: string
  status: TokenStatus
  counter: string
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

  // Token Queue
  const [tokenQueue, setTokenQueue] = useState<QueueToken[]>([])
  const [showQueue, setShowQueue] = useState(false)
  const [servingToken, setServingToken] = useState<QueueToken | null>(null)
  const [queueFilter, setQueueFilter] = useState("")

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

    // Load queue from session
    const savedQueue = sessionStorage.getItem("dls_token_queue")
    if (savedQueue) {
      try {
        const parsed = JSON.parse(savedQueue)
        setTokenQueue(parsed)
        setTokenCounter(parsed.length)
      } catch { /* ignore */ }
    }
  }, [router])

  // Save queue to sessionStorage whenever it changes
  useEffect(() => {
    if (tokenQueue.length > 0) {
      sessionStorage.setItem("dls_token_queue", JSON.stringify(tokenQueue))
    }
  }, [tokenQueue])

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
        const tokenNumber = `${servicePrefix}${typeIndicator}-${String(newCount).padStart(4, "0")}`
        const issuedAt = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        })

        const token: TokenData = {
          tokenNumber,
          docType,
          docNumber,
          serviceType: SERVICE_LABELS[serviceId] || serviceId,
          servicePrefix,
          tokenType,
          tokenTypeNumber,
          branchName,
          counter: tokenTypeNumber === 2 ? "Counter 01 (Priority)" : "Counter 03",
          issuedAt,
          date: now.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }
        setIssuedToken(token)

        // Add to queue
        const queueItem: QueueToken = {
          id: `${Date.now()}-${newCount}`,
          tokenNumber,
          cnic: docNumber,
          name: "",
          serviceType: SERVICE_LABELS[serviceId] || serviceId,
          servicePrefix,
          tokenType,
          tokenTypeNumber,
          issuedAt,
          status: "Pending",
          counter: token.counter,
        }
        setTokenQueue(prev => [...prev, queueItem])

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

  // ===== Token Queue Actions =====
  const handleNextToken = useCallback(() => {
    const next = tokenQueue.find(t => t.status === "Pending")
    if (!next) return
    setTokenQueue(prev =>
      prev.map(t =>
        t.id === next.id ? { ...t, status: "Called" as TokenStatus } : t
      )
    )
    setServingToken({ ...next, status: "Called" })
  }, [tokenQueue])

  const handleCallToken = useCallback((token: QueueToken) => {
    // Mark any currently serving token as Completed
    setTokenQueue(prev =>
      prev.map(t => {
        if (t.id === token.id) return { ...t, status: "Called" as TokenStatus }
        if (t.status === "Called" || t.status === "Serving") return { ...t, status: "Completed" as TokenStatus }
        return t
      })
    )
    setServingToken({ ...token, status: "Called" })
  }, [])

  const handleSkipToken = useCallback(() => {
    if (!servingToken) return
    setTokenQueue(prev =>
      prev.map(t =>
        t.id === servingToken.id ? { ...t, status: "Skipped" as TokenStatus } : t
      )
    )
    setServingToken(null)
  }, [servingToken])

  const handleOpenRegistration = useCallback((token: QueueToken) => {
    // Mark as Serving
    setTokenQueue(prev =>
      prev.map(t =>
        t.id === token.id ? { ...t, status: "Serving" as TokenStatus } : t
      )
    )
    setServingToken({ ...token, status: "Serving" })
    // Save to session and navigate to Registration with CNIC
    sessionStorage.setItem("dls_token_queue", JSON.stringify(tokenQueue))
    sessionStorage.setItem("dls_current_token", JSON.stringify(token))
    router.push(`/driving-license/registration?cnic=${encodeURIComponent(token.cnic)}&token=${encodeURIComponent(token.tokenNumber)}`)
  }, [router, tokenQueue])

  const handleRemoveToken = useCallback((id: string) => {
    setTokenQueue(prev => prev.filter(t => t.id !== id))
    if (servingToken?.id === id) setServingToken(null)
  }, [servingToken])

  const handleLogout = useCallback(() => {
    sessionStorage.clear()
    router.replace("/")
  }, [router])

  const handleBack = useCallback(() => {
    router.push("/session")
  }, [router])

  if (!isAuthenticated) return null

  const pendingCount = tokenQueue.filter(t => t.status === "Pending").length
  const skippedCount = tokenQueue.filter(t => t.status === "Skipped").length
  const completedCount = tokenQueue.filter(t => t.status === "Completed" || t.status === "Serving").length

  const filteredQueue = tokenQueue.filter(t => {
    if (!queueFilter) return true
    const q = queueFilter.toLowerCase()
    return (
      t.tokenNumber.toLowerCase().includes(q) ||
      t.cnic.toLowerCase().includes(q) ||
      t.serviceType.toLowerCase().includes(q)
    )
  })

  const statusColor: Record<TokenStatus, string> = {
    Pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    Called: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    Serving: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    Skipped: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    Completed: "bg-secondary text-muted-foreground",
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <TokenHeader username={username} onLogout={handleLogout} onBack={handleBack} />

      {/* Token Call Bar */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-3 py-2 sm:flex-row sm:items-center sm:justify-between sm:px-4">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="default"
              className="h-8 gap-1.5 text-xs"
              onClick={handleNextToken}
              disabled={pendingCount === 0}
            >
              <PhoneForwarded className="h-3.5 w-3.5" />
              Next Token
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setShowQueue(prev => !prev)}
            >
              <List className="h-3.5 w-3.5" />
              Call Token
              {pendingCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                  {pendingCount}
                </span>
              )}
            </Button>
            {servingToken && (
              <Button
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 border-amber-300 text-xs text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/20"
                onClick={handleSkipToken}
              >
                <SkipForward className="h-3.5 w-3.5" />
                Skip
              </Button>
            )}
          </div>

          {/* Serving Token Display */}
          <div className="flex items-center gap-3">
            {servingToken ? (
              <div className="flex items-center gap-2 rounded-lg border border-green-300 bg-green-50 px-3 py-1.5 dark:border-green-700 dark:bg-green-950/20">
                <PhoneCall className="h-3.5 w-3.5 animate-pulse text-green-600" />
                <span className="text-xs font-semibold text-green-800 dark:text-green-400">
                  Serving: {servingToken.tokenNumber}
                </span>
                <span className="text-[10px] text-green-600 dark:text-green-500">
                  | CNIC: {servingToken.cnic}
                </span>
                <Button
                  size="sm"
                  className="ml-1 h-6 gap-1 bg-green-600 px-2 text-[10px] text-white hover:bg-green-700"
                  onClick={() => handleOpenRegistration(servingToken)}
                >
                  <ArrowRight className="h-3 w-3" />
                  Register
                </Button>
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">No token serving</span>
            )}
            <div className="hidden items-center gap-3 text-[10px] text-muted-foreground sm:flex">
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3 text-amber-500" /> {pendingCount} pending
              </span>
              <span className="flex items-center gap-1">
                <SkipForward className="h-3 w-3 text-red-500" /> {skippedCount} skipped
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3 text-green-500" /> {completedCount} done
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-3 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto flex max-w-7xl gap-4">
          {/* Left: Token Issuance + Stats */}
          <div className={`flex flex-col gap-4 ${showQueue ? "w-full lg:w-1/2" : "mx-auto w-full max-w-5xl"}`}>
            <TokenStats
              tokensIssued={tokenCounter}
              sessionStart={sessionStart}
              sessionDuration={sessionDuration}
            />

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

          {/* Right: Token Queue Panel */}
          {showQueue && (
            <div className="hidden w-1/2 flex-col gap-3 lg:flex">
              <div className="rounded-xl border border-border bg-card shadow-sm">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Token Queue</h3>
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      {tokenQueue.length} total
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 gap-1.5 text-xs"
                    onClick={() => router.push("/driving-license")}
                  >
                    <LayoutGrid className="h-3 w-3" />
                    DL Module
                  </Button>
                </div>
                <div className="border-b border-border px-4 py-2">
                  <Input
                    placeholder="Search by token, CNIC..."
                    value={queueFilter}
                    onChange={e => setQueueFilter(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
                <div className="max-h-[calc(100vh-360px)] divide-y divide-border overflow-y-auto">
                  {filteredQueue.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users className="mb-2 h-8 w-8 text-muted-foreground/40" />
                      <p className="text-sm font-medium text-muted-foreground">No tokens in queue</p>
                      <p className="text-xs text-muted-foreground/60">Issue a token to see it here</p>
                    </div>
                  ) : (
                    filteredQueue.map(token => (
                      <div
                        key={token.id}
                        className={`flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-secondary/50 ${
                          servingToken?.id === token.id ? "bg-green-50/50 dark:bg-green-950/10" : ""
                        }`}
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary font-mono text-xs font-bold text-foreground">
                          {token.tokenNumber.split("-")[1]}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-foreground">{token.tokenNumber}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold ${statusColor[token.status]}`}>
                              {token.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="font-mono">{token.cnic}</span>
                            <span>|</span>
                            <span>{token.serviceType}</span>
                            <span>|</span>
                            <span>{token.issuedAt}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {(token.status === "Pending" || token.status === "Skipped") && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 gap-1 px-2 text-[10px]"
                              onClick={() => handleCallToken(token)}
                            >
                              <PhoneCall className="h-3 w-3" />
                              Call
                            </Button>
                          )}
                          {(token.status === "Called") && (
                            <Button
                              size="sm"
                              className="h-7 gap-1 bg-green-600 px-2 text-[10px] text-white hover:bg-green-700"
                              onClick={() => handleOpenRegistration(token)}
                            >
                              <ArrowRight className="h-3 w-3" />
                              Register
                            </Button>
                          )}
                          {token.status === "Completed" && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                              onClick={() => handleRemoveToken(token.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Queue - shown below form on small screens */}
        {showQueue && (
          <div className="mt-4 lg:hidden">
            <div className="rounded-xl border border-border bg-card shadow-sm">
              <div className="flex items-center justify-between border-b border-border px-3 py-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-primary" />
                  <h3 className="text-xs font-bold text-foreground">Token Queue ({tokenQueue.length})</h3>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[10px]" onClick={() => setShowQueue(false)}>
                  Close
                </Button>
              </div>
              <div className="border-b border-border px-3 py-2">
                <Input
                  placeholder="Search token, CNIC..."
                  value={queueFilter}
                  onChange={e => setQueueFilter(e.target.value)}
                  className="h-7 text-xs"
                />
              </div>
              <div className="max-h-[50vh] divide-y divide-border overflow-y-auto">
                {filteredQueue.length === 0 ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">No tokens in queue</div>
                ) : (
                  filteredQueue.map(token => (
                    <div key={token.id} className="flex items-center gap-2 px-3 py-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[11px] font-semibold text-foreground">{token.tokenNumber}</span>
                          <span className={`rounded-full px-1.5 py-0.5 text-[8px] font-semibold ${statusColor[token.status]}`}>
                            {token.status}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground">{token.cnic}</span>
                      </div>
                      {(token.status === "Pending" || token.status === "Skipped") && (
                        <Button size="sm" variant="outline" className="h-6 gap-1 px-2 text-[10px]" onClick={() => handleCallToken(token)}>
                          <PhoneCall className="h-2.5 w-2.5" /> Call
                        </Button>
                      )}
                      {token.status === "Called" && (
                        <Button size="sm" className="h-6 gap-1 bg-green-600 px-2 text-[10px] text-white hover:bg-green-700" onClick={() => handleOpenRegistration(token)}>
                          <ArrowRight className="h-2.5 w-2.5" /> Register
                        </Button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-border bg-card px-4 py-3">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Shield className="h-3.5 w-3.5" />
            <span>Secured by Sindh Police IT Department</span>
          </div>
          <p className="text-[10px] text-muted-foreground/60 text-center">
            {"Government of Sindh - All Rights Reserved"}
          </p>
        </div>
      </footer>
    </div>
  )
}
