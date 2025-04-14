import { clientAxios, requestConfig } from "@/configs/axios"
import type { TGetDirectMessagesData, TGetDirectMsgsParamsDTO } from "./types"

export const getFetchDirectMessages = (params: TGetDirectMsgsParamsDTO) =>
   clientAxios.get<TGetDirectMessagesData>("message/get-direct-messages/", {
      ...requestConfig,
      params,
   })
