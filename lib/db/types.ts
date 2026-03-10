// Database types matching SQL Server schema for Driving License System

// ==================== Audit Fields (common across all tables) ====================
export interface AuditFields {
  utdoctype?: number
  utsubdoctype?: number
  utsysgen?: boolean
  utblock?: boolean
  utispartial?: boolean
  utaddtime?: Date
  utadduser?: string
  utaddsystem?: string
  utaddip?: string
  utaddappversion?: string
  utadddbversion?: string
  utaddid?: number
  utaddsessionid?: number
  utedittime?: Date
  utedituser?: string
  uteditsystem?: string
  uteditip?: string
  uteditappversion?: string
  uteditdbversion?: string
  uteditid?: number
  uteditsessionid?: number
  utrecordversion?: number
}

// ==================== User & Authentication ====================
export interface User extends AuditFields {
  userid: number
  username: string
  password?: string
  firstname?: string
  lastname?: string
  email?: string
  phone?: string
  isactive?: boolean
  roleid?: number
  entityid?: number
  busunitid?: number
  siteid?: number
}

export interface UserSession extends AuditFields {
  sessionid: number
  userid: number
  logintime?: Date
  logouttime?: Date
  ipaddress?: string
  systemname?: string
  isactive?: boolean
}

// ==================== Organization Structure ====================
export interface Entity extends AuditFields {
  entityid: number
  entitycode?: string
  entitystxt?: string
  entityltxt?: string
}

export interface BusinessUnit extends AuditFields {
  busunitid: number
  entityid?: number
  busunitcode?: string
  busunitstxt?: string
  busunitltxt?: string
  address?: string
  cityid?: number
  phone?: string
}

export interface Site extends AuditFields {
  siteid: number
  busunitid?: number
  sitecode?: string
  sitestxt?: string
  siteltxt?: string
  address?: string
}

// ==================== Location ====================
export interface Country extends AuditFields {
  countryid: number
  countrycode?: string
  countrystxt?: string
  countryltxt?: string
}

export interface State extends AuditFields {
  stateid: number
  countryid?: number
  statecode?: string
  statestxt?: string
  stateltxt?: string
}

export interface City extends AuditFields {
  cityid: number
  stateid?: number
  citycode?: string
  citystxt?: string
  cityltxt?: string
}

export interface District extends AuditFields {
  districtid: number
  cityid?: number
  districtcode?: string
  districtstxt?: string
  districtltxt?: string
}

// ==================== Driving License - Core ====================
export interface DLLicenseType extends AuditFields {
  licensetypeid: number
  licensetypecode?: string
  licensetypestxt?: string
  licensetypeltxt?: string
  prefix?: string
  validityyears?: number
  validitymonths?: number
  islearner?: boolean
  ispermanent?: boolean
  isinternational?: boolean
}

export interface DLLicenseCategory extends AuditFields {
  licensecatid: number
  licensecatcode?: string
  licensecatstxt?: string
  licensecatltxt?: string
  vehicletype?: string
}

export interface DLLicenseTypeDtl extends AuditFields {
  licensetypedtlid: number
  licensetypeid?: number
  licensecatid?: number
  feeid?: number
}

export interface DLAppType extends AuditFields {
  apptypeid: number
  apptypecode?: string
  apptypestxt?: string
  apptypeltxt?: string
  isnew?: boolean
  isrenewal?: boolean
  isduplicate?: boolean
  isaddition?: boolean
}

export interface DLFeeType extends AuditFields {
  feetypeid: number
  feetypecode?: string
  feetypestxt?: string
  feetypeltxt?: string
  amount?: number
  isactive?: boolean
}

// ==================== Driving License - Applicant ====================
export interface DLApplicantInfoHdr extends AuditFields {
  applicantid: number
  applicantno?: string
  cnic?: string
  passportno?: string
  firstname?: string
  lastname?: string
  fathername?: string
  gender?: string
  dob?: Date
  bloodgroup?: string
  nationality?: string
  religion?: string
  maritalstatus?: string
  education?: string
  occupation?: string
  photo?: Buffer
  signature?: Buffer
  thumbprint?: Buffer
  isactive?: boolean
}

export interface DLApplicantContact extends AuditFields {
  contactid: number
  applicantid?: number
  addresstype?: string
  address1?: string
  address2?: string
  cityid?: number
  districtid?: number
  postalcode?: string
  phone?: string
  mobile?: string
  email?: string
}

