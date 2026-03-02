"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  SkipForward,
  PhoneCall,
  PhoneOff,
  Radio,
  Save,
  FilePlus,
  Trash2,
  User,
  CreditCard,
  Building2,
  MapPin,
  Calendar,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  DSP Approval  –  frmDLDspapproval                                  */
/* ------------------------------------------------------------------ */

interface ApplicantInfo {
  applicantId: string
  tokenNo: string
  appProcessNo: string
  firstName: string
  lastName: string
  fatherName: string
  cnic: string
  dob: string
  gender: string
  mobile: string
  address: string
  licenseType: string
  applicationDate: string
  photo: string | null
}

interface LicenseCategory {
  id: number
  categoryId: string
  category: string
  checked: boolean
}

const DEMO_CATEGORIES: LicenseCategory[] = [
  { id: 1, categoryId: "1", category: "Motor Cycle", checked: true },
  { id: 2, categoryId: "2", category: "Motor Car", checked: false },
  { id: 3, categoryId: "3", category: "Jeep", checked: false },
  { id: 4, categoryId: "4", category: "Tractor", checked: false },
  { id: 5, categoryId: "5", category: "LTV", checked: false },
  { id: 6, categoryId: "6", category: "HTV", checked: false },
  { id: 7, categoryId: "7", category: "PSV / Badge", checked: false },
]

const APPROVAL_STATUSES = [
  { id: 1, label: "Approved" },
  { id: 2, label: "Rejected" },
  { id: 3, label: "On Hold" },
  { id: 4, label: "Refer Back" },
]

