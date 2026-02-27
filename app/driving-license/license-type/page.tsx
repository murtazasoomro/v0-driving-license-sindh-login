"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

// ===== DATA =====
interface LicenseTypeRecord {
  typeCode: string
  prefix: string
  licenseType: string
  entity: string
  description: string
  report: string
  block: boolean
  condonation: boolean
  categories: { line: number; name: string; checked: boolean }[]
  requiredDocs: { line: number; name: string; checked: boolean }[]
}

const CATEGORIES = [
  { line: 1, name: "M CYCLE" },
  { line: 2, name: "M CAR" },
  { line: 3, name: "LTV" },
  { line: 4, name: "HTV" },
  { line: 5, name: "M.CAB" },
  { line: 6, name: "MCR" },
  { line: 7, name: "IC CAR" },
  { line: 8, name: "IC M.Cycle" },
  { line: 9, name: "Invalid Carriage. (HI)" },
  { line: 10, name: "DELIVERY VAN" },
  { line: 11, name: "TRACTOR" },
  { line: 12, name: "ROAD ROLLER" },
  { line: 13, name: "PSV" },
]

const REQUIRED_DOCS = [
  { line: 1, name: "CNIC (Original + Copy)" },
  { line: 2, name: "Medical Certificate" },
  { line: 3, name: "Photographs (3 copies)" },
  { line: 4, name: "Previous License (if any)" },
  { line: 5, name: "Domicile Certificate" },
  { line: 6, name: "FIR Copy (for duplicate)" },
]

const INITIAL_RECORDS: LicenseTypeRecord[] = [
  {
    typeCode: "LT_001", prefix: "L", licenseType: "Learner", entity: "Driving License Sindh",
    description: "Learner", report: "", block: false, condonation: true,
    categories: CATEGORIES.map((c) => ({ ...c, checked: c.line <= 12 })),
    requiredDocs: REQUIRED_DOCS.map((d) => ({ ...d, checked: false })),
  },
  {
    typeCode: "LT_002", prefix: "P", licenseType: "Permanent", entity: "Driving License Sindh",
    description: "Permanent Driving License", report: "", block: false, condonation: true,
    categories: CATEGORIES.map((c) => ({ ...c, checked: ![10, 12].includes(c.line) })),
    requiredDocs: REQUIRED_DOCS.map((d) => ({ ...d, checked: false })),
  },
  {
    typeCode: "LT_003", prefix: "I", licenseType: "IDP", entity: "Driving License Sindh",
    description: "International Driving licence", report: "", block: false, condonation: false,
    categories: CATEGORIES.map((c) => ({ ...c, checked: c.line <= 2 })),
    requiredDocs: REQUIRED_DOCS.map((d) => ({ ...d, checked: false })),
  },
]

