import { getFetchDirectChat, postSearchDirectChat, postStartDirectChat } from "@/apis/direct-chat"
import type { TUserWithProfile } from "@/utils/types"
import { DirectChatError } from "@/utils/custom-errors"
import { EDirectChatErrMsgs } from "@/utils/enums"
import type { TDirectChatData, TSearchDirectChatParams, TStartDirectChatParams } from "@/apis/types"

class DirectChatService {
   async searchDirectChat(payload: TSearchDirectChatParams): Promise<TUserWithProfile[]> {
      const { data } = await postSearchDirectChat(payload)
      return data
   }

   async startDirectChat(payload: TStartDirectChatParams): Promise<TDirectChatData> {
      const { data } = await postStartDirectChat(payload)
      return data
   }

   async fetchDirectChat(directChatId: number): Promise<TDirectChatData> {
      const { data } = await getFetchDirectChat(directChatId)
      if (!data) {
         throw new DirectChatError(EDirectChatErrMsgs.CONV_NOT_FOUND)
      }
      return data
   }
}

export const directChatService = new DirectChatService()
