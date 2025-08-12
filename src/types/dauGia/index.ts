import { CommonParams } from "../common";

export interface AuctionOrgParams extends CommonParams {
  name?: string; // Tên tổ chức
  cityId?: number; // id Sở Tư pháp
  status?: number; // Trạng thái
  orgType?: string; // Loại tổ chức
}

export interface AuctionOrgParamsPrivate {
  "organization-id"?: string;
  "department-code"?: string;
  type?: string;
  status?: string;
  text?: string;
  page: number;
  size: number;
  types?: string[];
}

export interface AuctioneerParams extends CommonParams {
  fullname?: string;
  province?: number;
  cerCode?: string;
  sex?: number;
  publishStatus?: number;
  actType?: number;
  other?: number;
  cerStatus?: number;
  orgType?: number | string;
  orgId?: number;
  cardStatus?: number;
}

export interface AuctioneerParamsPrivate {
  fullname?: string;
  province?: number;
  cerCode?: string;
  sex?: number;
  publishStatus?: number;
  actType?: number;
  other?: number;
  cerStatus?: number;
  orgType?: number | string;
  "auction-info"?: string;
  "org-info"?: string;
  "department-id"?: string;
  "card-status"?: string;
  "cert-status"?: string;
  "org-id"?: string;
  page: number;
  size: number;
}

export interface AuctionOrgItem {
  address: string;
  auctioneerName: string;
  cityId: number;
  districtId: number;
  effDate: string;
  fullname: string;
  id: number;
  orgRoot: number;
  orgType: number;
  quantityAuctioneer: number;
  status: number;
  province: string;
}

export interface AuctionOrgItemPrivate {
  uuid: string;
  departmentCode: string;
  departmentName: string;
  fullName: string;
  managerUuid: string;
  managerName: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  address: string;
  status: string;
  auctioneerCount: number;
}

export interface AuctioneerItem {
  id: number;
  fullname: string;
  addFull: string;
  cerCode: string;
  cardCode?: string;
  dob: string;
  orgID?: number;
  status?: number;
  cerStatus?: number;
  orgName: string;
  deptName: string;
  deptAddress: string;
  cardStatus?: number;
}

export interface AuctionDashboardResponse {
  tk_dgts_to_chuc: number;
  tk_dgts_to_chuc_growth: string;
  tk_dgts_dgv: number;
  tk_dgts_dgv_growth: string;
  tk_dgts_tb_lua_chon: number;
  tk_dgts_tb_lua_chon_growth: string;
  tk_dgts_tb_dau_gia: string;
  tk_dgts_tb_dau_gia_growth: string;
  tk_dgts_top_cities: {
    total_count: number;
    province_name: string;
  }[];
  dataMap: any;
  tk_pie_dgts_th_theo_loai_tc_hndg: {
    name: string;
    value: string[];
  }[];
  tk_pie_dgts_th_theo_cap_cchn_dg: {
    name: string;
    value: string[];
  }[];
}

export interface AuctionOrgDetailResponse {
  organization: {
    id: number;
    orgType: number;
    orgRoot: number;
    fullname: string;
    licenseNo: string;
    licenseDate: string;
    email: string;
    foneNumber: string;
    address: string;
    genDate: string;
    status: number;
    complexStatus: number;
    districtId: number;
    cityId: number;
    effDate: string;
    isPublish: number;
  };
  manager: {
    id: number;
    auctioneerType: number;
    genDate: string;
    lastUpdated: string;
    fullname: string;
    dob: string;
    addPermanent: string;
    cerCode: string;
    cerDOI: string;
    isPublish: number;
    districtId: number;
    cityId: number;
    cerStatus: number;
    cardStatus: number;
    scanType: number;
    userUpdate: string;
    cardCode: string;
    cardDOI: string;
    sex: number;
    idCode?: string;
    idDOI?: string;
    idPOI?: string;
  };
  auctioneers: DGVMemberItem[];
  listOrganizationHises: AuctionOrgListOrganizationHistory[];
  ltsMemberParters: AuctionOrgListMemberPartners[];
  toChucDuocSN: AuctionOrgRootOrganization;
}

export interface AuctionOrgRootOrganization {
  address: string;
  cityId: number;
  complexStatus: number;
  districtId: number;
  effDate: number;
  faxNumber: string;
  foneNumber: string;
  fullname: string;
  genDate: number;
  id: number;
  isPublish: number;
  licenseDate: number;
  licenseNo: string;
  orgRoot: number;
  orgType: number;
  status: number;
}

export interface AuctionOrgListMemberPartners {
  auctioneerId: number;
  cerCode: string;
  cerDOI: number;
  dob: string;
  fullname: string;
  id: number;
  orgId: number;
}

export interface AuctionOrgListOrganizationHistory {
  actType: number;
  address: string;
  cityId: number;
  districtId: number;
  effDate: number;
  email: string;
  foneNumber: string;
  fullname: string;
  genDate: number;
  id: number;
  licenseDate: number;
  licenseNo: string;
  orgId: number;
  orgRoot: number;
  orgType: number;
  scanOrg: number;
  status: number;
  userCreate: number;
  userUpdated: number;
}

