import axiosClient from "@/axios/axiosClient";
import axiosServer from "@/axios/axiosServer";
import {
  CommonReportParams,
  DashboardData,
  MicroserviceResponse,
  OrganizationItem,
  ResponseBaseData,
  ResponseBaseDataWithTotal,
} from "@/types/common";
import { ReportItem } from "@/types/congChung";
import {
  AuctionDashboardResponse,
  AuctionDGVResponse,
  AuctioneerDetailPrivate,
  AuctioneerItem,
  AuctioneerItemPrivate,
  AuctioneerParams,
  AuctioneerParamsPrivate,
  AuctioneerPrivate,
  AuctionOrgDetailItem,
  AuctionOrgDetailResponse,
  AuctionOrgItem,
  AuctionOrgItemPrivate,
  AuctionOrgMemberPartners,
  AuctionOrgParams,
  AuctionOrgParamsPrivate,
  CardSectionItem,
  CertificateSectionItem,
  DGVProcessItem,
  PublicAuctionAssetParam,
  PublicAuctionAssetResponse,
} from "@/types/dauGia";
import { QueryFunctionContext } from "@tanstack/react-query";

// Lấy danh sách Sở Tư pháp
export const getAllOrganization = async (type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/getAllOrganization`
  );
  return response?.data as MicroserviceResponse<OrganizationItem[]>;
};

// Danh sách tổ chức đấu giá
export const getAllOrganizationAuction = async (params: AuctionOrgParams) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/getAllOrganizationAuction`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<AuctionOrgItem>
  >;
};

export const getAllOrganizationAuctionPrivate = async (
  params: AuctionOrgParamsPrivate
) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization`,
    {
      params: { ...params, page: params.page - 1 },
      paramsSerializer: { indexes: null },
    }
  );
  return response?.data as ResponseBaseDataWithTotal<AuctionOrgItemPrivate>;
};

export const getAllOrganizationAuctionPublic = async (
  params: AuctionOrgParamsPrivate
) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/public`,
    {
      params: { ...params, page: params.page - 1 },
      paramsSerializer: { indexes: null },
    }
  );
  return response?.data as ResponseBaseDataWithTotal<AuctionOrgItemPrivate>;
};

// Danh sách đấu giá viên
export const searchAuctioneer = async ({
  queryKey,
}: QueryFunctionContext<[string, AuctioneerParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/searchAuctioneer`,
    {
      params: {
        ...params,
        p: params.pageNumber,
      },
    }
  );
  return response?.data as MicroserviceResponse<
    ResponseBaseData<AuctioneerItem>
  >;
};

export const searchAuctioneerNew = async (params: AuctioneerParamsPrivate) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/public`,
    {
      params: { ...params, page: params.page - 1 },
    }
  );
  return response?.data as ResponseBaseDataWithTotal<AuctioneerItemPrivate>;
};

// Danh sách đấu giá viên
export const searchAuctioneerPrivate = async (
  params: AuctioneerParamsPrivate
) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer`,
    {
      params: { ...params, page: params.page - 1 },
    }
  );
  return response?.data as ResponseBaseDataWithTotal<AuctioneerItemPrivate>;
};

// Báo cáo số liệu tổ chức
export const reportAuctionOrg = async (
  { queryKey }: QueryFunctionContext<[string, CommonReportParams]>,
  type?: "client" | "server"
) => {
  const [, params] = queryKey;
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/dgts/report-quantity-organization-auction`,
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
export const reportAuctionOperation = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/dgts/report-operation-organization-auction`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo tổng quan - Dashboard
export const reportAuctionDashboard = async ({
  queryKey,
}: QueryFunctionContext<
  [string, Omit<CommonReportParams, "pageNumber" | "numberPerPage">]
>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/report-dashboard`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<DashboardData>;
};

// Báo cáo quản lý thẻ
export const reportAuctionCard = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/dgts/report-auction-card`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo thông báo
export const reportAuctionNotice = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/dgts/report-notice-auction`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Tổng hợp số liệu thông báo lựa chọn tổ chức đgts
export const reportNoticeAuctionAsset = async ({
  queryKey,
}: QueryFunctionContext<[string, CommonReportParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/dgts/report-notice-auction-asset`,
    {
      params: {
        ...params,
        aTypes: params.aTypes?.join(","),
      },
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<ReportItem>>;
};

// Báo cáo tổng quan - Dashboard
export const reportAuctionDashboard2 = async ({
  queryKey,
}: QueryFunctionContext<
  [string, Omit<CommonReportParams, "pageNumber" | "numberPerPage">]
>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/dgtsDashboard`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<AuctionDashboardResponse>;
};

// Chi tiết tổ chức
export const getAuctionOrgById = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/organization-auction-detail/${id}`
  );
  return response?.data as MicroserviceResponse<AuctionOrgDetailResponse>;
};

// Chi tiết DGV
export const getDGVById = async (id: number) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/auctioneer-detail/${id}`
  );
  return response?.data as MicroserviceResponse<AuctionDGVResponse>;
};

// Chi tiết quá trình ĐGV
export const getDGVProcess = async ({
  queryKey,
}: QueryFunctionContext<[string, number]>) => {
  const [, id] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/dgts/auctioneer-detail-process/${id}`
  );
  return response?.data as MicroserviceResponse<DGVProcessItem[]>;
};

// Thống kê công việc đấu giá
export const reportPublicAuctionAsset = async ({
  queryKey,
}: QueryFunctionContext<[string, PublicAuctionAssetParam]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/private/dgts/report-public-auction-asset-by-day`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<PublicAuctionAssetResponse[]>;
};

