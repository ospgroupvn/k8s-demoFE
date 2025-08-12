import axiosClient from "@/axios/axiosClient";
import axiosServer from "@/axios/axiosServer";
import {
  CommonReportParams,
  MicroserviceResponse,
  ResponseBaseData,
  ResponseBaseDataWithTotal,
} from "@/types/common";
import {
  AdministrationItem,
  CCVAppointPrivate,
  CCVOrgDetailPrivateResponse,
  CCVOrgSubmitBody,
  CCVPenalizePrivate,
  CCVProbationaryPrivate,
  CCVProcessItem,
  CCVRegisterPrivate,
  CCVSuspendWorkPrivate,
  CongChungOrg,
  NotaryCategoryParams,
  NotaryDashboardResponse,
  NotaryEmplItem,
  NotaryEmplParams,
  NotaryOperationItem,
  NotaryOperationParams,
  NotaryOrgParams,
  OrgCCVDetailResponsePrivate,
  OrgDetailResponse,
  ReportItem,
} from "@/types/congChung";
import { QueryFunctionContext } from "@tanstack/react-query";
import { AxiosResponse } from "axios";
import { path } from "d3";

// Danh sách cục/sở
export const getAdministrationByType = async ({
  queryKey,
}: QueryFunctionContext<[string, { type: number }]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/tccc/getAdministrationByType`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<AdministrationItem[]>;
};

export const getListNotaryAdministration = async (
  type: number,
  clientType?: "client" | "server"
) => {
  const client = clientType === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org/getAdministrationByType`,
    {
      params: {
        type,
      },
    }
  );
  return response?.data as MicroserviceResponse<AdministrationItem[]>;
};

// Danh sách tổ chức
export const getNotaryOrgList = async ({
  queryKey,
}: QueryFunctionContext<[string, NotaryOrgParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/tccc/notary-manage/search`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<CongChungOrg>>;
};

// Danh sách tổ chức
export const getNotaryOrgListPrivate = async (params: NotaryOrgParams) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org/notary-manage/search`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<CongChungOrg>>;
};

// Danh sách Công chứng viên
export const searchNotaryEmpl = async ({
  queryKey,
}: QueryFunctionContext<[string, NotaryEmplParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/tccc/ccv/search`,
    {
      params: {
        ...params,
        fullName: params.name,
      },
    }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<NotaryEmplItem>
  >;
};

// Danh sách Công chứng viên private
export const searchNotaryEmplPrivate = async ({
  queryKey,
}: QueryFunctionContext<[string, NotaryEmplParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/ccv/search`,
    {
      params: {
        ...params,
        fullName: params.name,
      },
    }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<NotaryEmplItem>
  >;
};

export const exportNotaryEmplPrivate = async (params: NotaryEmplParams) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/ccv/export`,
    {
      params: {
        ...params,
        fullName: params.name,
      },
      paramsSerializer: { indexes: null },
      responseType: "blob",
    }
  );
  const contentDisposition =
    response.headers?.["content-disposition"] ||
    response.headers?.["Content-Disposition"] ||
    "";

  return { data: response.data, filename: contentDisposition };
};

// Danh sách trạng thái Công chứng viên
export const getNotaryEmplStatus = async () => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/tccc/ccv/getNotaryStatus`
  );
  return response?.data as MicroserviceResponse<
    {
      name: string;
      status: number;
    }[]
  >;
};

// Báo cáo số liệu tổ chức
export const reportNotaryOrg = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/reportOrganizationNotary`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo tình hình hoạt động
export const reportNotaryOperation = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/reportOperationOrganizationNotary`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo bổ nhiệm
export const reportAppoint = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/reportOperationSuggestAppoint`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo vi phạm CCV
export const reportCCVViolation = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, { aTypes, ...params }] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/reportOperationViolation`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo vi phạm tổ chức
export const reportOrgViolation = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, { aTypes, ...params }] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/reportOperationViolationOrganization`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo tổng quan - Dashboard
export const reportNotaryDashboard = async ({
  queryKey,
}: QueryFunctionContext<
  [
    string,
    Omit<CommonReportParams, "pageNumber" | "numberPerPage"> & { type?: number }
  ]
>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/tccc/tcccDashboard`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<NotaryDashboardResponse>;
};

