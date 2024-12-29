import { clientSocket } from "@/configs/socket"
import { ESocketEvents } from "@/utils/events/socket-events"
import type { TChattingPayload } from "@/utils/events/types"
import type { TUnknownFunction } from "@/utils/types"

class ChattingService {
   async sendMessage(message: TChattingPayload, callback: TUnknownFunction<void>): Promise<void> {
      clientSocket.emit(ESocketEvents.send_message_1v1, message, (res: unknown) => {
         callback(res)
      })
   }
}

export const chattingService = new ChattingService()