export default function LicenseTypePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [records, setRecords] = useState<LicenseTypeRecord[]>(INITIAL_RECORDS)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [activeSubTab, setActiveSubTab] = useState<"categories" | "documents">("categories")

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") { router.replace("/"); return }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const current = records[selectedIndex] || INITIAL_RECORDS[0]

  const updateField = useCallback((field: keyof LicenseTypeRecord, value: unknown) => {
    setRecords((prev) => prev.map((r, i) => (i === selectedIndex ? { ...r, [field]: value } : r)))
  }, [selectedIndex])

  const toggleCategory = useCallback((line: number) => {
    setRecords((prev) =>
      prev.map((r, i) =>
        i === selectedIndex
          ? { ...r, categories: r.categories.map((c) => (c.line === line ? { ...c, checked: !c.checked } : c)) }
          : r
      )
    )
  }, [selectedIndex])

  const toggleAllCategories = useCallback((checked: boolean) => {
    setRecords((prev) =>
      prev.map((r, i) =>
        i === selectedIndex
          ? { ...r, categories: r.categories.map((c) => ({ ...c, checked })) }
          : r
      )
    )
  }, [selectedIndex])

  const toggleDoc = useCallback((line: number) => {
    setRecords((prev) =>
      prev.map((r, i) =>
        i === selectedIndex
          ? { ...r, requiredDocs: r.requiredDocs.map((d) => (d.line === line ? { ...d, checked: !d.checked } : d)) }
          : r
      )
    )
  }, [selectedIndex])

  const handleNew = () => {
    const newCode = `LT_${String(records.length + 1).padStart(3, "0")}`
    const newRecord: LicenseTypeRecord = {
      typeCode: newCode, prefix: "", licenseType: "", entity: "Driving License Sindh",
      description: "", report: "", block: false, condonation: false,
      categories: CATEGORIES.map((c) => ({ ...c, checked: false })),
      requiredDocs: REQUIRED_DOCS.map((d) => ({ ...d, checked: false })),
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
        title="License Type"
        username={username}
        onLogout={() => { sessionStorage.clear(); router.replace("/") }}
        onBack={() => router.push("/driving-license")}
      />

      <MasterDetailToolbar
        title="License Type"
        recordIndex={selectedIndex}
        totalRecords={records.length}
        onNew={handleNew}
        onSave={() => {}}
        onSaveAndNew={() => { handleNew() }}
        onFirst={() => setSelectedIndex(0)}
        onPrev={() => setSelectedIndex(Math.max(0, selectedIndex - 1))}
        onNext={() => setSelectedIndex(Math.min(records.length - 1, selectedIndex + 1))}
        onLast={() => setSelectedIndex(records.length - 1)}
        onRefresh={() => setRecords(INITIAL_RECORDS)}
      />

      <main className="flex flex-1 overflow-hidden">
        {/* Left panel - record list */}
        <div className="w-80 shrink-0 overflow-y-auto border-r border-border bg-card">
          <div className="sticky top-0 z-10 grid grid-cols-[70px_50px_1fr_1fr] gap-px bg-[#2d3748] px-2 py-2 text-xs font-semibold text-[#e2e8f0]">
            <span>Type Code</span>
            <span>Prefix</span>
            <span>License Type</span>
            <span>Entity</span>
          </div>
          {/* Empty filter row */}
          <div className="grid grid-cols-[70px_50px_1fr_1fr] gap-px border-b border-border px-2 py-1">
            <div className="h-5" />
            <div className="h-5" />
            <div className="h-5" />
            <div className="h-5" />
          </div>
          {records.map((r, idx) => (
            <button
              key={r.typeCode}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`grid w-full grid-cols-[70px_50px_1fr_1fr] gap-px border-b border-border px-2 py-2 text-left text-xs transition-colors ${
                idx === selectedIndex
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="truncate">{r.typeCode}</span>
              <span className="font-bold">{r.prefix}</span>
              <span className="truncate">{r.licenseType}</span>
              <span className="truncate text-muted-foreground">{r.entity}</span>
            </button>
          ))}
        </div>

        {/* Right panel - detail form */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Header Information */}
          <div className="border-b border-border">
            <div className="bg-[#4a5568] px-4 py-1.5 text-xs font-semibold text-[#e2e8f0]">
              Header Information
            </div>
            <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-4 md:grid-cols-2">
              <div className="flex items-center gap-3">
                <Label className="w-28 shrink-0 text-xs font-semibold">Type Code :</Label>
                <Input
                  value={current.typeCode}
                  onChange={(e) => updateField("typeCode", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-28 shrink-0 text-xs font-semibold">Entity :</Label>
                <Input value="001" readOnly className="h-8 w-20 text-xs bg-secondary/50" />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28 shrink-0 text-xs font-semibold">License Type :</Label>
                <Input
                  value={current.licenseType}
                  onChange={(e) => updateField("licenseType", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div />

              <div className="flex items-start gap-3 md:col-span-2">
                <Label className="w-28 shrink-0 pt-2 text-xs font-semibold">Description :</Label>
                <Textarea
                  value={current.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className="min-h-[60px] text-xs"
                  rows={3}
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28 shrink-0 text-xs font-semibold">Report :</Label>
                <Input
                  value={current.report}
                  onChange={(e) => updateField("report", e.target.value)}
                  className="h-8 text-xs"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-20 shrink-0 text-xs font-semibold">Block :</Label>
                <Checkbox
                  checked={current.block}
                  onCheckedChange={(v) => updateField("block", !!v)}
                />
              </div>

              <div className="flex items-center gap-3">
                <Label className="w-28 shrink-0 text-xs font-semibold">Prefix :</Label>
                <Input
                  value={current.prefix}
                  onChange={(e) => updateField("prefix", e.target.value)}
                  className="h-8 w-24 text-xs"
                />
              </div>
              <div className="flex items-center gap-3">
                <Label className="w-20 shrink-0 text-xs font-semibold">Condonation :</Label>
                <Checkbox
                  checked={current.condonation}
                  onCheckedChange={(v) => updateField("condonation", !!v)}
                />
              </div>
            </div>
          </div>

          {/* Sub-tabs: License Category / Required Document */}
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveSubTab("categories")}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                activeSubTab === "categories"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              License Category (F6)
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("documents")}
              className={`px-4 py-2 text-xs font-semibold transition-colors ${
                activeSubTab === "documents"
                  ? "border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Required Document (F7)
            </button>
          </div>

          {/* Sub-tab content */}
          {activeSubTab === "categories" && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center gap-4 bg-[#4a5568] px-4 py-1.5 text-xs font-semibold text-[#e2e8f0]">
                <Checkbox
                  checked={current.categories.every((c) => c.checked)}
                  onCheckedChange={(v) => toggleAllCategories(!!v)}
                  className="border-[#e2e8f0] data-[state=checked]:bg-primary"
                />
                <span className="w-12">Line</span>
                <span>License Category</span>
              </div>
              <div className="divide-y divide-border">
                {current.categories.map((cat) => (
                  <div
                    key={cat.line}
                    className="flex items-center gap-4 px-4 py-2 text-xs hover:bg-secondary/30"
                  >
                    <Checkbox
                      checked={cat.checked}
                      onCheckedChange={() => toggleCategory(cat.line)}
                    />
                    <span className="w-12 text-muted-foreground">{cat.line}</span>
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "documents" && (
            <div className="flex-1 overflow-y-auto">
              <div className="sticky top-0 z-10 flex items-center gap-4 bg-[#4a5568] px-4 py-1.5 text-xs font-semibold text-[#e2e8f0]">
                <Checkbox className="border-[#e2e8f0]" />
                <span className="w-12">Line</span>
                <span>Required Document</span>
              </div>
              <div className="divide-y divide-border">
                {current.requiredDocs.map((doc) => (
                  <div
                    key={doc.line}
                    className="flex items-center gap-4 px-4 py-2 text-xs hover:bg-secondary/30"
                  >
                    <Checkbox
                      checked={doc.checked}
                      onCheckedChange={() => toggleDoc(doc.line)}
                    />
                    <span className="w-12 text-muted-foreground">{doc.line}</span>
                    <span className="font-medium text-foreground">{doc.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
