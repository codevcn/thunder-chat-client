import { HttpStatusCode } from "axios"

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
