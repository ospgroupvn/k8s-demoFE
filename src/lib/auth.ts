// import { SERVICE_USER } from "@/constants"
// import { IUserInfoResponse } from "@/types"
import { IUserInfoResponse, MicroserviceResponse } from "@/types/common";
import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// TODO: placeholder file, đợi khi có API sẽ update auth
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
        const url =
          process.env.NEXT_PUBLIC_API_URL +
          //   SERVICE_USER +
          "/api/users/login-cms";
        const userInfo = await fetch(url, {
          mode: "cors",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(credentials),
        })
          .then((res) => res.json())
          .catch((err) => {
            console.error(err);
          });

        if (userInfo?.data) {
          // Gọi userInfo ban đầu sau khi login thành công
          const userDetailInfo: MicroserviceResponse<IUserInfoResponse> =
            await fetch(
              `${process.env.NEXT_PUBLIC_API_URL}/api/partner/app/getInfo`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userInfo?.data?.accessTokenInfo?.accessToken}`,
                },
              }
            )
              .then((res) => res.json())
              .catch((err) => {
                console.error(err);
              });

          if (userDetailInfo?.data?.userId) {
            // let { listAuthority, ...rest } = userDetailInfo?.data
            return {
              ...userInfo,
              data: {
                ...userInfo.data,
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
          //   authorities: user?.data?.authorities,
          //   accessToken: user?.data?.accessTokenInfo?.accessToken || "",
          //   selectCompany: user?.data?.selectCompany || "",
          //   ...user?.data,
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
        },
      };

      return session;
    },
  },
  // debug: true,
};
