import axiosClient from "@/axios/axiosClient";
import axiosServer from "@/axios/axiosServer";
import {
  DepartmentItem,
  MicroserviceResponse,
  NationItem,
  ProvinceItem,
  WardItem,
} from "@/types/common";

// Lấy danh sách tỉnh thành
export const getListProvince = async (type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/common/getListProvince`
  );
  return response?.data as MicroserviceResponse<ProvinceItem[]>;
};

export const getListWard = async (id: string, type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/common/getListWard/${id}`
  );
  return response?.data as MicroserviceResponse<WardItem[]>;
};

// Lấy danh sách quốc gia
export const getListNation = async (type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/public/common/nation`
  );
  return response?.data as MicroserviceResponse<NationItem[]>;
};

// Lấy danh sách STP
export const getListDepartment = async (type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/category/department`
  );
  return response?.data as DepartmentItem[];
};

export const getListProvinceNew = async (type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/category/province`
  );
  return response?.data as ProvinceItem[];
};

export const getListWardNew = async (
  provinceCode: string,
  type?: "client" | "server"
) => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/category/ward?province-code=${provinceCode}`
  );
  return response?.data as WardItem[];
};

export const getListPlaceOfIssue = async (type?: "client" | "server") => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/category/place-of-issue`
  );
  return response?.data as DepartmentItem[];
};

export const downloadFile = async ({
  filePath,
  fileName,
}: {
  filePath: string;
  fileName: string;
}) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/file-storage?file-path=${filePath}&file-name=${fileName}`,
    {
      responseType: "blob",
    }
  );
  return response?.data as Blob;
};

export const getListAuctionOrg = async (
  departmentCode?: string,
  orgType?: string[],
  type?: "client" | "server"
) => {
  const client = type === "server" ? axiosServer : axiosClient;
  const response = await client.get(
    `${process.env.NEXT_PUBLIC_API_URL}/auction-organization/all`,
    {
      params: {
        "department-code": departmentCode,
        type: orgType,
      },
      paramsSerializer: { indexes: null },
    }
  );
  return response?.data as { uuid: string; fullName: string }[];
};
