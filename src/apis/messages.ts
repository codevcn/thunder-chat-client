import { client_axios } from "@/configs/axios"
import type { TMessage } from "@/utils/types"
import { requestConfig } from "./init"

export const getfetchDirectMessages = (directChatId: number) =>
   client_axios.get<TMessage[]>("message/messages/" + directChatId, requestConfig)
