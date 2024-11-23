import type { AxiosRequestConfig } from "axios"
import type { TSuccess, TUserWithoutPassword } from "@/utils/types"
import type { TLoginUserParams } from "@/utils/types"
import { client_axios } from "@/configs/axios"

const request_config: AxiosRequestConfig = {
   withCredentials: true,
}

const postLoginUser = (data: TLoginUserParams) =>
   client_axios.post<TSuccess>("/auth/login", data, request_config)

const postCheckAuth = () =>
   client_axios.post<TUserWithoutPassword>("/auth/checkAuth", {}, request_config)

export { postLoginUser, postCheckAuth }
