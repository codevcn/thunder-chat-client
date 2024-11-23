import type { TRegisterUserParams, TSuccess, TUserWithProfile } from "@/utils/types"
import { client_axios } from "@/configs/axios"
import type { AxiosRequestConfig } from "axios"

const request_config: AxiosRequestConfig = {
   withCredentials: true,
}

const getUserByEmail = (email: string) =>
   client_axios.get<TUserWithProfile>("/user/getUserByEmail?email=" + email)

const postRegisterUser = (data: TRegisterUserParams) =>
   client_axios.post<TSuccess>("/user/register", data, request_config)

export { getUserByEmail, postRegisterUser }
