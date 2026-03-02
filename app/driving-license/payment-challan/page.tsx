"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Search,
  Banknote,
  Receipt,
  CheckCircle2,
  XCircle,
  Clock,
  Printer,
  AlertCircle,
  Eye,
  FileText,
} from "lucide-react"

interface FeeItem {
  feeid: number
  feedesc: string
  amount: number
  qty: number
  total: number
}

interface PaymentRecord {
  challanNo: string
  applicationId: string
  applicationNo: string
  applicantNo: string
  applicantName: string
  fatherName: string
  cnic: string
  feeType: string
  licenseType: string
  appType: string
  licenseCategory: string
  branchName: string
  totalAmount: number
  paymentDate: string
  paymentStatus: "Pending" | "Paid" | "Cancelled" | "Refunded"
  nbpBranchCode: string
  receiptNo: string
  remarks: string
  fees: FeeItem[]
}

const DEFAULT_FEES: FeeItem[] = [
  { feeid: 1, feedesc: "License Fee", amount: 300, qty: 1, total: 300 },
  { feeid: 2, feedesc: "Govt. Tax", amount: 60, qty: 1, total: 60 },
  { feeid: 3, feedesc: "Card Fee", amount: 500, qty: 1, total: 500 },
  { feeid: 4, feedesc: "Challan Charges", amount: 20, qty: 1, total: 20 },
]

const EMPTY_RECORD: PaymentRecord = {
  challanNo: "",
  applicationId: "",
  applicationNo: "",
  applicantNo: "",
  applicantName: "",
  fatherName: "",
  cnic: "",
  feeType: "License Fee",
  licenseType: "",
  appType: "",
  licenseCategory: "",
  branchName: "",
  totalAmount: 0,
  paymentDate: new Date().toLocaleDateString("en-US"),
  paymentStatus: "Pending",
  nbpBranchCode: "",
  receiptNo: "",
  remarks: "",
  fees: [...DEFAULT_FEES],
}

const FEE_TYPE_OPTIONS = [
  "License Fee",
  "Learner License Fee",
  "Permanent License Fee",
  "International License Fee",
  "Duplicate License Fee",
  "Renewal Fee",
]

