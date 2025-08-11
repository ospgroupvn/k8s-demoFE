export type MicroserviceResponse<T> = {
  code: number;
  message: string;
  data: T;
  success?: boolean;
};

export type IUserInfoResponse = {
  userId: number;
  username: string;
  accessToken: string;
  fullName: string;
  authorities: string[]
};
