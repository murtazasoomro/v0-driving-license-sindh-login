"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  PhoneForwarded,
  SkipForward,
  PhoneCall,
  Clock,
  CheckCircle2,
  XCircle,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { SetupPageHeader } from "@/components/setup-page-header"

// ----- Sample data -----
interface QuestionSubDtl {
  option: string
  userresponse: boolean
  correct: boolean
}
interface QuestionDtl {
  questionid: number
  question: string
  subDtls: QuestionSubDtl[]
}
interface LicenseCategory {
  line: number
  category: string
  checked: boolean
}

const SAMPLE_CATEGORIES: LicenseCategory[] = [
  { line: 1, category: "M CYCLE", checked: true },
  { line: 2, category: "M CAR", checked: true },
  { line: 3, category: "LTV", checked: true },
  { line: 4, category: "HTV", checked: false },
  { line: 5, category: "M.CAB", checked: false },
  { line: 6, category: "MCR", checked: false },
  { line: 7, category: "IC CAR", checked: false },
  { line: 8, category: "IC M.Cycle", checked: false },
  { line: 9, category: "Invalid Carriage. (HI)", checked: false },
  { line: 10, category: "DELIVERY VAN", checked: false },
  { line: 11, category: "TRACTOR", checked: false },
  { line: 12, category: "ROAD ROLLER", checked: false },
  { line: 13, category: "PSV", checked: false },
]

const SAMPLE_TOKENS = [
  { tokenid: 1, tokenno: "M-0001", appprocessid: 200, applicantName: "Muhammad Ali" },
  { tokenid: 2, tokenno: "M-0002", appprocessid: 201, applicantName: "Ahmed Khan" },
  { tokenid: 3, tokenno: "M-0003", appprocessid: 202, applicantName: "Sara Bibi" },
]

const QUESTIONNAIRES = [
  { id: 1, name: "Medical Examination - Urdu", points: 20 },
  { id: 2, name: "Medical Examination - English", points: 20 },
  { id: 3, name: "Medical Examination - Sindhi", points: 20 },
]

const LANGUAGES = [
  { id: 1, name: "Urdu" },
  { id: 2, name: "English" },
  { id: 3, name: "Sindhi" },
]

