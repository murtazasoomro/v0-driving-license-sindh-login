import { NextRequest, NextResponse } from "next/server"
import { query } from "@/lib/db/mssql"
import type { User } from "@/lib/db/types"

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      )
    }

    // Query user from database
    const users = await query<User>(
      `SELECT userid, username, firstname, lastname, email, roleid, entityid, busunitid, siteid, isactive
       FROM utuser 
       WHERE username = @username AND password = @password AND ISNULL(utblock, 0) = 0`,
      { username, password }
    )

    if (users.length === 0) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      )
    }

    const user = users[0]

    if (!user.isactive) {
      return NextResponse.json(
        { error: "User account is inactive" },
        { status: 403 }
      )
    }

    // Get business unit name for branch display
    let branchName = "Sindh Police - DL Branch"
    if (user.busunitid) {
      const units = await query<{ busunitstxt: string }>(
        `SELECT busunitstxt FROM BusinessUnit WHERE busunitid = @busunitid`,
        { busunitid: user.busunitid }
      )
      if (units.length > 0) {
        branchName = units[0].busunitstxt || branchName
      }
    }

    return NextResponse.json({
      success: true,
      user: {
        userid: user.userid,
        username: user.username,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        roleid: user.roleid,
        entityid: user.entityid,
        busunitid: user.busunitid,
        siteid: user.siteid,
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