// Chi tiết tổ chức
export const getNotaryOrgById = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/detailOrganizationNotary/${id}`
  );
  return response?.data as MicroserviceResponse<OrgDetailResponse>;
};

// Chi tiết CCV
export const getCCVById = async (id: number, type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/detailNotary/${id}`
  );
  return response?.data as MicroserviceResponse<OrgCCVDetailResponsePrivate>;
};

// Chi tiết quá trình CCV
export const getCCVProcess = async ({
  queryKey,
}: QueryFunctionContext<[string, number]>) => {
  const [, id] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/detailNotaryProcess/${id}`
  );
  return response?.data as MicroserviceResponse<CCVProcessItem[]>;
};

// Danh sách hoạt động công chứng
export const searchNotaryOperation = async ({
  queryKey,
}: QueryFunctionContext<[string, NotaryOperationParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/notary-activity/search`,
    {
      params: {
        ...params,
        monthReport: params.monthReport?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<NotaryOperationItem>
  >;
};

// Thêm mới hoạt động công chứng
export const addNotaryOperation = async (
  body: Partial<NotaryOperationItem>
) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/notary-activity/add`,
    body
  );

  return response?.data as MicroserviceResponse<NotaryOperationItem>;
};

// Sửa hoạt động công chứng
export const editNotaryOperation = async (
  body: Partial<NotaryOperationItem>
) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/notary-activity/${body.id}`,
    body
  );

  return response as AxiosResponse<NotaryOperationItem>;
};

// Xóa hoạt động công chứng
export const deleteNotaryOperation = async (id: number) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/notary-activity/${id}`
  );

  return response as AxiosResponse<NotaryOperationItem>;
};

// Báo cáo hoạt động công chứng
export const notaryOperationReport = async ({
  queryKey,
}: QueryFunctionContext<[string, NotaryOperationParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/notary-activity/aggregate-by-stp`,
    {
      params: {
        ...params,
        monthReport: params.monthReport?.join(","),
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo số liệu tổ chức theo quận huyện
export const reportNotaryOrgByDistrict = async ({
  queryKey,
}: QueryFunctionContext<[string, { cityCode: string }]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/tccc/getDataChartCity`,
    {
      params: {
        ...params,
      },
    }
  );
  return response?.data as MicroserviceResponse<
    {
      name: string;
      value: string;
    }[]
  >;
};

export const addCCV = async (body: Partial<OrgCCVDetailResponsePrivate>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary`,
    body
  );
  return response?.data as MicroserviceResponse<number>;
};

export const updateCCV = async (body: Partial<OrgCCVDetailResponsePrivate>) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/${body.idNotaryInfo}`,
    body
  );
  return response?.data as MicroserviceResponse<number>;
};

export const deleteCCV = async (id: number) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/${id}`
  );
  return response?.data;
};

export const addCCVProbation = async ({
  data,
  id,
}: {
  data: Partial<CCVProbationaryPrivate>;
  id: number;
}) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/probationary/${id}`,
    data
  );
  return response?.data as MicroserviceResponse<
    CCVProbationaryPrivate & { documentCertificateId?: number }
  >;
};

export const updateCCVProbation = async (
  data: Partial<CCVProbationaryPrivate>
) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/probationary/${data.idProbationary}`,
    data
  );
  return response?.data as MicroserviceResponse<CCVProbationaryPrivate>;
};

export const deleteCCVProbation = async (id: number) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/probationary/${id}`
  );
  return response?.data;
};

export const appointCCV = async (body: Partial<CCVAppointPrivate>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/appoint`,
    body
  );
  return response?.data as MicroserviceResponse<CCVAppointPrivate>;
};

