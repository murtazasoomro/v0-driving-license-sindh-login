"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Search,
  SkipForward,
  PhoneCall,
  PhoneOff,
  UserCheck,
  Camera,
  AlertCircle,
  CheckCircle2,
  XCircle,
  FileText,
  Clock,
} from "lucide-react"

interface ScreeningRecord {
  tokenId: string
  applicantName: string
  cnic: string
  licenseType: string
  applicationId: string
  status: "Pending" | "Verified" | "Rejected" | "Referred"
  documentsOk: boolean
  photoOk: boolean
  cnicVerified: boolean
  remarks: string
}

const EMPTY_RECORD: ScreeningRecord = {
  tokenId: "",
  applicantName: "",
  cnic: "",
  licenseType: "",
  applicationId: "",
  status: "Pending",
  documentsOk: false,
  photoOk: false,
  cnicVerified: false,
  remarks: "",
}

export default function ScreeningPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [record, setRecord] = useState<ScreeningRecord>({ ...EMPTY_RECORD })
  const [servingToken, setServingToken] = useState("")
  const [tokenCalled, setTokenCalled] = useState(false)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") { router.replace("/"); return }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const handleNextToken = () => {
    const nextId = `T-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, "0")}`
    setServingToken(nextId)
    setTokenCalled(false)
    setRecord({
      ...EMPTY_RECORD,
      tokenId: nextId,
      applicantName: "Muhammad Ahmed",
      cnic: "42201-1234567-1",
      licenseType: "Learner",
      applicationId: `APP-${Date.now().toString().slice(-6)}`,
    })
  }

  const handleCallToken = () => setTokenCalled(true)
  const handleSkipToken = () => {
    setServingToken("")
    setTokenCalled(false)
    setRecord({ ...EMPTY_RECORD })
  }

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SetupPageHeader
        title="Screening"
        username={username}
        onLogout={() => { sessionStorage.clear(); router.replace("/") }}
        onBack={() => router.push("/driving-license")}
      />

      {/* Token Call Bar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-border bg-card px-3 py-2 sm:px-4">
        <Button size="sm" onClick={handleNextToken} className="gap-1.5 bg-blue-600 text-white hover:bg-blue-700">
          <Clock className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Next Token</span>
          <span className="sm:hidden">Next</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleCallToken} disabled={!servingToken || tokenCalled} className="gap-1.5">
          <PhoneCall className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Call Token</span>
          <span className="sm:hidden">Call</span>
        </Button>
        <Button size="sm" variant="outline" onClick={handleSkipToken} disabled={!servingToken} className="gap-1.5">
          <SkipForward className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Skip Token</span>
          <span className="sm:hidden">Skip</span>
        </Button>
        {servingToken && (
          <div className="ml-auto flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5">
            <UserCheck className="h-4 w-4 text-primary" />
            <span className="text-sm font-bold text-primary">Serving: {servingToken}</span>
          </div>
        )}
      </div>

      <main className="flex-1 overflow-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto max-w-5xl">
          {/* Applicant Info */}
          <div className="mb-4 rounded-lg border border-border bg-card">
            <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
              <h3 className="text-sm font-bold text-foreground">Applicant Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Token ID</Label>
                <Input value={record.tokenId} readOnly className="h-8 bg-muted/30 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Application ID</Label>
                <Input value={record.applicationId} readOnly className="h-8 bg-muted/30 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Applicant Name</Label>
                <Input value={record.applicantName} readOnly className="h-8 bg-muted/30 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">CNIC</Label>
                <Input value={record.cnic} readOnly className="h-8 bg-muted/30 text-xs font-mono" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">License Type</Label>
                <Input value={record.licenseType} readOnly className="h-8 bg-muted/30 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Status</Label>
                <div className={`flex h-8 items-center rounded-md border px-2 text-xs font-bold ${
                  record.status === "Verified" ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400" :
                  record.status === "Rejected" ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400" :
                  "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"
                }`}>
                  {record.status === "Verified" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                  {record.status === "Rejected" && <XCircle className="mr-1 h-3 w-3" />}
                  {record.status === "Pending" && <AlertCircle className="mr-1 h-3 w-3" />}
                  {record.status}
                </div>
              </div>
            </div>
          </div>

          {/* Document Verification Checklist */}
          <div className="mb-4 rounded-lg border border-border bg-card">
            <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
              <h3 className="text-sm font-bold text-foreground">Document Verification</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-3 sm:p-4">
              {/* CNIC Verification */}
              <button
                type="button"
                onClick={() => setRecord(r => ({ ...r, cnicVerified: !r.cnicVerified }))}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all sm:p-4 ${
                  record.cnicVerified ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30" : "border-border hover:bg-muted/30"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  record.cnicVerified ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">CNIC Verified</p>
                  <p className="text-xs text-muted-foreground">Original CNIC checked</p>
                </div>
                {record.cnicVerified && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
              </button>

              {/* Photo Verification */}
              <button
                type="button"
                onClick={() => setRecord(r => ({ ...r, photoOk: !r.photoOk }))}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all sm:p-4 ${
                  record.photoOk ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30" : "border-border hover:bg-muted/30"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  record.photoOk ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <Camera className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Photo OK</p>
                  <p className="text-xs text-muted-foreground">Photo matches CNIC</p>
                </div>
                {record.photoOk && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
              </button>

              {/* Documents Complete */}
              <button
                type="button"
                onClick={() => setRecord(r => ({ ...r, documentsOk: !r.documentsOk }))}
                className={`flex items-center gap-3 rounded-lg border p-3 transition-all sm:p-4 ${
                  record.documentsOk ? "border-green-300 bg-green-50 dark:border-green-800 dark:bg-green-950/30" : "border-border hover:bg-muted/30"
                }`}
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  record.documentsOk ? "bg-green-500 text-white" : "bg-muted text-muted-foreground"
                }`}>
                  <Search className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-foreground">Documents OK</p>
                  <p className="text-xs text-muted-foreground">All required docs present</p>
                </div>
                {record.documentsOk && <CheckCircle2 className="ml-auto h-5 w-5 text-green-500" />}
              </button>
            </div>
          </div>

          {/* Remarks & Actions */}
          <div className="rounded-lg border border-border bg-card">
            <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
              <h3 className="text-sm font-bold text-foreground">Remarks & Decision</h3>
            </div>
            <div className="flex flex-col gap-3 p-3 sm:p-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Remarks</Label>
                <textarea
                  value={record.remarks}
                  onChange={e => setRecord(r => ({ ...r, remarks: e.target.value }))}
                  className="min-h-[60px] w-full resize-y rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:min-h-[80px]"
                  placeholder="Enter screening remarks..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  onClick={() => setRecord(r => ({ ...r, status: "Verified" }))}
                  className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                  disabled={!servingToken}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Verify & Proceed
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRecord(r => ({ ...r, status: "Referred" }))}
                  className="gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-800 dark:text-amber-400"
                  disabled={!servingToken}
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  Refer Back
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setRecord(r => ({ ...r, status: "Rejected" }))}
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                  disabled={!servingToken}
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">Driving License Sindh - Sindh Police IT Department</p>
      </footer>
    </div>
  )
}
