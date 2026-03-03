"use client"

import { Suspense, useEffect, useState, useRef, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { SetupPageHeader } from "@/components/setup-page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Camera,
  Video,
  VideoOff,
  RotateCcw,
  SkipForward,
  PhoneCall,
  PhoneForwarded,
  PhoneOff,
  User,
  X,
} from "lucide-react"

// ===== Types =====
interface RegistrationRecord {
  applicationId: string
  applicationType: string
  appDate: string
  applicantType: string
  licenseType: string
  personnelTitle: string
  cardType: string
  firstName: string
  lastName: string
  fatherHusband: string
  cnic: string
  cnicExpiry: string
  dateOfBirth: string
  houseNo: string
  streetNo: string
  mobileNo: string
  city: string
  country: string
  gender: string
  dispatchCity: string
  education: string
  religion: string
  motherLanguage: string
  occupation: string
  bloodGroup: string
  maritalStatus: string
  identificationMark: string
  permanentAddress: string
  permanentCity: string
  permanentCountry: string
  mailingAddress: string
  mailingCity: string
  mailingCountry: string
  phone: string
  email: string
  emergencyName: string
  emergencyPhone: string
  passportNo: string
  visaType: string
  visaExpiry: string
  nationality: string
  licenseCategories: number[]
  photoData: string | null
}

const EMPTY_RECORD: RegistrationRecord = {
  applicationId: "",
  applicationType: "",
  appDate: new Date().toLocaleDateString("en-US"),
  applicantType: "",
  licenseType: "",
  personnelTitle: "Mr.",
  cardType: "Local ID Card",
  firstName: "",
  lastName: "",
  fatherHusband: "",
  cnic: "",
  cnicExpiry: "",
  dateOfBirth: "",
  houseNo: "",
  streetNo: "",
  mobileNo: "",
  city: "KARACHI",
  country: "Pakistan",
  gender: "",
  dispatchCity: "KARACHI",
  education: "",
  religion: "Islam",
  motherLanguage: "Sindhi",
  occupation: "",
  bloodGroup: "unknown",
  maritalStatus: "Single",
  identificationMark: "",
  permanentAddress: "",
  permanentCity: "KARACHI",
  permanentCountry: "Pakistan",
  mailingAddress: "",
  mailingCity: "KARACHI",
  mailingCountry: "Pakistan",
  phone: "",
  email: "",
  emergencyName: "",
  emergencyPhone: "",
  passportNo: "",
  visaType: "",
  visaExpiry: "",
  nationality: "Pakistani",
  licenseCategories: [],
  photoData: null,
}

