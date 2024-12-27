import type {
   TRegisterUserParams,
   TSearchUserData,
   TSuccess,
   TUserWithProfile,
} from "@/utils/types"
import { client_axios } from "@/configs/axios"
import type { AxiosRequestConfig } from "axios"

const request_config: AxiosRequestConfig = {
   withCredentials: true,
}

export const getUserByEmail = (email: string) =>
   client_axios.get<TUserWithProfile>("/user/getUserByEmail?email=" + email)

export const postRegisterUser = (data: TRegisterUserParams) =>
   client_axios.post<TSuccess>("/user/register", data, request_config)

export const getSearchUsers = (keyword: string) =>
   client_axios.get<TSearchUserData[]>("/user/search-users", { params: { keyword } })
