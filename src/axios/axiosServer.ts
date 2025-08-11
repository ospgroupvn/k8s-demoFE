import { authOptions } from "@/lib/auth"
import axios from "axios"
import { getServerSession } from "next-auth"

const axiosServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
})
axiosServer.interceptors.request.use(async request => {
  const session = await getServerSession(authOptions)
  let accessToken = ""
  if (session?.user?.accessToken) {
    accessToken = session?.user.accessToken
  }
  const accessHeader = `Bearer ${accessToken}`
  if (request.headers) {
    request.headers["Authorization"] = accessHeader
  }
  return request
})
export default axiosServer
