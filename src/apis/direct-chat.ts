import { clientAxios, clientSideAxios, requestConfig } from "@/configs/axios"
import type { TDirectChatData } from "./types"
import { TGetEmojisRes } from "@/app/api/types"

export const getFetchDirectChat = (id: number) =>
   clientAxios.get<TDirectChatData>("/direct-chat/fetch/" + id, requestConfig)

export const getFetchEmojis = () =>
   clientSideAxios.get<TGetEmojisRes>("/api/emojis", {
      ...requestConfig,
      headers: {
         "Cache-Control": "no-store",
      },
   })
