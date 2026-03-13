// import { NextRequest, NextResponse } from "next/server"
// import { query } from "@/lib/db/mssql"
// import type { User } from "@/lib/db/types"

// export async function POST(request: NextRequest) {
//   try {
//     const { username, password } = await request.json()

//     if (!username || !password) {
//       return NextResponse.json(
//         { error: "Username and password are required" },
//         { status: 400 }
//       )
//     }

//     // Query user from database
//     const users = await query<User>(
//       `SELECT userid, username, firstname, lastname, email, roleid, entityid, busunitid, siteid, isactive
//        FROM utusers 
//        WHERE username = @username AND password = @password AND ISNULL(utblock, 0) = 0`,
//       { username, password }
//     )

//     if (users.length === 0) {
//       return NextResponse.json(
//         { error: "Invalid username or password" },
//         { status: 401 }
//       )
//     }

//     const user = users[0]

//     if (!user.isactive) {
//       return NextResponse.json(
//         { error: "User account is inactive" },
//         { status: 403 }
//       )
//     }

//     // Get business unit name for branch display
//     let branchName = "Sindh Police - DL Branch"
//     if (user.busunitid) {
//       const units = await query<{ busunitstxt: string }>(
//         `SELECT busunitstxt FROM BusinessUnit WHERE busunitid = @busunitid`,
//         { busunitid: user.busunitid }
//       )
//       if (units.length > 0) {
//         branchName = units[0].busunitstxt || branchName
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       user: {
//         userid: user.userid,
//         username: user.username,
//         firstname: user.firstname,
//         lastname: user.lastname,
//         email: user.email,
//         roleid: user.roleid,
//         entityid: user.entityid,
//         busunitid: user.busunitid,
//         siteid: user.siteid,
//         branchName,
//       },
//     })
//   } catch (error) {
//     console.error("[API] Login error:", error)
//     return NextResponse.json(
//       { error: "Database connection failed. Please check server configuration." },
//       { status: 500 }
//     )
//   }
// }


import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"
import { query } from "@/lib/db/mssql"

type LoginUserRow = {
  userid: number
  username: string
  fullname: string | null
  emailid: string | null
  empid: string | null
  roleid?: number | null
  entityid?: number | null
  busunitid?: number | null
  siteid?: number | null
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    const normalizedUsername = String(username || "").trim()
    const plainPassword = String(password || "").trim()

    if (!normalizedUsername || !plainPassword) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    const md5PasswordHash = crypto
      .createHash("md5")
      .update(plainPassword)
      .digest("hex")

    const users = await query<LoginUserRow>(
      `
        SELECT TOP 1
          userid,
          username,
          fullname,
          emailid,
          empid,
          roleid,
          entityid,
          busunitid,
          siteid
        FROM dbo.utusers
        WHERE username = @username
          AND password = @password
          AND ISNULL(utblock, 0) = 0
      `,
      {
        username: normalizedUsername,
        password: md5PasswordHash,
      }
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      )
    }

    const user = users[0]

    let branchName = "Sindh Police - DL Branch"

    if (user.busunitid) {
      try {
        const units = await query<{ busunitstxt: string | null }>(
          `
            SELECT TOP 1 busunitstxt
            FROM dbo.BusinessUnit
            WHERE busunitid = @busunitid
          `,
          { busunitid: user.busunitid }
        )

        if (units.length > 0 && units[0].busunitstxt) {
          branchName = units[0].busunitstxt
        }
      } catch (branchError) {
        console.warn("[API] Branch lookup failed:", branchError)
      }
    }

    const [firstName = "", ...remainingNameParts] = (user.fullname || "").trim().split(/\s+/)
    const lastName = remainingNameParts.join(" ")

    return NextResponse.json({
      success: true,
      user: {
        userid: user.userid,
        username: user.username,
        fullname: user.fullname,
        firstname: firstName,
        lastname: lastName,
        email: user.emailid,
        empid: user.empid,
        roleid: user.roleid ?? null,
        entityid: user.entityid ?? null,
        busunitid: user.busunitid ?? null,
        siteid: user.siteid ?? null,
        branchName,
      },
    })
  } catch (error) {
    console.error("[API] Login error:", error)

    return NextResponse.json(
      { error: "Database connection failed. Please check server configuration." },
      { status: 500 }
    )
  }
}

