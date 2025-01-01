import type { TSuccess, TUserWithoutPassword } from "@/utils/types"
import { client_axios } from "@/configs/axios"
import { requestConfig } from "./init"
import type { TLoginUserParams } from "./types"

export const postLoginUser = (data: TLoginUserParams) =>
   client_axios.post<TSuccess>("/auth/login", data, requestConfig)

export const getCheckAuth = () =>
   client_axios.get<TUserWithoutPassword>("/auth/check-auth", requestConfig)
