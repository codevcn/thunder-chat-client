import { clientSocket } from "@/configs/socket"
import { MAX_TIMEOUT_MESSAGING } from "@/utils/constants"
import { ESocketEvents } from "@/utils/events/socket-events"
import type { TChattingPayload } from "@/utils/events/types"
import type { TOfflineMessage, TSendMessageCallback } from "@/utils/types"

class ChattingService {
   private offlineMessages: TOfflineMessage[] = []
   private messagesQueue: TChattingPayload[] = []
   private acknowledgmentFlag: boolean = true

   async sendMessage(
      receiverId: number,
      message: string,
      directChatId: number,
      token: string,
      timestamp: Date,
      callback: TSendMessageCallback
   ): Promise<void> {
      if (clientSocket.socket.connected) {
         if (this.getAcknowledgmentFlag()) {
            this.setAcknowledgmentFlag(false)
            clientSocket.socket
               .timeout(MAX_TIMEOUT_MESSAGING)
               .emit(
                  ESocketEvents.send_message_direct,
                  { message, receiverId, directChatId, token, timestamp },
                  (error, data) => {
                     if (error) {
                        this.saveOfflineMessage(receiverId, message, directChatId, token, timestamp)
                     } else {
                        callback(data)
                     }
                  }
               )
         } else {
            this.messagesQueue.push({ directChatId, message, receiverId, timestamp, token })
         }
      } else {
         this.saveOfflineMessage(receiverId, message, directChatId, token, timestamp)
      }
   }

   async sendOfflineMessages(): Promise<void> {
      this.recursiveSendingOfflineMessages()
   }

   recursiveSendingQueueMessages() {
      const message = this.getQueueMessages().shift()
      if (message) {
         this.sendMessage(
            message.receiverId,
            message.message,
            message.directChatId,
            message.token,
            message.timestamp,
            (data) => {
               if ("success" in data && data.success) {
                  this.setAcknowledgmentFlag(true)
                  this.recursiveSendingQueueMessages()
               }
            }
         )
      }
   }

   recursiveSendingOfflineMessages() {
      const message = this.getOfflineMessages().shift()
      if (message) {
         this.sendMessage(
            message.receiverId,
            message.message,
            message.directChatId,
            message.token,
            message.timestamp,
            (data) => {
               if ("success" in data && data.success) {
                  this.setAcknowledgmentFlag(true)
                  this.recursiveSendingOfflineMessages()
               }
            }
         )
      }
   }

   saveOfflineMessage(
      receiverId: number,
      message: string,
      directChatId: number,
      token: string,
      timestamp: Date
   ): void {
      let offlineMessages = this.getOfflineMessages()
      const newMessage = { token, message, receiverId, directChatId, timestamp }
      if (offlineMessages && offlineMessages.length > 0) {
         offlineMessages = [...offlineMessages, newMessage]
      } else {
         offlineMessages = [newMessage]
      }
      this.setOfflineMessages(offlineMessages)
   }

   setAcknowledgmentFlag(flag: boolean): void {
      this.acknowledgmentFlag = flag
   }

   getAcknowledgmentFlag(): boolean {
      return this.acknowledgmentFlag
   }

   getQueueMessages(): TChattingPayload[] {
      return this.messagesQueue
   }

   getOfflineMessages(): TOfflineMessage[] {
      return this.offlineMessages
   }

   setOfflineMessages(messages: TOfflineMessage[]): void {
      this.offlineMessages = messages
   }

   clearOfflineMessages(): void {
      this.offlineMessages = []
   }
}

export const chattingService = new ChattingService()
