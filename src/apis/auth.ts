import type { TSuccess, TUserWithoutPassword } from "@/utils/types"
import type { TLoginUserParams } from "@/utils/types"
import { client_axios } from "@/configs/axios"
import { request_config } from "./init"

export const postLoginUser = (data: TLoginUserParams) =>
   client_axios.post<TSuccess>("/auth/login", data, request_config)

export const postCheckAuth = () =>
   client_axios.get<TUserWithoutPassword>("/auth/check-auth", request_config)
