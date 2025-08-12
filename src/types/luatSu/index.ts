import { CommonParams } from "../common";

export interface LawyerParams extends CommonParams {
  fullName?: string; // Họ tên
  organizationId?: number; // id tổ chức
  listIsDomestic?: number[]; // Trong nước hay ngoài nước
  listStatus?: number[]; // Trạng thái
  provinceId?: number; // Tỉnh thành
  orgName?: string; // Tên tổ chức
  parentId?: number; // id tổ chức cha
}

export interface LawyerParamsPrivate extends CommonParams {
  fullName?: string;
  organizationId?: string;
  assocId?: string;
  listGender?: number[];
  phone?: string;
  email?: string;
  licenseNumber?: string;
  isDomestic: number;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  listStatus?: number[];
  provinceId?: string;
}

export interface LawyerOrgParamsPrivate extends CommonParams {
  orgName?: string;
  address?: string;
  phone?: string;
  email?: string;
  isDomestic: number;
  registrationDateFrom?: string;
  registrationDateTo?: string;
  listStatus?: number[];
  provinceId?: string;
  parentId?: string;
}

export interface LicenseSearchParams extends CommonParams {
  ownerId?: number;
  ownerType?: number;
  licenseType?: number;
}

export interface LawyerItem {
  fullName: string;
  organizationId?: number;
  organizationName: string;
  gender: number;
  phone?: string;
  email?: string;
  licenseCCHNNumber?: string;
  isDomestic: number;
  registrationDate: string;
  status: number;
  licenseLSNumber: string;
  dateOfBirth?: string;
  address?: string;
  id: number;
  activityStatus: number;
  practiceForm?: number;
  nationalityName?: string;
  nationalName?: string;
  issueDate?: string;
}

export interface LawyerOrgItem {
  orgName: string;
  address: string;
  lawyerLegalRepresentativeName: string;
  businessLicenseNumber?: string;
  registrationLicenseNumber?: string;
  phone?: string;
  email?: string;
  isDomestic: number;
  status: number;
  lawyerNumber: number;
  id: number;
  businessLicenseIssueDate?: string;
  registrationLicenseIssueDate?: string;
  nationalName?: string;
  provinceName: string;
}

export interface LawyerItemPrivate {
  id: number;
  assocName: string;
  fullName: string;
  dateOfBirth: string;
  phone?: string;
  organizationName: string;
  licenseCCHNNumber: string;
  licenseLSNumber: string;
  activeStatus: number;
  genDate: string;
  nationalName?: string;
  typeWork?: number;
  dateIssueGPHN?: string;
}

export interface FullLawyerItem extends LawyerItem {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  lawyerId: number;
  identityCardNumber?: string;
  lawyerAssociationId?: number;
  provinceId: number;
  nationalityId?: string;
  lsCardLicenses?: LsCardLicenses[];
  lawyerAssociation?: LawyerAssociation;
  organization?: LawyerDetailOrg;
  listLawyerUpdateInfoHis?: CardInfoHistory[];
  certificateNumber?: string;
  decisionNumber?: string;
  issueDate?: string;
  revokeDecisionNumber?: string;
  revokeDate?: string;
  orgName?: string;
  yearReport?: string;
  provinceName?: string;
  assocName?: string;
  orgList?: OrgDetailItem[];
  note?: string;
  wardId?: number;
  wardName?: string;
}

export interface OrgDetailItem {
  id: number;
  idLawyer: number;
  idOrg: number;
  orgName: string;
}

export interface FullLawyerOrgItem {
  createBy?: string;
  updateBy?: string;
  genDate: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  orgId: number;
  orgName: string;
  orgType: number;
  address: string;
  lawyerLegalRepresentativeId: number;
  phone: string;
  email?: string;
  isDomestic: number;
  businessLicenseNumber: string;
  businessLicenseIssueDate: string;
  registrationLicenseNumber: string;
  registrationLicenseIssueDate: string;
  status: number;
  lawyerAssociationId: number;
  provinceId: number;
  provinceName?: string;
  wardId?: number;
  wardName?: string;
  parentOrgId: number;
  lawyerLegalRepresentative: Omit<
    FullLawyerItem,
    "lawyerAssociation | organization | listLawyerUpdateInfoHis"
  >;
  lawyerAssociation: LawyerAssociation;
  nationalName?: string;
  note?: string;
  lawyerLegalRep?: {
    id: number;
    fullName: string;
    dob: string;
    cerNumber: string;
    licNumber: string;
  }; // Người đại diện phát luật khi xem chi tiết tổ chức
  getListRegisOrgChange: OrgChangeItem[];
  branchOrgList: LawyerOrgBranchDetail[];
  nationalityId?: number;
}

