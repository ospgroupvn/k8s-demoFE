import { CommonParams } from "../common";

export interface CongChungOrg {
  name: string;
  adminName: string;
  address: string;
  idOrgNotaryInfo: number;
  statusOrg: number;
  officeChiefName: string;
  establishment: string;
  dateEstablishment: string;
  dateEstablishmentStr: string;
  countNotary: number;
  phoneNumber: string;
  administrationId?: number;
}

export interface NotaryOrgParams extends CommonParams {
  name?: string; // Tên tổ chức
  orgId?: number; // id Sở Tư pháp
  statusOrg?: number; // Trạng thái
}

export interface NotaryCategoryParams {
  pageNo: number;
  pageSize: number;
  adminId?: string;
  name?: string;
}

export interface AdministrationItem {
  id: number;
  name: string;
  fullName: string;
  isCenter: number;
  parentId?: number;
  type: number;
  address: string;
  phone: string;
  isActive: number;
  lastUpdate: string;
  updatedBy: number;
  status: number;
  addressId: number;
}

export interface NotaryEmplParams extends CommonParams {
  name?: string;
  fullName?: string;
  orgId?: number;
  status?: number;
  orgCode?: string; // Mã tổ chức
}

export interface NotaryEmplItem {
  idNotaryInfo: number;
  nameNotaryInfo: string;
  sex?: number;
  birthDay?: number;
  yearBirthDay?: number;
  idNo?: string;
  idNoDate?: string;
  addressIdNo?: string;
  addressResident?: string;
  addressResidentId?: number;
  addressNow?: string;
  addressNowId?: number;
  statusNotaryInfo?: number;
  phoneNumberNotaryInfo?: string;
  emailNotaryInfo?: string;
  activeNotaryInfo?: number;
  statusNotaryInfoStr?: string;
  birthDayStr: string;
  birthDayStr_: string;
  sexStr?: string;
  createdBy?: string;
  updatedBy?: string;
  genDate?: string;
  strGenDate: string;
  lastUpdate?: string;
  strLastUpdate: string;
  typeNotary?: number;
  documentId?: number;
  dispatchCode?: string;
  dateSign?: string;
  signer?: string;
  unitSign?: string;
  linkFile?: string;
  typeDocument?: number;
  activeDocument?: number;
  fileNameDocument?: string;
  dateSignStr: string;
  fileName?: string;
  effectiveDate?: string;
  effectiveDateStr: string;
  idOrgNotaryInfo?: number;
  nameOrgNotaryInfo?: string;
  address?: string;
  orgNotaryAddress?: string;
  telOrgNotaryInfo?: string;
  faxOrgNotaryInfo?: string;
  emailOrgNotaryInfo?: string;
  website?: string;
  notaryIdOfficeChief?: string;
  activeOrgNotaryInfo?: number;
  typeOrg?: number;
  orgAddressId?: number;
  status_org?: number;
  status_org_Str?: string;
  idNotaryRegPractice?: number;
  numberCad?: string;
  certificateCode?: string;
  name?: string;
  status?: number;
  statusStr?: string;
  dateStart?: string;
  dateSignProbationary?: string;
  dateEnd?: string;
  documentCertificateId?: number;
  note?: string;
  idAppoint?: number;
  probationaryCode?: string;
  typeAppoint?: number;
  typeAppointStr?: string;
  reasonDisAppoint?: string;
  genDateAppoint?: string;
  lastUpdateAppoint?: string;
  updatedByAppoint?: string;
  idDismissed?: number;
  genDateDismissed?: string;
  lastUpdateDismissed?: string;
  updatedByDismissed?: string;
  typeDismissed?: number;
  typeDismissedStr?: string;
  idReAppoint?: number;
  lastUpdateReAppoint?: string;
  updatedByReAppoint?: string;
  idSuspendWork?: number;
  typeSupend?: number;
  supendId?: number;
  typeSupendStr?: string;
  termOfSuspension?: string;
  idNotaryCard?: number;
  statusNotaryCard?: number;
  statusNotaryCardStr?: string;
  activeCard?: number;
  activeCardStr?: string;
  dateReq?: string;
  dateSignApo?: string;
  dispatchCodeApo?: string;
  reason?: string;
  notaryPenalizeId?: number;
  leverPenalize?: number;
  leverPenalizeStr?: string;
  activePena?: number;
  activePenaStr?: string;
  moneyPenalty?: number;
  typePenalize?: number;
  additionalPenalty?: number;
  typePenalizeStr?: string;
  additionalPenaltyStr?: string;
  idDetail?: number;
  idPro?: number;
  nameAdmin?: string;
  addressAdmin?: string;
  idRequest?: number;
  requestType?: number;
  requestTypeStr?: string;
  value?: string;
  userCreate?: string;
  provinceName?: string;
  dispatchCodeBn?: string;
  dateSignBn?: string;
  status_prac?: number;
  status_prac_Str?: string;
}

