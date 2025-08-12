import axiosClient from "@/axios/axiosClient";
import axiosServer from "@/axios/axiosServer";
import {
  CommonReportParams,
  MicroserviceResponse,
  ResponseBaseData,
} from "@/types/common";
import {
  FullLawyerItem,
  FullLawyerOrgItem,
  LawyerActivityReportItem,
  LawyerAreaReportItem,
  LawyerCardParams,
  LawyerCCHNLicense,
  LawyerCCHNReportItem,
  LawyerDashboard,
  LawyerItem,
  LawyerItemPrivate,
  LawyerOrgBranchDetail,
  LawyerOrgItem,
  LawyerOrgParamsPrivate,
  LawyerOrgReportItem,
  LawyerParams,
  LawyerParamsPrivate,
  LawyerReportParams,
  LicenseDocument,
  LicenseSearchParams,
  LsCardLicenses,
  OrgChangeItem,
  OrgChangItemSubmit,
  OrgLawyerItem,
  OrgLawyerParams,
} from "@/types/luatSu";
import { QueryFunctionContext } from "@tanstack/react-query";

// Danh sách Luật sư
export const searchLawyer = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyers/getPage`,
    params
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<LawyerItem>>;
};

// Danh sách tổ chức hành nghề
export const searchLawyerOrg = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyer-organizations/getPage`,
    params
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerOrgItem>
  >;
};

export const getLawyerOrgById = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyer-organizations/${id}`
  );
  return response?.data as MicroserviceResponse<FullLawyerOrgItem>;
};

export const getLawyerById = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyers/${id}`
  );
  return response?.data as MicroserviceResponse<FullLawyerItem>;
};

export const getLawyerCards = async ({
  queryKey,
}: QueryFunctionContext<[string, LicenseSearchParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyer-license/getPage`,
    { ...params }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerCCHNLicense>
  >;
};

// Dashboard cho luật sư
export const lawyerDashboard = async ({
  queryKey,
}: QueryFunctionContext<
  [string, Omit<CommonReportParams, "pageNumber" | "numberPerPage">]
>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyers/lawyer-dashboard`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<LawyerDashboard>;
};

// Dashboard cho tổ chức
export const lawyerOrgDashboard = async ({
  queryKey,
}: QueryFunctionContext<
  [string, Omit<CommonReportParams, "pageNumber" | "numberPerPage">]
>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/lawyer-organizations/lawyer-dashboard`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<LawyerDashboard>;
};

// Danh sách luật sư admin
export const searchLawyerPrivate = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerParamsPrivate]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/getPage`,
    params
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerItemPrivate>
  >;
};

// Chi tiết luật sư admin
export const getLawyerByIdPrivate = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/${id}`
  );
  return response?.data as MicroserviceResponse<FullLawyerItem>;
};

// Lấy danh sách tất cả đoàn luật sư
export const getAllAssoc = async (type: "client" | "server") => {
  const client = type === "client" ? axiosClient : axiosServer;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/common/assoc`
  );
  return response?.data as MicroserviceResponse<
    {
      assocId: number;
      assocName: string;
    }[]
  >;
};

/** Xóa luật sư */
export const deleteLawyer = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/delete/${id}`
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerItemPrivate>
  >;
};

// Lấy danh sách tất cả tổ chức
export const getAllOrg = async (type: "client" | "server") => {
  const client = type === "client" ? axiosClient : axiosServer;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/common/lorg`
  );
  return response?.data as MicroserviceResponse<
    {
      id: number;
      orgName: string;
    }[]
  >;
};

// Cập nhật thông tin luật sư
export const editLawyer = async (data: FullLawyerItem) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/edit`,
    data
  );
  return response?.data as MicroserviceResponse<FullLawyerItem>;
};

// Thêm mới thông tin luật sư
export const addLawyer = async (data: Partial<FullLawyerItem>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/add?isDomestic=${data.isDomestic}`,
    data
  );
  return response?.data as MicroserviceResponse<FullLawyerItem>;
};

// Danh sách tổ chức luật sư admin
export const searchLawyerOrgPrivate = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerOrgParamsPrivate]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/getPage`,
    params
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerOrgItem>
  >;
};

// Chi tiết tổ chức luật sư admin
export const getLawyerOrgByIdPrivate = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/${id}`
  );
  return response?.data as MicroserviceResponse<FullLawyerOrgItem>;
};

/**  Xóa tổ chức luật sư admin */
export const deleteLawyerOrg = async (id: number) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/delete/${id}`
  );
  return response?.data as MicroserviceResponse<FullLawyerOrgItem>;
};

// Danh sách thẻ theo từng luật sư
export const getCardByLawyer = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerCardParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/lic`,
    params
  );
  return response?.data as MicroserviceResponse<LsCardLicenses[]>;
};

