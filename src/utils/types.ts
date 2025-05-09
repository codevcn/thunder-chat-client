import type { AxiosError, HttpStatusCode } from "axios"
import type { TChattingPayload } from "./socket/types"
import type { EMessageStatus } from "./socket/enums"

// ================================= DB entities =================================
export type TUser = {
   id: number
   email: string
   password: string
   username: string | null
   createdAt: string
}

export type TProfile = {
   id: number
   createdAt: string
   fullName: string
   birthday: string | null
   about: string | null
   avatar: string | null
   userId: number
}

export type TUserWithProfile = TUser & { Profile: Omit<TProfile, "id" | "userId"> | null }

export type TUserWithoutPassword = Omit<TUser, "password">

export type TDirectChat = {
   id: number
   createdAt: string
   creatorId: number
   recipientId: number
   lastSentMessageId: number
}

export type TDirectMessage = {
   id: number
   createdAt: string
   content: string
   authorId: number
   directChatId: number
   status: EMessageStatus
}

// ================================= Common types =================================
export type TStateDirectMessage = TDirectMessage & {
   isNewMsg?: boolean
}

export type TDirectChatWithMessages = TDirectChat & { messages: TDirectMessage[] }

export type THttpErrorResBody =
   | {
        name: string
        message: string
        timestamp: string
        isUserError: boolean
     }
   | string

export type TAxiosError = {
   originalError: AxiosError<THttpErrorResBody>
   statusCode: number
   message: string
   isUserError: boolean
   clientMessage: string
}

export type TSuccess = {
   success: boolean // always true
}

export type TDirectChatCard = {
   id: number
   avatar: string
   title: string
   subtitle: string
   lastMessageTime: string
   pinIndex: number
}

export type TUnknownObject = {
   [key: number | string]: any
}

export type TUnknownFunction<P, R> = (...args: P[]) => R

export type TSendDirectMessageErrorRes = {
   isError: boolean
   message: string
}

export type TOfflineMessage = TChattingPayload

export type TSendMessageCallback = (data: TSendDirectMessageErrorRes | TSuccess) => void

export type THandledAxiosError = {
   originalError: unknown
   statusCode: HttpStatusCode
   message: string
   isUserError: boolean
}

export type TFormData = {
   [key: string]: FormDataEntryValue | FormDataEntryValue[] | TCheckboxValue | undefined
}

export type TLastPageAccessed = {
   current: string
   previous: string
}

export type TEmoji = {
   src: string
   alt: string
   name: string
}

export type TCheckboxValue = "on" | undefined

export type TMessageStateUpdates = {
   msgId: number
   msgUpdates: Partial<TStateDirectMessage>
}