export default function MedicalTestPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form fields
  const [transNo, setTransNo] = useState("")
  const [entityId, setEntityId] = useState("001")
  const [busUnitId, setBusUnitId] = useState("01")
  const [siteId, setSiteId] = useState("01")
  const [transDate, setTransDate] = useState(
    new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })
  )
  const [tokenId, setTokenId] = useState("")
  const [questionnaireId, setQuestionnaireId] = useState("")
  const [languageId, setLanguageId] = useState("")
  const [marks, setMarks] = useState("")
  const [statusTypeId, setStatusTypeId] = useState("")
  const [remarks, setRemarks] = useState("")
  const [appProcessId, setAppProcessId] = useState("")

  // Token state
  const [servingToken, setServingToken] = useState<string | null>(null)
  const [tokenIndex, setTokenIndex] = useState(0)

  // Result panel
  const [showResult, setShowResult] = useState(false)
  const [totalQues, setTotalQues] = useState(0)
  const [rightQues, setRightQues] = useState(0)
  const [wrongQues, setWrongQues] = useState(0)
  const [percentage, setPercentage] = useState(0)

  // Tab & category
  const [activeSubTab, setActiveSubTab] = useState<"appraisal" | "category">("appraisal")
  const [categories, setCategories] = useState<LicenseCategory[]>(SAMPLE_CATEGORIES)

  // Records
  const [recordIndex, setRecordIndex] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") {
      router.replace("/")
      return
    }
    setUsername(user || "Officer")
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    sessionStorage.clear()
    router.replace("/")
  }
  const handleBack = () => router.push("/driving-license")

  // ---------- Token Operations ----------
  const handleNextToken = useCallback(() => {
    if (SAMPLE_TOKENS.length === 0) return
    const idx = tokenIndex % SAMPLE_TOKENS.length
    const tk = SAMPLE_TOKENS[idx]
    setTokenId(String(tk.tokenid))
    setAppProcessId(String(tk.appprocessid))
    setServingToken(tk.tokenno)
    setTokenIndex(idx + 1)
    setShowResult(false)
    setQuestionnaireId("")
    setLanguageId("")
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
  }, [tokenIndex])

  const handleCallToken = useCallback(() => {
    handleNextToken()
  }, [handleNextToken])

  const handleSkipToken = useCallback(() => {
    setServingToken(null)
    setTokenId("")
    setAppProcessId("")
    setShowResult(false)
    setQuestionnaireId("")
    setLanguageId("")
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
    setCategories(SAMPLE_CATEGORIES)
  }, [])

  // ---------- Result calculation ----------
  const simulateResult = useCallback(() => {
    const total = 20
    const right = Math.floor(Math.random() * 15) + 6
    const wrong = total - right
    const pct = parseFloat(((right / total) * 100).toFixed(1))
    setTotalQues(total)
    setRightQues(right)
    setWrongQues(wrong)
    setPercentage(pct)
    setMarks(String(right))
    if (pct >= 50) {
      setStatusTypeId("Passed")
    } else {
      setStatusTypeId("Failed")
    }
    setShowResult(true)
  }, [])

  // ---------- Toolbar handlers ----------
  const handleNew = () => {
    setTransNo("")
    setTokenId("")
    setAppProcessId("")
    setQuestionnaireId("")
    setLanguageId("")
    setMarks("")
    setStatusTypeId("")
    setRemarks("")
    setShowResult(false)
    setServingToken(null)
    setCategories(SAMPLE_CATEGORIES)
  }

  const handleSave = () => {
    if (!tokenId) return alert("Please call a token first")
    if (!questionnaireId) return alert("Questionnaire is required")
    if (!languageId) return alert("Language is required")
    simulateResult()
    setTotalRecords((p) => p + 1)
    setRecordIndex(totalRecords)
  }

  const handleSaveAndNew = () => {
    handleSave()
    setTimeout(() => handleNew(), 200)
  }

  const handleDelete = () => {
    if (!tokenId) return
    handleNew()
    if (totalRecords > 0) setTotalRecords((p) => p - 1)
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
      <SetupPageHeader title="Medical Test" username={username} onLogout={handleLogout} onBack={handleBack} />

      {/* ---- Token Call Bar ---- */}
      <div className="border-b border-border bg-card px-4 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <Button size="sm" variant="outline" onClick={handleNextToken} className="gap-1.5">
            <PhoneForwarded className="h-4 w-4" />
            Next Token
          </Button>
          <Button size="sm" variant="outline" onClick={handleCallToken} className="gap-1.5">
            <PhoneCall className="h-4 w-4" />
            Call Token
          </Button>
          <Button size="sm" variant="outline" onClick={handleSkipToken} className="gap-1.5">
            <SkipForward className="h-4 w-4" />
            Skip Token
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => {
              /* serving list placeholder */
            }}
          >
            <Users className="h-4 w-4" />
            Serving Token
          </Button>

          {servingToken && (
            <div className="ml-auto flex items-center gap-2 rounded-md bg-primary/10 px-3 py-1.5 text-sm font-semibold text-primary">
              <Clock className="h-4 w-4" />
              Serving: {servingToken}
            </div>
          )}
        </div>
      </div>

      {/* ---- Toolbar ---- */}
      <MasterDetailToolbar
        title="Medical Test"
        recordIndex={recordIndex}
        totalRecords={totalRecords}
        onNew={handleNew}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onDelete={handleDelete}
        showDelete
        onFirst={() => setRecordIndex(0)}
        onPrev={() => setRecordIndex((p) => Math.max(0, p - 1))}
        onNext={() => setRecordIndex((p) => Math.min(totalRecords - 1, p + 1))}
        onLast={() => setRecordIndex(Math.max(0, totalRecords - 1))}
        onRefresh={() => {}}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        {/* ===== Header Fields ===== */}
        <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
          <div className="mb-2 rounded bg-[#5f6b6d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
            Medical Test Information
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Row 1 */}
            <FieldRow label="Entity">
              <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Business Unit">
              <Input value={busUnitId} onChange={(e) => setBusUnitId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Site">
              <Input value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Trans Date">
              <Input value={transDate} onChange={(e) => setTransDate(e.target.value)} className="h-8 text-xs" />
            </FieldRow>

            {/* Row 2 */}
            <FieldRow label="Token ID">
              <Input value={tokenId} readOnly className="h-8 bg-muted/40 text-xs" />
            </FieldRow>
            <FieldRow label="Questionnaire">
              <select
                value={questionnaireId}
                onChange={(e) => setQuestionnaireId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="">-- Select --</option>
                {QUESTIONNAIRES.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Language">
              <select
                value={languageId}
                onChange={(e) => setLanguageId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="">-- Select --</option>
                {LANGUAGES.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </FieldRow>
            <FieldRow label="Marks">
              <Input value={marks} onChange={(e) => setMarks(e.target.value)} className="h-8 text-xs" />
            </FieldRow>

            {/* Row 3 */}
            <FieldRow label="Status">
              <select
                value={statusTypeId}
                onChange={(e) => setStatusTypeId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs"
              >
                <option value="">-- Select --</option>
                <option value="Passed">Passed</option>
                <option value="Failed">Failed</option>
              </select>
            </FieldRow>
            <FieldRow label="Remarks" className="sm:col-span-2 lg:col-span-3">
              <Input value={remarks} onChange={(e) => setRemarks(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
          </div>
        </div>

        {/* ===== Result Panel ===== */}
        {showResult && (
          <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
            <div className="mb-2 rounded bg-[#5f6b6d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              Result
            </div>
            <div className="flex flex-wrap items-center gap-6">
              <ResultStat label="Total Questions" value={totalQues} />
              <ResultStat label="Right" value={rightQues} className="text-green-600" />
              <ResultStat label="Wrong" value={wrongQues} className="text-red-600" />
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground">Percentage:</span>
                <span className={`text-lg font-bold ${statusTypeId === "Passed" ? "text-green-600" : "text-red-600"}`}>
                  {percentage}%
                </span>
              </div>
              <div className="ml-auto">
                {statusTypeId === "Passed" ? (
                  <div className="flex items-center gap-2 rounded-full bg-green-100 px-4 py-1.5 text-sm font-bold text-green-700">
                    <CheckCircle2 className="h-5 w-5" />
                    PASSED
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-1.5 text-sm font-bold text-red-700">
                    <XCircle className="h-5 w-5" />
                    FAILED
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ===== Sub-Tabs ===== */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <div className="flex border-b border-border">
            <button
              type="button"
              onClick={() => setActiveSubTab("appraisal")}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeSubTab === "appraisal"
                  ? "border-b-2 border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Appraisal Questions
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("category")}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${
                activeSubTab === "category"
                  ? "border-b-2 border-primary bg-primary/5 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              License Category
            </button>
          </div>

          <div className="p-4">
            {activeSubTab === "appraisal" && (
              <div className="flex flex-col items-center justify-center gap-3 py-10 text-center text-muted-foreground">
                <p className="text-sm">Select a questionnaire and call a token to start the appraisal.</p>
                <Button size="sm" variant="outline" onClick={simulateResult}>
                  Simulate Medical Exam
                </Button>
              </div>
            )}

            {activeSubTab === "category" && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/40">
                      <th className="w-10 px-3 py-2 text-center">
                        <Checkbox disabled />
                      </th>
                      <th className="w-16 px-3 py-2 font-semibold">Line</th>
                      <th className="px-3 py-2 font-semibold">License Category</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((cat) => (
                      <tr key={cat.line} className="border-b border-border last:border-none hover:bg-muted/20">
                        <td className="px-3 py-1.5 text-center">
                          <Checkbox
                            checked={cat.checked}
                            onCheckedChange={(v) =>
                              setCategories((prev) =>
                                prev.map((c) => (c.line === cat.line ? { ...c, checked: !!v } : c))
                              )
                            }
                          />
                        </td>
                        <td className="px-3 py-1.5 text-muted-foreground">{cat.line}</td>
                        <td className="px-3 py-1.5">{cat.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">Driving License Sindh - Medical Test Module</p>
      </footer>
    </div>
  )
}

/* ---------- helpers ---------- */
function FieldRow({
  label,
  children,
  className = "",
}: {
  label: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <Label className="text-[11px] font-semibold text-muted-foreground">{label}</Label>
      {children}
    </div>
  )
}

function ResultStat({ label, value, className = "" }: { label: string; value: number; className?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[10px] font-medium text-muted-foreground">{label}</span>
      <span className={`text-lg font-bold ${className}`}>{value}</span>
    </div>
  )
}
