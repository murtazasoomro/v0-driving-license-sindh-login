"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Search,
  Package,
  CheckSquare,
  Square,
  Printer,
  RefreshCw,
  X,
  Calendar,
  Building2,
  MapPin,
  CreditCard,
  FileText,
  Truck,
  XCircle,
} from "lucide-react"

/* ------------------------------------------------------------------ */
/*  TCS Dispatch Booking  –  frmDLtcsdisptchBooking                    */
/* ------------------------------------------------------------------ */

interface BookingRow {
  id: number
  selected: boolean
  clientId: string
  entityId: string
  sitestxt: string
  licensetypestxt: string
  licenseno: string
  applicantid: string
  firstname: string
  fathername: string
  address: string
  cellno: string
  categorytypestxt: string
  issuedate: string
  expiry: string
  appprocessid: string
  appprocessno: string
  cnic: string
  dispatchid: string
  dispatchno: string
  dispatchdtlid: string
  dispatchdate: string
  cnno: string
  deliverystatus: string
  deliverycomments: string
  deliverydate: string
  receivedby: string
  piece: number
  weight: number
  destination: string
  appprocdate: string
  booked: boolean
}

const DEMO_DATA: BookingRow[] = [
  {
    id: 1, selected: false, clientId: "1", entityId: "1", sitestxt: "Nazimabad", licensetypestxt: "Permanent",
    licenseno: "KHI-24-001234", applicantid: "10234", firstname: "Ahmed Khan", fathername: "Muhammad Khan",
    address: "House 12, Block A, Nazimabad, Karachi", cellno: "0300-1234567", categorytypestxt: "Motor Cycle",
    issuedate: "2024-01-15", expiry: "2029-01-15", appprocessid: "5001", appprocessno: "PRC-2024-001",
    cnic: "42101-1234567-1", dispatchid: "", dispatchno: "", dispatchdtlid: "", dispatchdate: "",
    cnno: "", deliverystatus: "", deliverycomments: "", deliverydate: "", receivedby: "",
    piece: 1, weight: 1, destination: "Karachi", appprocdate: "2024-01-10", booked: false,
  },
  {
    id: 2, selected: false, clientId: "1", entityId: "1", sitestxt: "Nazimabad", licensetypestxt: "Permanent",
    licenseno: "KHI-24-001235", applicantid: "10235", firstname: "Sara Ali", fathername: "Ali Raza",
    address: "Flat 3B, Gulshan-e-Iqbal, Karachi", cellno: "0321-9876543", categorytypestxt: "Motor Car",
    issuedate: "2024-01-16", expiry: "2029-01-16", appprocessid: "5002", appprocessno: "PRC-2024-002",
    cnic: "42201-7654321-2", dispatchid: "", dispatchno: "", dispatchdtlid: "", dispatchdate: "",
    cnno: "", deliverystatus: "", deliverycomments: "", deliverydate: "", receivedby: "",
    piece: 1, weight: 1, destination: "Karachi", appprocdate: "2024-01-11", booked: false,
  },
  {
    id: 3, selected: false, clientId: "1", entityId: "1", sitestxt: "Saddar", licensetypestxt: "Permanent",
    licenseno: "KHI-24-001236", applicantid: "10236", firstname: "Bilal Ahmed", fathername: "Nasir Ahmed",
    address: "Plot 45, Clifton, Karachi", cellno: "0333-5551234", categorytypestxt: "LTV",
    issuedate: "2024-01-17", expiry: "2029-01-17", appprocessid: "5003", appprocessno: "PRC-2024-003",
    cnic: "42301-1122334-5", dispatchid: "", dispatchno: "", dispatchdtlid: "", dispatchdate: "",
    cnno: "", deliverystatus: "", deliverycomments: "", deliverydate: "", receivedby: "",
    piece: 1, weight: 1, destination: "Hyderabad", appprocdate: "2024-01-12", booked: false,
  },
]

