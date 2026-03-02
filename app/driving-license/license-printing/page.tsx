"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Printer,
  CheckSquare,
  Square,
  RefreshCw,
  X,
  Download,
  XCircle,
  Play,
  StopCircle,
  CreditCard,
  BarChart3,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  License Printing / Dispatch  –  frmDLtcsdisptch                    */
/* ------------------------------------------------------------------ */

interface PrintRow {
  id: number
  selected: boolean
  laserno: string
  dispatchno: string
  appprocdate: string
  licenseid: string
  appprocessid: string
  appprocessno: string
  licenseno: string
  name: string
  firstname: string
  fathername: string
  dob: string
  issuedate: string
  expiry: string
  site: string
  bunitstxt: string
  issuesiteid: string
  cnic: string
  bloodgroup: string
  identificationmark: string
  olddlno: string
  psvno: string
  addres: string
  category: string
  licensetypestxt: string
  applicantid: string
  licensetypeid: string
  isprinted: boolean
  isprintedstatus: string
  tokenno: string
  passportno: string
  nationality: string
}

interface StatRow {
  property: string
  value: string
}

const DEMO_DATA: PrintRow[] = [
  {
    id: 1, selected: false, laserno: "L-001", dispatchno: "", appprocdate: "2024-01-10",
    licenseid: "5001", appprocessid: "3001", appprocessno: "PRC-2024-001", licenseno: "KHI-24-001234",
    name: "Ahmed Khan", firstname: "Ahmed", fathername: "Muhammad Khan", dob: "1990-05-15",
    issuedate: "2024-01-15", expiry: "2029-01-15", site: "Nazimabad", bunitstxt: "DL Branch",
    issuesiteid: "1", cnic: "42101-1234567-1", bloodgroup: "A+", identificationmark: "Mole on left cheek",
    olddlno: "", psvno: "", addres: "House 12, Block A, Nazimabad, Karachi",
    category: "Motor Cycle, Motor Car", licensetypestxt: "Permanent", applicantid: "10234",
    licensetypeid: "2", isprinted: false, isprintedstatus: "Not Printed", tokenno: "T-1001",
    passportno: "", nationality: "Pakistani",
  },
  {
    id: 2, selected: false, laserno: "L-002", dispatchno: "", appprocdate: "2024-01-11",
    licenseid: "5002", appprocessid: "3002", appprocessno: "PRC-2024-002", licenseno: "KHI-24-001235",
    name: "Sara Ali", firstname: "Sara", fathername: "Ali Raza", dob: "1995-08-22",
    issuedate: "2024-01-16", expiry: "2029-01-16", site: "Nazimabad", bunitstxt: "DL Branch",
    issuesiteid: "1", cnic: "42201-7654321-2", bloodgroup: "B+", identificationmark: "",
    olddlno: "", psvno: "", addres: "Flat 3B, Gulshan-e-Iqbal, Karachi",
    category: "Motor Car", licensetypestxt: "Permanent", applicantid: "10235",
    licensetypeid: "2", isprinted: false, isprintedstatus: "Not Printed", tokenno: "T-1002",
    passportno: "", nationality: "Pakistani",
  },
  {
    id: 3, selected: false, laserno: "L-003", dispatchno: "", appprocdate: "2024-01-12",
    licenseid: "5003", appprocessid: "3003", appprocessno: "PRC-2024-003", licenseno: "KHI-24-001236",
    name: "Bilal Ahmed", firstname: "Bilal", fathername: "Nasir Ahmed", dob: "1988-03-10",
    issuedate: "2024-01-17", expiry: "2029-01-17", site: "Saddar", bunitstxt: "DL Branch",
    issuesiteid: "2", cnic: "42301-1122334-5", bloodgroup: "O+", identificationmark: "Scar on right hand",
    olddlno: "OLD-0045", psvno: "", addres: "Plot 45, Clifton, Karachi",
    category: "LTV, HTV", licensetypestxt: "Permanent", applicantid: "10236",
    licensetypeid: "2", isprinted: true, isprintedstatus: "Printed", tokenno: "T-1003",
    passportno: "", nationality: "Pakistani",
  },
]

