import type { TSuccess, TUserWithProfile } from "@/utils/types"
import { client_axios } from "@/configs/axios"
import { requestConfig } from "./init"
import type { TRegisterUserParams, TSearchUsersData, TSearchUsersParams } from "./types"

export const getUserByEmail = (email: string) =>
   client_axios.get<TUserWithProfile>("/user/get-user?email=" + email)

export const postRegisterUser = (data: TRegisterUserParams) =>
   client_axios.post<TSuccess>("/user/register", data, requestConfig)

export const getSearchUsers = (payload: TSearchUsersParams) =>
   client_axios.get<TSearchUsersData[]>("/user/search-users", { params: payload })
