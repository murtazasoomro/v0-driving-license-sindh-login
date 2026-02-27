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
  { tokenid: 1, tokenno: "L-0001", appprocessid: 100, applicantName: "Muhammad Ali" },
  { tokenid: 2, tokenno: "L-0002", appprocessid: 101, applicantName: "Ahmed Khan" },
  { tokenid: 3, tokenno: "P-0003", appprocessid: 102, applicantName: "Sara Bibi" },
]

const QUESTIONNAIRES = [
  { id: 1, name: "Academic Test - Urdu", points: 20 },
  { id: 2, name: "Academic Test - English", points: 20 },
  { id: 3, name: "Academic Test - Sindhi", points: 20 },
]

const LANGUAGES = [
  { id: 1, name: "Urdu" },
  { id: 2, name: "English" },
  { id: 3, name: "Sindhi" },
]

export default function AcademicTestPage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Form fields
  const [transNo, setTransNo] = useState("")
  const [entityId, setEntityId] = useState("001")
  const [busUnitId, setBusUnitId] = useState("01")
  const [siteId, setSiteId] = useState("01")
  const [transDate, setTransDate] = useState("")
  const [questionnaire, setQuestionnaire] = useState("")
  const [language, setLanguage] = useState("")
  const [marks, setMarks] = useState("")
  const [statusType, setStatusType] = useState("")
  const [remarks, setRemarks] = useState("")
  const [tokenId, setTokenId] = useState<number | null>(null)
  const [activeTokenNo, setActiveTokenNo] = useState("")

  // Result display
  const [showResult, setShowResult] = useState(false)
  const [totalQues, setTotalQues] = useState(0)
  const [rightQues, setRightQues] = useState(0)
  const [wrongQues, setWrongQues] = useState(0)
  const [percentage, setPercentage] = useState(0)

  // Token controls
  const [tokenMode, setTokenMode] = useState<"idle" | "serving" | "skip">("idle")

  // Category
  const [categories, setCategories] = useState<LicenseCategory[]>(SAMPLE_CATEGORIES)

  // Applicant info
  const [applicantName, setApplicantName] = useState("")
  const [appProcessId, setAppProcessId] = useState<number | null>(null)

  // Record navigation
  const [recordIndex, setRecordIndex] = useState(0)

  // Sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<"questions" | "category">("questions")

  // Toolbar visibility
  const [showQuestionBtn, setShowQuestionBtn] = useState(false)
  const [showHistoryBtn, setShowHistoryBtn] = useState(false)

  // Start time
  const [startTime, setStartTime] = useState<Date | null>(null)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") {
      router.replace("/")
      return
    }
    setUsername(user || "Officer")
    const now = new Date()
    setTransDate(now.toLocaleDateString("en-US"))
    setIsAuthenticated(true)
  }, [router])

  // Token handling
  const handleNextToken = useCallback(() => {
    const nextToken = SAMPLE_TOKENS.find((t) => t.tokenid > (tokenId || 0))
    if (nextToken) {
      setTokenId(nextToken.tokenid)
      setActiveTokenNo(nextToken.tokenno)
      setAppProcessId(nextToken.appprocessid)
      setApplicantName(nextToken.applicantName)
      setTokenMode("serving")
      setStartTime(new Date())
      setShowQuestionBtn(true)
      setShowResult(false)
    } else {
      alert("Token not available")
    }
  }, [tokenId])

  const handleCallToken = useCallback(() => {
    // Show skip token list (first available token)
    const token = SAMPLE_TOKENS[0]
    if (token) {
      setTokenId(token.tokenid)
      setActiveTokenNo(token.tokenno)
      setAppProcessId(token.appprocessid)
      setApplicantName(token.applicantName)
      setTokenMode("serving")
      setStartTime(new Date())
      setShowQuestionBtn(true)
      setShowResult(false)
    }
  }, [])

  const handleSkipToken = useCallback(() => {
    setTokenId(null)
    setActiveTokenNo("")
    setAppProcessId(null)
    setApplicantName("")
    setTokenMode("idle")
    setShowQuestionBtn(false)
    setShowResult(false)
    setMarks("")
    setStatusType("")
    setRemarks("")
    setCategories(SAMPLE_CATEGORIES)
    setTotalQues(0)
    setRightQues(0)
    setWrongQues(0)
    setPercentage(0)
  }, [])

  // Questionnaire change handler
  const handleQuestionnaireChange = (val: string) => {
    setQuestionnaire(val)
    if (val) {
      setShowQuestionBtn(true)
    }
  }

  // Simulate answering questionnaire and getting result
  const handleStartQuestionnaire = () => {
    // Simulate results
    const total = 20
    const right = Math.floor(Math.random() * 15) + 5
    const wrong = total - right
    const obtainedMarks = right
    const quesHdr = QUESTIONNAIRES.find((q) => q.id === Number(questionnaire))
    const totalPoints = quesHdr ? quesHdr.points : 20
    const pct = Math.round((obtainedMarks / totalPoints) * 100)

    setTotalQues(total)
    setRightQues(right)
    setWrongQues(wrong)
    setMarks(String(obtainedMarks))
    setPercentage(pct)

    if (pct >= 60) {
      setStatusType("Passed")
    } else {
      setStatusType("Failed")
    }

    setShowResult(true)
    setShowQuestionBtn(false)
    setShowHistoryBtn(true)
  }

  // Save
  const handleSave = () => {
    alert("Academic Test record saved successfully.")
    setTokenId(null)
    setActiveTokenNo("")
    setAppProcessId(null)
    setApplicantName("")
    setShowResult(false)
    setShowQuestionBtn(false)
    setShowHistoryBtn(false)
    setTokenMode("idle")
    setMarks("")
    setStatusType("")
    setRemarks("")
    setQuestionnaire("")
    setLanguage("")
    setCategories(SAMPLE_CATEGORIES)
    setTransNo("")
  }

  const handleLogout = () => {
    sessionStorage.clear()
    router.replace("/")
  }

  const handleBack = () => {
    router.push("/driving-license")
  }

  const handleCategoryToggle = (line: number) => {
    setCategories((prev) =>
      prev.map((c) => (c.line === line ? { ...c, checked: !c.checked } : c))
    )
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
        title={`Academic Test${activeTokenNo ? ` [ Token No - ${activeTokenNo} ]` : ""}`}
        username={username}
        onLogout={handleLogout}
        onBack={handleBack}
      />

      <MasterDetailToolbar
        title="Academic Test"
        recordIndex={recordIndex}
        totalRecords={0}
        onNew={() => {
          handleSkipToken()
          setTransNo("")
          setTransDate(new Date().toLocaleDateString("en-US"))
        }}
        onSave={handleSave}
        onSaveAndNew={() => {
          handleSave()
          setTransDate(new Date().toLocaleDateString("en-US"))
        }}
        onFirst={() => setRecordIndex(0)}
        onPrev={() => setRecordIndex(Math.max(0, recordIndex - 1))}
        onNext={() => setRecordIndex(recordIndex + 1)}
        onLast={() => setRecordIndex(0)}
        onRefresh={() => {}}
        showDelete={false}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        {/* Token Call Bar */}
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
          <Button
            size="sm"
            variant={tokenMode === "idle" ? "default" : "outline"}
            className="gap-1.5"
            onClick={handleNextToken}
          >
            <PhoneForwarded className="h-4 w-4" />
            Next Token
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={handleCallToken}>
            <PhoneCall className="h-4 w-4" />
            Call Token
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={handleSkipToken}
            disabled={tokenMode === "idle"}
          >
            <SkipForward className="h-4 w-4" />
            Skip Token
          </Button>
          <Button size="sm" variant="outline" className="gap-1.5" disabled={tokenMode === "idle"}>
            <Users className="h-4 w-4" />
            Serving Token
          </Button>

          {activeTokenNo && (
            <div className="ml-auto flex items-center gap-2">
              <span className="rounded bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">
                {activeTokenNo}
              </span>
              <span className="text-sm font-medium text-foreground">{applicantName}</span>
            </div>
          )}
        </div>

        {/* Main form grid */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Left Column - Header Information */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="border-b border-border bg-muted/50 px-4 py-2">
              <h3 className="text-sm font-bold text-foreground">Header Information</h3>
            </div>
            <div className="space-y-3 p-4">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">App Process ID</Label>
                  <Input
                    value={appProcessId || ""}
                    readOnly
                    className="h-8 bg-muted/30 text-sm"
                  />
                </div>
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Trans No</Label>
                  <Input
                    value={transNo}
                    readOnly
                    className="h-8 bg-muted/30 text-sm"
                    placeholder="Auto-generated"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Entity</Label>
                  <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Business Unit</Label>
                  <Input value={busUnitId} onChange={(e) => setBusUnitId(e.target.value)} className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Site</Label>
                  <Input value={siteId} onChange={(e) => setSiteId(e.target.value)} className="h-8 text-sm" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Trans Date</Label>
                  <Input value={transDate} readOnly className="h-8 bg-muted/30 text-sm" />
                </div>
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Token ID</Label>
                  <Input value={tokenId || ""} readOnly className="h-8 bg-muted/30 text-sm" />
                </div>
              </div>

              {/* Row 4 - Questionnaire */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Questionnaire</Label>
                  <select
                    value={questionnaire}
                    onChange={(e) => handleQuestionnaireChange(e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                  >
                    <option value="">-- Select --</option>
                    {QUESTIONNAIRES.map((q) => (
                      <option key={q.id} value={q.id}>
                        {q.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Language</Label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                  >
                    <option value="">-- Select --</option>
                    {LANGUAGES.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 5 - Marks and Status */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Marks</Label>
                  <Input
                    value={marks}
                    readOnly
                    className="h-8 bg-muted/30 text-sm font-bold"
                  />
                </div>
                <div>
                  <Label className="mb-1 text-xs text-muted-foreground">Status</Label>
                  <select
                    value={statusType}
                    onChange={(e) => setStatusType(e.target.value)}
                    className="h-8 w-full rounded-md border border-input bg-background px-2 text-sm"
                  >
                    <option value="">-- Select --</option>
                    <option value="Passed">Passed</option>
                    <option value="Failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Remarks */}
              <div>
                <Label className="mb-1 text-xs text-muted-foreground">Remarks</Label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="h-16 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>

              {/* Questionnaire button */}
              {showQuestionBtn && questionnaire && language && (
                <Button
                  onClick={handleStartQuestionnaire}
                  className="w-full gap-2"
                >
                  <Clock className="h-4 w-4" />
                  Start Questionnaire
                </Button>
              )}

              {showHistoryBtn && (
                <Button variant="outline" className="w-full gap-2" onClick={() => alert("Applicant test history displayed")}>
                  <Users className="h-4 w-4" />
                  Applicant Test History
                </Button>
              )}
            </div>
          </div>

          {/* Right Column - Result Panel + License Categories */}
          <div className="flex flex-col gap-4">
            {/* Result Panel */}
            {showResult && (
              <div
                className={`rounded-lg border-2 shadow-sm ${
                  statusType === "Passed"
                    ? "border-green-500 bg-green-50 dark:bg-green-950/30"
                    : "border-red-500 bg-red-50 dark:bg-red-950/30"
                }`}
              >
                <div className="flex items-center gap-3 border-b border-inherit p-4">
                  {statusType === "Passed" ? (
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  ) : (
                    <XCircle className="h-10 w-10 text-red-600" />
                  )}
                  <div>
                    <h3
                      className={`text-2xl font-black ${
                        statusType === "Passed" ? "text-green-700 dark:text-green-400" : "text-red-700 dark:text-red-400"
                      }`}
                    >
                      {statusType}
                    </h3>
                    <p className="text-sm text-muted-foreground">Academic Test Result</p>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3 p-4">
                  <div className="rounded-md bg-card p-3 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground">Total</p>
                    <p className="text-xl font-black text-foreground">{totalQues}</p>
                  </div>
                  <div className="rounded-md bg-card p-3 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground">Right</p>
                    <p className="text-xl font-black text-green-600">{rightQues}</p>
                  </div>
                  <div className="rounded-md bg-card p-3 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground">Wrong</p>
                    <p className="text-xl font-black text-red-600">{wrongQues}</p>
                  </div>
                  <div className="rounded-md bg-card p-3 text-center shadow-sm">
                    <p className="text-xs text-muted-foreground">Percentage</p>
                    <p
                      className={`text-xl font-black ${
                        statusType === "Passed" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {percentage}%
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Sub-tabs: Questions / License Category */}
            <div className="flex-1 rounded-lg border border-border bg-card shadow-sm">
              <div className="flex border-b border-border">
                <button
                  type="button"
                  className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-all ${
                    activeSubTab === "questions"
                      ? "border-b-2 border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveSubTab("questions")}
                >
                  Appraisal Questions
                </button>
                <button
                  type="button"
                  className={`flex-1 px-4 py-2.5 text-xs font-semibold transition-all ${
                    activeSubTab === "category"
                      ? "border-b-2 border-primary bg-primary/5 text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  onClick={() => setActiveSubTab("category")}
                >
                  License Category
                </button>
              </div>

              {activeSubTab === "questions" && (
                <div className="p-4">
                  <p className="text-sm text-muted-foreground">
                    {questionnaire
                      ? `Select Questionnaire "${QUESTIONNAIRES.find((q) => q.id === Number(questionnaire))?.name}" and press Start to begin the test.`
                      : "Select a questionnaire and language to begin the academic test."}
                  </p>
                </div>
              )}

              {activeSubTab === "category" && (
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="w-10 px-3 py-2 text-left">
                          <Checkbox />
                        </th>
                        <th className="w-16 px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                          Line
                        </th>
                        <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">
                          License Category
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => (
                        <tr
                          key={cat.line}
                          className="border-b border-border/50 hover:bg-muted/30"
                        >
                          <td className="px-3 py-1.5">
                            <Checkbox
                              checked={cat.checked}
                              onCheckedChange={() => handleCategoryToggle(cat.line)}
                            />
                          </td>
                          <td className="px-3 py-1.5 text-xs text-muted-foreground">{cat.line}</td>
                          <td className="px-3 py-1.5 text-xs font-medium text-foreground">
                            {cat.category}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">
          Driving License Sindh - Sindh Police IT Department
        </p>
      </footer>
    </div>
  )
}
