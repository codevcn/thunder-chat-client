import { getFetchMessages } from "@/apis/messages"

// >>> fix this: remove
import { dev_test_values } from "@/providers/test"

class MessageService {
   async fetchMessages(conversationId: number) {
      // const { data } = await getFetchMessages(conversationId)
      // return data
      return await dev_test_values.getTestMessages()
   }
}

export const messageService = new MessageService()