export default function DspApprovalPage() {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]

  // Token state
  const [tokenState, setTokenState] = useState<"idle" | "serving">("idle")
  const [servingToken, setServingToken] = useState("")

  // Form fields
  const [tokenId, setTokenId] = useState("")
  const [approvalDate, setApprovalDate] = useState(today)
  const [entityId, setEntityId] = useState("1")
  const [busUnitId, setBusUnitId] = useState("1")
  const [siteId, setSiteId] = useState("1")
  const [statusTypeId, setStatusTypeId] = useState("")
  const [remarks, setRemarks] = useState("")

  // Applicant info
  const [applicant, setApplicant] = useState<ApplicantInfo | null>(null)

  // Categories
  const [categories, setCategories] = useState<LicenseCategory[]>(DEMO_CATEGORIES)

  // Navigation
  const [currentRecord, setCurrentRecord] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  /* ---------- Token Actions ---------- */
  const handleNextToken = () => {
    const demoToken = `T-${String(Math.floor(Math.random() * 9000) + 1000)}`
    setTokenId("1001")
    setServingToken(demoToken)
    setTokenState("serving")
    setApplicant({
      applicantId: "APP-2024-0891",
      tokenNo: demoToken,
      appProcessNo: "PRC-2024-1234",
      firstName: "Ahmed",
      lastName: "Khan",
      fatherName: "Muhammad Khan",
      cnic: "42101-1234567-1",
      dob: "1990-05-15",
      gender: "Male",
      mobile: "0300-1234567",
      address: "House 12, Block A, Nazimabad, Karachi",
      licenseType: "Permanent",
      applicationDate: today,
      photo: null,
    })
    setCurrentRecord(1)
    setTotalRecords(1)
  }

  const handleCallToken = () => {
    handleNextToken()
  }

  const handleSkipToken = () => {
    if (tokenId) {
      setTokenState("idle")
      setTokenId("")
      setServingToken("")
      setApplicant(null)
      setStatusTypeId("")
      setRemarks("")
      setCurrentRecord(0)
    }
  }

  const handleSave = () => {
    if (!statusTypeId) {
      alert("Please select an Approval Status")
      return
    }
    alert(`DSP Approval saved with status: ${APPROVAL_STATUSES.find((s) => s.id === Number(statusTypeId))?.label}`)
    setTokenState("idle")
    setTokenId("")
    setServingToken("")
    setApplicant(null)
    setStatusTypeId("")
    setRemarks("")
  }

  const handleSaveNew = () => {
    handleSave()
    handleNextToken()
  }

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this record?")) {
      setTokenState("idle")
      setTokenId("")
      setServingToken("")
      setApplicant(null)
      setStatusTypeId("")
      setRemarks("")
    }
  }

  const statusColor = statusTypeId === "1" ? "text-green-700 bg-green-50 border-green-200" :
    statusTypeId === "2" ? "text-red-700 bg-red-50 border-red-200" :
    statusTypeId === "3" ? "text-amber-700 bg-amber-50 border-amber-200" :
    statusTypeId === "4" ? "text-blue-700 bg-blue-50 border-blue-200" : ""

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex h-[48px] shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground" title="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold tracking-tight">DSP Approval</h1>
        </div>
        {servingToken && (
          <span className="ml-2 rounded bg-primary/10 px-2 py-0.5 text-xs font-semibold text-primary">
            Token: {servingToken}
          </span>
        )}
      </header>

      {/* Token Call Bar */}
      <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-1.5">
        <button
          onClick={handleNextToken}
          disabled={tokenState === "serving"}
          className="flex items-center gap-1.5 rounded bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40"
        >
          <SkipForward className="h-3.5 w-3.5" /> Next Token
        </button>
        <button
          onClick={handleCallToken}
          disabled={tokenState === "serving"}
          className="flex items-center gap-1.5 rounded bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-40"
        >
          <PhoneCall className="h-3.5 w-3.5" /> Call Token
        </button>
        <button
          onClick={handleSkipToken}
          disabled={tokenState === "idle"}
          className="flex items-center gap-1.5 rounded bg-amber-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-amber-700 disabled:opacity-40"
        >
          <PhoneOff className="h-3.5 w-3.5" /> Skip Token
        </button>
        <button
          disabled={tokenState === "idle"}
          className="flex items-center gap-1.5 rounded bg-purple-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-purple-700 disabled:opacity-40"
        >
          <Radio className="h-3.5 w-3.5" /> Serving Token
        </button>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-muted-foreground">
          <Clock className="h-3 w-3" />
          {tokenState === "serving" ? (
            <span className="font-semibold text-emerald-600">Serving: {servingToken}</span>
          ) : (
            <span>Waiting for token...</span>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/20 px-4 py-1">
        <button
          onClick={handleSave}
          disabled={!applicant}
          className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted disabled:opacity-40"
        >
          <Save className="h-3.5 w-3.5" /> Save
        </button>
        <button
          onClick={handleSaveNew}
          disabled={!applicant}
          className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted disabled:opacity-40"
        >
          <FilePlus className="h-3.5 w-3.5" /> Save & New
        </button>
        <button
          onClick={handleDelete}
          disabled={!applicant}
          className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </button>
        <div className="mx-2 h-4 w-px bg-border" />
        <button className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40" disabled><ChevronFirst className="h-3.5 w-3.5" /></button>
        <button className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40" disabled><ChevronLeft className="h-3.5 w-3.5" /></button>
        <span className="min-w-[60px] text-center text-[11px] text-muted-foreground">{currentRecord} of {totalRecords}</span>
        <button className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40" disabled><ChevronRight className="h-3.5 w-3.5" /></button>
        <button className="rounded p-1 text-muted-foreground hover:bg-muted disabled:opacity-40" disabled><ChevronLast className="h-3.5 w-3.5" /></button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-4">
        {/* Approval Form Fields */}
        <div className="mb-4 rounded border border-border bg-card">
          <div className="border-b border-border bg-muted/40 px-3 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Approval Information</span>
          </div>
          <div className="grid grid-cols-4 gap-x-4 gap-y-2 p-3">
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Token ID</label>
              <input
                type="text"
                value={tokenId}
                readOnly
                className="h-7 w-full rounded border border-border bg-muted/30 px-2 text-[11px]"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Approval Date</label>
              <input
                type="date"
                value={approvalDate}
                onChange={(e) => setApprovalDate(e.target.value)}
                className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]"
              />
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Entity</label>
              <select value={entityId} onChange={(e) => setEntityId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
                <option value="1">Karachi - Nazimabad</option>
                <option value="2">Karachi - Saddar</option>
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Business Unit</label>
              <select value={busUnitId} onChange={(e) => setBusUnitId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
                <option value="1">DL Branch</option>
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Site</label>
              <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
                <option value="1">Nazimabad</option>
                <option value="2">Saddar</option>
              </select>
            </div>
            <div>
              <label className="mb-0.5 block text-[10px] font-semibold text-red-500 flex items-center gap-1">
                Approval Status <span className="text-red-500">*</span>
              </label>
              <select
                value={statusTypeId}
                onChange={(e) => setStatusTypeId(e.target.value)}
                className={`h-7 w-full rounded border px-2 text-[11px] font-semibold ${statusColor || "border-border bg-background"}`}
              >
                <option value="">-- Select --</option>
                {APPROVAL_STATUSES.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Remarks</label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter remarks..."
                className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]"
              />
            </div>
          </div>
        </div>

        {/* Applicant Info + Photo */}
        {applicant ? (
          <div className="mb-4 flex gap-4">
            {/* Applicant Details */}
            <div className="flex-1 rounded border border-border bg-card">
              <div className="border-b border-border bg-muted/40 px-3 py-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  <User className="mr-1 inline h-3 w-3" /> Applicant Information
                </span>
              </div>
              <div className="grid grid-cols-3 gap-x-4 gap-y-2 p-3">
                {[
                  { label: "Applicant ID", value: applicant.applicantId },
                  { label: "Token No", value: applicant.tokenNo },
                  { label: "Process No", value: applicant.appProcessNo },
                  { label: "First Name", value: applicant.firstName },
                  { label: "Last Name", value: applicant.lastName },
                  { label: "Father/Husband", value: applicant.fatherName },
                  { label: "CNIC", value: applicant.cnic },
                  { label: "Date of Birth", value: applicant.dob },
                  { label: "Gender", value: applicant.gender },
                  { label: "Mobile", value: applicant.mobile },
                  { label: "License Type", value: applicant.licenseType },
                  { label: "App Date", value: applicant.applicationDate },
                ].map((f, i) => (
                  <div key={i}>
                    <span className="text-[10px] text-muted-foreground">{f.label}:</span>
                    <span className="ml-1 text-[11px] font-semibold">{f.value}</span>
                  </div>
                ))}
                <div className="col-span-3">
                  <span className="text-[10px] text-muted-foreground">Address:</span>
                  <span className="ml-1 text-[11px] font-semibold">{applicant.address}</span>
                </div>
              </div>
            </div>

            {/* Photo */}
            <div className="w-[160px] shrink-0 rounded border border-border bg-card">
              <div className="border-b border-border bg-muted/40 px-3 py-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Photo</span>
              </div>
              <div className="flex h-[180px] items-center justify-center p-2">
                <div className="flex h-full w-full items-center justify-center rounded border border-dashed border-border bg-muted/20">
                  <span className="text-[10px] text-muted-foreground">No image data</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-4 flex h-32 items-center justify-center rounded border border-dashed border-border bg-muted/10">
            <p className="text-xs text-muted-foreground">Call a token to view applicant information</p>
          </div>
        )}

        {/* License Category Grid */}
        <div className="rounded border border-border bg-card">
          <div className="border-b border-border bg-muted/40 px-3 py-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              <CreditCard className="mr-1 inline h-3 w-3" /> License Category
            </span>
          </div>
          <div className="overflow-auto">
            <table className="w-full text-[11px]">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="w-8 px-2 py-1.5 text-center">
                    <input type="checkbox" className="h-3 w-3 rounded border-border" disabled />
                  </th>
                  <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground">Line</th>
                  <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground">Category ID</th>
                  <th className="px-3 py-1.5 text-left font-semibold text-muted-foreground">License Category</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={cat.id} className={`border-b border-border ${idx % 2 === 0 ? "" : "bg-muted/10"} ${cat.checked ? "bg-primary/5" : ""}`}>
                    <td className="px-2 py-1 text-center">
                      <input
                        type="checkbox"
                        checked={cat.checked}
                        onChange={() => {
                          setCategories((prev) =>
                            prev.map((c) => (c.id === cat.id ? { ...c, checked: !c.checked } : c))
                          )
                        }}
                        className="h-3 w-3 rounded border-border"
                      />
                    </td>
                    <td className="px-3 py-1 text-muted-foreground">{idx + 1}</td>
                    <td className="px-3 py-1 font-mono">{cat.categoryId}</td>
                    <td className="px-3 py-1 font-medium">{cat.category}</td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr><td colSpan={4} className="px-4 py-6 text-center text-muted-foreground">No categories loaded</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