export interface DGVMemberItem {
  id: number;
  auctioneerType: number;
  genDate: string;
  lastUpdated: string;
  idCode: string;
  idType: string;
  fullname: string;
  dob: string;
  sex: number;
  addPermanent: string;
  addCurrent: string;
  telNumber: string;
  email: string;
  cerCode: string;
  cardCode: string;
  otherInfo: string;
  idDOI: string;
  idPOI: string;
  cerDOI: string;
  cardPOI: string;
  cardDOI: string;
  auctioneerStatus: string;
  isPublish: number;
  districtId: number;
  cityId: number;
  cerStatus: number;
  cardStatus: number;
  warning: string;
  scanType: string;
  orgId: number;
  userUpdate: string;
  isPIC: string;
}

export interface AuctionDGVResponse {
  listFullCardDGV: FullCardDGVItem[];
  listFullCCHN: FullCCHNItem[];
  detail: {
    id: number;
    auctioneerType: number;
    genDate: string;
    lastUpdated: string;
    idCode: string;
    idType: string;
    fullname: string;
    dob: string;
    sex: number;
    telNumber: string;
    email: string;
    cerCode: string;
    cerDoi: string;
    cardPoi: string;
    cardDoi: string;
    cardCode: string;
    addrFull: string;
    idDOI: number;
    idPOI: string;
  };
}

export interface FullCardDGVItem {
  id: number;
  auctioneerID: number;
  auctioneerType: number;
  orgID: number;
  cerCode: string;
  cardCode: string;
  actType: number;
  actTypeStr: string;
  numberOfDecision: string;
  dateOfDecision: string;
  effectiveDate: string;
  orgName: string;
}

export interface FullCCHNItem {
  id: number;
  auctioneerID: number;
  auctioneerType: number;
  cerCode: string;
  actType: number;
  actTypeStr: string;
  numberOfDecision: string;
  dateOfDecision: string;
  effectiveDate: string;
}

export interface DGVProcessItem {
  orgID: number;
  orgName: string;
  numberOfDecision: string;
  dateOfDecision: string;
  effectiveDate: string;
  actType: number;
  strActType: string;
}

export interface PublicAuctionAssetParam {
  cityId?: number;
  yearReport: string;
  monthReport: string;
}

export interface PublicAuctionAssetResponse {
  publishDate: string;
  publishDateStr: string;
  countPerDay1: number;
  countPerDay2: number;
}

export interface AuctioneerItemPrivate {
  uuid: string;
  departmentName?: string;
  fullName: string;
  idCode: string;
  organizationName: string;
  organizationAddress: string;
  certStatus: string;
  cardStatus: string;
  orgProvinceCode?: string;
  orgProvinceName?: string;
  orgWardCode?: string;
  orgWardName?: string;
  cardCode?: string;
  certCode?: string;
  dateOfDecisionCert?: string;
  issueDate?: string;
  dob?: string;
}

export interface AuctioneerPrivate {
  fullName: string;
  gender: string;
  dob: string;
  telNumber: string;
  email: string;
  idCode: string;
  idDoi: string;
  idPoi: string;
  addPermanent: string;
  provinceCode: string;
  wardCode: string;
  uuid: string;
}

export interface CertificateSectionItem {
  certCode: string;
  numberOfDecision: string;
  dateOfDecision: string;
  effectiveDate: string;
  status: string;
  files?: File[];
  uuid: string;
}

export interface CardSectionItem {
  cardCode: string;
  status: string;
  numberOfDecision: string;
  dateOfDecision: string;
  effectiveDate: string;
  issueDate: string;
  departmentCode: string;
  departmentText?: string;
  files?: File[];
  uuid: string;
  orgId?: string;
  orgName?: string;
}

export interface AuctioneerDetailPrivate extends AuctioneerPrivate {
  auctioneerType: string;
  textPoi: string;
  textProvince: string;
  textWard: string;
  auctionCertificateInfos: (CertificateSectionItem & {
    attachFile: AttachFileResponse[];
  })[];
  auctionCardInfos: (CardSectionItem & {
    attachFile: AttachFileResponse[];
  })[];
}

export interface AttachFileResponse {
  fileName: string;
  filePath: string;
}

export interface AuctionOrgDetailItem {
  licenseNo: string;
  licenseDate: string;
  type: string;
  fullName: string;
  provinceCode: string;
  provinceName: string;
  wardCode: string;
  wardName: string;
  address: string;
  telNumber: string;
  email: string;
  status: string;
  orgRoot: string;
  orgRootName?: string;
  managerUuid: string;
  manager: AuctionOrgManager;
  memberPartners?: AuctionOrgMemberPartners[];
  auctioneers?: AuctionOrgEngineers[];
  orgRootDepartmentCode?: string;
  orgRootDepartmentName?: string;
}

export interface AuctionOrgManager {
  uuid: string;
  fullName: string;
  gender: string;
  dob: string;
  telNumber: string;
  email: string;
  idCode: string;
  idDoi: string;
  idPoi: string;
  textPoi: string;
  addPermanent: string;
  provinceCode: string;
  textProvince: string;
  wardCode: string;
  textWard: string;
  certCode: string;
  dateOfDecisionCert: string;
  cardCode: string;
  dateOfDecisionCard: string;
}

export interface AuctionOrgMemberPartners {
  uuid: string;
  fullName: string;
  dob: string;
  certCode: string;
  dateOfDecision: string;
}

export interface AuctionOrgEngineers {
  uuid: string;
  fullName: string;
  dob: string;
  certCode: string;
  dateOfDecisionCert: string;
  cardStatus: string;
  cardCode: string;
  dateOfDecisionCard: string;
  certStatus: string;
}
