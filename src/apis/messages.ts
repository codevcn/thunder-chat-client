import { client_axios } from "@/configs/axios"
import type { TMessage } from "@/utils/types"
import { requestConfig } from "./init"

export const getFetchMessages = (conversationId: number) =>
   client_axios.get<TMessage[]>("message/messages/" + conversationId, requestConfig)
