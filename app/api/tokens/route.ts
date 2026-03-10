import { NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db/mssql"
import type { DLToken } from "@/lib/db/types"

// GET - Fetch tokens
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const date = searchParams.get("date") || new Date().toISOString().split("T")[0]
    const busunitid = searchParams.get("busunitid")

    let whereClause = "WHERE CONVERT(date, tokendate) = @date"
    const params: Record<string, unknown> = { date }

    if (status) {
      whereClause += " AND status = @status"
      params.status = status
    }

    if (busunitid) {
      whereClause += " AND busunitid = @busunitid"
      params.busunitid = parseInt(busunitid)
    }

    const tokens = await query<DLToken>(
      `SELECT t.*, a.cnic, a.firstname, a.lastname, a.fathername
       FROM DLToken t
       LEFT JOIN DLApplicantInfoHdr a ON t.applicantid = a.applicantid
       ${whereClause}
       ORDER BY t.tokenno ASC`,
      params
    )

    return NextResponse.json({ tokens })
  } catch (error) {
    console.error("[API] Get tokens error:", error)
    return NextResponse.json(
      { error: "Failed to fetch tokens" },
      { status: 500 }
    )
  }
}

// POST - Create new token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      cnic,
      serviceprefix,
      tokentype,
      busunitid,
      siteid,
      userid,
    } = body

    if (!cnic) {
      return NextResponse.json(
        { error: "CNIC is required" },
        { status: 400 }
      )
    }

    // Check if applicant exists, if not create one
    let applicants = await query<{ applicantid: number }>(
      `SELECT applicantid FROM DLApplicantInfoHdr WHERE cnic = @cnic`,
      { cnic }
    )

    let applicantid: number
    if (applicants.length === 0) {
      // Create new applicant
      await execute(
        `INSERT INTO DLApplicantInfoHdr (cnic, utaddtime, utadduser, utblock)
         VALUES (@cnic, GETDATE(), @userid, 0)`,
        { cnic, userid }
      )
      applicants = await query<{ applicantid: number }>(
        `SELECT applicantid FROM DLApplicantInfoHdr WHERE cnic = @cnic`,
        { cnic }
      )
      applicantid = applicants[0].applicantid
    } else {
      applicantid = applicants[0].applicantid
    }

    // Generate token number for today
    const today = new Date().toISOString().split("T")[0]
    const prefix = serviceprefix || "L"
    const typeNum = tokentype || 1

    const countResult = await query<{ cnt: number }>(
      `SELECT COUNT(*) as cnt FROM DLToken 
       WHERE CONVERT(date, tokendate) = @today 
       AND serviceprefix = @prefix 
       AND busunitid = @busunitid`,
      { today, prefix, busunitid }
    )

    const nextNum = (countResult[0]?.cnt || 0) + 1
    const tokenno = `${prefix}-${String(nextNum).padStart(3, "0")}`

    // Insert token
    await execute(
      `INSERT INTO DLToken (tokenno, applicantid, tokendate, tokentime, tokentype, serviceprefix, status, busunitid, siteid, utaddtime, utadduser, utblock)
       VALUES (@tokenno, @applicantid, GETDATE(), CONVERT(varchar, GETDATE(), 108), @tokentype, @serviceprefix, 'Pending', @busunitid, @siteid, GETDATE(), @userid, 0)`,
      {
        tokenno,
        applicantid,
        tokentype: typeNum,
        serviceprefix: prefix,
        busunitid,
        siteid,
        userid,
      }
    )

    // Fetch the created token
    const tokens = await query<DLToken>(
      `SELECT TOP 1 t.*, a.cnic, a.firstname, a.lastname
       FROM DLToken t
       LEFT JOIN DLApplicantInfoHdr a ON t.applicantid = a.applicantid
       WHERE t.tokenno = @tokenno AND CONVERT(date, t.tokendate) = @today AND t.busunitid = @busunitid
       ORDER BY t.tokenid DESC`,
      { tokenno, today, busunitid }
    )

    return NextResponse.json({
      success: true,
      token: tokens[0],
    })
  } catch (error) {
    console.error("[API] Create token error:", error)
    return NextResponse.json(
      { error: "Failed to create token" },
      { status: 500 }
    )
  }
}

// PATCH - Update token status
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { tokenid, status, userid } = body

    if (!tokenid || !status) {
      return NextResponse.json(
        { error: "Token ID and status are required" },
        { status: 400 }
      )
    }

    let updateFields = "status = @status, utedittime = GETDATE(), utedituser = @userid"
    const params: Record<string, unknown> = { tokenid, status, userid }

    if (status === "Called") {
      updateFields += ", calledby = @userid, calledtime = GETDATE()"
    } else if (status === "Serving") {
      updateFields += ", servedby = @userid, servedtime = GETDATE()"
    } else if (status === "Completed") {
      updateFields += ", completedtime = GETDATE()"
    }

    await execute(
      `UPDATE DLToken SET ${updateFields} WHERE tokenid = @tokenid`,
      params
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Update token error:", error)
    return NextResponse.json(
      { error: "Failed to update token" },
      { status: 500 }
    )
  }
}