export const addAuctioneer = async (data: Partial<AuctioneerPrivate>) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer`,
    data
  );
  return response?.data as AuctioneerItemPrivate;
};

export const updateAuctioneer = async (data: AuctioneerPrivate) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${data.uuid}`,
    data
  );
  return response?.data as AuctioneerItemPrivate;
};

export const addCertificateForAuctioneer = async ({
  data,
  uuid,
}: {
  data: Partial<CertificateSectionItem>;
  uuid: string;
}) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${uuid}/cert`,
    data
  );
  return response?.data as CertificateSectionItem;
};

export const updateCertificateForAuctioneer = async ({
  data,
  uuid,
}: {
  data: Partial<CertificateSectionItem>;
  uuid: string;
}) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${uuid}/cert/${data.uuid}`,
    data
  );
  return response?.data as CertificateSectionItem;
};

export const deleteCertificateForAuctioneer = async ({
  auctioneerId,
  uuid,
}: {
  auctioneerId: string;
  uuid: string[];
}) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${auctioneerId}/cert`,
    {
      data: uuid,
      paramsSerializer: { indexes: null },
    }
  );
  return response?.data;
};

export const addCardForAuctioneer = async ({
  data,
  uuid,
}: {
  data: Partial<CardSectionItem>;
  uuid: string;
}) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${uuid}/card`,
    data
  );
  return response?.data as CardSectionItem;
};

export const updateCardForAuctioneer = async ({
  data,
  uuid,
}: {
  data: Partial<CardSectionItem>;
  uuid: string;
}) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${uuid}/card/${data.uuid}`,
    data
  );
  return response?.data as CardSectionItem;
};

export const deleteCardForAuctioneer = async ({
  auctioneerId,
  uuid,
}: {
  auctioneerId: string;
  uuid: string[];
}) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${auctioneerId}/card`,
    {
      data: uuid,
      paramsSerializer: { indexes: null },
    }
  );
  return response?.data;
};

export const uploadFilesForCert = async ({
  data,
  id,
}: {
  data: File[];
  id: string;
}) => {
  if (!data || data.length === 0) return [];

  const formData = new FormData();
  data.forEach((file) => {
    formData.append("files", file);
  });
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/cert/${id}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response?.data as string[];
};

export const deleteFilesForCert = async ({
  uuid,
  filePaths,
}: {
  uuid: string;
  filePaths: string[];
}) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/cert/${uuid}/attachments`,
    {
      data: filePaths,
    }
  );
  return response?.data;
};

export const uploadFilesForCard = async ({
  data,
  id,
}: {
  data: File[];
  id: string;
}) => {
  if (!data || data.length === 0) return [];

  const formData = new FormData();
  data.forEach((file) => {
    formData.append("files", file);
  });
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/card/${id}/attachments`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response?.data as string[];
};

export const deleteFilesForCard = async ({
  uuid,
  filePaths,
}: {
  uuid: string;
  filePaths: string[];
}) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/card/${uuid}/attachments`,
    {
      data: filePaths,
    }
  );
  return response?.data;
};

export const getAuctioneerById = async (
  id: string,
  type?: "client" | "server"
) => {
  const client = type === "server" ? axiosServer : axiosClient;

  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/${id}`
  );
  return response?.data as AuctioneerDetailPrivate;
};

export const getListAuctioneerCert = async () => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/cert`
  );
  return response?.data as { auctioneerId: string; certCode: string }[];
};

export const getAuctioneerDetailByCert = async (certCode: string) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/detail`,
    {
      params: { "cert-code": certCode },
    }
  );
  return response?.data as AuctioneerDetailPrivate;
};

export const getAuctionOrgByIdPrivate = async (
  id: string,
  isBasicInfo?: boolean
) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/${id}`,
    { params: { "is-basic-info": isBasicInfo || false } }
  );
  return response?.data as AuctionOrgDetailItem;
};

export const addAuctionOrgPrivate = async (
  data: Partial<AuctionOrgDetailItem>
) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization`,
    data
  );
  return response?.data as AuctionOrgDetailItem;
};

export const updateAuctionOrgPrivate = async (
  id: string,
  data: AuctionOrgDetailItem
) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/${id}`,
    data
  );
  return response?.data as AuctionOrgDetailItem;
};

export const addMemberPartner = async (
  id: string,
  data: Partial<AuctionOrgMemberPartners>[]
) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/${id}/member-partner`,
    data
  );
  return response?.data as AuctionOrgMemberPartners;
};

export const updateMemberPartner = async (
  parentId: string,
  data: AuctionOrgMemberPartners
) => {
  const response = await axiosClient.put(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/${parentId}/member-partner/${data.uuid}`,
    data
  );
  return response?.data as AuctionOrgMemberPartners;
};

export const deleteMemberPartner = async (parentId: string, id: string[]) => {
  const response = await axiosClient.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/${parentId}/member-partner`,
    {
      data: id,
    }
  );
  return response?.data;
};

export const exportAuctioneer = async (params: AuctioneerParamsPrivate) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/export`,
    {
      params: { ...params, page: params.page - 1 < 0 ? 0 : params.page - 1 },
      responseType: "blob",
      paramsSerializer: { indexes: null },
    }
  );
  return response?.data as Blob;
};

export const checkCertExist = async (
  certCode: string,
  certId?: string
): Promise<boolean> => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auctioneer/cert/exist`,
    {
      params: { "cert-code": certCode, "cert-id": certId ? certId : "" },
    }
  );
  return response?.data as boolean;
};

// Check if card exists for an auction organization
export const checkCardExist = async (
  organizationId: string,
  cardCode: string,
  cardId?: string
): Promise<boolean> => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/${organizationId}/card/exist`,
    {
      params: { "card-code": cardCode, "card-id": cardId ? cardId : "" },
    }
  );
  return response?.data as boolean;
};
