"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { SetupPageHeader } from "@/components/setup-page-header"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProcessRecord {
  processNo: string
  processName: string
  entity: string
  processType: string
  fromDate: string
  tillDate: string
  licenseType: string
  applicationType: string
  excludeExistingCategoriesFee: boolean
  canAllowNewCategories: boolean
}

const INITIAL_RECORDS: ProcessRecord[] = [
  { processNo: "PR_00001", processName: "New Learner", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00001", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00009", processName: "Permenent", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00002", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00013", processName: "International Driving Permit", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_003", applicationType: "00003", excludeExistingCategoriesFee: false, canAllowNewCategories: false },
  { processNo: "PR_00014", processName: "Renew Learner", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00004", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00015", processName: "Endorsement Learner", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00005", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00016", processName: "Duplicate Learner", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00006", excludeExistingCategoriesFee: false, canAllowNewCategories: false },
  { processNo: "PR_00017", processName: "Permanent Renew", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00007", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00018", processName: "Permanent Endorsement", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00008", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00019", processName: "Permanent + Duplicate", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00009", excludeExistingCategoriesFee: false, canAllowNewCategories: false },
  { processNo: "PR_00025", processName: "Learner Renew + Duplicate", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00010", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00026", processName: "Learner Endorsement + Duplicate", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00011", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00027", processName: "Learner Renew + Duplicate + Endorsement", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00012", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00028", processName: "Permanent Renew + Duplicate", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00013", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00029", processName: "Permanent Endorsement + Duplicate", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00014", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00030", processName: "Permanent Renew + Duplicate + Endorsement", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00015", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00031", processName: "Permanent Reprint", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00016", excludeExistingCategoriesFee: false, canAllowNewCategories: false },
  { processNo: "PR_00032", processName: "Permanent PSV", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00017", excludeExistingCategoriesFee: false, canAllowNewCategories: false },
  { processNo: "PR_00033", processName: "Permanent Renew + Endorsement", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00018", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00034", processName: "Learner Renew + Endorsement", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_001", applicationType: "00019", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00012", processName: "New Permanent Revise", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00020", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00035", processName: "New Armed Force", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00021", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00036", processName: "Endorsement Armed Force", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00022", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00037", processName: "End + Dup Armed Force", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00023", excludeExistingCategoriesFee: false, canAllowNewCategories: true },
  { processNo: "PR_00011", processName: "Renew + Duplicate Armed Force", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00030", excludeExistingCategoriesFee: true, canAllowNewCategories: true },
  { processNo: "PR_00012", processName: "Permanent Correction", entity: "DL", processType: "License Process", fromDate: "12/9/2019", tillDate: "12/31/9998", licenseType: "LT_002", applicationType: "00024", excludeExistingCategoriesFee: false, canAllowNewCategories: false },
]

export default function ProcessConfigurationPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [records, setRecords] = useState<ProcessRecord[]>(INITIAL_RECORDS)
  const [selectedIndex, setSelectedIndex] = useState(0)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") { router.replace("/"); return }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const current = records[selectedIndex] || INITIAL_RECORDS[0]

  const updateField = useCallback((field: keyof ProcessRecord, value: unknown) => {
    setRecords((prev) => prev.map((r, i) => (i === selectedIndex ? { ...r, [field]: value } : r)))
  }, [selectedIndex])

  const handleNew = () => {
    const newNo = `PR_${String(records.length + 1).padStart(5, "0")}`
    const newRecord: ProcessRecord = {
      processNo: newNo, processName: "", entity: "DL", processType: "License Process",
      fromDate: new Date().toLocaleDateString("en-US"), tillDate: "12/31/9998",
      licenseType: "", applicationType: "", excludeExistingCategoriesFee: false, canAllowNewCategories: false,
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
        title="Process Configuration"
        username={username}
        onLogout={() => { sessionStorage.clear(); router.replace("/") }}
        onBack={() => router.push("/driving-license")}
      />

      <MasterDetailToolbar
        title="Process Configuration"
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

      <div className="border-b border-border bg-card px-4 py-2">
        <span className="text-xs font-semibold text-muted-foreground">Define Process</span>
      </div>

      <main className="flex flex-1 overflow-hidden">
        {/* Left panel - process list */}
        <div className="w-[380px] shrink-0 overflow-y-auto border-r border-border bg-card">
          <div className="sticky top-0 z-10 grid grid-cols-[80px_1fr_40px] gap-px bg-[#2d3748] px-2 py-2 text-xs font-semibold text-[#e2e8f0]">
            <span>Process No</span>
            <span>Process Name</span>
            <span>Entity</span>
          </div>
          <div className="grid grid-cols-[80px_1fr_40px] gap-px border-b border-border px-2 py-1">
            <div className="h-5" /><div className="h-5" /><div className="h-5" />
          </div>
          {records.map((r, idx) => (
            <button
              key={`${r.processNo}-${idx}`}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`grid w-full grid-cols-[80px_1fr_40px] gap-px border-b border-border px-2 py-2 text-left text-xs transition-colors ${
                idx === selectedIndex
                  ? "bg-primary/15 font-semibold text-primary"
                  : "text-foreground hover:bg-secondary/50"
              }`}
            >
              <span className="truncate">{r.processNo}</span>
              <span className="truncate">{r.processName}</span>
              <span className="truncate text-muted-foreground">{r.entity}</span>
            </button>
          ))}
        </div>

        {/* Right panel - detail form */}
        <div className="flex flex-1 flex-col overflow-y-auto">
          {/* Header Information */}
          <div className="bg-[#4a5568] px-4 py-1.5 text-xs font-semibold text-[#e2e8f0]">
            Header Information
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Process No :</Label>
              <Input value={current.processNo} onChange={(e) => updateField("processNo", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Entity :</Label>
              <Input value="001" readOnly className="h-8 w-20 text-xs bg-secondary/50" />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <Label className="w-32 shrink-0 text-xs font-semibold">Process Type :</Label>
              <Input value={current.processType} onChange={(e) => updateField("processType", e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">From Date :</Label>
              <Input type="text" value={current.fromDate} onChange={(e) => updateField("fromDate", e.target.value)} className="h-8 text-xs" />
            </div>
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Till Date :</Label>
              <Input type="text" value={current.tillDate} onChange={(e) => updateField("tillDate", e.target.value)} className="h-8 text-xs" />
            </div>

            <div className="flex items-center gap-3 md:col-span-2">
              <Label className="w-32 shrink-0 text-xs font-semibold">Process Name :</Label>
              <Input value={current.processName} onChange={(e) => updateField("processName", e.target.value)} className="h-8 text-xs" />
            </div>
          </div>

          {/* License Process Section */}
          <div className="bg-[#4a5568] px-4 py-1.5 text-xs font-semibold text-[#e2e8f0]">
            License Process
          </div>
          <div className="grid grid-cols-1 gap-x-8 gap-y-3 p-4 md:grid-cols-2">
            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">License Type :</Label>
              <Input value={current.licenseType} onChange={(e) => updateField("licenseType", e.target.value)} className="h-8 text-xs" />
            </div>
            <div />

            <div className="flex items-center gap-3">
              <Label className="w-32 shrink-0 text-xs font-semibold">Application Type :</Label>
              <Input value={current.applicationType} onChange={(e) => updateField("applicationType", e.target.value)} className="h-8 text-xs" />
            </div>
            <div />

            <div className="flex items-center gap-4">
              <Label className="text-xs font-semibold">Exclude Existing Categories Fee :</Label>
              <Checkbox
                checked={current.excludeExistingCategoriesFee}
                onCheckedChange={(v) => updateField("excludeExistingCategoriesFee", !!v)}
              />
            </div>
            <div className="flex items-center gap-4">
              <Label className="text-xs font-semibold">Can allow new categories :</Label>
              <Checkbox
                checked={current.canAllowNewCategories}
                onCheckedChange={(v) => updateField("canAllowNewCategories", !!v)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