export interface ReportNotaryOrgParams extends CommonParams {
  fromDate?: string;
  toDate?: string;
  cityId?: number;
}

export interface ReportItem {
  col_1: string;
  col_2: string;
  col_3: string;
  col_4: string;
  col_5: string;
  col_6: string;
  col_7: string;
  col_8: string;
  col_9: string;
  col_10: string;
  col_11: string;
  col_12: string;
  col_13: string;
  col_14: string;
  col_15: string;
  col_16: string;
  col_17: string;
  col_18: string;
}

export type ReportItemLawyerType = {
  [key in `col_${number}`]: string;
};
export interface NotaryDashboardResponse {
  tk_tccc_ds_cgv: number;
  tk_tccc_ds_cgv_growth: string;
  VPCC_duoc_phep_tl: string;
  VPCC_duoc_phep_tl_growth: string;
  tk_tccc_top_cities: {
    administration_name: string;
    total_count: number;
  }[];
  tk_pie_loai_cong_chung: {
    name: string;
    value: string[];
  }[];
  dataMap: {
    name: string;
    value: string;
  }[];
  dataChartCity: {
    name: string;
    value: string;
  }[];
  HSCC_da_thuc_hien: string;
  HSCC_da_thuc_hien_growth: string;
  tk_tccc_ds_tccc: number;
  tk_tccc_ds_tccc_growth: string;
  tk_pie_th_bo_nhiem_ccv: {
    name: string;
    value: string[];
  }[];
}

export interface OrgDetailResponse {
  orgNotaryInfoView: {
    name: string;
    adminName: string;
    address: string;
    tel: string;
    email: string;
    fax: string;
    statusOrg: number;
    statusOrgStr: string;
    administrationId: number;
    officeChiefName: string;
    addressResident: string;
    addressNow: string;
    sex: number;
    notaryIdOfficeChief: string;
    phoneNumber: string;
    emailNotary: string;
    birthDay: string;
    idNo: string;
    idNoDate: string;
    addressIdNo: string;
    numberCad: string;
    type: number;
    dispatchCode: string;
    dateSign: string;
    effectiveDate: string;
  };
  pageNotary: {
    items: OrgDetailNotaryList[];
    numberPerPage: number;
    pageCount: number;
    pageList: number[];
    pageNumber: number;
    rowCount: number;
  };
}

export interface OrgDetailNotaryList {
  nameNotaryInfo: string;
  birthDay: string;
  idNo: string;
  addressResident: string;
  birthDayStr: string;
  birthDayStr_: string;
  numberCad: string;
  dispatchCode: string;
  dateSign: string;
  dateSignStr: string;
  telOrgNotaryInfo: string;
}

export interface OrgCCVDetailResponse {
  addressIdNo: string;
  addressResident: string;
  addressResidentId: number;
  birthDay: string;
  birthDayStr: string;
  birthDayStr_: string;
  dateSign: string;
  dateSignStr: string;
  dispatchCode: string;
  idNo: string;
  idNoDate: string;
  idNotaryInfo: number;
  nameNotaryInfo: string;
  numberCad: string;
  sex: number;
  sexStr: string;
  statusNotaryInfo: number;
  statusNotaryInfoStr: string;
  phoneNumberNotaryInfo: string;
  pageAppoint: {
    items: CCVAppointItem[];
    rowCount: number;
    numberPerPage: number;
    pageNumber: number;
    checkLast: number;
    pageCount: number;
    pageList: number[];
  };
  pageRegAndAuctionCard: {
    items: CCVRegAndAuctionCard[];
    rowCount: number;
    numberPerPage: number;
    pageNumber: number;
    checkLast: number;
    pageCount: number;
    pageList: number[];
  };
  pageProbationary: {
    items: CCVProbationary[];
    rowCount: number;
    numberPerPage: number;
    pageNumber: number;
    checkLast: number;
    pageCount: number;
    pageList: number[];
  };
}

// Chi tiết CCV - Thông tin bổ nhiệm
export interface CCVAppointItem {
  idNotaryInfo: number;
  genDate: string;
  strGenDate: string;
  dispatchCode: string;
  dateSign: string;
  dateSignStr: string;
  name: string;
  idAppoint: number;
  typeAppoint: number;
  typeAppointStr: string;
  effectiveDate: string;
  effectiveDateStr: string;
  status: string;
  statusStr: string;
  signer: string;
}

