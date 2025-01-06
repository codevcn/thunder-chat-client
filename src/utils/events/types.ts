import { HttpStatus } from "../enums"

export type TWsErrorResponse = {
   isError: boolean
   message: string
   httpStatus: HttpStatus
}

export type TNewMessage1v1 = {
   id: number
   content: string
   authorId: number
   conversationId: number
   createdAt: string
}

export type TChattingPayload = {
   receiverId: number
   message: string
   conversationId: number
   token: string
}