export default function DispatchBookingPage() {
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
  const [dispatchId, setDispatchId] = useState("")
  const [cityId, setCityId] = useState("")
  const [showBooked, setShowBooked] = useState(false)

  // Grid data
  const [rows, setRows] = useState<BookingRow[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isCancelled, setIsCancelled] = useState(false)

  /* ---------- CNIC Auto Mask ---------- */
  const handleCnicChange = (val: string) => {
    const digits = val.replace(/[^0-9]/g, "").slice(0, 13)
    let masked = digits
    if (digits.length > 5) masked = digits.slice(0, 5) + "-" + digits.slice(5)
    if (digits.length > 12) masked = digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12)
    setCnic(masked)
  }

  /* ---------- License No Auto Mask ---------- */
  const handleLicenseNoChange = (val: string) => {
    const digits = val.replace(/[^0-9-#]/g, "").slice(0, 19)
    setLicenseNo(digits)
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
    setDispatchId("")
    setCityId("")
    setFromDate(today)
    setTillDate(today)
    setShowBooked(false)
    setRows([])
  }

  const handleSelectAll = () => setRows((prev) => prev.map((r) => ({ ...r, selected: true })))
  const handleUnselectAll = () => setRows((prev) => prev.map((r) => ({ ...r, selected: false })))

  const toggleRow = (id: number) => {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, selected: !r.selected } : r)))
  }

  const handleBooking = () => {
    const selected = rows.filter((r) => r.selected)
    if (selected.length === 0) { alert("Please select records for booking"); return }
    if (!confirm(`Do you want to Book ${selected.length} Selected License(s)?`)) return

    setRows((prev) =>
      prev.map((r) => {
        if (r.selected) {
          const cnno = `CN${String(Math.floor(Math.random() * 900000000) + 100000000)}`
          return { ...r, cnno, deliverystatus: "Dispatch", booked: true, dispatchdate: today }
        }
        return r
      })
    )
  }

  const handlePrintEnvelop = () => {
    const selected = rows.filter((r) => r.selected && r.cnno)
    if (selected.length === 0) { alert("Please select booked records to print envelopes"); return }
    alert(`Printing ${selected.length} envelope(s)`)
  }

  const handleCancel = () => {
    setIsCancelled(true)
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
          <Truck className="h-5 w-5 text-primary" />
          <h1 className="text-base font-bold tracking-tight">TCS Dispatch Booking</h1>
        </div>
      </header>

      {/* Filter Panel */}
      <div className="border-b border-border bg-card">
        <div className="border-b border-border bg-muted/40 px-3 py-1.5 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Filter Criteria</span>
          <div className="flex items-center gap-1">
            <button
              onClick={handleGetLicense}
              className="flex items-center gap-1 rounded bg-primary px-3 py-1 text-[11px] font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
            >
              <Search className="h-3 w-3" /> Get License
            </button>
            <button
              onClick={handleRefresh}
              className="flex items-center gap-1 rounded bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/80"
            >
              <RefreshCw className="h-3 w-3" /> Refresh
            </button>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1 rounded bg-muted px-3 py-1 text-[11px] font-medium text-muted-foreground hover:bg-muted/80"
            >
              <X className="h-3 w-3" /> Close
            </button>
          </div>
        </div>
        <div className="grid grid-cols-6 gap-x-3 gap-y-2 p-3">
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
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">City</label>
            <select value={cityId} onChange={(e) => setCityId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]">
              <option value="">All Cities</option>
              <option value="1">Karachi</option>
              <option value="2">Hyderabad</option>
              <option value="3">Lahore</option>
            </select>
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">CNIC</label>
            <input type="text" value={cnic} onChange={(e) => handleCnicChange(e.target.value)} placeholder="00000-0000000-0" className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] font-mono" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">License No</label>
            <input type="text" value={licenseNo} onChange={(e) => handleLicenseNoChange(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px] font-mono" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Passport No</label>
            <input type="text" value={passportNo} onChange={(e) => setPassportNo(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]" />
          </div>
          <div>
            <label className="mb-0.5 block text-[10px] font-semibold text-muted-foreground">Dispatch ID</label>
            <input type="text" value={dispatchId} onChange={(e) => setDispatchId(e.target.value)} className="h-7 w-full rounded border border-border bg-background px-2 text-[11px]" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-1.5 text-[11px]">
              <input type="checkbox" checked={showBooked} onChange={(e) => setShowBooked(e.target.checked)} className="h-3.5 w-3.5 rounded border-border" />
              <span className="font-medium text-muted-foreground">Show Booked</span>
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
        <button onClick={handleBooking} className="flex items-center gap-1 rounded bg-emerald-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-emerald-700">
          <Package className="h-3.5 w-3.5" /> Booking
        </button>
        <button onClick={handlePrintEnvelop} className="flex items-center gap-1 rounded bg-blue-600 px-3 py-1 text-[11px] font-semibold text-white shadow-sm hover:bg-blue-700">
          <Printer className="h-3.5 w-3.5" /> Print Envelope
        </button>
        <button onClick={handleCancel} disabled={!rows.some((r) => r.selected)} className="flex items-center gap-1 rounded px-2.5 py-1 text-[11px] font-medium text-red-600 hover:bg-red-50 disabled:opacity-40">
          <XCircle className="h-3.5 w-3.5" /> Cancel
        </button>
        {selectedCount > 0 && (
          <span className="ml-auto rounded bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">{selectedCount} selected</span>
        )}
      </div>

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
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">App Process No</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Applicant ID</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Name</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Father Name</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">CNIC</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">License No</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Site</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">License Type</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Category</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Issue Date</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Expiry</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Cell No</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Address</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Dispatch Date</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">CN No</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Status</th>
                <th className="px-2 py-1.5 text-left font-semibold text-muted-foreground">Destination</th>
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
                  <td className="px-2 py-1 font-mono">{row.appprocessno}</td>
                  <td className="px-2 py-1 font-mono">{row.applicantid}</td>
                  <td className="px-2 py-1 font-medium">{row.firstname}</td>
                  <td className="px-2 py-1">{row.fathername}</td>
                  <td className="px-2 py-1 font-mono">{row.cnic}</td>
                  <td className="px-2 py-1 font-mono">{row.licenseno}</td>
                  <td className="px-2 py-1">{row.sitestxt}</td>
                  <td className="px-2 py-1">{row.licensetypestxt}</td>
                  <td className="px-2 py-1">{row.categorytypestxt}</td>
                  <td className="px-2 py-1">{row.issuedate}</td>
                  <td className="px-2 py-1">{row.expiry}</td>
                  <td className="px-2 py-1 font-mono">{row.cellno}</td>
                  <td className="px-2 py-1 max-w-[150px] truncate" title={row.address}>{row.address}</td>
                  <td className="px-2 py-1">{row.dispatchdate}</td>
                  <td className="px-2 py-1 font-mono font-semibold text-emerald-600">{row.cnno}</td>
                  <td className="px-2 py-1">
                    {row.deliverystatus && (
                      <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">{row.deliverystatus}</span>
                    )}
                  </td>
                  <td className="px-2 py-1">{row.destination}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Status Bar */}
      <div className="flex h-7 items-center gap-4 border-t border-border bg-muted/20 px-4">
        <span className="text-[10px] text-muted-foreground">Total: {rows.length}</span>
        <span className="text-[10px] text-muted-foreground">Selected: {selectedCount}</span>
        <span className="text-[10px] text-muted-foreground">Booked: {rows.filter((r) => r.booked).length}</span>
      </div>
    </div>
  )
}
