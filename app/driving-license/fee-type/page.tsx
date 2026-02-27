"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface FeeTypeRecord {
  code: string
  feeType: string
  feeCategory: string
  feeNature: string
  entity: string
  feeOccurrence: string
  validityType: string
  validity: number
  description: string
  counterType: string
  vendorNo: string
  block: boolean
}

const INITIAL_RECORDS: FeeTypeRecord[] = [
  { code: "F_001", feeType: "Medical", feeCategory: "Non-Refundable", feeNature: "Police Welfare", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_002", feeType: "Card", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_003", feeType: "Physical Fail", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_004", feeType: "PSV", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_005", feeType: "Change Profile", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_006", feeType: "License Fee", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_007", feeType: "OD Fee", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_008", feeType: "RTF", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_020", feeType: "Lamination", feeCategory: "Non-Refundable", feeNature: "Police Welfare", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_021", feeType: "Duplicate", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_022", feeType: "Renewal", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_023", feeType: "Endorsement", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_032", feeType: "License Book Fee", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_033", feeType: "LRNR Duplicate", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_034", feeType: "LRNR Renewal", feeCategory: "Non-Refundable", feeNature: "Government", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_035", feeType: "TCS Dispatch", feeCategory: "Non-Refundable", feeNature: "TCS Dispatch", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
  { code: "F_036", feeType: "Nadra Fee", feeCategory: "Non-Refundable", feeNature: "Nadra Verification", entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0, description: "", counterType: "03", vendorNo: "", block: false },
]

export default function FeeTypePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [records, setRecords] = useState<FeeTypeRecord[]>(INITIAL_RECORDS)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") { router.replace("/"); return }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const current = records[selectedIndex] || INITIAL_RECORDS[0]

  const updateField = useCallback((field: keyof FeeTypeRecord, value: unknown) => {
    setRecords((prev) => prev.map((r, i) => (i === selectedIndex ? { ...r, [field]: value } : r)))
  }, [selectedIndex])

  const handleNew = () => {
    const newCode = `F_${String(records.length + 1).padStart(3, "0")}`
    const newRecord: FeeTypeRecord = {
      code: newCode, feeType: "", feeCategory: "Non-Refundable", feeNature: "Government",
      entity: "001", feeOccurrence: "Visit", validityType: "", validity: 0,
      description: "", counterType: "03", vendorNo: "", block: false,
    }
    setRecords((prev) => [...prev, newRecord])
    setSelectedIndex(records.length)
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader
        title="Fee Type"
        username={username}
        onLogout={() => { sessionStorage.clear(); router.replace("/") }}
        onBack={() => router.push("/driving-license")}
      />

      <MasterDetailToolbar
        title="Fee Type"
        recordIndex={selectedIndex}
        totalRecords={records.length}
        onNew={handleNew}
        onSave={() => {}}
        onSaveAndNew={() => handleNew()}
        onFirst={() => setSelectedIndex(0)}
        onPrev={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
        onNext={() => setSelectedIndex(Math.min(records.length - 1, selectedIndex + 1))}
        onLast={() => setSelectedIndex(records.length - 1)}
        onRefresh={() => setRecords(INITIAL_RECORDS)}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Left panel - record list */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-border bg-card">
          <div className="sticky top-0 z-10 grid grid-cols-[50px_1fr_1fr_1fr] gap-px bg-[#2d3748] px-2 py-2 text-xs font-semibold text-[#e2e8f0]">
            <span>Code</span>
            <span>Fee Type</span>
            <span>Fee Category</span>
            <span>Fee Nature</span>
          </div>
          <div className="grid grid-cols-[50px_1fr_1fr_1fr] gap-px border-b border-border px-2 py-1">
            <div className="h-5" /><div className="h-5" /><div className="h-5" /><div className="h-5" />
          </div>
          {records.map((r, idx) => (
            <button
              key={r.code}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`grid w-full grid-cols-[50px_1fr_1fr_1fr] gap-px border-b border-border px-2 py-2 text-left text-xs transition-colors ${
                idx === selectedIndex
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="truncate">{r.code}</span>
              <span className="truncate">{r.feeType}</span>
              <span className="truncate text-muted-foreground">{r.feeCategory}</span>
              <span className="truncate text-muted-foreground">{r.feeNature}</span>
            </button>
          ))}
        </div>

        {/* Right panel - detail form */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="bg-[#4a5568] px-4 py-1.5 text-xs font-semibold text-[#e2e8f0]">
            Header Information
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Fee Code :</Label>
              <Input value={current.code} onChange={(e) => updateField("code", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Entity :</Label>
              <Input value={current.entity} readOnly className="h-8 w-20 text-xs bg-secondary/50" />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <Label className="w-32 shrink-0 text-xs font-semibold">Fee Type :</Label>
              <Input value={current.feeType} onChange={(e) => updateField("feeType", e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Fee Occurrence :</Label>
              <Input value={current.feeOccurrence} onChange={(e) => updateField("feeOccurrence", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Validity Type :</Label>
              <Input value={current.validityType} onChange={(e) => updateField("validityType", e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Fee Category :</Label>
              <Input value={current.feeCategory} onChange={(e) => updateField("feeCategory", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Validity :</Label>
              <Input type="number" value={current.validity} onChange={(e) => updateField("validity", Number(e.target.value))} className="h-8 w-20 text-xs" />
            </div>

            <div className="flex items-start gap-3 md:col-span-2">
              <Label className="w-32 shrink-0 pt-2 text-xs font-semibold">Description :</Label>
              <Textarea value={current.description} onChange={(e) => updateField("description", e.target.value)} className="min-h-[60px] text-xs" rows={3} />
            </div>

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Fee Nature :</Label>
              <Input value={current.feeNature} onChange={(e) => updateField("feeNature", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Counter Type :</Label>
              <Input value={current.counterType} onChange={(e) => updateField("counterType", e.target.value)} className="h-8 w-20 text-xs" />
            </div>

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Vendor No:</Label>
              <Input value={current.vendorNo} onChange={(e) => updateField("vendorNo", e.target.value)} className="h-8 text-xs" />
            </div>
            <div />

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Block :</Label>
              <Checkbox checked={current.block} onCheckedChange={(v) => updateField("block", !!v)} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
