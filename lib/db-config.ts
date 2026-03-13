/**
 * Database Configuration for SQL Server
 * ──────────────────────────────────────
 * Two databases are used:
 *
 * 1. ESSUT_Nazimabad        – User Management (UT) database
 *    Tables: utusers, utuserrights, utuserapps, utuserclient, utuserent,
 *            utprofilehdr, utprofileroles, utscreenrights, utsessionhdr,
 *            utsessiondtl, utmodule, utapp, utscreen, utsite, utserver,
 *            utclient, utlov, utappentitydtl, utappsub, etc.
 *
 * 2. iXSEPolice_Nazimabad   – Production (DL) database
 *    Tables: DLToken, DLApplicanttype, DLApplicationfeedtl,
 *            DLApplicationfeehdr, DLTestGrouphdr, DLTestGroupdtl,
 *            DLTCSBooking, DLThatta, DLTokenchange, Template,
 *            TempNadra, ActivityLog, Ageingperiod, etc.
 *
 * Connection will be established later via environment variables.
 */

export const DB_CONFIG = {
  /** User-management / UT database */
  UT_DATABASE: "ESSUT",
  /** Production / DL operations database */
  PRODUCTION_DATABASE: "EPolice",
  /** Default schema */
  SCHEMA: "dbo",
} as const

/* ──────────────────────────────────────
   Table name constants (UT database)
   ────────────────────────────────────── */
export const UT_TABLES = {
  USERS: "utusers",
  USER_RIGHTS: "utuserrights",
  USER_APPS: "utuserapps",
  USER_CLIENT: "utuserclient",
  USER_ENTITY: "utuserent",
  PROFILE_HDR: "utprofilehdr",
  PROFILE_ROLES: "utprofileroles",
  SCREEN_RIGHTS: "utscreenrights",
  SESSION_HDR: "utsessionhdr",
  SESSION_DTL: "utsessiondtl",
  MODULE: "utmodule",
  APP: "utapp",
  APP_ENTITY_DTL: "utappentitydtl",
  APP_SUB: "utappsub",
  SCREEN: "utscreen",
  SITE: "utsite",
  SERVER: "utserver",
  CLIENT: "utclient",
  LOV: "utlov",
  ROLE: "utrole",
} as const

/* ──────────────────────────────────────
   Table name constants (Production database)
   ────────────────────────────────────── */
export const DL_TABLES = {
  TOKEN: "DLToken",
  TOKEN_CHANGE: "DLTokenchange",
  APPLICANT_TYPE: "DLApplicanttype",
  APPLICATION_FEE_HDR: "DLApplicationfeehdr",
  APPLICATION_FEE_DTL: "DLApplicationfeedtl",
  APPLICATION_FEE_BREAKUP: "DLApplicationfeebreakupdtl",
  APPLICATION_FEE_EXEMPTION: "DLApplicationfeeexemptiondtl",
  APPLICANT_QUES_SUB_DTL: "DLApplicantquessubdtl",
  TEST_GROUP_HDR: "DLTestGrouphdr",
  TEST_GROUP_DTL: "DLTestGroupdtl",
  TCS_BOOKING: "DLTCSBooking",
  THATTA: "DLThatta",
  TEMPLATE: "Template",
  TEMP_NADRA: "TempNadra",
  ACTIVITY_LOG: "ActivityLog",
  AGEING_PERIOD: "Ageingperiod",
} as const

/* ──────────────────────────────────────
   Column definitions for key tables
   (for future ORM / query builder use)
   ────────────────────────────────────── */

/** utusers columns */
export const UTUSERS_COLUMNS = {
  userid: "int",
  profileid: "int",
  username: "nvarchar(50)",
  password: "nvarchar(200)",
  fullname: "nvarchar(150)",
  emailid: "nvarchar(200)",
  empid: "int",
  userpic: "image",
  cellno: "nvarchar(25)",
  usertypeid: "int",
  userstatusid: "int",
  otp: "nvarchar(10)",
  otpexpiry: "datetime",
  imageid: "bigint",
  roleId: "int",
  userclientid: "int",
  usercatid: "int",
  firebaseid: "nvarchar(500)",
  utblock: "bit",
} as const

/** DLToken columns */
export const DLTOKEN_COLUMNS = {
  tokenid: "bigint",
  sessionid: "bigint",
  tokenno: "nvarchar(15)",
  entityid: "int",
  siteid: "int",
  busunitid: "int",
  tokendate: "datetime",
  tokentime: "datetime",
  licensetypeid: "int",
  apptypeid: "int",
  apptypecode: "varchar(10)",
  stxt: "nvarchar(150)",
  ltxt: "nvarchar(500)",
  tokenstatusid: "int",
  isfasttrack: "bit",
  pendingstatusid: "int",
  processid: "int",
  categorytypeid: "int",
  referenceno: "nvarchar(20)",
  referencetypeid: "int",
  appprocessid: "bigint",
  tokentypeid: "int",
  ismobile: "tinyint",
} as const

/* ──────────────────────────────────────
   Connection helper (placeholder)
   Will be implemented when database is connected
   ────────────────────────────────────── */
export function getConnectionConfig(database: "ut" | "production") {
  const dbName =
    database === "ut" ? DB_CONFIG.UT_DATABASE : DB_CONFIG.PRODUCTION_DATABASE

  return {
    server: process.env.MSSQL_SERVER || "localhost",
    port: Number(process.env.MSSQL_PORT) || 1433,
    database: dbName,
    user: process.env.MSSQL_USER || "",
    password: process.env.MSSQL_PASSWORD || "",
    options: {
      encrypt: true,
      trustServerCertificate: true,
    },
  }
}
