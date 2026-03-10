import sql from "mssql"

// SQL Server connection configuration
const config: sql.config = {
  user: process.env.MSSQL_USER || "sa",
  password: process.env.MSSQL_PASSWORD || "",
  server: process.env.MSSQL_SERVER || "localhost",
  port: parseInt(process.env.MSSQL_PORT || "1433"),
  database: process.env.MSSQL_DATABASE || "EPolice",
  options: {
    encrypt: process.env.MSSQL_ENCRYPT === "true",
    trustServerCertificate: process.env.MSSQL_TRUST_CERT !== "false",
    enableArithAbort: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
}

// Connection pool singleton
let pool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (pool) {
    return pool
  }
  
  try {
    pool = await sql.connect(config)
    console.log("[DB] Connected to SQL Server")
    return pool
  } catch (error) {
    console.error("[DB] Connection failed:", error)
    throw error
  }
}

export async function closeConnection(): Promise<void> {
  if (pool) {
    await pool.close()
    pool = null
    console.log("[DB] Connection closed")
  }
}

// Helper to execute queries
export async function query<T>(
  queryText: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const conn = await getConnection()
  const request = conn.request()
  
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }
  
  const result = await request.query(queryText)
  return result.recordset as T[]
}

// Helper to execute stored procedures
export async function executeProc<T>(
  procName: string,
  params?: Record<string, unknown>
): Promise<T[]> {
  const conn = await getConnection()
  const request = conn.request()
  
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }
  
  const result = await request.execute(procName)
  return result.recordset as T[]
}

// Helper to execute a single insert/update and return the affected rows or identity
export async function execute(
  queryText: string,
  params?: Record<string, unknown>
): Promise<number> {
  const conn = await getConnection()
  const request = conn.request()
  
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      request.input(key, value)
    }
  }
  
  const result = await request.query(queryText)
  return result.rowsAffected[0] || 0
}

// Transaction helper
export async function withTransaction<T>(
  fn: (transaction: sql.Transaction) => Promise<T>
): Promise<T> {
  const conn = await getConnection()
  const transaction = new sql.Transaction(conn)
  
  try {
    await transaction.begin()
    const result = await fn(transaction)
    await transaction.commit()
    return result
  } catch (error) {
    await transaction.rollback()
    throw error
  }
}

export { sql }