export const updateAppointCCV = async (body: Partial<CCVAppointPrivate>) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/appoint/${body.id}`,
    body
  );
  return response?.data as MicroserviceResponse<CCVAppointPrivate>;
};

export const deleteAppointCCV = async (id: number) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/appoint/${id}`
  );
  return response?.data;
};

export const suspendCCV = async (body: Partial<CCVSuspendWorkPrivate>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/suspend`,
    body
  );
  return response?.data as MicroserviceResponse<CCVSuspendWorkPrivate>;
};

export const updateSuspendCCV = async (
  body: Partial<CCVSuspendWorkPrivate>
) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/suspend/${body.id}`,
    body
  );
  return response?.data as MicroserviceResponse<CCVSuspendWorkPrivate>;
};

export const deleteSuspendCCV = async (id: number) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/suspend/${id}`
  );
  return response?.data;
};

export const penalizeCCV = async (body: Partial<CCVPenalizePrivate>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/penalize`,
    body
  );
  return response?.data as MicroserviceResponse<CCVPenalizePrivate>;
};

export const updatePenalizeCCV = async (body: Partial<CCVPenalizePrivate>) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/penalize/${body.id}`,
    body
  );
  return response?.data as MicroserviceResponse<CCVPenalizePrivate>;
};

export const deletePenalizeCCV = async (id: number) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/penalize/${id}`
  );
  return response?.data;
};

export const registerPracticeCCV = async (
  body: Partial<CCVRegisterPrivate>
) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/re-practice`,
    body
  );
  return response?.data as MicroserviceResponse<CCVRegisterPrivate>;
};

export const updateRegisterPracticeCCV = async (
  body: Partial<CCVRegisterPrivate>
) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/re-practice/${body.id}`,
    body
  );
  return response?.data as MicroserviceResponse<CCVRegisterPrivate>;
};

export const UploadFileCCV = async (body: File, id: number) => {
  const formData = new FormData();
  formData.append("file", body);
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/document/upload/${id}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response?.data as MicroserviceResponse<string>;
};

export const deleteFileCCV = async (linkFile: string) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/document/delete`,
    {
      params: { path: linkFile },
    }
  );
  return response?.data as MicroserviceResponse<string>;
};

export const getListChief = async ({
  name,
  pageNo,
  pageSize,
}: {
  name?: string;
  pageNo?: number;
  pageSize?: number;
}) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/notary/chief-category`,
    {
      params: {
        name,
        pageNo: pageNo || 0,
        pageSize: pageSize || 10,
      },
    }
  );
  return response?.data as ResponseBaseDataWithTotal<{
    id: number;
    name: string;
    ccv: string;
    cccd: string;
  }>;
};

export const addCCVOrg = async (body: CCVOrgSubmitBody) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org`,
    body
  );
  return response?.data as MicroserviceResponse<CongChungOrg>;
};

export const updateCCVOrg = async (body: CCVOrgSubmitBody & { id: number }) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org/${body.id}`,
    body
  );
  return response?.data as MicroserviceResponse<CongChungOrg>;
};

export const getCCVOrgById = async (id: number, type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org/detailOrganizationNotary/${id}`
  );
  return response?.data as MicroserviceResponse<CCVOrgDetailPrivateResponse>;
};

export const getNotaryInOrg = async ({
  id,
  pageNo,
  pageSize,
}: {
  id: number;
  pageNo: number;
  pageSize: number;
}) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org/notary-in-org/${id}`,
    {
      params: {
        pageNo,
        pageSize,
      },
    }
  );
  return response?.data as ResponseBaseData<NotaryEmplItem>;
};

export const getNotaryOrgCategory = async (params: NotaryCategoryParams) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/bttp/org/category`,
    {
      params,
    }
  );
  return response?.data as ResponseBaseDataWithTotal<{
    id: number;
    name: string;
    dmAdministrationId: number;
  }>;
};
