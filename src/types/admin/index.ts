import { CommonParams, CommonParams_v2 } from "../common";

export interface UserGroupParams extends CommonParams {
  filterName?: string;
  type?: number;
}

export interface UserGroupItem {
  createBy?: string;
  updateBy?: string;
  genDate?: string;
  lastUpdated?: string;
  id: number;
  groupName: string;
  status: number;
  description?: string;
  type: number;
  isDefault: number;
}

export interface AuthListParams extends CommonParams {
  authKey?: string;
  type?: string;
}

export interface AuthItem {
  createBy?: string;
  updateBy?: string;
  genDate: string;
  lastUpdated: string;
  id: number;
  authority: string;
  fid: number;
  description?: string;
  orderId: number;
  authKey: string;
}

export type GroupDataAdd = {
  description?: string;
  groupName?: string;
  listAuthority: string;
  isDefault?: number;
  type?: number;
  id?: number;
};

export interface AuthorityDetail {
  item: {
    id: number;
    groupName: string;
    description: string;
    listAuthority: string;
    isDefault: number;
    type: number;
  };
  listAuthority: {
    parent: AuthItem;
    childrens?: AuthItem[];
  }[];
}

export interface UserSearchParams extends CommonParams {
  username?: string;
  fullName?: string;
  type?: string;
}

export interface UserListItem {
  id: number;
  username: string;
  fullName: string;
  type: number;
  administrationId: number;
}

export interface UserAddParams {
  username: string;
  fullName: string;
  type: number;
  administrationId: number;
  password: string;
}

export enum ActionType {
  ADD = "Thêm",
  EDIT = "Sửa",
  DELETE = "Xóa",
}

export enum ActorType {
  PER = "Cá nhân",
  ORG = "Tổ chức",
}

export enum GroupType {
  LAWYER = "Luật sư",
  NOTARY = "Công chứng",
  Auction = "Đấu giá",
}

type ActionTypeKeys = keyof typeof ActionType;
type ActorTypeKeys = keyof typeof ActorType;
type GroupTypeKeys = keyof typeof GroupType;

export interface HistorySystemParams extends CommonParams {
  input?: string;
}

export interface HistorySystemListItem {
  id?: number;
  objectName: string;
  actions: ActionType;
  group?: GroupTypeKeys;
  actor?: ActorTypeKeys;
  createByStr: string;
  genDate: string;
  ip: string;
}