export default function LicensePrintingPage() {
  const router = useRouter()
  const today = new Date().toISOString().split("T")[0]

  // Filter state
  const [entityId, setEntityId] = useState("1")
  const [siteId, setSiteId] = useState("")
  const [licenseTypeId, setLicenseTypeId] = useState("")
  const [fromDate, setFromDate] = useState(today)
  const [tillDate, setTillDate] = useState(today)
  const [cnic, setCnic] = useState("")
  const [licenseNo, setLicenseNo] = useState("")
  const [passportNo, setPassportNo] = useState("")
  const [printedCard, setPrintedCard] = useState(false)

  // Grid data
  const [rows, setRows] = useState<PrintRow[]>([])
  const [isLoading, setIsLoading] = useState(false)

  // Print state
  const [isPrinting, setIsPrinting] = useState(false)
  const [printProgress, setPrintProgress] = useState(0)
  const [printStatusLabel, setPrintStatusLabel] = useState("")

  // Auto-print service
  const [serviceRunning, setServiceRunning] = useState(false)

  // Statistics
  const [stats, setStats] = useState<StatRow[]>([
    { property: "Start", value: "" },
    { property: "End", value: "" },
    { property: "Duration", value: "" },
    { property: "No of license", value: "" },
    { property: "Printed", value: "" },
    { property: "Cancel Printing", value: "" },
  ])

  /* ---------- CNIC Auto Mask ---------- */
  const handleCnicChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, "").slice(0, 13)
    let masked = digits
    if (digits.length > 5) masked = digits.slice(0, 5) + "-" + digits.slice(5)
    if (digits.length > 12) masked = digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12)
    setCnic(masked)
  }

  /* ---------- Actions ---------- */
  const handleGetLicense = () => {
    if (!fromDate) { alert("Start date must be selected"); return }
    if (!tillDate) { alert("Till date must be selected"); return }
    if (new Date(fromDate) > new Date(tillDate)) { alert("From date cannot be greater than Till date"); return }
    setIsLoading(true)
    setTimeout(() => {
      setRows(DEMO_DATA.map((r) => ({ ...r, selected: false })))
      setIsLoading(false)
    }, 500)
  }

  const handleRefresh = () => {
    setSiteId("")
    setLicenseTypeId("")
    setCnic("")
    setLicenseNo("")
    setPassportNo("")
    setFromDate(today)
    setTillDate(today)
    setPrintedCard(false)
    setRows([])
  }

  const handleSelectAll = () => setRows((prev) => prev.map((r) => ({ ...r, selected: true })))
  const handleUnselectAll = () => setRows((prev) => prev.map((r) => ({ ...r, selected: false })))
  const toggleRow = (id: number) => setRows((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)))

  const handlePrintLicense = useCallback(() => {
    const selected = rows.filter((r) => r.selected)
    if (selected.length === 0) { alert("Please select the license first"); return }
    if (!confirm(`Do you want to Batch Print ${selected.length} Selected License(s)?`)) return

    setIsPrinting(true)
    setPrintProgress(0)
    setPrintStatusLabel("Printing...")

    let idx = 0
    const interval = setInterval(() => {
      if (idx >= selected.length) {
        clearInterval(interval)
        setIsPrinting(false)
        setPrintProgress(100)
        setPrintStatusLabel(`Printed ${selected.length} license(s)`)
        setRows((prev) =>
          prev.map((r) =>
            r.selected ? { ...r, isprinted: true, isprintedstatus: "Printed" } : r
          )
        )
        setTimeout(() => { setPrintStatusLabel(""); setPrintProgress(0) }, 3000)
        return
      }
      idx++
      setPrintProgress(Math.round((idx / selected.length) * 100))
      setPrintStatusLabel(`Printing ${idx} of ${selected.length}...`)
    }, 800)
  }, [rows])

  const handleImportData = () => {
    const selected = rows.filter((r) => r.selected)
    if (selected.length === 0) { alert("Please select the license first"); return }
    if (!confirm(`Do you want to Import ${selected.length} Selected License(s)?`)) return
    alert(`Exported ${selected.length} records to Access database file`)
  }

  const handleCancelPrint = () => {
    setIsPrinting(false)
    setPrintStatusLabel("Cancelled")
    setTimeout(() => setPrintStatusLabel(""), 2000)
  }

  const handleStartService = () => {
    setServiceRunning(true)
    setStats((prev) => prev.map((s) => s.property === "Start" ? { ...s, value: new Date().toLocaleString() } : s))
  }

  const handleStopService = () => {
    setServiceRunning(false)
    setStats((prev) => prev.map((s) => s.property === "End" ? { ...s, value: new Date().toLocaleString() } : s))
  }

  const handleMarkPrinted = (id: number) => {
    setRows((prev) => prev.map((r) => r.id === id ? { ...r, isprinted: true, isprintedstatus: "Printed" } : r))
  }

  const selectedCount = rows.filter((r) => r.selected).length

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex h-[48px] shrink-0 items-center gap-3 border-b border-border bg-card px-4">
        <button onClick={() => router.back()} className="text-muted-foreground hover:text-foreground" title="Back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-2">
          <Printer className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold tracking-tight">License Printing / Dispatch</h1>
        </div>
      </header>

      {/* Filter Panel */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-3 py-1.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Filter Criteria</span>
          <div className="flex items-center gap-1">
            <button onClick={handleGetLicense} className="flex items-center gap-1 rounded bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
              <Search className="h-3 w-3" /> Get License
            </button>
            <button onClick={handleRefresh} className="flex items-center gap-1 rounded bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/80">
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
            <button onClick={() => router.back()} className="flex items-center gap-1 rounded bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/80">
              <X className="h-3 w-3" /> Close
            </button>
          </div>
        </div>
        <div className="grid grid-cols-5 gap-x-3 gap-y-2 p-3">
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Entity</label>
            <select value={entityId} onChange={(e) => setEntityId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
              <option value="1">Karachi - Nazimabad</option>
              <option value="2">Karachi - Saddar</option>
            </select>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Site</label>
            <select value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
              <option value="">All Sites</option>
              <option value="1">Nazimabad</option>
              <option value="2">Saddar</option>
            </select>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">License Type</label>
            <select value={licenseTypeId} onChange={(e) => setLicenseTypeId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
              <option value="">All Types</option>
              <option value="1">Permanent</option>
              <option value="2">IDP</option>
            </select>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">From Date</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Till Date</label>
            <input type="date" value={tillDate} onChange={(e) => setTillDate(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">CNIC</label>
            <input type="text" value={cnic} onChange={(e) => handleCnicChange(e.target.value)} placeholder="00000-0000000-0" className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] font-mono" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">License No</label>
            <input type="text" value={licenseNo} onChange={(e) => setLicenseNo(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] font-mono" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Passport No</label>
            <input type="text" value={passportNo} onChange={(e) => setPassportNo(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-1.5 text-[11px]">
              <input type="checkbox" checked={printedCard} onChange={(e) => setPrintedCard(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
              <span className="font-medium text-muted-foreground">Printed Card</span>
            </label>
          </div>
        </div>
      </div>

      {/* Detail Toolbar */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/20 px-4 py-1">
        <button onClick={handleSelectAll} className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted">
          <CheckSquare className="h-3.5 w-3.5" /> Select All
        </button>
        <button onClick={handleUnselectAll} className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted">
          <Square className="h-3.5 w-3.5" /> Unselect All
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={handlePrintLicense}
          disabled={isPrinting}
          className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-40"
        >
          <Printer className="h-3.5 w-3.5" /> Print License
        </button>
        <button onClick={handleImportData} className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700">
          <Download className="h-3.5 w-3.5" /> Import Data
        </button>
        <button
          onClick={handleCancelPrint}
          disabled={!isPrinting}
          className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-40"
        >
          <XCircle className="h-3.5 w-3.5" /> Cancel
        </button>
        <div className="mx-1 h-4 w-px bg-border" />
        <button
          onClick={serviceRunning ? handleStopService : handleStartService}
          className={`flex items-center gap-1 rounded px-3 py-1 text-[11px] font-semibold text-white shadow-sm ${serviceRunning ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"}`}
        >
          {serviceRunning ? <><StopCircle className="h-3.5 w-3.5" /> Stop Service</> : <><Play className="h-3.5 w-3.5" /> Start Service</>}
        </button>
        {selectedCount > 0 && (
          <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{selectedCount} selected</span>
        )}
      </div>

      {/* Print Progress */}
      {(isPrinting || printStatusLabel) && (
        <div className="border-b border-border bg-amber-50 px-4 py-1.5 dark:bg-amber-950/20">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">{printStatusLabel}</span>
            {isPrinting && (
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-amber-200 dark:bg-amber-900">
                <div className="h-full rounded-full bg-amber-600 transition-all duration-300" style={{ width: `${printProgress}%` }} />
              </div>
            )}
            <span className="text-[10px] font-mono text-amber-600">{printProgress}%</span>
          </div>
        </div>
      )}

      {/* Main Content: Grid + Statistics */}
      <div className="flex flex-1 overflow-hidden">
        {/* Grid */}
        <div className="flex-1 overflow-auto">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : rows.length === 0 ? (
            <div className="flex h-40 items-center justify-center">
              <p className="text-xs text-muted-foreground">Use the filter above and click "Get License" to load records</p>
            </div>
          ) : (
            <table className="w-full text-[11px]">
              <thead className="sticky top-0 z-10">
                <tr className="border-b border-border bg-muted/50">
                  <th className="w-8 px-2 py-1.5 text-center">
                    <input type="checkbox" checked={rows.every((r) => r.selected)} onChange={() => rows.every((r) => r.selected) ? handleUnselectAll() : handleSelectAll()} className="h-3 w-3 rounded border-border" />
                  </th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">#</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Laser No</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Token No</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Trans Date</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">License No</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Name</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Father Name</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">CNIC</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">DOB</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Issue Date</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Expiry</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Site</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">License Type</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Category</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Printed</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Status</th>
                  <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`border-b border-border cursor-pointer ${row.selected ? "bg-primary/5" : idx % 2 === 0 ? "" : "bg-muted/10"} hover:bg-muted/20`}
                    onClick={() => toggleRow(row.id)}
                  >
                    <td className="px-2 py-1 text-center">
                      <input type="checkbox" checked={row.selected} onChange={() => toggleRow(row.id)} className="h-3 w-3 rounded border-border" onClick={(e) => e.stopPropagation()} />
                    </td>
                    <td className="px-2 py-1 text-muted-foreground">{idx + 1}</td>
                    <td className="px-2 py-1 font-mono">{row.laserno}</td>
                    <td className="px-2 py-1 font-mono">{row.tokenno}</td>
                    <td className="px-2 py-1">{row.appprocdate}</td>
                    <td className="px-2 py-1 font-mono font-medium">{row.licenseno}</td>
                    <td className="px-2 py-1 font-medium">{row.name}</td>
                    <td className="px-2 py-1">{row.fathername}</td>
                    <td className="px-2 py-1 font-mono">{row.cnic}</td>
                    <td className="px-2 py-1">{row.dob}</td>
                    <td className="px-2 py-1">{row.issuedate}</td>
                    <td className="px-2 py-1">{row.expiry}</td>
                    <td className="px-2 py-1">{row.site}</td>
                    <td className="px-2 py-1">{row.licensetypestxt}</td>
                    <td className="px-2 py-1 max-w-[120px] truncate" title={row.category}>{row.category}</td>
                    <td className="px-2 py-1 text-center">
                      {row.isprinted ? (
                        <span className="inline-block h-3 w-3 rounded-full bg-emerald-500" title="Printed" />
                      ) : (
                        <span className="inline-block h-3 w-3 rounded-full bg-muted-foreground/20" title="Not Printed" />
                      )}
                    </td>
                    <td className="px-2 py-1">
                      <span className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${row.isprinted ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                        {row.isprintedstatus}
                      </span>
                    </td>
                    <td className="px-2 py-1">
                      {!row.isprinted && (
                        <button
                          onClick={(e) => { e.stopPropagation(); handleMarkPrinted(row.id) }}
                          className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground hover:bg-muted/80"
                        >
                          Mark Printed
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Statistics Panel */}
        <div className="w-[200px] shrink-0 border-l border-border bg-card">
          <div className="border-b border-border bg-muted/40 px-3 py-1.5">
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              <BarChart3 className="h-3 w-3" /> Statistics
            </span>
          </div>
          <table className="w-full text-[11px]">
            <tbody>
              {stats.map((s, i) => (
                <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                  <td className="px-3 py-1.5 font-semibold text-muted-foreground">{s.property}</td>
                  <td className="px-3 py-1.5 font-mono">{s.value || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Bar */}
      <div className="flex h-7 items-center gap-4 border-t border-border bg-muted/20 px-4">
        <span className="text-[10px] text-muted-foreground">Total: {rows.length}</span>
        <span className="text-[10px] text-muted-foreground">Selected: {selectedCount}</span>
        <span className="text-[10px] text-muted-foreground">Printed: {rows.filter((r) => r.isprinted).length}</span>
        <span className="text-[10px] text-muted-foreground">Not Printed: {rows.filter((r) => !r.isprinted).length}</span>
        {serviceRunning && (
          <span className="ml-auto flex items-center gap-1 text-[10px] font-semibold text-amber-600">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-amber-500" /> Auto-Print Service Running
          </span>
        )}
      </div>
    </div>
  )
}