// Chi tiết CCV - Đăng ký HNCC
export interface CCVRegAndAuctionCard {
  idNotaryInfo: number;
  genDate: string;
  strGenDate: string;
  dispatchCode: string;
  dateSign: string;
  signer: string;
  dateSignStr: string;
  effectiveDate: string;
  effectiveDateStr: string;
  nameOrgNotaryInfo: string;
  idNotaryRegPractice: number;
  numberCad: string;
  status_prac: number;
  status_prac_Str: string;
  nameAdmin: string;
}

// Chi tiết CCV - đăng ký tập sự
export interface CCVProbationary {
  id: number;
  notaryInfoId: number;
  orgNotaryInfoId: number;
  dateStart: string;
  dateStartStr: string;
  nameOrgNotaryInfo: string;
  status: number;
  dispatchCode: string;
  dateSign: string;
  dateSignStr: string;
  createdBy: string;
  updatedBy: string;
  genDate: string;
  genDateStr: string;
  lastUpdate: string;
  lastUpdateStr: string;
  address: string;
  name_ntaryInfo: string;
  dateNumber: string;
}

export interface CCVProcessItem {
  ten_chinh: string;
  administration: string;
  org_name: string;
  date_start: string;
  date_end: string;
  note: string;
  dispatch_code: string;
  date_sign: string;
  effective_date: string;
  number_cad: string;
  body: string[];
}

export interface NotaryOperationParams extends CommonParams {
  yearReport?: number;
  monthReport?: string[];
  cityId?: number | string;
  aTypes?: string[];
}

export interface NotaryOperationItem {
  id: number;
  administrationId: number;
  reportYear: number;
  reportMonth: number;
  reportDate: string;
  numNotaryContracts: number;
  notaryFeesContracts: number;
  numOtherNotaryTasks: number;
  notaryFeesOtherTasks: number;
  totalTasks: number;
  totalFees: number;
  taxContribution: number;
  numNotaryOfficesReporting: number;
  numNotariesWorking: number;
  province: string;
}

export interface InfoSectionData {
  name: string;
  email: string;
  sex: number;
  birthDay: string;
  idNo: string;
  idNoDate: string;
  addressIdNo: string;
  addressResident: string;
  addressResidentId: number;
  addressNow: string;
  addressNowId: number;
  status: number;
  phoneNumber: string;
}

export interface OrgCCVDetailResponsePrivate {
  administrationId?: string;
  activeCard?: number;
  activeCardStr?: string;
  activeDocument?: number;
  activeNotaryInfo?: number;
  activeOrgNotaryInfo?: number;
  activePena?: number;
  activePenaStr?: string;
  additionalPenalty?: number;
  additionalPenaltyStr?: string;
  address?: string;
  addressAdmin?: string;
  addressIdNo?: string;
  addressNow?: string;
  addressNowId?: number;
  addressResident?: string;
  addressResidentId?: number;
  birthDay?: string;
  birthDayStr?: string;
  birthDayStr_?: string;
  certificateCode?: string;
  createdBy?: string;
  dateEnd?: string;
  dateReq?: string;
  dateSign?: string;
  dateSignApo?: string;
  dateSignBn?: string;
  dateSignProbationary?: string;
  dateSignStr?: string;
  dateStart?: string;
  dispatchCode?: string;
  dispatchCodeApo?: string;
  dispatchCodeBn?: string;
  documentCertificateId?: number;
  effectiveDate?: string;
  effectiveDateStr?: string;
  email?: string;
  emailOrgNotaryInfo?: string;
  faxOrgNotaryInfo?: string;
  fileName?: string;
  fileNameDocument?: string;
  genDate?: string;
  genDateAppoint?: string;
  genDateDismissed?: string;
  idAppoint?: number;
  idDetail?: number;
  idDismissed?: number;
  documentId?: number;
  idNo?: string;
  idNoDate?: string;
  idNotaryCard?: number;
  idNotaryInfo?: number;
  idNotaryRegPractice?: number;
  idOrgNotaryInfo?: number;
  idPro?: number;
  idReAppoint?: number;
  idRequest?: number;
  idSuspendWork?: number;
  lastUpdate?: string;
  lastUpdateAppoint?: string;
  lastUpdateDismissed?: string;
  lastUpdateReAppoint?: string;
  leverPenalize?: number;
  leverPenalizeStr?: string;
  linkFile?: string;
  moneyPenalty?: number;
  name?: string;
  nameAdmin?: string;
  nameNotaryInfo?: string;
  nameOrgNotaryInfo?: string;
  notaryIdOfficeChief?: string;
  notaryPenalizeId?: number;
  note?: string;
  numberCad?: string;
  orgAddressId?: string;
  orgNotaryAddress?: string;
  phoneNumber?: string;
  probationaryCode?: string;
  provinceName?: string;
  reason?: string;
  reasonDisAppoint?: string;
  requestType?: number;
  requestTypeStr?: string;
  sex?: string;
  sexStr?: string;
  signer?: string;
  status?: number;
  statusNotaryCard?: number;
  statusNotaryCardStr?: string;
  statusNotaryInfo?: number;
  statusNotaryInfoStr?: string;
  statusStr?: string;
  status_org?: number;
  status_org_Str?: string;
  status_prac?: number;
  status_prac_Str?: string;
  strGenDate?: string;
  strLastUpdate?: string;
  supendId?: number;
  telOrgNotaryInfo?: string;
  termOfSuspension?: string;
  typeAppoint?: number;
  typeAppointStr?: string;
  typeDismissed?: number;
  typeDismissedStr?: string;
  typeDocument?: number;
  typeNotary?: number;
  typeOrg?: number;
  typePenalize?: number;
  typePenalizeStr?: string;
  typeSupend?: number;
  typeSupendStr?: string;
  unitSign?: string;
  updatedBy?: string;
  updatedByAppoint?: string;
  updatedByDismissed?: string;
  updatedByReAppoint?: string;
  userCreate?: string;
  value?: string;
  website?: string;
  yearBirthDay?: number;
  cityNowId?: string;
  cityResidentId?: string;
  notaryProbationaryResponse: CCVProbationaryPrivate;
  notaryAppointResponses: CCVAppointPrivate[];
  notaryRegAndAuctionCardResponse: CCVRegAndAuctionCardPrivate;
  notarySuspendWorkResponse: CCVSuspendWorkPrivate;
  notaryPenalizeResponse: CCVPenalizePrivate[];
}

