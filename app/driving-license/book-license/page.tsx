"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { MasterDetailToolbar } from "@/components/master-detail-toolbar"
import { SetupPageHeader } from "@/components/setup-page-header"

/* ===== License Category ===== */
interface LicenseCategory {
  line: number
  categoryid: number
  category: string
  checked: boolean
}
const DEFAULT_CATEGORIES: LicenseCategory[] = [
  { line: 1, categoryid: 1, category: "M CYCLE", checked: false },
  { line: 2, categoryid: 2, category: "M CAR", checked: false },
  { line: 3, categoryid: 3, category: "LTV", checked: false },
  { line: 4, categoryid: 4, category: "HTV", checked: false },
  { line: 5, categoryid: 5, category: "M.CAB", checked: false },
  { line: 6, categoryid: 6, category: "MCR", checked: false },
  { line: 7, categoryid: 7, category: "IC CAR", checked: false },
  { line: 8, categoryid: 8, category: "IC M.Cycle", checked: false },
  { line: 9, categoryid: 9, category: "Invalid Carriage. (HI)", checked: false },
  { line: 10, categoryid: 10, category: "DELIVERY VAN", checked: false },
  { line: 11, categoryid: 11, category: "TRACTOR", checked: false },
  { line: 12, categoryid: 12, category: "ROAD ROLLER", checked: false },
  { line: 13, categoryid: 13, category: "PSV", checked: false },
]

const today = () =>
  new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit", year: "numeric" })

