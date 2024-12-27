import {
   getFetchConversation,
   postSearchConversation,
   postStartConversation,
} from "@/apis/conversations"
import type {
   TDirectConversation,
   TSearchConversationParams,
   TStartConversationParams,
   TUserWithProfile,
} from "@/utils/types"
import { ConversationError } from "@/utils/custom-errors"
import { EConversationErrMsgs } from "@/utils/enums"

class ConversationService {
   async searchConversation(payload: TSearchConversationParams): Promise<TUserWithProfile[]> {
      const { data } = await postSearchConversation(payload)
      return data
   }

   async startConversation(payload: TStartConversationParams): Promise<TDirectConversation> {
      const { data } = await postStartConversation(payload)
      return data
   }

   async fetchConversation(conversationId: number): Promise<TDirectConversation> {
      const { data } = await getFetchConversation(conversationId)

      if (!data) {
         throw new ConversationError(EConversationErrMsgs.CONV_NOT_FOUND)
      }
      return data
   }
}

export const conversationService = new ConversationService()
