import type { TSuccess, TUserWithoutPassword } from "@/utils/types"
import { clientAxios, requestConfig } from "@/configs/axios"
import type { TLoginUserParams } from "./types"

export const postLoginUser = (data: TLoginUserParams) =>
   clientAxios.post<TSuccess>("/auth/login", data, requestConfig)

export const getCheckAuth = () =>
   clientAxios.get<TUserWithoutPassword>("/auth/check-auth", requestConfig)
