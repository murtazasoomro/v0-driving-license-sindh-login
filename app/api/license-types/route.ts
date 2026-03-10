import { NextRequest, NextResponse } from "next/server"
import { query, execute } from "@/lib/db/mssql"
import type { DLLicenseType, DLLicenseCategory, DLLicenseTypeDtl } from "@/lib/db/types"

// GET - Fetch license types or categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get("type") // "types" or "categories"
    const licensetypeid = searchParams.get("licensetypeid")

    if (type === "categories") {
      const categories = await query<DLLicenseCategory>(
        `SELECT * FROM DLLicenseCategory WHERE ISNULL(utblock, 0) = 0 ORDER BY licensecatcode`
      )
      return NextResponse.json({ categories })
    }

    if (licensetypeid) {
      // Get categories for a specific license type
      const details = await query<DLLicenseTypeDtl & DLLicenseCategory>(
        `SELECT d.*, c.licensecatcode, c.licensecatstxt, c.licensecatltxt, c.vehicletype
         FROM DLLicenseTypeDtl d
         JOIN DLLicenseCategory c ON d.licensecatid = c.licensecatid
         WHERE d.licensetypeid = @licensetypeid AND ISNULL(d.utblock, 0) = 0`,
        { licensetypeid: parseInt(licensetypeid) }
      )
      return NextResponse.json({ categories: details })
    }

    // Get all license types
    const types = await query<DLLicenseType>(
      `SELECT * FROM DLLicenseType WHERE ISNULL(utblock, 0) = 0 ORDER BY licensetypecode`
    )
    return NextResponse.json({ types })
  } catch (error) {
    console.error("[API] Get license types error:", error)
    return NextResponse.json(
      { error: "Failed to fetch license types" },
      { status: 500 }
    )
  }
}

// POST - Create license type
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      licensetypecode,
      licensetypestxt,
      licensetypeltxt,
      prefix,
      validityyears,
      validitymonths,
      islearner,
      ispermanent,
      isinternational,
      userid,
    } = body

    await execute(
      `INSERT INTO DLLicenseType (licensetypecode, licensetypestxt, licensetypeltxt, prefix, validityyears, validitymonths, islearner, ispermanent, isinternational, utaddtime, utadduser, utblock)
       VALUES (@licensetypecode, @licensetypestxt, @licensetypeltxt, @prefix, @validityyears, @validitymonths, @islearner, @ispermanent, @isinternational, GETDATE(), @userid, 0)`,
      {
        licensetypecode,
        licensetypestxt,
        licensetypeltxt,
        prefix,
        validityyears,
        validitymonths,
        islearner: islearner ? 1 : 0,
        ispermanent: ispermanent ? 1 : 0,
        isinternational: isinternational ? 1 : 0,
        userid,
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Create license type error:", error)
    return NextResponse.json(
      { error: "Failed to create license type" },
      { status: 500 }
    )
  }
}

// PATCH - Update license type
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      licensetypeid,
      licensetypecode,
      licensetypestxt,
      licensetypeltxt,
      prefix,
      validityyears,
      validitymonths,
      islearner,
      ispermanent,
      isinternational,
      userid,
    } = body

    await execute(
      `UPDATE DLLicenseType SET
        licensetypecode = @licensetypecode,
        licensetypestxt = @licensetypestxt,
        licensetypeltxt = @licensetypeltxt,
        prefix = @prefix,
        validityyears = @validityyears,
        validitymonths = @validitymonths,
        islearner = @islearner,
        ispermanent = @ispermanent,
        isinternational = @isinternational,
        utedittime = GETDATE(),
        utedituser = @userid
       WHERE licensetypeid = @licensetypeid`,
      {
        licensetypeid,
        licensetypecode,
        licensetypestxt,
        licensetypeltxt,
        prefix,
        validityyears,
        validitymonths,
        islearner: islearner ? 1 : 0,
        ispermanent: ispermanent ? 1 : 0,
        isinternational: isinternational ? 1 : 0,
        userid,
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Update license type error:", error)
    return NextResponse.json(
      { error: "Failed to update license type" },
      { status: 500 }
    )
  }
}

// DELETE - Soft delete license type
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const licensetypeid = searchParams.get("licensetypeid")

    if (!licensetypeid) {
      return NextResponse.json(
        { error: "License type ID is required" },
        { status: 400 }
      )
    }

    await execute(
      `UPDATE DLLicenseType SET utblock = 1 WHERE licensetypeid = @licensetypeid`,
      { licensetypeid: parseInt(licensetypeid) }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[API] Delete license type error:", error)
    return NextResponse.json(
      { error: "Failed to delete license type" },
      { status: 500 }
    )
  }
}
