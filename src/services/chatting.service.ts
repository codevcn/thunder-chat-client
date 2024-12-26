import socketClient from "@/configs/socket"
import { EChattingEvents } from "@/utils/events/chatting-events"
import type { TUnknownFunction } from "@/utils/types"

type TMessage = {
   receiverId: number
   message: string
   conversationId: number
}

class ChattingService {
   sendMessage(message: TMessage, callback: TUnknownFunction<void>) {
      socketClient.emit(EChattingEvents.send_message_1v1, message, (res: unknown) => {
         callback(res)
      })
   }
}

export const chattingService = new ChattingService()
