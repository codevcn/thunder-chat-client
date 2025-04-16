import type { HttpStatusCode } from "axios"
import type { EMessageStatus } from "./enums"

export type TWsErrorResponse = {
   isError: boolean
   message: string
   httpStatus: HttpStatusCode
}

export type TChattingPayload = {
   receiverId: number
   message: string
   directChatId: number
   token: string
   timestamp: Date
}

export type TMsgSeenListenPayload = {
   messageId: number
   status: EMessageStatus
}

export type TMsgSeenEmitPayload = {
   messageId: number
   receiverId: number
}

export type TTypingEmitPayload = {
   receiverId: number
   isTyping: boolean
}
