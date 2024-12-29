import { HttpStatus } from "../enums"

export type TWsErrorResponse = {
   isError: boolean
   message: string
   httpStatus: HttpStatus
}

export type TNewMessage = {
   id: number
   conversationId: number
   content: string
   authorId: number
   createdAt: string
}

export type TChattingPayload = {
   receiverId: number
   message: string
   conversationId: number
}
