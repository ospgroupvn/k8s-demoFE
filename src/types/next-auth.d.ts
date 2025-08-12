import { type DefaultSession } from "next-auth"
import { IUserInfoResponse } from "./common"

declare module "next-auth" {
  interface Session {
    user?: {
      userId: number
      username: string
      accessToken: string
      type: number
      authorities: string[]
      accessTokenInfo: {
        expiresIn?: number
      }
    } & DefaultSession["user"] &
      Omit<IUserInfoResponse, "listAuthority">
  }

  interface User {
    data: {
      // userId: number
      type: number
      // userName: string
      accessTokenInfo: {
        accessToken: string
        expiresIn: number
      }
      // authorities: string[]
      lastChangePassword: string
    } & Omit<IUserInfoResponse, "listAuthority">
  }
}
