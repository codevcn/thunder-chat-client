import { HttpStatus } from "../enums"

export type TWsErrorResponse = {
   isError: boolean
   message: string
   httpStatus: HttpStatus
}

export type TNewDirectMessage = {
   id: number
   content: string
   authorId: number
   directChatId: number
   createdAt: string
}

export type TChattingPayload = {
   receiverId: number
   message: string
   directChatId: number
   token: string
   timestamp: Date
}