export interface CCVProbationaryPrivate {
  idOrg: string;
  orgName: string;
  address: string;
  documentId: number;
  dispatchCode: string;
  dateSign: string;
  note?: string;
  linkFile?: string;
  fileName?: string;
  idProbationary: string;
  dateStart: string;
  dateEnd: string;
  status: number;
  active: number;
  typeCertificate?: number;
  dateNumber: number;
}

export interface CCVAppointPrivate {
  dispatchCode?: string;
  dateSign?: string;
  note?: string;
  linkFile?: string;
  fileName?: string;
  active?: number;
  type?: number;
  kind?: number;
  notaryInfoId?: number;
  status?: number;
  reason?: string;
  requestDate?: string;
  effectiveDate?: string;
  id?: string;
  signer?: string;
  documentId?: number;
}

export interface CCVRegAndAuctionCardPrivate {
  dispatchCode?: string;
  note?: string;
  linkFile?: string;
  fileName?: string;
  active?: number;
  decisionDate?: string;
  effectiveDate?: string;
  orgNotaryInfoId?: number;
  notaryInfoId?: number;
  numberCad?: string;
  status?: number;
  notaryReq?: string;
  dateReq?: string;
  typeNotaryInfo?: number;
  administrationId?: number;
  id?: string;
}

export interface CCVSuspendWorkPrivate {
  dispatchCode?: string;
  note?: string;
  linkFile?: string;
  fileName?: string;
  active?: number;
  decisionDate?: string;
  effectiveDate?: string;
  notaryInfoId?: number;
  orgNotaryId?: number;
  reason?: string;
  typeSupend?: number;
  id?: string;
  signer?: string;
  dateNumber?: number;
  documentId?: number;
}

export interface CCVPenalizePrivate {
  id: string;
  dispatchCode: string;
  active: number;
  decisionDate: string;
  effectiveDate: string;
  administrationIdPenalty: number;
  notaryInfoId: number;
  orgNotaryId: number;
  typePenalize: number;
  reason: string;
  leverPenalize: number;
  additionalPenalty: number;
  moneyPenalty: number;
  documentId: number;
  linkFile?: string;
  fileName?: string;
}

export interface CCVRegisterPrivate {
  dispatchCode: string;
  note: string;
  linkFile?: string;
  fileName: string;
  active: number;
  signer: string;
  decisionDate: string;
  effectiveDate: string;
  orgNotaryInfoId: number;
  notaryInfoId: number;
  numberCad: string;
  status: number;
  notaryReq: number;
  dateReq: string;
  typeNotaryInfo: number;
  id?: number;
}

export interface CCVOrgSubmitBody {
  name: string;
  address: string;
  tel: string;
  email: string;
  notaryIdOfficeChief: number;
  addressId: number;
  administrationId: number;
  active?: number;
  status: number;
}

export interface CCVOrgDetailPrivateResponse {
  orgNotaryInfoView: CCVOrgDetailPrivate;
}

export interface CCVOrgDetailPrivate extends CCVOrgSubmitBody {
  officeChiefName: string;
  addressResident: string;
  sex: number;
  phoneNumber: string;
  emailNotary: string;
  birthDay: number;
  idNo: string;
  idNoDate: number;
  cityId: string;
  statusOrg?: number;
}