export interface OrgChangeItem {
  id: number;
  vbChange: string;
  dateChange: string;
  contentChange: string;
  isDomestic: number;
  owwnerId: number;
  ownerType: number;
  typeChange?: number;
}

export interface OrgChangItemSubmit {
  idLic: number;
  licenseNumber?: string;
  vbChange: string;
  issueDate: string;
  changeContent: string;
  isDomestic: number;
  ownerId: number;
  ownerType: number;
  typeOrgChange?: number;
}

export interface OrgLawyerItem {
  id: number;
  fullName: string;
  dob: string;
  licNumber: string;
  typeWork: number;
  status: number;
  cchnnumber: string;
  gphnnumber: string;
}

export interface LawyerCCHNLicense {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  licenseId: number;
  ownerId: number;
  ownerType: number;
  licenseType: number;
  licenseNumber: string;
  decisionNumber: string;
  issueDate: string;
  revocationDate?: string;
  practiceForm?: string;
  practicePlace?: string;
  status: number;
}

export interface LsCardLicenses {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  licenseId: number;
  ownerId: number;
  ownerType: number;
  licenseType: number;
  licenseNumber: string;
  decisionNumber?: string;
  issueDate: string;
  revocationDate?: string;
  practiceForm?: string;
  practicePlace?: string;
  status: number;
  countChange?: number;
}

export interface LawyerAssociation {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  assocId: number;
  assocName: string;
  address: string;
  phone: string;
  email: string;
  establishedDate: string;
  status: number;
}

export interface LawyerDetailOrg {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  orgId: number;
  orgName: string;
  orgType: number;
  address: string;
  lawyerLegalRepresentativeId: number;
  phone: string;
  email: string;
  isDomestic: number;
  status: number;
  lawyerAssociationId: number;
  provinceId: number;
  parentOrgId: number;
}

export interface CardInfoHistory {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: string;
  createById?: string;
  id: number;
  lawyerId: number;
  title: string;
  licenseType: number;
  licenseNumber: string;
  decisionNumber: string;
  issueDate: string;
  status: string;
  practiceForm?: number;
  practicePlace?: string;
}

export interface LawyerDashboard {
  dataMap: {
    name: string;
    value: string;
  }[];
}

export interface LawyerCardParams {
  idLaw: number;
  isDomestic: number;
}

export interface OrgLawyerParams extends CommonParams {
  organizationId?: number;
  isDominic?: number;
}

export interface LicenseDocument {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  licenseId?: number;
  ownerId?: number;
  ownerType?: number;
  licenseType?: number;
  licenseNumber?: string;
  decisionNumber?: string;
  issueDate?: string;
  revocationDate?: string;
  practiceForm?: number;
  practicePlace?: string;
  status?: number;
  approvalDocument?: string;
  changeContent?: string;
  countChange?: string;
}

export interface LawyerOrgBranchDetail {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  orgBranchId: number;
  orgId: number;
  orgName?: string;
  address?: string;
  lawyerLegalRepresentativeId?: number;
  phone?: string;
  businessLicenseNumber?: string;
  businessLicenseIssueDate?: string;
}

export interface LawyerReportParams extends CommonParams {
  isOrg?: number;
  provinceIds?: string[];
  isDomestics?: number[];
}

export interface LawyerAreaReportItem {
  provinceId?: number;
  provinceName: string;
  totalIn: number;
  totalOut: number;
}

export interface LawyerOrgReportItem {
  provinceId?: number;
  provinceName: string;
  totalActive: number;
  totalInActive: number;
  totalRevoke1: number;
  totalRevoke2: number;
  totalDisable: number;
}

export interface LawyerActivityReportItem {
  provinceId?: number;
  provinceName: string;
  totalActive: number;
  totalRevoke: number;
  totalCard: number;
  totalNotCard: number;
}

export interface LawyerCCHNReportItem {
  idLaw?: number;
  fullName?: string;
  dateOfBirth?: string;
  gender?: number;
  address?: string;
  provinceId?: number;
  certificateNumber?: string;
  decisionNumber?: string;
  issueDate?: string;
  status?: number;
}
