"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Database, CheckCircle2, XCircle, RefreshCw, Server, ArrowLeft, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DbStatus {
  connected: boolean
  server?: string
  database?: string
  error?: string
  timestamp?: string
}

export default function DbStatusPage() {
  const router = useRouter()
  const [status, setStatus] = useState<DbStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [envVars, setEnvVars] = useState<Record<string, boolean>>({})

  const checkConnection = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/db-test")
      const data = await res.json()
      setStatus({
        connected: data.success,
        server: data.server,
        database: data.database,
        error: data.error,
        timestamp: new Date().toLocaleTimeString()
      })
    } catch (err) {
      setStatus({
        connected: false,
        error: err instanceof Error ? err.message : "Failed to connect",
        timestamp: new Date().toLocaleTimeString()
      })
    }
    setLoading(false)
  }

  const checkEnvVars = async () => {
    try {
      const res = await fetch("/api/db-test/env")
      const data = await res.json()
      setEnvVars(data.vars || {})
    } catch {
      // Ignore
    }
  }

  useEffect(() => {
    checkConnection()
    checkEnvVars()
  }, [])

  return (
    <div className="min-h-svh bg-background p-4 sm:p-8">
      <div className="mx-auto max-w-2xl">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/")}
          className="mb-6 gap-1.5"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </Button>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Database className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">SQL Server Connection</h1>
                <p className="text-sm text-muted-foreground">Check database connectivity status</p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={checkConnection}
              disabled={loading}
              className="gap-1.5"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Connection Status */}
          <div className={`mb-6 rounded-lg border p-4 ${
            status?.connected 
              ? "border-green-500/30 bg-green-500/10" 
              : "border-red-500/30 bg-red-500/10"
          }`}>
            <div className="flex items-center gap-3">
              {loading ? (
                <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
              ) : status?.connected ? (
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              ) : (
                <XCircle className="h-6 w-6 text-red-600" />
              )}
              <div>
                <p className={`font-semibold ${status?.connected ? "text-green-700" : "text-red-700"}`}>
                  {loading ? "Checking..." : status?.connected ? "Connected" : "Not Connected"}
                </p>
                {status?.timestamp && (
                  <p className="text-xs text-muted-foreground">Last checked: {status.timestamp}</p>
                )}
              </div>
            </div>
          </div>

          {/* Connection Details */}
          {status && !loading && (
            <div className="mb-6 space-y-3">
              <h2 className="text-sm font-semibold text-foreground">Connection Details</h2>
              <div className="grid gap-2">
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">Server</span>
                  <span className="font-mono text-sm text-foreground">
                    {status.server || "Not configured"}
                  </span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="text-sm text-muted-foreground">Database</span>
                  <span className="font-mono text-sm text-foreground">
                    {status.database || "Not configured"}
                  </span>
                </div>
                {status.error && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3">
                    <p className="text-sm font-medium text-red-700">Error:</p>
                    <p className="mt-1 font-mono text-xs text-red-600">{status.error}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Environment Variables Status */}
          <div className="mb-6 space-y-3">
            <h2 className="text-sm font-semibold text-foreground">Environment Variables</h2>
            <div className="grid gap-2">
              {["MSSQL_SERVER", "MSSQL_DATABASE", "MSSQL_USER", "MSSQL_PASSWORD"].map((key) => (
                <div key={key} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                  <span className="font-mono text-xs text-muted-foreground">{key}</span>
                  {envVars[key] ? (
                    <span className="flex items-center gap-1 text-xs font-medium text-green-600">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      Set
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-medium text-amber-600">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      Not Set
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div className="rounded-lg border border-border bg-secondary/30 p-4">
            <div className="flex items-start gap-2">
              <Server className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div className="text-sm text-muted-foreground">
                <p className="font-medium text-foreground">How to configure:</p>
                <ol className="mt-2 list-inside list-decimal space-y-1">
                  <li>Click the settings icon (top right of v0)</li>
                  <li>Go to <strong>Vars</strong> section</li>
                  <li>Add the following environment variables:
                    <ul className="ml-4 mt-1 list-disc space-y-0.5 font-mono text-xs">
                      <li>MSSQL_SERVER (e.g., localhost or IP)</li>
                      <li>MSSQL_DATABASE (e.g., EPolice)</li>
                      <li>MSSQL_USER (e.g., sa)</li>
                      <li>MSSQL_PASSWORD (your password)</li>
                      <li>MSSQL_PORT (default: 1433)</li>
                      <li>MSSQL_ENCRYPT (true/false)</li>
                      <li>MSSQL_TRUST_CERT (true for local)</li>
                    </ul>
                  </li>
                  <li>Click Refresh to test connection</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