export interface DLApplicantDocsDtl extends AuditFields {
  docid: number
  applicantid?: number
  doctype?: string
  docno?: string
  issuedate?: Date
  expirydate?: Date
  issuingauthority?: string
  docimage?: Buffer
  isverified?: boolean
}

// ==================== Driving License - Application ====================
export interface DLApplicationHdr extends AuditFields {
  applicationid: number
  applicationno?: string
  applicantid?: number
  licensetypeid?: number
  apptypeid?: number
  entityid?: number
  busunitid?: number
  siteid?: number
  applicationdate?: Date
  status?: string
  remarks?: string
}

export interface DLApplicationDtl extends AuditFields {
  applicationdtlid: number
  applicationid?: number
  licensecatid?: number
  isselected?: boolean
}

export interface DLApplicationFeeDtl extends AuditFields {
  feeid: number
  applicationid?: number
  feetypeid?: number
  amount?: number
  ispaid?: boolean
  paymentdate?: Date
  receiptno?: string
}

// ==================== Driving License - Token ====================
export interface DLToken extends AuditFields {
  tokenid: number
  tokenno?: string
  applicantid?: number
  applicationid?: number
  tokendate?: Date
  tokentime?: string
  tokentype?: number // 1=Normal, 2=Fast Track
  serviceprefix?: string // L=Learner, P=Permanent, I=International
  counterno?: number
  status?: string // Pending, Called, Serving, Completed, Skipped
  calledby?: number
  calledtime?: Date
  servedby?: number
  servedtime?: Date
  completedtime?: Date
}

// ==================== Driving License - Tests ====================
export interface DLMedicalTest extends AuditFields {
  medicaltestid: number
  applicationid?: number
  testdate?: Date
  eyesightleft?: string
  eyesightright?: string
  colorblind?: boolean
  hearingtest?: string
  physicaldefects?: string
  bloodpressure?: string
  doctorname?: string
  doctorremarks?: string
  result?: string // Pass, Fail, Refer
  testedby?: number
}

export interface DLAcademicTest extends AuditFields {
  academictestid: number
  applicationid?: number
  testdate?: Date
  totalmarks?: number
  obtainedmarks?: number
  percentage?: number
  result?: string // Pass, Fail
  remarks?: string
  testedby?: number
}

export interface DLPhysicalTest extends AuditFields {
  physicaltestid: number
  applicationid?: number
  testdate?: Date
  vehicletype?: string
  testresult?: string // Pass, Fail
  remarks?: string
  testedby?: number
}

// ==================== Driving License - Approval & License ====================
export interface DLApproval extends AuditFields {
  approvalid: number
  applicationid?: number
  approvaldate?: Date
  approvalstatus?: string // Approved, Rejected, On Hold, Refer Back
  approvedby?: number
  remarks?: string
}

export interface DLLicenseStatus extends AuditFields {
  transid: number
  transno?: string
  applicantid?: number
  applicationid?: number
  licenseno?: string
  cnic?: string
  issuedate?: Date
  expirydate?: Date
  licensetypeid?: number
  status?: string // Active, Expired, Cancelled, Suspended
  printdate?: Date
  printedby?: number
  dispatchdate?: Date
  dispatchedby?: number
  tcscnno?: string
}

// ==================== Driving License - Dispatch ====================
export interface DLDispatch extends AuditFields {
  dispatchid: number
  applicationid?: number
  licenseid?: number
  bookingdate?: Date
  cnno?: string
  envelopeno?: string
  dispatchstatus?: string // Booked, Printed, Dispatched, Delivered, Returned
  dispatchdate?: Date
  deliverydate?: Date
  receivedby?: string
  remarks?: string
}

// ==================== Payment ====================
export interface DLPaymentChallan extends AuditFields {
  challanid: number
  challanno?: string
  applicationid?: number
  applicantid?: number
  challandate?: Date
  totalamount?: number
  paidamount?: number
  status?: string // Pending, Paid, Cancelled
  nbpbranchcode?: string
  receiptno?: string
  paymentdate?: Date
  remarks?: string
}

// ==================== Activity & Workflow ====================
export interface DLActivityHdr extends AuditFields {
  activityid: number
  applicationid?: number
  activitytype?: string
  activitydate?: Date
  activityby?: number
  status?: string
  remarks?: string
}

// ==================== List of Values ====================
export interface LOV extends AuditFields {
  lovid: number
  lovtype?: string
  lovcode?: string
  lovstxt?: string
  lovltxt?: string
  parentid?: number
  seqno?: number
  isactive?: boolean
}
