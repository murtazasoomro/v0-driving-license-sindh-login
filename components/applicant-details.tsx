"use client"

import { User, CreditCard, BookOpen, MapPin, Phone, Calendar, CheckCircle2 } from "lucide-react"

export interface Applicant {
  name: string
  fatherName: string
  cnic: string
  passport?: string
  dob: string
  gender: string
  address: string
  phone: string
  licenseType: string
  photo: string
}

interface ApplicantDetailsProps {
  applicant: Applicant
}

export function ApplicantDetails({ applicant }: ApplicantDetailsProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-2">
        <CheckCircle2 className="h-5 w-5 text-green-500" />
        <h2 className="text-lg font-bold text-foreground">Applicant Found</h2>
      </div>

      <div className="flex flex-col gap-5 sm:flex-row">
        {/* Photo */}
        <div className="flex shrink-0 flex-col items-center gap-2">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-xl border-2 border-border bg-secondary/50">
            <User className="h-14 w-14 text-muted-foreground/40" />
          </div>
          <span className="rounded-md bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {applicant.licenseType}
          </span>
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col gap-3">
          <div>
            <h3 className="text-lg font-bold text-foreground">{applicant.name}</h3>
            <p className="text-sm text-muted-foreground">{"S/o D/o W/o: "}{applicant.fatherName}</p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">CNIC</p>
                <p className="text-sm font-semibold text-foreground font-mono">{applicant.cnic}</p>
              </div>
            </div>

            {applicant.passport && (
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 shrink-0 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Passport</p>
                  <p className="text-sm font-semibold text-foreground font-mono">{applicant.passport}</p>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2.5">
              <Calendar className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Date of Birth</p>
                <p className="text-sm font-semibold text-foreground">{applicant.dob}</p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm font-semibold text-foreground">{applicant.phone}</p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Address</p>
              <p className="text-sm text-foreground">{applicant.address}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
