import { client_axios } from "@/configs/axios"
import { requestConfig } from "./init"
import type { TGetDirectMessagesData, TGetDirectMsgsParamsDTO } from "./types"

export const getFetchDirectMessages = (params: TGetDirectMsgsParamsDTO) =>
   client_axios.get<TGetDirectMessagesData>("message/get-direct-messages/", {
      ...requestConfig,
      params,
   })
