import { NextResponse } from "next/server"

export async function GET() {
  // Check which environment variables are set (don't expose values, just existence)
  const vars: Record<string, boolean> = {
    MSSQL_SERVER: !!process.env.MSSQL_SERVER,
    MSSQL_DATABASE: !!process.env.MSSQL_DATABASE,
    MSSQL_USER: !!process.env.MSSQL_USER,
    MSSQL_PASSWORD: !!process.env.MSSQL_PASSWORD,
    MSSQL_PORT: !!process.env.MSSQL_PORT,
    MSSQL_ENCRYPT: !!process.env.MSSQL_ENCRYPT,
    MSSQL_TRUST_CERT: !!process.env.MSSQL_TRUST_CERT,
  }

  return NextResponse.json({ vars })
}
