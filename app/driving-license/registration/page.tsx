"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { SetupPageHeader } from "@/components/setup-page-header"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Search, Camera } from "lucide-react"

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
  // Applicant detail
  gender: string
  dispatchCity: string
  education: string
  religion: string
  motherLanguage: string
  occupation: string
  bloodGroup: string
  maritalStatus: string
  identificationMark: string
  // Address detail
  permanentAddress: string
  permanentCity: string
  permanentCountry: string
  mailingAddress: string
  mailingCity: string
  mailingCountry: string
  // Contact detail
  phone: string
  email: string
  emergencyName: string
  emergencyPhone: string
  // Foreigner
  passportNo: string
  visaType: string
  visaExpiry: string
  nationality: string
  // License categories
  licenseCategories: number[]
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

export default function RegistrationPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")

  const [records, setRecords] = useState<RegistrationRecord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [form, setForm] = useState<RegistrationRecord>({ ...EMPTY_RECORD })
  const [activeTab, setActiveTab] = useState<"applicant" | "address" | "contact" | "foreigner">("applicant")

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

  const handleChange = (field: keyof RegistrationRecord, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const toggleCategory = (line: number) => {
    setForm((prev) => ({
      ...prev,
      licenseCategories: prev.licenseCategories.includes(line)
        ? prev.licenseCategories.filter((l) => l !== line)
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
  const handleNext = () => { if (currentIndex < records.length - 1) { setCurrentIndex(currentIndex + 1); setForm(records[currentIndex + 1]) } }
  const handleLast = () => { if (records.length > 0) { setCurrentIndex(records.length - 1); setForm(records[records.length - 1]) } }
  const handleRefresh = () => {}

  const handleLogout = () => { sessionStorage.clear(); router.replace("/") }
  const handleBack = () => router.push("/driving-license")

  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SetupPageHeader title="Registration" username={username} onLogout={handleLogout} onBack={handleBack} />

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
        onNext={handleNext}
        onLast={handleLast}
        onRefresh={handleRefresh}
      />

      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-7xl px-4 py-4">
          {/* ========== APPLICATION INFORMATION ========== */}
          <div className="mb-4 rounded-lg border border-border bg-card shadow-sm">
            <div className="rounded-t-lg bg-[#4a4a4a] px-4 py-2">
              <h3 className="text-sm font-semibold text-[#f7fafc]">Application Information</h3>
            </div>
            <div className="flex flex-col gap-4 p-4 lg:flex-row">
              {/* Left: form fields */}
              <div className="flex-1">
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
                  {/* Row 1 */}
                  <FormField label="Application ID" value={form.applicationId} onChange={(v) => handleChange("applicationId", v)} />
                  <FormFieldLookup label="Application Type" value={form.applicationType} onChange={(v) => handleChange("applicationType", v)} />
                  <FormField label="App Date" value={form.appDate} onChange={(v) => handleChange("appDate", v)} />

                  {/* Row 2 */}
                  <FormFieldLookup label="Applicant Type" value={form.applicantType} onChange={(v) => handleChange("applicantType", v)} />
                  <FormFieldLookup label="License Type" value={form.licenseType} onChange={(v) => handleChange("licenseType", v)} />
                  <div />

                  {/* Row 3 */}
                  <FormFieldLookup label="Personnel Title" value={form.personnelTitle} onChange={(v) => handleChange("personnelTitle", v)} />
                  <FormFieldLookup label="Card Type" value={form.cardType} onChange={(v) => handleChange("cardType", v)} />
                  <div />
                </div>

                {/* Full width fields */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <FormField label="First Name" value={form.firstName} onChange={(v) => handleChange("firstName", v)} fullWidth />
                  <div />
                  <FormField label="Last Name" value={form.lastName} onChange={(v) => handleChange("lastName", v)} fullWidth />
                  <div />
                  <FormField label="Father / Husband" value={form.fatherHusband} onChange={(v) => handleChange("fatherHusband", v)} fullWidth />
                  <div />
                </div>

                {/* CNIC row */}
                <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-4">
                  <div className="flex flex-col gap-1">
                    <Label className="text-xs font-semibold text-accent">CNIC :</Label>
                    <Input
                      value={form.cnic}
                      onChange={(e) => handleChange("cnic", e.target.value)}
                      placeholder="XXXXX-XXXXXXX-X"
                      className="h-8 text-sm"
                    />
                  </div>
                  <FormField label="CNIC Expiry" value={form.cnicExpiry} onChange={(v) => handleChange("cnicExpiry", v)} />
                  <FormField label="Date of Birth" value={form.dateOfBirth} onChange={(v) => handleChange("dateOfBirth", v)} />
                  <div />
                </div>

                {/* Address row */}
                <div className="mt-3 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  <FormField label="House/Flat/Block No" value={form.houseNo} onChange={(v) => handleChange("houseNo", v)} fullWidth />
                  <div />
                  <FormField label="Street/Area No" value={form.streetNo} onChange={(v) => handleChange("streetNo", v)} fullWidth />
                  <div />
                </div>

                {/* Mobile, City, Country row */}
                <div className="mt-3 grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-4">
                  <FormField label="Mobile No" value={form.mobileNo} onChange={(v) => handleChange("mobileNo", v)} />
                  <FormFieldLookup label="City" value={form.city} onChange={(v) => handleChange("city", v)} />
                  <FormFieldLookup label="Country" value={form.country} onChange={(v) => handleChange("country", v)} />
                  <div />
                </div>
              </div>

              {/* Right: photo placeholder */}
              <div className="flex w-full flex-col items-center lg:w-44">
                <div className="flex h-40 w-36 flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-secondary/30">
                  <Camera className="mb-2 h-8 w-8 text-muted-foreground/40" />
                  <span className="text-xs text-muted-foreground">No image data</span>
                </div>
                <button className="mt-2 rounded border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground hover:bg-secondary">
                  Upload Photo
                </button>
              </div>
            </div>
          </div>

          {/* ========== SUB TABS ========== */}
          <div className="mb-4 rounded-lg border border-border bg-card shadow-sm">
            <div className="flex border-b border-border">
              {(
                [
                  { id: "applicant", label: "Applicant Detail (F6)" },
                  { id: "address", label: "Address Detail (F7)" },
                  { id: "contact", label: "Contact Detail (F8)" },
                  { id: "foreigner", label: "Foreigner (F9)" },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 border-b-2 px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm ${
                    activeTab === tab.id
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="p-4">
              {/* Applicant Detail Tab */}
              {activeTab === "applicant" && (
                <div>
                  <div className="mb-3 rounded bg-[#4a4a4a] px-3 py-1.5">
                    <span className="text-xs font-semibold text-[#f7fafc]">Applicant Detail</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-3">
                    <FormFieldLookup label="Gender" value={form.gender} onChange={(v) => handleChange("gender", v)} />
                    <FormFieldLookup label="Dispatch City" value={form.dispatchCity} onChange={(v) => handleChange("dispatchCity", v)} />
                    <FormFieldLookup label="Education" value={form.education} onChange={(v) => handleChange("education", v)} />

                    <FormFieldLookup label="Religion" value={form.religion} onChange={(v) => handleChange("religion", v)} />
                    <FormFieldLookup label="Mother Language" value={form.motherLanguage} onChange={(v) => handleChange("motherLanguage", v)} />
                    <FormFieldLookup label="Occupation" value={form.occupation} onChange={(v) => handleChange("occupation", v)} />

                    <FormFieldLookup label="Blood Group" value={form.bloodGroup} onChange={(v) => handleChange("bloodGroup", v)} />
                    <FormFieldLookup label="Marital Status" value={form.maritalStatus} onChange={(v) => handleChange("maritalStatus", v)} />
                    <FormField label="Identification (Mark)" value={form.identificationMark} onChange={(v) => handleChange("identificationMark", v)} />
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
                      <FormField label="Address" value={form.permanentAddress} onChange={(v) => handleChange("permanentAddress", v)} fullWidth />
                      <FormFieldLookup label="City" value={form.permanentCity} onChange={(v) => handleChange("permanentCity", v)} />
                      <FormFieldLookup label="Country" value={form.permanentCountry} onChange={(v) => handleChange("permanentCountry", v)} />
                    </div>
                    <div className="flex flex-col gap-3">
                      <h4 className="text-sm font-bold text-foreground">Mailing Address</h4>
                      <FormField label="Address" value={form.mailingAddress} onChange={(v) => handleChange("mailingAddress", v)} fullWidth />
                      <FormFieldLookup label="City" value={form.mailingCity} onChange={(v) => handleChange("mailingCity", v)} />
                      <FormFieldLookup label="Country" value={form.mailingCountry} onChange={(v) => handleChange("mailingCountry", v)} />
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
                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    <FormField label="Phone" value={form.phone} onChange={(v) => handleChange("phone", v)} />
                    <FormField label="Email" value={form.email} onChange={(v) => handleChange("email", v)} />
                    <FormField label="Emergency Contact Name" value={form.emergencyName} onChange={(v) => handleChange("emergencyName", v)} />
                    <FormField label="Emergency Contact Phone" value={form.emergencyPhone} onChange={(v) => handleChange("emergencyPhone", v)} />
                  </div>
                </div>
              )}

              {/* Foreigner Tab */}
              {activeTab === "foreigner" && (
                <div>
                  <div className="mb-3 rounded bg-[#4a4a4a] px-3 py-1.5">
                    <span className="text-xs font-semibold text-[#f7fafc]">Foreigner Detail</span>
                  </div>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                    <FormField label="Passport No" value={form.passportNo} onChange={(v) => handleChange("passportNo", v)} />
                    <FormFieldLookup label="Nationality" value={form.nationality} onChange={(v) => handleChange("nationality", v)} />
                    <FormFieldLookup label="Visa Type" value={form.visaType} onChange={(v) => handleChange("visaType", v)} />
                    <FormField label="Visa Expiry" value={form.visaExpiry} onChange={(v) => handleChange("visaExpiry", v)} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* ========== LICENSE CATEGORY ========== */}
          <div className="rounded-lg border border-border bg-card shadow-sm">
            <div className="rounded-t-lg bg-[#4a4a4a] px-4 py-2">
              <h3 className="text-sm font-semibold text-[#f7fafc]">License Category</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-secondary/40">
                    <th className="w-10 px-3 py-2 text-left">
                      <Checkbox
                        checked={form.licenseCategories.length === LICENSE_CATEGORIES.length}
                        onCheckedChange={(checked) => {
                          setForm((prev) => ({
                            ...prev,
                            licenseCategories: checked ? LICENSE_CATEGORIES.map((c) => c.line) : [],
                          }))
                        }}
                      />
                    </th>
                    <th className="w-16 px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Line</th>
                    <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">License Category</th>
                  </tr>
                </thead>
                <tbody>
                  {LICENSE_CATEGORIES.map((cat) => (
                    <tr
                      key={cat.line}
                      className="border-b border-border/50 transition-colors hover:bg-secondary/20"
                    >
                      <td className="px-3 py-1.5">
                        <Checkbox
                          checked={form.licenseCategories.includes(cat.line)}
                          onCheckedChange={() => toggleCategory(cat.line)}
                        />
                      </td>
                      <td className="px-3 py-1.5 text-xs text-muted-foreground">{cat.line}</td>
                      <td className="px-3 py-1.5 text-xs font-medium text-foreground">{cat.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Bottom accent line */}
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
      <Label className="text-xs font-semibold text-muted-foreground">{label} :</Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-sm"
      />
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
      <Label className="text-xs font-semibold text-muted-foreground">{label} :</Label>
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-8 pr-8 text-sm"
        />
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
