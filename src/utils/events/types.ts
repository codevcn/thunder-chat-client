import { HttpStatus } from "../enums"

export type TWsErrorResponse = {
   isError: boolean
   message: string
   httpStatus: HttpStatus
}

export type TChattingPayload = {
   receiverId: number
   message: string
   directChatId: number
   token: string
   timestamp: Date
}
