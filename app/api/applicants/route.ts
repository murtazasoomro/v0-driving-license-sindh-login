import { NextRequest, NextResponse } from "next/server"
import { query, execute, withTransaction } from "@/lib/db/mssql"
import type { DLApplicantInfoHdr, DLApplicantContact } from "@/lib/db/types"

// GET - Fetch applicants or single applicant by CNIC
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const cnic = searchParams.get("cnic")
    const applicantid = searchParams.get("applicantid")

    if (cnic) {
      const applicants = await query<DLApplicantInfoHdr & DLApplicantContact>(
        `SELECT a.*, c.address1, c.address2, c.cityid, c.districtid, c.postalcode, c.phone, c.mobile, c.email,
                ct.citystxt as cityname, d.districtstxt as districtname
         FROM DLApplicantInfoHdr a
         LEFT JOIN DLApplicantContact c ON a.applicantid = c.applicantid
         LEFT JOIN City ct ON c.cityid = ct.cityid
         LEFT JOIN District d ON c.districtid = d.districtid
         WHERE a.cnic = @cnic`,
        { cnic }
      )
      
      if (applicants.length === 0) {
        return NextResponse.json({ applicant: null })
      }
      
      return NextResponse.json({ applicant: applicants[0] })
    }

    if (applicantid) {
      const applicants = await query<DLApplicantInfoHdr & DLApplicantContact>(
        `SELECT a.*, c.address1, c.address2, c.cityid, c.districtid, c.postalcode, c.phone, c.mobile, c.email,
                ct.citystxt as cityname, d.districtstxt as districtname
         FROM DLApplicantInfoHdr a
         LEFT JOIN DLApplicantContact c ON a.applicantid = c.applicantid
         LEFT JOIN City ct ON c.cityid = ct.cityid
         LEFT JOIN District d ON c.districtid = d.districtid
         WHERE a.applicantid = @applicantid`,
        { applicantid: parseInt(applicantid) }
      )
      
      return NextResponse.json({ applicant: applicants[0] || null })
    }

    // List applicants with pagination
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "50")
    const search = searchParams.get("search")
    const offset = (page - 1) * limit

    let whereClause = "WHERE ISNULL(a.utblock, 0) = 0"
    const params: Record<string, unknown> = { offset, limit }

    if (search) {
      whereClause += " AND (a.cnic LIKE @search OR a.firstname LIKE @search OR a.lastname LIKE @search)"
      params.search = `%${search}%`
    }

    const applicants = await query<DLApplicantInfoHdr>(
      `SELECT a.applicantid, a.applicantno, a.cnic, a.firstname, a.lastname, a.fathername, a.gender, a.dob
       FROM DLApplicantInfoHdr a
       ${whereClause}
       ORDER BY a.applicantid DESC
       OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY`,
      params
    )

    const countResult = await query<{ total: number }>(
      `SELECT COUNT(*) as total FROM DLApplicantInfoHdr a ${whereClause}`,
      params
    )

    return NextResponse.json({
      applicants,
      total: countResult[0]?.total || 0,
      page,
      limit,
    })
  } catch (error) {
    console.error("[API] Get applicants error:", error)
    return NextResponse.json(
      { error: "Failed to fetch applicants" },
      { status: 500 }
    )
  }
}

