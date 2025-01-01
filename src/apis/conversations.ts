import { client_axios } from "@/configs/axios"
import type { TUserWithProfile } from "@/utils/types"
import { requestConfig } from "./init"
import type {
   TDirectConversation,
   TSearchConversationParams,
   TStartConversationParams,
} from "./types"

export const postSearchConversation = (data: TSearchConversationParams) =>
   client_axios.post<TUserWithProfile[]>("/conversations/search", data, requestConfig)

export const postStartConversation = (data: TStartConversationParams) =>
   client_axios.post<TDirectConversation>("/conversations/start", data, requestConfig)

export const getFetchConversation = (id: number) =>
   client_axios.get<TDirectConversation>("/conversations/fetch/" + id, requestConfig)
