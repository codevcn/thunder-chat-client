import { getFetchDirectMessages } from "@/apis/messages"
import type { TGetDirectMessagesData, TGetDirectMsgsParamsDTO } from "@/apis/types"

class MessageService {
   async fetchDirectMessages(params: TGetDirectMsgsParamsDTO): Promise<TGetDirectMessagesData> {
      const { data } = await getFetchDirectMessages(params)
      console.log(">>> data:", data)
      return data
   }
}

export const messageService = new MessageService()