export default function BookLicensePage() {
  const router = useRouter()
  const [username, setUsername] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  /* === Header fields === */
  const [appProcessNo, setAppProcessNo] = useState("")
  const [appProcessDate, setAppProcessDate] = useState(today())
  const [entityId, setEntityId] = useState("001")
  const [applicantId, setApplicantId] = useState("")
  const [applicantTypeId, setApplicantTypeId] = useState("Civilian")
  const [titleId, setTitleId] = useState("Mr.")
  const [firstName, setFirstName] = useState("")
  const [middleName, setMiddleName] = useState("")
  const [lastName, setLastName] = useState("")
  const [cnic, setCnic] = useState("")
  const [cnicExpiry, setCnicExpiry] = useState("")
  const [appTypeId, setAppTypeId] = useState("")
  const [licenseTypeId, setLicenseTypeId] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [isForeigner, setIsForeigner] = useState(false)
  const [nationality, setNationality] = useState("")
  const [passportNo, setPassportNo] = useState("")
  const [visaNo, setVisaNo] = useState("")
  const [counterId, setCounterId] = useState("")
  const [userIdBegan, setUserIdBegan] = useState("")
  const [isBookLicense, setIsBookLicense] = useState(true)

  /* === Applicant Detail (F6) === */
  const [genderId, setGenderId] = useState("")
  const [dob, setDob] = useState("")
  const [religionId, setReligionId] = useState("Islam")
  const [bloodGroupId, setBloodGroupId] = useState("unknown")
  const [maritalId, setMaritalId] = useState("Single")
  const [birthCountryId, setBirthCountryId] = useState("Pakistan")
  const [birthCityId, setBirthCityId] = useState("KARACHI")
  const [languageId, setLanguageId] = useState("Urdu")
  const [qualificationId, setQualificationId] = useState("")
  const [occupationId, setOccupationId] = useState("")
  const [identificationMark, setIdentificationMark] = useState("")

  /* === Address === */
  const [permanentAddr, setPermanentAddr] = useState("")
  const [permCity, setPermCity] = useState("KARACHI")
  const [permTel, setPermTel] = useState("")
  const [email, setEmail] = useState("")
  const [mobileNo, setMobileNo] = useState("")
  const [sameAsPermanentCurrent, setSameAsPermanentCurrent] = useState(true)
  const [currentAddr, setCurrentAddr] = useState("")
  const [currCity, setCurrCity] = useState("KARACHI")
  const [currTel, setCurrTel] = useState("")
  const [sameAsPermanentMailing, setSameAsPermanentMailing] = useState(true)
  const [mailingAddr, setMailingAddr] = useState("")
  const [mailCity, setMailCity] = useState("KARACHI")
  const [mailTel, setMailTel] = useState("")

  /* === Contacts === */
  const [fatherContactName, setFatherContactName] = useState("")
  const [fatherContactNo, setFatherContactNo] = useState("")
  const [fatherCnic, setFatherCnic] = useState("")
  const [motherName, setMotherName] = useState("")
  const [motherContactNo, setMotherContactNo] = useState("")
  const [motherCnic, setMotherCnic] = useState("")
  const [spouseName, setSpouseName] = useState("")
  const [spouseContactNo, setSpouseContactNo] = useState("")
  const [spouseCnic, setSpouseCnic] = useState("")
  const [otherRelation, setOtherRelation] = useState("")
  const [otherContactNo, setOtherContactNo] = useState("")
  const [otherCnic, setOtherCnic] = useState("")

  /* === Old License (F7) === */
  const [oldBookNo, setOldBookNo] = useState("")
  const [oldBookDate, setOldBookDate] = useState("")
  const [oldRemarks, setOldRemarks] = useState("")
  const [psvNo, setPsvNo] = useState("")
  const [psvDate, setPsvDate] = useState("")
  const [oldLicenseExpiry, setOldLicenseExpiry] = useState("")

  /* === License Category grid === */
  const [categories, setCategories] = useState<LicenseCategory[]>(DEFAULT_CATEGORIES)

  /* === Active sub-tab === */
  const [activeSubTab, setActiveSubTab] = useState<"applicant" | "old-license">("applicant")

  /* === Records navigation === */
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

  /* === CNIC auto-masking + gender === */
  const handleCnicChange = (val: string) => {
    let raw = val.replace(/[^0-9-]/g, "")
    const digits = raw.replace(/-/g, "")
    if (digits.length <= 5) raw = digits
    else if (digits.length <= 12) raw = digits.slice(0, 5) + "-" + digits.slice(5)
    else raw = digits.slice(0, 5) + "-" + digits.slice(5, 12) + "-" + digits.slice(12, 13)

    setCnic(raw)

    if (digits.length === 13) {
      const lastDigit = parseInt(digits[12])
      if (lastDigit % 2 === 1) {
        setGenderId("Male")
        setTitleId("Mr.")
      } else {
        setGenderId("Female")
        setTitleId("Ms.")
      }
    }
  }

  /* === Toolbar handlers === */
  const handleNew = () => {
    setAppProcessNo("")
    setAppProcessDate(today())
    setApplicantId("")
    setFirstName("")
    setMiddleName("")
    setLastName("")
    setCnic("")
    setCnicExpiry("")
    setFatherName("")
    setGenderId("")
    setDob("")
    setPermanentAddr("")
    setMobileNo("")
    setEmail("")
    setCategories(DEFAULT_CATEGORIES)
    setOldBookNo("")
    setOldBookDate("")
    setOldRemarks("")
    setPsvNo("")
    setPsvDate("")
    setOldLicenseExpiry("")
  }

  const handleSave = () => {
    if (!firstName) return alert("First Name is required")
    if (!fatherName) return alert("Father Name is required")
    if (!permanentAddr) return alert("Permanent Address is required")
    if (!mobileNo) return alert("Mobile No is required")
    setTotalRecords((p) => p + 1)
    setRecordIndex(totalRecords)
    alert("Record saved successfully")
  }

  const handleSaveAndNew = () => {
    handleSave()
    setTimeout(() => handleNew(), 200)
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
      <SetupPageHeader title="Book License" username={username} onLogout={handleLogout} onBack={handleBack} />

      <MasterDetailToolbar
        title="Book License"
        recordIndex={recordIndex}
        totalRecords={totalRecords}
        onNew={handleNew}
        onSave={handleSave}
        onSaveAndNew={handleSaveAndNew}
        onFirst={() => setRecordIndex(0)}
        onPrev={() => setRecordIndex((p) => Math.max(0, p - 1))}
        onNext={() => setRecordIndex((p) => Math.min(totalRecords - 1, p + 1))}
        onLast={() => setRecordIndex(Math.max(0, totalRecords - 1))}
        onRefresh={() => {}}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-4">
        {/* ===== Application Information ===== */}
        <div className="mb-4 rounded-lg border border-border bg-card p-4 shadow-sm">
          <SectionHeader>Application Information</SectionHeader>

          <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
            <FieldRow label="App Process No">
              <Input value={appProcessNo} onChange={(e) => setAppProcessNo(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="App Process Date">
              <Input value={appProcessDate} onChange={(e) => setAppProcessDate(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Entity">
              <Input value={entityId} onChange={(e) => setEntityId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Applicant ID">
              <Input value={applicantId} onChange={(e) => setApplicantId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>

            <FieldRow label="Applicant Type">
              <select value={applicantTypeId} onChange={(e) => setApplicantTypeId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                <option value="Civilian">Civilian</option>
                <option value="Police">Police</option>
                <option value="Army">Army</option>
              </select>
            </FieldRow>
            <FieldRow label="Application Type">
              <select value={appTypeId} onChange={(e) => setAppTypeId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                <option value="">-- Select --</option>
                <option value="New">New</option>
                <option value="Renewal">Renewal</option>
                <option value="Duplicate">Duplicate</option>
                <option value="Additional">Additional</option>
              </select>
            </FieldRow>
            <FieldRow label="License Type">
              <select value={licenseTypeId} onChange={(e) => setLicenseTypeId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                <option value="">-- Select --</option>
                <option value="Permanent">Permanent</option>
                <option value="Learner">Learner</option>
                <option value="International">International</option>
              </select>
            </FieldRow>
            <FieldRow label="Title">
              <select value={titleId} onChange={(e) => setTitleId(e.target.value)}
                className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                <option value="Mr.">Mr.</option>
                <option value="Ms.">Ms.</option>
                <option value="Mrs.">Mrs.</option>
              </select>
            </FieldRow>

            <FieldRow label="First Name">
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Middle Name">
              <Input value={middleName} onChange={(e) => setMiddleName(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Last Name">
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Father / Husband">
              <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="h-8 text-xs" />
            </FieldRow>

            <FieldRow label="CNIC">
              <Input value={cnic} onChange={(e) => handleCnicChange(e.target.value)} placeholder="XXXXX-XXXXXXX-X" className="h-8 text-xs" maxLength={15} />
            </FieldRow>
            <FieldRow label="CNIC Expiry">
              <Input value={cnicExpiry} onChange={(e) => setCnicExpiry(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="Counter">
              <Input value={counterId} onChange={(e) => setCounterId(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
            <FieldRow label="User">
              <Input value={userIdBegan} onChange={(e) => setUserIdBegan(e.target.value)} className="h-8 text-xs" />
            </FieldRow>
          </div>

          {/* Foreigner checkbox */}
          <div className="mt-3 flex items-center gap-2">
            <Checkbox checked={isForeigner} onCheckedChange={(v) => setIsForeigner(!!v)} id="foreigner" />
            <Label htmlFor="foreigner" className="text-xs font-semibold text-muted-foreground">Foreigner</Label>
            {isForeigner && (
              <div className="ml-4 flex flex-wrap gap-4">
                <FieldRow label="Nationality">
                  <Input value={nationality} onChange={(e) => setNationality(e.target.value)} className="h-8 w-40 text-xs" />
                </FieldRow>
                <FieldRow label="Passport No">
                  <Input value={passportNo} onChange={(e) => setPassportNo(e.target.value)} className="h-8 w-40 text-xs" />
                </FieldRow>
                <FieldRow label="Visa No">
                  <Input value={visaNo} onChange={(e) => setVisaNo(e.target.value)} className="h-8 w-40 text-xs" />
                </FieldRow>
              </div>
            )}
          </div>
        </div>

        {/* ===== Sub-Tabs: Applicant Detail (F6), Old License (F7) ===== */}
        <div className="mb-4 rounded-lg border border-border bg-card shadow-sm">
          <div className="flex border-b border-border">
            <button type="button" onClick={() => setActiveSubTab("applicant")}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${activeSubTab === "applicant" ? "border-b-2 border-primary bg-primary/5 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              Applicant Detail (F6)
            </button>
            <button type="button" onClick={() => setActiveSubTab("old-license")}
              className={`px-4 py-2.5 text-xs font-semibold transition-colors ${activeSubTab === "old-license" ? "border-b-2 border-primary bg-primary/5 text-primary" : "text-muted-foreground hover:text-foreground"}`}>
              Old License (F7)
            </button>
          </div>

          <div className="p-4">
            {activeSubTab === "applicant" && (
              <div className="space-y-6">
                {/* Personal Info */}
                <div>
                  <SectionHeader>Personal Information</SectionHeader>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-4">
                    <FieldRow label="Gender">
                      <select value={genderId} onChange={(e) => setGenderId(e.target.value)}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                        <option value="">-- Select --</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </FieldRow>
                    <FieldRow label="Date of Birth">
                      <Input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="h-8 text-xs" />
                    </FieldRow>
                    <FieldRow label="Religion">
                      <select value={religionId} onChange={(e) => setReligionId(e.target.value)}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                        <option value="Islam">Islam</option>
                        <option value="Christianity">Christianity</option>
                        <option value="Hinduism">Hinduism</option>
                        <option value="Other">Other</option>
                      </select>
                    </FieldRow>
                    <FieldRow label="Blood Group">
                      <select value={bloodGroupId} onChange={(e) => setBloodGroupId(e.target.value)}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                        <option value="unknown">Unknown</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </FieldRow>
                    <FieldRow label="Marital Status">
                      <select value={maritalId} onChange={(e) => setMaritalId(e.target.value)}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                        <option value="Single">Single</option>
                        <option value="Married">Married</option>
                        <option value="Divorced">Divorced</option>
                        <option value="Widow">Widow</option>
                      </select>
                    </FieldRow>
                    <FieldRow label="Birth Country">
                      <select value={birthCountryId} onChange={(e) => setBirthCountryId(e.target.value)}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                        <option value="Pakistan">Pakistan</option>
                        <option value="India">India</option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Other">Other</option>
                      </select>
                    </FieldRow>
                    <FieldRow label="Birth City">
                      <Input value={birthCityId} onChange={(e) => setBirthCityId(e.target.value)} className="h-8 text-xs" />
                    </FieldRow>
                    <FieldRow label="Mother Language">
                      <select value={languageId} onChange={(e) => setLanguageId(e.target.value)}
                        className="h-8 w-full rounded-md border border-input bg-background px-2 text-xs">
                        <option value="Urdu">Urdu</option>
                        <option value="Sindhi">Sindhi</option>
                        <option value="Punjabi">Punjabi</option>
                        <option value="Pashto">Pashto</option>
                        <option value="English">English</option>
                      </select>
                    </FieldRow>
                    <FieldRow label="Qualification">
                      <Input value={qualificationId} onChange={(e) => setQualificationId(e.target.value)} className="h-8 text-xs" />
                    </FieldRow>
                    <FieldRow label="Occupation">
                      <Input value={occupationId} onChange={(e) => setOccupationId(e.target.value)} className="h-8 text-xs" />
                    </FieldRow>
                    <FieldRow label="Identification Mark" className="sm:col-span-2">
                      <Input value={identificationMark} onChange={(e) => setIdentificationMark(e.target.value)} className="h-8 text-xs" />
                    </FieldRow>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <SectionHeader>Address Information</SectionHeader>

                  {/* Permanent */}
                  <div className="mb-3">
                    <p className="mb-1 text-[11px] font-bold text-muted-foreground">Permanent Address</p>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
                      <FieldRow label="Address" className="sm:col-span-2">
                        <Input value={permanentAddr} onChange={(e) => {
                          setPermanentAddr(e.target.value)
                          if (sameAsPermanentCurrent) setCurrentAddr(e.target.value)
                          if (sameAsPermanentMailing) setMailingAddr(e.target.value)
                        }} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="City">
                        <Input value={permCity} onChange={(e) => {
                          setPermCity(e.target.value)
                          if (sameAsPermanentCurrent) setCurrCity(e.target.value)
                          if (sameAsPermanentMailing) setMailCity(e.target.value)
                        }} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="Telephone">
                        <Input value={permTel} onChange={(e) => {
                          setPermTel(e.target.value)
                          if (sameAsPermanentCurrent) setCurrTel(e.target.value)
                          if (sameAsPermanentMailing) setMailTel(e.target.value)
                        }} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="Email">
                        <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="Mobile No">
                        <Input value={mobileNo} onChange={(e) => setMobileNo(e.target.value)} className="h-8 text-xs" />
                      </FieldRow>
                    </div>
                  </div>

                  {/* Current */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-[11px] font-bold text-muted-foreground">Current Address</p>
                      <Checkbox checked={sameAsPermanentCurrent} onCheckedChange={(v) => setSameAsPermanentCurrent(!!v)} id="sameCurrent" />
                      <Label htmlFor="sameCurrent" className="text-[10px] text-muted-foreground">Same as Permanent</Label>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                      <FieldRow label="Address">
                        <Input value={currentAddr} onChange={(e) => setCurrentAddr(e.target.value)} disabled={sameAsPermanentCurrent} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="City">
                        <Input value={currCity} onChange={(e) => setCurrCity(e.target.value)} disabled={sameAsPermanentCurrent} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="Telephone">
                        <Input value={currTel} onChange={(e) => setCurrTel(e.target.value)} disabled={sameAsPermanentCurrent} className="h-8 text-xs" />
                      </FieldRow>
                    </div>
                  </div>

                  {/* Mailing */}
                  <div className="mb-3">
                    <div className="mb-1 flex items-center gap-2">
                      <p className="text-[11px] font-bold text-muted-foreground">Mailing Address</p>
                      <Checkbox checked={sameAsPermanentMailing} onCheckedChange={(v) => setSameAsPermanentMailing(!!v)} id="sameMailing" />
                      <Label htmlFor="sameMailing" className="text-[10px] text-muted-foreground">Same as Permanent</Label>
                    </div>
                    <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                      <FieldRow label="Address">
                        <Input value={mailingAddr} onChange={(e) => setMailingAddr(e.target.value)} disabled={sameAsPermanentMailing} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="City">
                        <Input value={mailCity} onChange={(e) => setMailCity(e.target.value)} disabled={sameAsPermanentMailing} className="h-8 text-xs" />
                      </FieldRow>
                      <FieldRow label="Telephone">
                        <Input value={mailTel} onChange={(e) => setMailTel(e.target.value)} disabled={sameAsPermanentMailing} className="h-8 text-xs" />
                      </FieldRow>
                    </div>
                  </div>
                </div>

                {/* Contact Details */}
                <div>
                  <SectionHeader>Contact Details</SectionHeader>
                  <div className="space-y-2">
                    <ContactRow
                      relation="Father"
                      name={fatherContactName} onNameChange={setFatherContactName}
                      contactNo={fatherContactNo} onContactChange={setFatherContactNo}
                      cnicVal={fatherCnic} onCnicChange={setFatherCnic}
                    />
                    <ContactRow
                      relation="Mother"
                      name={motherName} onNameChange={setMotherName}
                      contactNo={motherContactNo} onContactChange={setMotherContactNo}
                      cnicVal={motherCnic} onCnicChange={setMotherCnic}
                    />
                    <ContactRow
                      relation="Spouse"
                      name={spouseName} onNameChange={setSpouseName}
                      contactNo={spouseContactNo} onContactChange={setSpouseContactNo}
                      cnicVal={spouseCnic} onCnicChange={setSpouseCnic}
                    />
                    <ContactRow
                      relation="Other"
                      name={otherRelation} onNameChange={setOtherRelation}
                      contactNo={otherContactNo} onContactChange={setOtherContactNo}
                      cnicVal={otherCnic} onCnicChange={setOtherCnic}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSubTab === "old-license" && (
              <div>
                <SectionHeader>Old License Information</SectionHeader>
                <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
                  <FieldRow label="Old Book No">
                    <Input value={oldBookNo} onChange={(e) => setOldBookNo(e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="Old Book Date">
                    <Input type="date" value={oldBookDate} onChange={(e) => setOldBookDate(e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="Old License Expiry">
                    <Input type="date" value={oldLicenseExpiry} onChange={(e) => setOldLicenseExpiry(e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="PSV No">
                    <Input value={psvNo} onChange={(e) => setPsvNo(e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="PSV Date">
                    <Input type="date" value={psvDate} onChange={(e) => setPsvDate(e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                  <FieldRow label="Remarks" className="sm:col-span-2 lg:col-span-3">
                    <Input value={oldRemarks} onChange={(e) => setOldRemarks(e.target.value)} className="h-8 text-xs" />
                  </FieldRow>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ===== License Category Grid ===== */}
        <div className="rounded-lg border border-border bg-card shadow-sm">
          <SectionHeader className="mx-4 mt-3">License Category</SectionHeader>
          <div className="overflow-x-auto p-4 pt-2">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border bg-muted/40">
                  <th className="w-10 px-3 py-2 text-center">
                    <Checkbox disabled />
                  </th>
                  <th className="w-16 px-3 py-2 font-semibold">Line</th>
                  <th className="px-3 py-2 font-semibold">Category ID</th>
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
                    <td className="px-3 py-1.5 text-muted-foreground">{cat.categoryid}</td>
                    <td className="px-3 py-1.5">{cat.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <footer className="border-t border-border bg-card/50 py-3 text-center">
        <p className="text-xs text-muted-foreground">Driving License Sindh - Book License Module</p>
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

function SectionHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`mb-2 rounded bg-[#5f6b6d] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white ${className}`}>
      {children}
    </div>
  )
}

function ContactRow({
  relation,
  name,
  onNameChange,
  contactNo,
  onContactChange,
  cnicVal,
  onCnicChange,
}: {
  relation: string
  name: string
  onNameChange: (v: string) => void
  contactNo: string
  onContactChange: (v: string) => void
  cnicVal: string
  onCnicChange: (v: string) => void
}) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-1 sm:grid-cols-4">
      <div className="flex items-center">
        <span className="text-[11px] font-bold text-muted-foreground">{relation}</span>
      </div>
      <FieldRow label="Name">
        <Input value={name} onChange={(e) => onNameChange(e.target.value)} className="h-7 text-xs" />
      </FieldRow>
      <FieldRow label="Contact No">
        <Input value={contactNo} onChange={(e) => onContactChange(e.target.value)} className="h-7 text-xs" />
      </FieldRow>
      <FieldRow label="CNIC">
        <Input value={cnicVal} onChange={(e) => onCnicChange(e.target.value)} className="h-7 text-xs" />
      </FieldRow>
    </div>
  )
}