// POST - Create or update applicant (registration)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cnic,
      firstname,
      lastname,
      fathername,
      gender,
      dob,
      bloodgroup,
      nationality,
      religion,
      maritalstatus,
      education,
      occupation,
      photo,
      // Contact info
      address1,
      address2,
      cityid,
      districtid,
      postalcode,
      phone,
      mobile,
      email,
      // Meta
      userid,
    } = body

    if (!cnic) {
      return NextResponse.json(
        { error: "CNIC is required" },
        { status: 400 }
      )
    }

    // Check if applicant exists
    const existing = await query<{ applicantid: number }>(
      `SELECT applicantid FROM DLApplicantInfoHdr WHERE cnic = @cnic`,
      { cnic }
    )

    let applicantid: number

    if (existing.length > 0) {
      // Update existing applicant
      applicantid = existing[0].applicantid
      
      await execute(
        `UPDATE DLApplicantInfoHdr SET
          firstname = @firstname,
          lastname = @lastname,
          fathername = @fathername,
          gender = @gender,
          dob = @dob,
          bloodgroup = @bloodgroup,
          nationality = @nationality,
          religion = @religion,
          maritalstatus = @maritalstatus,
          education = @education,
          occupation = @occupation,
          photo = @photo,
          utedittime = GETDATE(),
          utedituser = @userid
         WHERE applicantid = @applicantid`,
        {
          applicantid,
          firstname,
          lastname,
          fathername,
          gender,
          dob,
          bloodgroup,
          nationality,
          religion,
          maritalstatus,
          education,
          occupation,
          photo: photo ? Buffer.from(photo, "base64") : null,
          userid,
        }
      )

      // Update or insert contact
      const existingContact = await query<{ contactid: number }>(
        `SELECT contactid FROM DLApplicantContact WHERE applicantid = @applicantid`,
        { applicantid }
      )

      if (existingContact.length > 0) {
        await execute(
          `UPDATE DLApplicantContact SET
            address1 = @address1,
            address2 = @address2,
            cityid = @cityid,
            districtid = @districtid,
            postalcode = @postalcode,
            phone = @phone,
            mobile = @mobile,
            email = @email,
            utedittime = GETDATE(),
            utedituser = @userid
           WHERE applicantid = @applicantid`,
          { applicantid, address1, address2, cityid, districtid, postalcode, phone, mobile, email, userid }
        )
      } else {
        await execute(
          `INSERT INTO DLApplicantContact (applicantid, addresstype, address1, address2, cityid, districtid, postalcode, phone, mobile, email, utaddtime, utadduser, utblock)
           VALUES (@applicantid, 'Permanent', @address1, @address2, @cityid, @districtid, @postalcode, @phone, @mobile, @email, GETDATE(), @userid, 0)`,
          { applicantid, address1, address2, cityid, districtid, postalcode, phone, mobile, email, userid }
        )
      }
    } else {
      // Generate applicant number
      const countResult = await query<{ cnt: number }>(
        `SELECT COUNT(*) as cnt FROM DLApplicantInfoHdr`
      )
      const applicantno = `AP-${String((countResult[0]?.cnt || 0) + 1).padStart(6, "0")}`

      // Insert new applicant
      await execute(
        `INSERT INTO DLApplicantInfoHdr (applicantno, cnic, firstname, lastname, fathername, gender, dob, bloodgroup, nationality, religion, maritalstatus, education, occupation, photo, isactive, utaddtime, utadduser, utblock)
         VALUES (@applicantno, @cnic, @firstname, @lastname, @fathername, @gender, @dob, @bloodgroup, @nationality, @religion, @maritalstatus, @education, @occupation, @photo, 1, GETDATE(), @userid, 0)`,
        {
          applicantno,
          cnic,
          firstname,
          lastname,
          fathername,
          gender,
          dob,
          bloodgroup,
          nationality,
          religion,
          maritalstatus,
          education,
          occupation,
          photo: photo ? Buffer.from(photo, "base64") : null,
          userid,
        }
      )

      const newApplicant = await query<{ applicantid: number }>(
        `SELECT applicantid FROM DLApplicantInfoHdr WHERE cnic = @cnic`,
        { cnic }
      )
      applicantid = newApplicant[0].applicantid

      // Insert contact
      await execute(
        `INSERT INTO DLApplicantContact (applicantid, addresstype, address1, address2, cityid, districtid, postalcode, phone, mobile, email, utaddtime, utadduser, utblock)
         VALUES (@applicantid, 'Permanent', @address1, @address2, @cityid, @districtid, @postalcode, @phone, @mobile, @email, GETDATE(), @userid, 0)`,
        { applicantid, address1, address2, cityid, districtid, postalcode, phone, mobile, email, userid }
      )
    }

    return NextResponse.json({
      success: true,
      applicantid,
    })
  } catch (error) {
    console.error("[API] Save applicant error:", error)
    return NextResponse.json(
      { error: "Failed to save applicant" },
      { status: 500 }
    )
  }
}
