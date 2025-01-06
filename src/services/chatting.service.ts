import { clientSocket } from "@/configs/socket"
import { MAX_TIMEOUT_MESSAGING } from "@/utils/constants"
import { ESocketEvents } from "@/utils/events/socket-events"
import type { TUnknownFunction } from "@/utils/types"

class ChattingService {
   async sendMessage<P>(
      receiverId: number,
      message: string,
      conversationId: number,
      token: string,
      callback: TUnknownFunction<P, void>
   ): Promise<void> {
      clientSocket.socket
         .timeout(MAX_TIMEOUT_MESSAGING)
         .emit(
            ESocketEvents.send_message_1v1,
            { message, receiverId, conversationId, token },
            (error, data) => {
               if (error) {
                  this.sendMessage(receiverId, message, conversationId, token, callback)
               }
            }
         )
   }
}

export const chattingService = new ChattingService()