/* ---------- Printable Challan Copy Component ---------- */
function ChallanCopy({
  copyLabel,
  record,
  className = "",
}: {
  copyLabel: string
  record: PaymentRecord
  className?: string
}) {
  const grandTotal = record.fees.reduce((s, f) => s + f.total, 0)
  return (
    <div className={`border border-foreground/80 ${className}`}>
      {/* Header */}
      <div className="border-b border-foreground/80 p-2 text-center">
        <p className="text-[9px] font-bold uppercase tracking-wide">{copyLabel}</p>
      </div>
      <div className="border-b border-foreground/80 p-2 text-center">
        <p className="text-[11px] font-bold uppercase">Government of Sindh</p>
        <p className="text-[10px] font-semibold">Driving License Branch - Sindh Police</p>
        <p className="text-[9px] text-muted-foreground">Payment Challan / Fee Receipt</p>
      </div>
      {/* Branch Name */}
      {record.branchName && (
        <div className="border-b border-foreground/80 px-2 py-1 text-center">
          <p className="text-[9px] font-semibold">{record.branchName}</p>
        </div>
      )}
      {/* Info */}
      <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 border-b border-foreground/80 px-2 py-1.5 text-[9px]">
        <div className="flex gap-1">
          <span className="font-semibold">Challan No:</span>
          <span className="font-mono">{record.challanNo || "---"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">Date:</span>
          <span>{record.paymentDate}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">Applicant No:</span>
          <span className="font-mono">{record.applicantNo || "---"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">Application No:</span>
          <span className="font-mono">{record.applicationNo || "---"}</span>
        </div>
        <div className="col-span-2 flex gap-1">
          <span className="font-semibold">Name:</span>
          <span>{record.applicantName || "---"}</span>
        </div>
        <div className="col-span-2 flex gap-1">
          <span className="font-semibold">{"Father's Name:"}</span>
          <span>{record.fatherName || "---"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">CNIC:</span>
          <span className="font-mono">{record.cnic || "---"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">App Type:</span>
          <span>{record.appType || "---"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">License Type:</span>
          <span>{record.licenseType || "---"}</span>
        </div>
        <div className="flex gap-1">
          <span className="font-semibold">Category:</span>
          <span>{record.licenseCategory || "---"}</span>
        </div>
      </div>
      {/* Fee Table */}
      <div className="border-b border-foreground/80">
        <table className="w-full text-[9px]">
          <thead>
            <tr className="border-b border-foreground/80 bg-muted/30">
              <th className="px-1.5 py-1 text-left font-semibold">#</th>
              <th className="px-1.5 py-1 text-left font-semibold">Description</th>
              <th className="px-1.5 py-1 text-right font-semibold">Rate</th>
              <th className="px-1.5 py-1 text-center font-semibold">Qty</th>
              <th className="px-1.5 py-1 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {record.fees.map((fee, i) => (
              <tr key={fee.feeid} className="border-b border-foreground/30 last:border-0">
                <td className="px-1.5 py-0.5">{i + 1}</td>
                <td className="px-1.5 py-0.5">{fee.feedesc}</td>
                <td className="px-1.5 py-0.5 text-right font-mono">{fee.amount}</td>
                <td className="px-1.5 py-0.5 text-center">{fee.qty}</td>
                <td className="px-1.5 py-0.5 text-right font-mono">{fee.total}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-foreground/80 font-bold">
              <td colSpan={4} className="px-1.5 py-1 text-right">
                Grand Total (PKR):
              </td>
              <td className="px-1.5 py-1 text-right font-mono">{grandTotal.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      {/* Footer */}
      <div className="grid grid-cols-2 gap-2 px-2 py-2 text-[8px]">
        <div className="flex flex-col gap-3">
          <span className="text-muted-foreground">Depositor Signature</span>
          <div className="border-b border-foreground/60" />
        </div>
        <div className="flex flex-col gap-3 text-right">
          <span className="text-muted-foreground">Cashier / Bank Stamp</span>
          <div className="border-b border-foreground/60" />
        </div>
      </div>
    </div>
  )
}

export default function PaymentChallanPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [record, setRecord] = useState<PaymentRecord>({ ...EMPTY_RECORD })
  const [activeTab, setActiveTab] = useState<"challan" | "fee-detail" | "print-preview">("challan")
  const printRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") { router.replace("/"); return }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const updateField = (field: keyof PaymentRecord, value: string | number) => {
    setRecord(r => {
      const updated = { ...r, [field]: value }
      return updated
    })
  }

  const updateFee = (index: number, field: keyof FeeItem, value: number | string) => {
    setRecord(r => {
      const fees = [...r.fees]
      const fee = { ...fees[index], [field]: value }
      if (field === "amount" || field === "qty") {
        fee.total = Number(fee.amount) * Number(fee.qty)
      }
      fees[index] = fee
      return { ...r, fees, totalAmount: fees.reduce((s, f) => s + f.total, 0) }
    })
  }

  const addFeeRow = () => {
    setRecord(r => ({
      ...r,
      fees: [...r.fees, { feeid: r.fees.length + 1, feedesc: "", amount: 0, qty: 1, total: 0 }],
    }))
  }

  const removeFeeRow = (index: number) => {
    setRecord(r => {
      const fees = r.fees.filter((_, i) => i !== index)
      return { ...r, fees, totalAmount: fees.reduce((s, f) => s + f.total, 0) }
    })
  }

  const handleSave = () => {
    const updated = { ...record }
    if (!updated.challanNo) {
      updated.challanNo = `CH-${Date.now().toString().slice(-8)}`
    }
    updated.totalAmount = updated.fees.reduce((s, f) => s + f.total, 0)
    setRecord(updated)
    const newRecords = [...records]
    newRecords[currentIndex] = updated
    setRecords(newRecords)
  }

  const handlePrint = () => {
    const el = printRef.current
    if (!el) return
    const win = window.open("", "_blank", "width=900,height=700")
    if (!win) return
    win.document.write(`
      <html><head><title>Payment Challan - ${record.challanNo || "Draft"}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; font-size: 9px; color: #000; }
        .challan-container { display: flex; gap: 4px; padding: 8px; }
        .copy { flex: 1; border: 1.5px solid #000; }
        .copy-header { text-align: center; border-bottom: 1px solid #000; padding: 3px; font-weight: bold; text-transform: uppercase; font-size: 8px; letter-spacing: 0.5px; }
        .govt-header { text-align: center; border-bottom: 1px solid #000; padding: 4px 2px; }
        .govt-header .title { font-size: 10px; font-weight: bold; text-transform: uppercase; }
        .govt-header .subtitle { font-size: 9px; font-weight: 600; }
        .govt-header .desc { font-size: 8px; color: #555; }
        .info { padding: 4px 6px; border-bottom: 1px solid #000; display: grid; grid-template-columns: 1fr 1fr; gap: 2px; font-size: 8px; }
        .info .full { grid-column: 1 / -1; }
        .info .label { font-weight: 600; }
        table { width: 100%; border-collapse: collapse; font-size: 8px; }
        th, td { padding: 2px 4px; border-bottom: 1px solid #ccc; }
        th { text-align: left; font-weight: 600; background: #f5f5f5; border-bottom: 1px solid #000; }
        .text-right { text-align: right; }
        .text-center { text-align: center; }
        .mono { font-family: 'Courier New', monospace; }
        .total-row { border-top: 1.5px solid #000; font-weight: bold; }
        .footer { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; padding: 6px; font-size: 7px; color: #555; }
        .sig-line { border-bottom: 1px solid #666; margin-top: 16px; }
        @media print { body { margin: 0; } .challan-container { padding: 2mm; } }
      </style></head><body>
      <div class="challan-container">
        ${["Bank Copy", "Applicant Copy", "Office Copy"].map(label => `
          <div class="copy">
            <div class="copy-header">${label}</div>
            <div class="govt-header">
              <div class="title">Government of Sindh</div>
              <div class="subtitle">Driving License Branch - Sindh Police</div>
              ${record.branchName ? `<div class="subtitle" style="font-size:8px">${record.branchName}</div>` : ""}
              <div class="desc">Payment Challan / Fee Receipt</div>
            </div>
            <div class="info">
              <div><span class="label">Challan No: </span><span class="mono">${record.challanNo || "---"}</span></div>
              <div><span class="label">Date: </span>${record.paymentDate}</div>
              <div><span class="label">Applicant No: </span><span class="mono">${record.applicantNo || "---"}</span></div>
              <div><span class="label">Application No: </span><span class="mono">${record.applicationNo || "---"}</span></div>
              <div class="full"><span class="label">Name: </span>${record.applicantName || "---"}</div>
              <div class="full"><span class="label">Father's Name: </span>${record.fatherName || "---"}</div>
              <div><span class="label">CNIC: </span><span class="mono">${record.cnic || "---"}</span></div>
              <div><span class="label">App Type: </span>${record.appType || "---"}</div>
              <div><span class="label">License Type: </span>${record.licenseType || "---"}</div>
              <div><span class="label">Category: </span>${record.licenseCategory || "---"}</div>
            </div>
            <table>
              <thead><tr><th>#</th><th>Description</th><th class="text-right">Rate</th><th class="text-center">Qty</th><th class="text-right">Amount</th></tr></thead>
              <tbody>
                ${record.fees.map((f, i) => `<tr><td>${i + 1}</td><td>${f.feedesc}</td><td class="text-right mono">${f.amount}</td><td class="text-center">${f.qty}</td><td class="text-right mono">${f.total}</td></tr>`).join("")}
              </tbody>
              <tfoot><tr class="total-row"><td colspan="4" class="text-right">Grand Total (PKR):</td><td class="text-right mono">${record.fees.reduce((s, f) => s + f.total, 0).toLocaleString()}</td></tr></tfoot>
            </table>
            <div class="footer">
              <div>Depositor Signature<div class="sig-line"></div></div>
              <div style="text-align:right">Cashier / Bank Stamp<div class="sig-line"></div></div>
            </div>
          </div>
        `).join("")}
      </div>
      </body></html>
    `)
    win.document.close()
    setTimeout(() => { win.print(); win.close() }, 400)
  }

  const formatCNIC = (val: string) => {
    const d = val.replace(/\D/g, "").slice(0, 13)
    if (d.length <= 5) return d
    if (d.length <= 12) return `${d.slice(0, 5)}-${d.slice(5)}`
    return `${d.slice(0, 5)}-${d.slice(5, 12)}-${d.slice(12)}`
  }

  const statusColor = record.paymentStatus === "Paid"
    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
    : record.paymentStatus === "Cancelled"
    ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <SetupPageHeader
        title="Payment Challan"
        username={username}
        onLogout={() => { sessionStorage.clear(); router.replace("/") }}
        onBack={() => router.push("/driving-license")}
      />
      <MasterDetailToolbar
        title="Payment / Challan"
        recordIndex={currentIndex}
        totalRecords={records.length}
        onNew={() => { setRecord({ ...EMPTY_RECORD, fees: [...DEFAULT_FEES] }); setRecords(r => [...r, { ...EMPTY_RECORD, fees: [...DEFAULT_FEES] }]); setCurrentIndex(records.length) }}
        onSave={handleSave}
        onSaveAndNew={() => { handleSave(); setRecord({ ...EMPTY_RECORD, fees: [...DEFAULT_FEES] }); setRecords(r => [...r, { ...EMPTY_RECORD, fees: [...DEFAULT_FEES] }]); setCurrentIndex(records.length) }}
        onFirst={() => { if (records.length > 0) { setCurrentIndex(0); setRecord(records[0]) } }}
        onPrev={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setRecord(records[currentIndex - 1]) } }}
        onNext={() => { if (currentIndex < records.length - 1) { setCurrentIndex(currentIndex + 1); setRecord(records[currentIndex + 1]) } }}
        onLast={() => { if (records.length > 0) { setCurrentIndex(records.length - 1); setRecord(records[records.length - 1]) } }}
        onRefresh={() => setRecord({ ...EMPTY_RECORD, fees: [...DEFAULT_FEES] })}
        showDelete
        onDelete={() => {}}
      />

      <main className="flex-1 overflow-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto max-w-6xl">
          {/* Challan Header */}
          <div className="mb-4 rounded-lg border border-border bg-card">
            <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
              <h3 className="text-sm font-bold text-foreground">Challan Information</h3>
            </div>
            <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-4">
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Challan No</Label>
                <Input value={record.challanNo} readOnly className="h-8 bg-muted/30 text-xs font-mono" placeholder="Auto Generated" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Application ID</Label>
                <div className="flex gap-1">
                  <Input value={record.applicationId} onChange={e => updateField("applicationId", e.target.value)} className="h-8 text-xs" />
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0"><Search className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Applicant Name</Label>
                <Input value={record.applicantName} onChange={e => updateField("applicantName", e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">{"Father / Husband"}</Label>
                <Input value={record.fatherName} onChange={e => updateField("fatherName", e.target.value)} className="h-8 text-xs" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Application No</Label>
                <Input value={record.applicationNo} onChange={e => updateField("applicationNo", e.target.value)} className="h-8 text-xs font-mono" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Applicant No</Label>
                <Input value={record.applicantNo} onChange={e => updateField("applicantNo", e.target.value)} className="h-8 text-xs font-mono" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">CNIC</Label>
                <Input
                  value={record.cnic}
                  onChange={e => updateField("cnic", formatCNIC(e.target.value))}
                  className="h-8 text-xs font-mono"
                  placeholder="XXXXX-XXXXXXX-X"
                  maxLength={15}
                />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Fee Type</Label>
                <select
                  value={record.feeType}
                  onChange={e => updateField("feeType", e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                >
                  <option value="">Select</option>
                  {FEE_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">License Type</Label>
                <select
                  value={record.licenseType}
                  onChange={e => updateField("licenseType", e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                >
                  <option value="">Select</option>
                  <option value="Learner">Learner</option>
                  <option value="Permanent">Permanent</option>
                  <option value="International">International</option>
                  <option value="Duplicate">Duplicate</option>
                  <option value="Renewal">Renewal</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">App Type</Label>
                <select
                  value={record.appType}
                  onChange={e => updateField("appType", e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                >
                  <option value="">Select</option>
                  <option value="New">New</option>
                  <option value="Renewal">Renewal</option>
                  <option value="Duplicate">Duplicate</option>
                  <option value="Addition">Addition of Category</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Branch Name</Label>
                <div className="flex gap-1">
                  <Input value={record.branchName} onChange={e => updateField("branchName", e.target.value)} className="h-8 text-xs" placeholder="Business Unit" />
                  <Button variant="outline" size="icon" className="h-8 w-8 shrink-0"><Search className="h-3 w-3" /></Button>
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Status</Label>
                <div className={`flex h-8 items-center rounded-md border px-2 text-xs font-bold ${statusColor}`}>
                  {record.paymentStatus === "Paid" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                  {record.paymentStatus === "Pending" && <Clock className="mr-1 h-3 w-3" />}
                  {record.paymentStatus === "Cancelled" && <XCircle className="mr-1 h-3 w-3" />}
                  {record.paymentStatus}
                </div>
              </div>
            </div>
          </div>

          {/* Tab Bar */}
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
            {([
              { key: "challan" as const, label: "Fee Detail (F6)", icon: Banknote },
              { key: "fee-detail" as const, label: "Payment (F7)", icon: Receipt },
              { key: "print-preview" as const, label: "Print Preview (F8)", icon: Eye },
            ]).map(tab => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Fee Detail Tab */}
          {activeTab === "challan" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
                <h3 className="text-sm font-bold text-foreground">Applicant Fee Breakdown</h3>
                <Button size="sm" variant="outline" onClick={addFeeRow} className="h-7 gap-1 px-2 text-[11px]">
                  + Add Row
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="w-10 px-3 py-2 text-left font-semibold text-muted-foreground">#</th>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground">Description</th>
                      <th className="w-24 px-3 py-2 text-right font-semibold text-muted-foreground">Rate (PKR)</th>
                      <th className="w-16 px-3 py-2 text-center font-semibold text-muted-foreground">Qty</th>
                      <th className="w-24 px-3 py-2 text-right font-semibold text-muted-foreground">Total (PKR)</th>
                      <th className="w-12 px-3 py-2 text-center font-semibold text-muted-foreground" />
                    </tr>
                  </thead>
                  <tbody>
                    {record.fees.map((fee, i) => (
                      <tr key={i} className="border-b border-border last:border-0">
                        <td className="px-3 py-1.5 text-muted-foreground">{i + 1}</td>
                        <td className="px-3 py-1.5">
                          <Input
                            value={fee.feedesc}
                            onChange={e => updateFee(i, "feedesc", e.target.value)}
                            className="h-7 border-0 bg-transparent p-0 text-xs shadow-none focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <Input
                            type="number"
                            value={fee.amount || ""}
                            onChange={e => updateFee(i, "amount", Number(e.target.value))}
                            className="h-7 border-0 bg-transparent p-0 text-right text-xs font-mono shadow-none focus-visible:ring-0"
                          />
                        </td>
                        <td className="px-3 py-1.5">
                          <Input
                            type="number"
                            value={fee.qty || ""}
                            onChange={e => updateFee(i, "qty", Number(e.target.value))}
                            className="h-7 border-0 bg-transparent p-0 text-center text-xs shadow-none focus-visible:ring-0"
                            min={1}
                          />
                        </td>
                        <td className="px-3 py-1.5 text-right font-mono font-semibold text-foreground">
                          {fee.total.toLocaleString()}
                        </td>
                        <td className="px-3 py-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => removeFeeRow(i)}
                            className="text-destructive/60 transition-colors hover:text-destructive"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="border-t-2 border-border bg-muted/30">
                      <td colSpan={4} className="px-3 py-2 text-right text-sm font-bold text-foreground">
                        Grand Total (PKR):
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-sm font-bold text-foreground">
                        {record.fees.reduce((s, f) => s + f.total, 0).toLocaleString()}
                      </td>
                      <td />
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "fee-detail" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
                <h3 className="text-sm font-bold text-foreground">Payment Detail</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Total Amount (PKR)</Label>
                  <Input
                    value={record.fees.reduce((s, f) => s + f.total, 0)}
                    readOnly
                    className="h-8 bg-emerald-50 text-xs font-mono font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">NBP Branch Code</Label>
                  <Input value={record.nbpBranchCode} onChange={e => updateField("nbpBranchCode", e.target.value)} className="h-8 text-xs" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Receipt No</Label>
                  <Input value={record.receiptNo} onChange={e => updateField("receiptNo", e.target.value)} className="h-8 text-xs font-mono" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Payment Date</Label>
                  <Input value={record.paymentDate} readOnly className="h-8 bg-muted/30 text-xs" />
                </div>
                <div className="flex flex-col gap-1 sm:col-span-2">
                  <Label className="text-[11px] text-muted-foreground">Remarks</Label>
                  <Input value={record.remarks} onChange={e => updateField("remarks", e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border px-3 py-3 sm:px-4">
                <Button
                  size="sm"
                  onClick={() => { updateField("paymentStatus", "Paid"); handleSave() }}
                  className="gap-1.5 bg-green-600 text-white hover:bg-green-700"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confirm Payment
                </Button>
                <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" />
                  Print Challan
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => updateField("paymentStatus", "Cancelled")}
                  className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Print Preview Tab */}
          {activeTab === "print-preview" && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-foreground">Challan Print Preview</h3>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handlePrint} className="gap-1.5">
                    <Printer className="h-3.5 w-3.5" />
                    Print
                  </Button>
                </div>
              </div>

              {/* Preview: 3 copies side by side on desktop, stacked on mobile */}
              <div
                ref={printRef}
                className="rounded-lg border border-border bg-card p-3 sm:p-4"
              >
                {!record.challanNo && !record.applicantName ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <FileText className="mb-3 h-10 w-10 text-muted-foreground/30" />
                    <p className="text-sm font-medium text-muted-foreground">No challan data</p>
                    <p className="text-xs text-muted-foreground/60">Fill in challan information and save to preview</p>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3 lg:flex-row lg:gap-2">
                    <ChallanCopy copyLabel="Bank Copy" record={record} className="flex-1" />
                    <ChallanCopy copyLabel="Applicant Copy" record={record} className="flex-1" />
                    <ChallanCopy copyLabel="Office Copy" record={record} className="flex-1" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">Driving License Sindh - Sindh Police IT Department</p>
      </footer>
    </div>
  )
}
