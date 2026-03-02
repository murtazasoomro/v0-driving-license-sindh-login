"use client"

import { useEffect, useState } from "react"
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
} from "lucide-react"

interface PaymentRecord {
  challanNo: string
  applicationId: string
  applicantName: string
  cnic: string
  feeType: string
  licenseType: string
  amount: number
  penaltyAmount: number
  totalAmount: number
  paymentDate: string
  paymentStatus: "Pending" | "Paid" | "Cancelled" | "Refunded"
  nbpBranchCode: string
  receiptNo: string
  remarks: string
}

const EMPTY_RECORD: PaymentRecord = {
  challanNo: "",
  applicationId: "",
  applicantName: "",
  cnic: "",
  feeType: "License Fee",
  licenseType: "",
  amount: 0,
  penaltyAmount: 0,
  totalAmount: 0,
  paymentDate: new Date().toLocaleDateString("en-US"),
  paymentStatus: "Pending",
  nbpBranchCode: "",
  receiptNo: "",
  remarks: "",
}

// Fee structure mock data
const FEE_STRUCTURE = [
  { type: "Learner License Fee", amount: 60 },
  { type: "Permanent License Fee", amount: 300 },
  { type: "International License Fee", amount: 1500 },
  { type: "Duplicate License Fee", amount: 200 },
  { type: "Renewal Fee", amount: 300 },
  { type: "Late Fee / Penalty", amount: 100 },
]

