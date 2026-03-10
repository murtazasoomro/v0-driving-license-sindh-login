import { NextResponse } from "next/server"
import { getConnection, closeConnection } from "@/lib/db/mssql"

export async function GET() {
  try {
    const pool = await getConnection()
    
    // Test query - get server version
    const result = await pool.request().query("SELECT @@VERSION as version, GETDATE() as serverTime")
    
    return NextResponse.json({
      success: true,
      message: "Database connection successful",
      serverVersion: result.recordset[0]?.version?.substring(0, 50) + "...",
      serverTime: result.recordset[0]?.serverTime,
    })
  } catch (error) {
    console.error("Database connection error:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Database connection failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}

export async function POST() {
  try {
    await closeConnection()
    return NextResponse.json({ success: true, message: "Connection closed" })
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
