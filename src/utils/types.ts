import { AxiosError } from "axios"

// DB entities
export type TUser = {
   id: number
   email: string
   password: string
   username: string | null
   createdAt: Date
}

export type TProfile = {
   id: number
   createdAt: Date
   fullName: string
   birthday: Date | null
   about: string | null
   avatar: string | null
   userId: number
}

export type TUserWithProfile = TUser & { Profile: Omit<TProfile, "id" | "userId"> | null }

export type TUserWithoutPassword = Omit<TUser, "password">

export type TConversation = {
   id: number
   createdAt: string
   lastMsgSentId: number | null
   creatorId: number
   recipientId: number
}

export type TMessage = {
   id: number
   content: string
   createdAt: string
   authorId: number
   conversationId: number
}

// Common types
export type TConvMessage = TMessage & {
   isNewMsg?: boolean
}

export type TConversationWithMessages = TConversation & { messages: TMessage[] }

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

export type TConversationCard = {
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

export type TUnknownFunction<R> = (...args: any[]) => R
