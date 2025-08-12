// import { SERVICE_USER } from "@/constants"
// import { IUserInfoResponse } from "@/types"
import { IUserInfoResponse, MicroserviceResponse } from "@/types/common";
import axios from "axios";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      id: "login",
      name: "login",
      credentials: {
        username: {
          label: "Tên đăng nhập",
          type: "text",
        },
        password: {
          label: "Mật khẩu",
          type: "password",
        },
      },
      authorize: async (credentials) => {
        const url = process.env.NEXT_PUBLIC_API_URL + "/auth/login";
        const userInfo = await axios
          .post(url, credentials, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_BASE_AUTH}`,
            },
          })
          .then((res) => {
            return res.data;
          })
          .catch((err) => console.log(err));

        if (userInfo?.data) {
          // Gọi userInfo ban đầu sau khi login thành công
          // const userDetailInfo: MicroserviceResponse<IUserInfoResponse> =
          //   await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, {
          //     method: "GET",
          //     headers: {
          //       "Content-Type": "application/json",
          //       Authorization: `Bearer ${userInfo?.data?.accessTokenInfo?.accessToken}`,
          //     },
          //   })
          //     .then((res) => res.json())
          //     .catch((err) => {
          //       console.error(err);
          //     });

          const userDetailInfo: MicroserviceResponse<IUserInfoResponse> =
            await axios
              .get(`${process.env.NEXT_PUBLIC_API_URL}/user/info`, {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo?.data?.accessTokenInfo?.accessToken}`,
                },
              })
              .then((res) => res.data)
              .catch((err) => {
                console.error(err);
              });

          if (userDetailInfo?.data?.username) {
            // let { listAuthority, ...rest } = userDetailInfo?.data;
            return {
              ...userInfo,
              data: {
                ...userInfo.data,
                ...userDetailInfo?.data,
                authorities: userDetailInfo?.data?.listAuthority,
                // ...rest,
              },
            };
          } else {
            throw new Error(userDetailInfo?.message || "Đã có lỗi xảy ra");
          }
        } else {
          throw new Error(userInfo?.message || "Đã có lỗi xảy ra");
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt(params) {
      const { user, token, session } = params;
      // Initial call
      if (user) {
        return {
          ...user?.data,
          authorities: user?.data?.authorities,
          accessToken: user?.data?.accessTokenInfo?.accessToken || "",
          //   selectCompany: user?.data?.selectCompany || "",
        };
      }
      return { ...token, ...(session?.user ? { ...session.user } : {}) };
    },
    async session({ session, token }) {
      session = {
        ...session,
        user: {
          ...session.user,
          ...token,
          userId: token?.userId as number,
          username: token?.username as string,
          accessToken: token?.accessToken as string,
          fullName: token?.fullName as string,
          type: token?.type as number,
          authorities: token?.authorities as string[],
          accessTokenInfo: {
            ...session.user?.accessTokenInfo,
          },
          administrationId: token?.administrationId as number,
        },
      };

      return session;
    },
  },
  // debug: true,
};
