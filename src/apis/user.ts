import type { TSuccess, TUserWithProfile } from "@/utils/types"
import { clientAxios, requestConfig } from "@/configs/axios"
import type { TRegisterUserParams, TSearchUsersData, TSearchUsersParams } from "./types"

export const getUserByEmail = (email: string) =>
   clientAxios.get<TUserWithProfile>("/user/get-user?email=" + email)

export const postRegisterUser = (data: TRegisterUserParams) =>
   clientAxios.post<TSuccess>("/user/register", data, requestConfig)

export const getSearchUsers = (payload: TSearchUsersParams) =>
   clientAxios.get<TSearchUsersData[]>("/user/search-users", { params: payload })
