import { AxiosError } from "axios"

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

// Conversation Message Type
export type TConvMessage = TMessage & {
   isNewMsg?: boolean
}

export type TConversationWithMessages = TConversation & { messages: TMessage[] }

export type THttpErrorResBody =
   | {
        name: string
        message: string
        trace: string
        timestamp: string
        isUserException: boolean
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

export type TRegisterUserParams = {
   email: string
   password: string
   firstName: string
   lastName: string
   birthday: Date
}

export type TLoginUserParams = {
   email: string
   password: string
}

export type TSearchConversationParams = {
   email?: string
   username?: string
   nameOfUser?: string
}

export type TConversationCard = {
   id: number
   avatar: string
   title: string
   subtitle: string
   lastMessageTime: string
   pinIndex: number
}

export type TStartConversationParams = {
   recipientId: number
}

export type TDirectConversation = TConversation & {
   recipient: TUserWithProfile
}

export type TUnknownObject = {
   [key: number | string]: any
}

export type TUnknownFunction<R> = (...args: any[]) => R

export type TSearchUserData =
   | {
        id: number
        User: {
           id: number
           email: string
           username: string | null
        }
        fullName: string
        avatar: string | null
     }
   | {
        id: number
        email: string
        username: string | null
        Profile: {
           id: number
           fullName: string
           avatar: string | null
           userId: number
        } | null
     }
