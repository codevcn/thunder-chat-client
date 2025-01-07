import { clientSocket } from "@/configs/socket"
import { MAX_TIMEOUT_MESSAGING } from "@/utils/constants"
import { ESocketEvents } from "@/utils/events/socket-events"
import type { TSendDirectMessageErrorRes, TSuccess } from "@/utils/types"

class ChattingService {
   async sendMessage(
      receiverId: number,
      message: string,
      directChatId: number,
      token: string,
      timestamp: Date,
      callback: (data: TSendDirectMessageErrorRes | TSuccess) => void
   ): Promise<void> {
      clientSocket.socket
         .timeout(MAX_TIMEOUT_MESSAGING)
         .emit(
            ESocketEvents.send_message_direct,
            { message, receiverId, directChatId, token, timestamp },
            (error, data) => {
               if (error) {
                  console.log(">>> try again send message:", token)
                  this.sendMessage(receiverId, message, directChatId, token, timestamp, callback)
               } else {
                  callback(data)
               }
            }
         )
   }
}

export const chattingService = new ChattingService()