export default function PaymentChallanPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [records, setRecords] = useState<PaymentRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [record, setRecord] = useState<PaymentRecord>({ ...EMPTY_RECORD })
  const [activeTab, setActiveTab] = useState<"challan" | "fee-detail" | "history">("challan")

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
      if (field === "amount" || field === "penaltyAmount") {
        updated.totalAmount = Number(updated.amount) + Number(updated.penaltyAmount)
      }
      return updated
    })
  }

  const handleSave = () => {
    if (!record.challanNo) {
      setRecord(r => ({ ...r, challanNo: `CH-${Date.now().toString().slice(-8)}` }))
    }
    const newRecords = [...records]
    newRecords[currentIndex] = record
    setRecords(newRecords)
  }

  if (!isAuthenticated) return null

  const statusColor = record.paymentStatus === "Paid"
    ? "border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-400"
    : record.paymentStatus === "Cancelled"
    ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400"
    : "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400"

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
        onNew={() => { setRecord({ ...EMPTY_RECORD }); setRecords([...records, { ...EMPTY_RECORD }]); setCurrentIndex(records.length) }}
        onSave={handleSave}
        onSaveAndNew={() => { handleSave(); setRecord({ ...EMPTY_RECORD }); setRecords([...records, { ...EMPTY_RECORD }]); setCurrentIndex(records.length) }}
        onFirst={() => { if (records.length > 0) { setCurrentIndex(0); setRecord(records[0]) } }}
        onPrev={() => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setRecord(records[currentIndex - 1]) } }}
        onNext={() => { if (currentIndex < records.length - 1) { setCurrentIndex(currentIndex + 1); setRecord(records[currentIndex + 1]) } }}
        onLast={() => { if (records.length > 0) { setCurrentIndex(records.length - 1); setRecord(records[records.length - 1]) } }}
        onRefresh={() => setRecord({ ...EMPTY_RECORD })}
        showDelete
        onDelete={() => {}}
      />

      <main className="flex-1 overflow-auto px-3 py-4 sm:px-4 sm:py-6">
        <div className="mx-auto max-w-5xl">
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
                <Label className="text-[11px] text-muted-foreground">CNIC</Label>
                <Input value={record.cnic} onChange={e => updateField("cnic", e.target.value)} className="h-8 text-xs font-mono" placeholder="XXXXX-XXXXXXX-X" />
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Fee Type</Label>
                <select
                  value={record.feeType}
                  onChange={e => updateField("feeType", e.target.value)}
                  className="h-8 rounded-md border border-input bg-background px-2 text-xs text-foreground"
                >
                  <option value="">Select</option>
                  {FEE_STRUCTURE.map(f => <option key={f.type} value={f.type}>{f.type}</option>)}
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
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-[11px] text-muted-foreground">Payment Date</Label>
                <Input value={record.paymentDate} readOnly className="h-8 bg-muted/30 text-xs" />
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

          {/* Tabs */}
          <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
            {(["challan", "fee-detail", "history"] as const).map(tab => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-2 text-xs font-semibold transition-all ${
                  activeTab === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                {tab === "challan" && <Receipt className="h-3.5 w-3.5" />}
                {tab === "fee-detail" && <Banknote className="h-3.5 w-3.5" />}
                {tab === "history" && <Clock className="h-3.5 w-3.5" />}
                {tab === "challan" ? "Challan Detail" : tab === "fee-detail" ? "Fee Breakdown" : "Payment History"}
              </button>
            ))}
          </div>

          {/* Challan Detail Tab */}
          {activeTab === "challan" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
                <h3 className="text-sm font-bold text-foreground">Payment Detail</h3>
              </div>
              <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Amount (PKR)</Label>
                  <Input type="number" value={record.amount || ""} onChange={e => updateField("amount", Number(e.target.value))} className="h-8 text-xs font-mono" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Penalty (PKR)</Label>
                  <Input type="number" value={record.penaltyAmount || ""} onChange={e => updateField("penaltyAmount", Number(e.target.value))} className="h-8 text-xs font-mono" />
                </div>
                <div className="flex flex-col gap-1">
                  <Label className="text-[11px] text-muted-foreground">Total Amount (PKR)</Label>
                  <Input value={record.totalAmount} readOnly className="h-8 bg-emerald-50 text-xs font-mono font-bold text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400" />
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
                  <Label className="text-[11px] text-muted-foreground">Remarks</Label>
                  <Input value={record.remarks} onChange={e => updateField("remarks", e.target.value)} className="h-8 text-xs" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t border-border px-3 py-3 sm:px-4">
                <Button size="sm" onClick={() => updateField("paymentStatus", "Paid")} className="gap-1.5 bg-green-600 text-white hover:bg-green-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Confirm Payment
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5">
                  <Printer className="h-3.5 w-3.5" />
                  Print Challan
                </Button>
                <Button size="sm" variant="outline" className="gap-1.5 border-destructive/30 text-destructive hover:bg-destructive/10">
                  <XCircle className="h-3.5 w-3.5" />
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Fee Detail Tab */}
          {activeTab === "fee-detail" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
                <h3 className="text-sm font-bold text-foreground">Fee Structure</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/20">
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground sm:px-4">#</th>
                      <th className="px-3 py-2 text-left font-semibold text-muted-foreground sm:px-4">Fee Type</th>
                      <th className="px-3 py-2 text-right font-semibold text-muted-foreground sm:px-4">Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {FEE_STRUCTURE.map((fee, i) => (
                      <tr key={fee.type} className="border-b border-border last:border-0">
                        <td className="px-3 py-2 text-muted-foreground sm:px-4">{i + 1}</td>
                        <td className="px-3 py-2 font-medium text-foreground sm:px-4">{fee.type}</td>
                        <td className="px-3 py-2 text-right font-mono font-semibold text-foreground sm:px-4">{fee.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="rounded-lg border border-border bg-card">
              <div className="border-b border-border bg-muted/30 px-3 py-2 sm:px-4">
                <h3 className="text-sm font-bold text-foreground">Payment History</h3>
              </div>
              <div className="flex items-center justify-center p-8">
                <div className="text-center">
                  <AlertCircle className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">No payment records found</p>
                  <p className="text-xs text-muted-foreground/60">Payment history will appear here after transactions are processed</p>
                </div>
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
