// API utility functions for frontend

const API_BASE = "/api"

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Generic fetch wrapper
async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    })
    
    const data = await res.json()
    
    if (!res.ok) {
      return { success: false, error: data.error || data.message || "Request failed" }
    }
    
    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    }
  }
}

// ===== Auth API =====
export interface LoginCredentials {
  username: string
  password: string
}

export interface LoginResponse {
  user: {
    userid: number
    loginid: string
    fullname: string
    email: string
    busunitid: number
    busunitname: string
    isactive: boolean
  }
  token?: string
}

export async function loginUser(credentials: LoginCredentials) {
  return fetchApi<LoginResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  })
}

// ===== Tokens API =====
export interface TokenData {
  tokenid?: number
  tokenno: string
  cnic: string
  licensetypeid: number
  licensetype?: string
  tokendate: string
  tokenstatus: string
  busunitid: number
  createdby?: number
}

export async function getTokens(params?: {
  busunitid?: number
  status?: string
  date?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.busunitid) searchParams.set("busunitid", String(params.busunitid))
  if (params?.status) searchParams.set("status", params.status)
  if (params?.date) searchParams.set("date", params.date)
  
  const query = searchParams.toString()
  return fetchApi<TokenData[]>(`/tokens${query ? `?${query}` : ""}`)
}

export async function createToken(token: Omit<TokenData, "tokenid">) {
  return fetchApi<TokenData>("/tokens", {
    method: "POST",
    body: JSON.stringify(token),
  })
}

export async function updateTokenStatus(tokenid: number, status: string) {
  return fetchApi<TokenData>("/tokens", {
    method: "PUT",
    body: JSON.stringify({ tokenid, tokenstatus: status }),
  })
}

// ===== Applicants API =====
export interface ApplicantData {
  applicantid?: number
  applicantno?: string
  cnic: string
  firstname: string
  fathername: string
  dateofbirth?: string
  gender?: string
  bloodgroup?: string
  photo?: string
  address?: string
  city?: string
  district?: string
  mobile?: string
  email?: string
  licensetypeid?: number
  apptypeid?: number
  busunitid?: number
}

export async function getApplicants(params?: {
  busunitid?: number
  cnic?: string
  search?: string
}) {
  const searchParams = new URLSearchParams()
  if (params?.busunitid) searchParams.set("busunitid", String(params.busunitid))
  if (params?.cnic) searchParams.set("cnic", params.cnic)
  if (params?.search) searchParams.set("search", params.search)
  
  const query = searchParams.toString()
  return fetchApi<ApplicantData[]>(`/applicants${query ? `?${query}` : ""}`)
}

export async function getApplicantByCnic(cnic: string) {
  return fetchApi<ApplicantData>(`/applicants?cnic=${encodeURIComponent(cnic)}`)
}

export async function createApplicant(applicant: Omit<ApplicantData, "applicantid" | "applicantno">) {
  return fetchApi<ApplicantData>("/applicants", {
    method: "POST",
    body: JSON.stringify(applicant),
  })
}

export async function updateApplicant(applicant: ApplicantData) {
  return fetchApi<ApplicantData>("/applicants", {
    method: "PUT",
    body: JSON.stringify(applicant),
  })
}

// ===== License Types API =====
export interface LicenseType {
  licensetypeid: number
  licensetypename: string
  licensetypeprefix: string
  validityperiod: number
  isactive: boolean
}

export interface LicenseCategory {
  categorydtlid: number
  licensetypeid: number
  categorycode: string
  categoryname: string
  description?: string
  isactive: boolean
}

export async function getLicenseTypes() {
  return fetchApi<LicenseType[]>("/license-types")
}

export async function getLicenseCategories(licensetypeid?: number) {
  const query = licensetypeid ? `?licensetypeid=${licensetypeid}` : ""
  return fetchApi<LicenseCategory[]>(`/license-types/categories${query}`)
}

// ===== Lookups API =====
export interface LookupItem {
  id: number
  code: string
  name: string
  description?: string
}

export async function getLookups(type: string) {
  return fetchApi<LookupItem[]>(`/lookups?type=${encodeURIComponent(type)}`)
}

// ===== Database Test =====
export async function testDatabaseConnection() {
  return fetchApi<{
    serverVersion: string
    serverTime: string
  }>("/db-test")
}
