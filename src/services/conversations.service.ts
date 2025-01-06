import {
   getFetchConversation,
   postSearchConversation,
   postStartConversation,
} from "@/apis/conversations"
import type { TUserWithProfile } from "@/utils/types"
import { ConversationError } from "@/utils/custom-errors"
import { EConversationErrMsgs } from "@/utils/enums"
import type {
   T1v1Conversation,
   TSearchConversationParams,
   TStartConversationParams,
} from "@/apis/types"

class ConversationService {
   async searchConversation(payload: TSearchConversationParams): Promise<TUserWithProfile[]> {
      const { data } = await postSearchConversation(payload)
      return data
   }

   async startConversation(payload: TStartConversationParams): Promise<T1v1Conversation> {
      const { data } = await postStartConversation(payload)
      return data
   }

   async fetchConversation(conversationId: number): Promise<T1v1Conversation> {
      const { data } = await getFetchConversation(conversationId)
      if (!data) {
         throw new ConversationError(EConversationErrMsgs.CONV_NOT_FOUND)
      }
      return data
   }
}

export const conversationService = new ConversationService()
