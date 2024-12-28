import type {
   TRegisterUserParams,
   TSearchUsersData,
   TSuccess,
   TUserWithProfile,
} from "@/utils/types"
import { client_axios } from "@/configs/axios"
import { request_config } from "./init"

export const getUserByEmail = (email: string) =>
   client_axios.get<TUserWithProfile>("/user/getUserByEmail?email=" + email)

export const postRegisterUser = (data: TRegisterUserParams) =>
   client_axios.post<TSuccess>("/user/register", data, request_config)

export const getSearchUsers = (keyword: string) =>
   client_axios.get<TSearchUsersData[]>("/user/search-users", { params: { keyword } })
