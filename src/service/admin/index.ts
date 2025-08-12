import axiosClient from "@/axios/axiosClient";
import {
  AuthItem,
  AuthListParams,
  AuthorityDetail,
  GroupDataAdd,
  HistorySystemListItem,
  HistorySystemParams,
  UserAddParams,
  UserGroupItem,
  UserGroupParams,
  UserListItem,
  UserSearchParams,
} from "@/types/admin";
import {
  MicroserviceResponse,
  ResponseBaseData,
  ResponseBaseDataWithTotal,
} from "@/types/common";
import { QueryFunctionContext } from "@tanstack/react-query";

// Danh sách nhóm quyền
export const searchUserGroup = async ({
  queryKey,
}: QueryFunctionContext<[string, UserGroupParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/system/group/search`,
    {
      params,
    }
  );
  return response?.data as ResponseBaseData<UserGroupItem>;
};

// Lấy danh sách quyền
export const getListAuthoritySearch = async (params: AuthListParams) => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/authority/search`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<AuthItem>>;
};

// Lấy danh sách quyền cấp cha
export const getListAuthParent = async ({
  queryKey,
}: QueryFunctionContext<[string, { type?: string }]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/authority/get-list-auth-parent`,
    { params }
  );
  return response?.data as AuthItem[];
};

// Lấy chi tiết nhóm quyền
export const getDetailGroup = async ({
  queryKey,
}: QueryFunctionContext<[string, { id: string | string[] }]>) => {
  const [, data] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/system/group/detail/${data?.id}`
  );
  return response?.data as MicroserviceResponse<AuthorityDetail>;
};

// Thêm nhóm quyền
export const addGroup = async (body: GroupDataAdd) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/system/group/add`,
    body
  );
  return response.data;
};

// Sửa nhóm quyền
export const editGroup = async (body: GroupDataAdd) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/system/group/edit`,
    body
  );
  return response.data;
};

// Xóa nhóm quyền
export const deleteGroup = async (data: UserGroupItem) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/system/group/delete?id=${data?.id}`
  );
  return response.data;
};

// Danh sách người dùng
export const searchUser = async ({
  queryKey,
}: QueryFunctionContext<[string, UserSearchParams]>) => {
  const [, params] = queryKey;
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/list`,
    {
      params,
    }
  );
  return response?.data as MicroserviceResponse<ResponseBaseData<UserListItem>>;
};

// Thêm người dùng
export const addUser = async (body: UserAddParams) => {
  const response = await axiosClient.post(
    `${process.env.NEXT_PUBLIC_API_URL}/user/add`,
    body
  );
  return response.data;
};

export const searcHistorySystemListData = async ({
  queryKey,
}: QueryFunctionContext<[string, HistorySystemParams]>) => {
  const [, params] = queryKey;

  const paramsNew = Object.assign(
    {},
    {
      page: params.pageNumber - 1,
      size: params.numberPerPage,
      input: params.input ?? "",
    }
  );

  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/search-log`,
    {
      params: paramsNew,
    }
  );

  return response?.data as ResponseBaseDataWithTotal<HistorySystemListItem>;
};

export const dashboardReportTotal = async () => {
  const response = await axiosClient.get(
    `${process.env.NEXT_PUBLIC_API_URL}/dashboard/report-total`
  );
  return response?.data as {
    totalNotary: number;
    totalLawyer: number;
    totalAuction: number;
    totalOrgNotary: number;
  };
};