const LICENSE_CATEGORIES = [
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

export default function RegistrationPageWrapper() {
  return (
    <Suspense fallback={<div className="flex min-h-svh items-center justify-center bg-background"><div className="text-sm text-muted-foreground">Loading...</div></div>}>
      <RegistrationPage />
    </Suspense>
  )
}

function RegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")

  // Token management -- tokens come from Token Issuance page via URL params or sessionStorage
  const [servingToken, setServingToken] = useState<string | null>(null)
  const [servingCnic, setServingCnic] = useState<string | null>(null)
  const [tokenStatus, setTokenStatus] = useState<"idle" | "serving" | "skipped">("idle")

  // Form state
  const [records, setRecords] = useState<RegistrationRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [form, setForm] = useState<RegistrationRecord>({ ...EMPTY_RECORD })
  const [activeTab, setActiveTab] = useState<"applicant" | "address" | "contact" | "foreigner">("applicant")

  // Camera state
  const [cameraActive, setCameraActive] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    const auth = sessionStorage.getItem("dls_authenticated")
    const user = sessionStorage.getItem("dls_user")
    if (auth !== "true") { router.replace("/"); return }
    setUsername(user || "Officer")
    setIsAuthenticated(true)

    // Pre-fill from URL params (from Token Issuance "Register" button)
    const paramCnic = searchParams.get("cnic")
    const paramToken = searchParams.get("token")
    if (paramCnic) {
      setServingCnic(paramCnic)
      setForm(prev => ({ ...prev, cnic: paramCnic }))
      setTokenStatus("serving")
    }
    if (paramToken) {
      setServingToken(paramToken)
    }
    // Also check sessionStorage for current token
    if (!paramToken) {
      const savedToken = sessionStorage.getItem("dls_current_token")
      if (savedToken) {
        try {
          const t = JSON.parse(savedToken)
          setServingToken(t.tokenNumber)
          setServingCnic(t.cnic)
          setForm(prev => ({ ...prev, cnic: t.cnic }))
          setTokenStatus("serving")
        } catch { /* ignore */ }
      }
    }
  }, [router, searchParams])

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop())
      }
    }
  }, [])

  // ===== Camera functions =====
  const startCamera = useCallback(async () => {
    setCameraError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: { ideal: 640 }, height: { ideal: 480 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setCameraActive(true)
    } catch {
      setCameraError("Camera access denied or not available")
      setCameraActive(false)
    }
  }, [])

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setCameraActive(false)
  }, [])

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85)
    setForm(prev => ({ ...prev, photoData: dataUrl }))
    stopCamera()
  }, [stopCamera])

  const clearPhoto = useCallback(() => {
    setForm(prev => ({ ...prev, photoData: null }))
  }, [])

  // ===== Token functions =====
  const handleNextToken = () => {
    // Go back to Token Issuance to call the next token
    router.push("/token-issuance")
  }

  const handleCallToken = () => {
    // Navigate to Token Issuance to pick a token from the queue
    router.push("/token-issuance")
  }

  const handleSkipToken = () => {
    if (servingToken) {
      setTokenStatus("skipped")
      setServingToken(null)
      setServingCnic(null)
      sessionStorage.removeItem("dls_current_token")
      // Clear the CNIC from form
      setForm(prev => ({ ...prev, cnic: "" }))
    }
  }

  // ===== Form functions =====
  const handleChange = (field: keyof RegistrationRecord, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (line: number) => {
    setForm(prev => ({
      ...prev,
      licenseCategories: prev.licenseCategories.includes(line)
        ? prev.licenseCategories.filter(l => l !== line)
        : [...prev.licenseCategories, line],
    }))
  }

  const handleNew = () => setForm({ ...EMPTY_RECORD, appDate: new Date().toLocaleDateString("en-US") })
  const handleSave = () => {
    const updated = [...records]
    if (records.length > 0 && currentIndex < records.length) {
      updated[currentIndex] = form
    } else {
      updated.push(form)
    }
    setRecords(updated)
    setCurrentIndex(updated.length - 1)
  }
  const handleSaveAndNew = () => { handleSave(); handleNew() }
  const handleDelete = () => {
    if (records.length === 0) return
    const updated = records.filter((_, i) => i !== currentIndex)
    setRecords(updated)
    setCurrentIndex(Math.max(0, currentIndex - 1))
    setForm(updated[Math.max(0, currentIndex - 1)] || { ...EMPTY_RECORD })
  }
  const handleFirst = () => { if (records.length > 0) { setCurrentIndex(0); setForm(records[0]) } }
  const handlePrev = () => { if (currentIndex > 0) { setCurrentIndex(currentIndex - 1); setForm(records[currentIndex - 1]) } }
  const handleNextRec = () => { if (currentIndex < records.length - 1) { setCurrentIndex(currentIndex + 1); setForm(records[currentIndex + 1]) } }
  const handleLast = () => { if (records.length > 0) { setCurrentIndex(records.length - 1); setForm(records[records.length - 1]) } }
  const handleRefresh = () => {}

  const handleLogout = () => { sessionStorage.clear(); router.replace("/") }
  const handleBack = () => router.push("/driving-license")

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader title="Registration" username={username} onLogout={handleLogout} onBack={handleBack} />

      {/* ===== TOKEN CALL BAR ===== */}
      <div className="border-b border-border bg-card px-3 py-2 sm:px-4">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              onClick={handleNextToken}
              className="h-8 gap-1.5 bg-emerald-600 text-xs hover:bg-emerald-700"
            >
              <PhoneForwarded className="h-3.5 w-3.5" />
              <span className="hidden xs:inline">Next Token</span>
              <span className="xs:hidden">Next</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCallToken}
              disabled={!servingToken}
              className="h-8 gap-1.5 text-xs"
            >
              <PhoneCall className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Call Token</span>
              <span className="sm:hidden">Call</span>
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSkipToken}
              disabled={!servingToken}
              className="h-8 gap-1.5 text-xs border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-700 dark:text-amber-400 dark:hover:bg-amber-950/30"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Skip Token</span>
              <span className="sm:hidden">Skip</span>
            </Button>

            <div className="mx-1 hidden h-5 w-px bg-border sm:block" />

            {/* Serving Token Display */}
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/50 px-3 py-1.5">
              <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">Serving:</span>
              {servingToken ? (
                <span className="text-sm font-bold text-primary">{servingToken}</span>
              ) : (
                <span className="text-sm font-medium text-muted-foreground">---</span>
              )}
            </div>
          </div>

          {/* Queue info */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-muted-foreground">{servingCnic ? `CNIC: ${servingCnic}` : "No token called"}</span>
            </div>
            {tokenStatus === "serving" && (
              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">SERVING</span>
            )}
            {tokenStatus === "skipped" && (
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">SKIPPED</span>
            )}
          </div>
        </div>
      </div>

      <MasterDetailToolbar
        title="Registration"
        recordIndex={currentIndex}
        totalRecords={records.length}
        onNew={handleNew}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onDelete={handleDelete}
        showDelete
        onFirst={handleFirst}
        onPrev={handlePrev}
        onNext={handleNextRec}
        onLast={handleLast}
        onRefresh={handleRefresh}
      />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-3 py-3 sm:px-4 sm:py-4">
          {/* ========== APPLICATION INFORMATION ========== */}
          <div className="mb-4 rounded-lg border border-border bg-card shadow-sm">
            <div className="rounded-t-lg bg-[#4a4a4a] px-3 py-2 sm:px-4">
              <h3 className="text-xs font-semibold text-[#f7fafc] sm:text-sm">Application Information</h3>
            </div>
            <div className="flex flex-col gap-4 p-3 sm:p-4 lg:flex-row">
              {/* Left: form fields */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  <FormField label="Application ID" value={form.applicationId} onChange={v => handleChange("applicationId", v)} />
                  <FormFieldLookup label="Application Type" value={form.applicationType} onChange={v => handleChange("applicationType", v)} />
                  <FormField label="App Date" value={form.appDate} onChange={v => handleChange("appDate", v)} />

                  <FormFieldLookup label="Applicant Type" value={form.applicantType} onChange={v => handleChange("applicantType", v)} />
                  <FormFieldLookup label="License Type" value={form.licenseType} onChange={v => handleChange("licenseType", v)} />
                  <div className="hidden lg:block" />

                  <FormFieldLookup label="Personnel Title" value={form.personnelTitle} onChange={v => handleChange("personnelTitle", v)} />
                  <FormFieldLookup label="Card Type" value={form.cardType} onChange={v => handleChange("cardType", v)} />
                  <div className="hidden lg:block" />
                </div>

                {/* Full width name fields */}
                <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <FormField label="First Name" value={form.firstName} onChange={v => handleChange("firstName", v)} fullWidth />
                  <div className="hidden sm:block" />
                  <FormField label="Last Name" value={form.lastName} onChange={v => handleChange("lastName", v)} fullWidth />
                  <div className="hidden sm:block" />
                  <FormField label="Father / Husband" value={form.fatherHusband} onChange={v => handleChange("fatherHusband", v)} fullWidth />
                  <div className="hidden sm:block" />
                </div>

                {/* CNIC row */}
                <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-accent">CNIC :</Label>
                    <Input value={form.cnic} onChange={e => handleChange("cnic", e.target.value)} placeholder="XXXXX-XXXXXXX-X" className="h-8 text-sm" />
                  </div>
                  <FormField label="CNIC Expiry" value={form.cnicExpiry} onChange={v => handleChange("cnicExpiry", v)} />
                  <FormField label="Date of Birth" value={form.dateOfBirth} onChange={v => handleChange("dateOfBirth", v)} />
                  <div className="hidden lg:block" />
                </div>

                {/* Address row */}
                <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                  <FormField label="House/Flat/Block No" value={form.houseNo} onChange={v => handleChange("houseNo", v)} fullWidth />
                  <div className="hidden sm:block" />
                  <FormField label="Street/Area No" value={form.streetNo} onChange={v => handleChange("streetNo", v)} fullWidth />
                  <div className="hidden sm:block" />
                </div>

                {/* Mobile, City, Country row */}
                <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                  <FormField label="Mobile No" value={form.mobileNo} onChange={v => handleChange("mobileNo", v)} />
                  <FormFieldLookup label="City" value={form.city} onChange={v => handleChange("city", v)} />
                  <FormFieldLookup label="Country" value={form.country} onChange={v => handleChange("country", v)} />
                  <div className="hidden lg:block" />
                </div>
              </div>

              {/* Right: LIVE CAMERA / PHOTO */}
              <div className="flex w-full flex-col items-center gap-2 lg:w-48">
                <div className="relative flex h-44 w-40 flex-col items-center justify-center overflow-hidden rounded-lg border-2 border-dashed border-border bg-secondary/30 sm:h-48 sm:w-44">
                  {/* Hidden canvas for capture */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Live camera feed */}
                  {cameraActive && (
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  {/* Captured photo */}
                  {!cameraActive && form.photoData && (
                    <>
                      <img src={form.photoData} alt="Captured photo" className="absolute inset-0 h-full w-full object-cover" />
                      <button
                        type="button"
                        onClick={clearPhoto}
                        className="absolute right-1 top-1 rounded-full bg-destructive/80 p-1 text-destructive-foreground hover:bg-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  )}

                  {/* Empty state */}
                  {!cameraActive && !form.photoData && (
                    <div className="flex flex-col items-center gap-1.5">
                      <User className="h-10 w-10 text-muted-foreground/30" />
                      <span className="text-[10px] text-muted-foreground">No image data</span>
                      {cameraError && (
                        <span className="px-2 text-center text-[9px] text-destructive">{cameraError}</span>
                      )}
                    </div>
                  )}

                  {/* Capture button overlay when camera is on */}
                  {cameraActive && (
                    <button
                      type="button"
                      onClick={capturePhoto}
                      className="absolute bottom-2 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full bg-destructive px-3 py-1.5 text-[10px] font-bold text-destructive-foreground shadow-lg transition-transform hover:scale-105"
                    >
                      <Camera className="h-3.5 w-3.5" />
                      Capture
                    </button>
                  )}
                </div>

                {/* Camera controls */}
                <div className="flex items-center gap-1.5">
                  {!cameraActive ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startCamera}
                      className="h-7 gap-1.5 px-3 text-[11px]"
                    >
                      <Video className="h-3.5 w-3.5 text-emerald-600" />
                      Open Camera
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={stopCamera}
                      className="h-7 gap-1.5 px-3 text-[11px] border-destructive/30 text-destructive"
                    >
                      <VideoOff className="h-3.5 w-3.5" />
                      Close
                    </Button>
                  )}
                  {form.photoData && !cameraActive && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={startCamera}
                      className="h-7 gap-1.5 px-2 text-[11px]"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Retake
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ========== SUB TABS ========== */}
          <div className="mb-4 rounded-lg border border-border bg-card shadow-sm">
            <div className="flex overflow-x-auto border-b border-border">
              {([
                { id: "applicant", label: "Applicant Detail (F6)" },
                { id: "address", label: "Address Detail (F7)" },
                { id: "contact", label: "Contact Detail (F8)" },
                { id: "foreigner", label: "Foreigner (F9)" },
              ] as const).map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`shrink-0 flex-1 border-b-2 px-2 py-2.5 text-[11px] font-semibold transition-all sm:px-3 sm:text-xs md:text-sm ${
                    activeTab === tab.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-3 sm:p-4">
              {/* Applicant Detail Tab */}
              {activeTab === "applicant" && (
                <div>
                  <div className="mb-3 rounded bg-[#4a4a4a] px-3 py-1.5">
                    <span className="text-xs font-semibold text-[#f7fafc]">Applicant Detail</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                    <FormFieldLookup label="Gender" value={form.gender} onChange={v => handleChange("gender", v)} />
                    <FormFieldLookup label="Dispatch City" value={form.dispatchCity} onChange={v => handleChange("dispatchCity", v)} />
                    <FormFieldLookup label="Education" value={form.education} onChange={v => handleChange("education", v)} />

                    <FormFieldLookup label="Religion" value={form.religion} onChange={v => handleChange("religion", v)} />
                    <FormFieldLookup label="Mother Language" value={form.motherLanguage} onChange={v => handleChange("motherLanguage", v)} />
                    <FormFieldLookup label="Occupation" value={form.occupation} onChange={v => handleChange("occupation", v)} />

                    <FormFieldLookup label="Blood Group" value={form.bloodGroup} onChange={v => handleChange("bloodGroup", v)} />
                    <FormFieldLookup label="Marital Status" value={form.maritalStatus} onChange={v => handleChange("maritalStatus", v)} />
                    <FormField label="Identification (Mark)" value={form.identificationMark} onChange={v => handleChange("identificationMark", v)} />
                  </div>
                </div>
              )}

              {/* Address Detail Tab */}
              {activeTab === "address" && (
                <div>
                  <div className="mb-3 rounded bg-[#4a4a4a] px-3 py-1.5">
                    <span className="text-xs font-semibold text-[#f7fafc]">Address Detail</span>
                  </div>
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-bold text-foreground">Permanent Address</h4>
                      <FormField label="Address" value={form.permanentAddress} onChange={v => handleChange("permanentAddress", v)} fullWidth />
                      <FormFieldLookup label="City" value={form.permanentCity} onChange={v => handleChange("permanentCity", v)} />
                      <FormFieldLookup label="Country" value={form.permanentCountry} onChange={v => handleChange("permanentCountry", v)} />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-bold text-foreground">Mailing Address</h4>
                      <FormField label="Address" value={form.mailingAddress} onChange={v => handleChange("mailingAddress", v)} fullWidth />
                      <FormFieldLookup label="City" value={form.mailingCity} onChange={v => handleChange("mailingCity", v)} />
                      <FormFieldLookup label="Country" value={form.mailingCountry} onChange={v => handleChange("mailingCountry", v)} />
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Detail Tab */}
              {activeTab === "contact" && (
                <div>
                  <div className="mb-3 rounded bg-[#4a4a4a] px-3 py-1.5">
                    <span className="text-xs font-semibold text-[#f7fafc]">Contact Detail</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <FormField label="Phone" value={form.phone} onChange={v => handleChange("phone", v)} />
                    <FormField label="Email" value={form.email} onChange={v => handleChange("email", v)} />
                    <FormField label="Emergency Contact Name" value={form.emergencyName} onChange={v => handleChange("emergencyName", v)} />
                    <FormField label="Emergency Contact Phone" value={form.emergencyPhone} onChange={v => handleChange("emergencyPhone", v)} />
                  </div>
                </div>
              )}

              {/* Foreigner Tab */}
              {activeTab === "foreigner" && (
                <div>
                  <div className="mb-3 rounded bg-[#4a4a4a] px-3 py-1.5">
                    <span className="text-xs font-semibold text-[#f7fafc]">Foreigner Detail</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2">
                    <FormField label="Passport No" value={form.passportNo} onChange={v => handleChange("passportNo", v)} />
                    <FormFieldLookup label="Nationality" value={form.nationality} onChange={v => handleChange("nationality", v)} />
                    <FormFieldLookup label="Visa Type" value={form.visaType} onChange={v => handleChange("visaType", v)} />
                    <FormField label="Visa Expiry" value={form.visaExpiry} onChange={v => handleChange("visaExpiry", v)} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== LICENSE CATEGORY ========== */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="rounded-t-lg bg-[#4a4a4a] px-3 py-2 sm:px-4">
              <h3 className="text-xs font-semibold text-[#f7fafc] sm:text-sm">License Category</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="w-10 px-3 py-2 text-left">
                      <Checkbox
                        checked={form.licenseCategories.length === LICENSE_CATEGORIES.length}
                        onCheckedChange={checked => {
                          setForm(prev => ({
                            ...prev,
                            licenseCategories: checked ? LICENSE_CATEGORIES.map(c => c.line) : [],
                          }))
                        }}
                      />
                    </th>
                    <th className="w-16 px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Line</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">License Category</th>
                  </tr>
                </thead>
                <tbody>
                  {LICENSE_CATEGORIES.map(cat => (
                    <tr key={cat.line} className="border-b border-border/50 transition-colors hover:bg-secondary/20">
                      <td className="px-3 py-1.5">
                        <Checkbox checked={form.licenseCategories.includes(cat.line)} onCheckedChange={() => toggleCategory(cat.line)} />
                      </td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{cat.line}</td>
                      <td className="px-3 py-1.5 text-xs font-medium text-foreground">{cat.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="h-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

// ===== Reusable Form Field Components =====
function FormField({
  label,
  value,
  onChange,
  fullWidth,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  fullWidth?: boolean
}) {
  return (
    <div className={`flex flex-col gap-1 ${fullWidth ? "sm:col-span-2" : ""}`}>
      <Label className="text-[11px] font-semibold text-muted-foreground sm:text-xs">{label} :</Label>
      <Input value={value} onChange={e => onChange(e.target.value)} className="h-8 text-sm" />
    </div>
  )
}

function FormFieldLookup({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] font-semibold text-muted-foreground sm:text-xs">{label} :</Label>
      <div className="relative">
        <Input value={value} onChange={e => onChange(e.target.value)} className="h-8 pr-8 text-sm" />
        <button
          type="button"
          className="absolute right-0 top-0 flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
        >
          <Search className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
