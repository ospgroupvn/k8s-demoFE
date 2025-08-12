export type MicroserviceResponse<T> = {
  code: number;
  message: string;
  data: T;
  success?: boolean;
};

export type ResponseBaseData<T> = {
  checkLast?: number;
  items: T[];
  numberPerPage: number;
  pageCount: number;
  pageList: number[];
  pageNumber: number;
  rowCount?: number;
  page?: number;
  total?: number;
};

export type ResponseBaseDataWithTotal<T> = {
  data: T[];
  totalItem: number;
  totalPage: number;
};

export type IUserInfoResponse = {
  listAuthority: string[];
  userId: number;
  username: string;
  accessToken: string;
  fullName: string;
  authorities: string[];
  administrationId?: number;
};

export interface CommonParams {
  pageNumber: number;
  numberPerPage: number;
}

export interface CommonParams_v2 {
  page: number;
  size: number;
}

export interface CommonReportParams extends CommonParams {
  fromDate?: string;
  toDate?: string;
  cityId?: number | string;
  aTypes?: string[];
}

export interface OrganizationItem {
  id: number;
  fullName: string;
  licenseNo?: number;
  licenseDate?: string;
  phoneNUmber: string;
  faxNumber?: string;
  email: string;
  address: string;
  webSite?: string;
  director: string;
  status: number;
  roleInfo: string;
  otherInfo?: string;
  genDate: string;
  lastUpdate: string;
  districtId: number;
  cityId: number;
  userCreate?: number;
  lastUserUpdate?: number;
  cityCode?: string;
}

export interface ProvinceItem {
  id: number;
  name: string;
  code: string;
  catType: string;
}

export interface DashboardData extends ChartData {
  tk_dgts_tb_dau_gia: number;
  tk_dgts_to_chuc: number;
  tk_dgts_dgv: number;
  tk_dgts_tb_lua_chon: number;
  tk_tccc_ds_cgv: number;
  tk_tccc_ds_tccc: number;
}

export interface ChartData {
  // tk_dgts_top_cities: { total_count: number; province_name: string }[];
  tk_tccc_top_cities: {
    administration_name: string;
    total_count: number;
  }[];
}

export type BarChartData = {
  label: string;
  [x: string]: string | number;
};

export interface NationItem {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  updateById?: number;
  createById?: number;
  nationalityId: number;
  nationalityName: string;
  countryCode: string;
  status: number;
}

export interface DepartmentItem {
  id: number;
  code: string;
  name: string;
}

export interface ProvinceItem {
  id: number;
  code: string;
  name: string;
  provinceCode: string;
}

export interface WardItem {
  id: number;
  provinceCode: string;
  name: string;
  wardCode: string;
}
