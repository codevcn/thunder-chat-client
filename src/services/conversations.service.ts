import {
   getFetchConversation,
   postSearchConversation,
   postStartConversation,
} from "@/apis/conversations"
import type { TSearchConversationParams, TStartConversationParams } from "@/utils/types"
import { ConversationError } from "@/utils/custom-errors"
import { EConversationErrMsgs } from "@/utils/enums"

class ConversationService {
   async searchConversationService(payload: TSearchConversationParams) {
      try {
         const { data } = await postSearchConversation(payload)
         return data
      } catch (error) {
         throw error
      }
   }

   async startConversationService(payload: TStartConversationParams) {
      try {
         const { data } = await postStartConversation(payload)
         return data
      } catch (error) {
         throw error
      }
   }

   async fetchConversationService(conversationId: number) {
      try {
         const { data } = await getFetchConversation(conversationId)

         if (data) return data
         else throw new ConversationError(EConversationErrMsgs.CONV_NOT_FOUND)
      } catch (error) {
         throw error
      }
   }
}

export const conversationService = new ConversationService()
