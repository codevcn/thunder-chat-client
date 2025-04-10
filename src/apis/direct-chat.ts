import { client_axios } from "@/configs/axios"
import type { TUserWithProfile } from "@/utils/types"
import { requestConfig } from "./init"
import type { TDirectChatData, TSearchDirectChatParams, TStartDirectChatParams } from "./types"

export const postSearchDirectChat = (data: TSearchDirectChatParams) =>
   client_axios.post<TUserWithProfile[]>("/direct-chat/search", data, requestConfig)

export const postStartDirectChat = (data: TStartDirectChatParams) =>
   client_axios.post<TDirectChatData>("/direct-chat/start", data, requestConfig)

export const getFetchDirectChat = (id: number) =>
   client_axios.get<TDirectChatData>("/direct-chat/fetch/" + id, requestConfig)