// Update thẻ theo từng luật sư
export const updateCard = async (
  data: LsCardLicenses & { isDomestic: number }
) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lic/update?isDomestic=${data.isDomestic}`,
    data
  );
  return response?.data as MicroserviceResponse<LsCardLicenses>;
};

// Add thẻ theo từng luật sư
export const addCard = async (
  data: Partial<LsCardLicenses> & { isDomestic: number }
) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lic/add?isDomestic=${data.isDomestic}`,
    data
  );
  return response?.data as MicroserviceResponse<LsCardLicenses>;
};

// Xóa thẻ luật sư
export const deleteCard = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lic/delete/${id}`
  );
  return response?.data as MicroserviceResponse<LsCardLicenses>;
};

// Lấy danh sách luật sư chưa có tổ chức
export const getAllLawyersUnique = async () => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/law-rep-unique`
  );
  return response?.data as MicroserviceResponse<
    {
      id: number;
      fullName: string;
      dob: string;
      cerNumber: string;
      licNumber: string;
    }[]
  >;
};

// Thêm mới tổ chức luật sư
export const addLawyerOrg = async (data: Partial<FullLawyerOrgItem>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/add`,
    data
  );
  return response?.data as MicroserviceResponse<FullLawyerOrgItem>;
};

/**  Lấy danh sách luật sư thuộc tổ chức */
export const getLawyerInOrg = async ({
  queryKey,
}: QueryFunctionContext<[string, OrgLawyerParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/law`,
    {
      ...params,
      pageNumber: 1,
      numberPerPage: 1000,
    }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<OrgLawyerItem>
  >;
};

/** Thêm mới thông tin thay đổi nội dung ĐKHĐ */
export const addContentChange = async (data: Partial<OrgChangItemSubmit>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lic/doc/add`,
    data
  );
  return response?.data as MicroserviceResponse<OrgChangeItem>;
};

/** Cập nhật thông tin thay đổi nội dung ĐKHĐ */
export const editContentChange = async (data: OrgChangItemSubmit) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lic/doc/edit`,
    data
  );
  return response?.data as MicroserviceResponse<OrgChangeItem>;
};

/** Xóa thông tin thay đổi nội dung ĐKHĐ */
export const deleteContentChange = async (id: number) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lic/doc/delete/${id}`
  );
  return response?.data as MicroserviceResponse<LicenseDocument>;
};

/** Thêm mới chi nhánh */
export const addBranch = async (data: Partial<LawyerOrgBranchDetail>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/org/add`,
    data
  );
  return response?.data as MicroserviceResponse<LawyerOrgBranchDetail>;
};

/** Sửa chi nhánh */
export const updateBranch = async (data: LawyerOrgBranchDetail) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/org/update`,
    data
  );
  return response?.data as MicroserviceResponse<LawyerOrgBranchDetail>;
};

/** Xóa chi nhánh */
export const deleteBranch = async (id: number) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/org/remove/${id}`
  );
  return response?.data as MicroserviceResponse<LawyerOrgBranchDetail>;
};

/**  Báo cáo tổ chức HNLS + Luật sư đang hành nghề theo địa phương */
export const reportLawyerByProvince = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerReportParams]>) => {
  const [, { provinceIds: provinceId, pageNumber, numberPerPage, isOrg }] =
    queryKey;

  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/report/area?pageNum=${pageNumber}&pageSize=${numberPerPage}&isOrg=${isOrg}`,
    provinceId || []
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerAreaReportItem>
  >;
};

/** Báo cáo tổ chức HNLS */
export const reportLawyerOrg = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerReportParams]>) => {
  const [, { provinceIds, pageNumber, numberPerPage, isDomestics }] = queryKey;

  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lorg/report/org-active`,
    { pageNum: pageNumber, pageSize: numberPerPage, provinceIds, isDomestics }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerOrgReportItem>
  >;
};

/** Báo cáo Luật sư đang hành nghề */
export const reportLawyer = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerReportParams]>) => {
  const [, { provinceIds, pageNumber, numberPerPage, isDomestics }] = queryKey;

  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/report/law-active`,
    { pageNum: pageNumber, pageSize: numberPerPage, provinceIds, isDomestics }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerActivityReportItem>
  >;
};

/** Báo cáo CCHN Luật sư */
export const reportLawyerCCHN = async ({
  queryKey,
}: QueryFunctionContext<[string, LawyerParamsPrivate]>) => {
  const [, params] = queryKey;

  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/lstc/report/law-ccnh`,
    params
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<LawyerCCHNReportItem>
  >;
};
