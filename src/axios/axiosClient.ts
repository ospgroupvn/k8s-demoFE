import axios from "axios"
import { getSession, signOut } from "next-auth/react"

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
})
axiosClient.interceptors.request.use(async request => {
  const session = await getSession()
  const accessToken = session?.user?.accessToken ?? process.env.NEXT_PUBLIC_BASE_AUTH
  const accessHeader = `Bearer ${accessToken}`
  if (request.headers) {
    request.headers["Authorization"] = accessHeader
  }
  return request
})

axiosClient.interceptors.response.use(
  async response => {
    return response
  },
  error => {
    if (error?.response?.status === 401) {
      signOut()
    }

    return Promise.reject(error)
  }
)
export default axiosClient
