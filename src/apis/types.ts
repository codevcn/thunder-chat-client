import { EFriendRequestStatus } from "@/utils/enums"
import type { TConversation, TUserWithProfile } from "@/utils/types"

export type TLoginUserParams = {
   email: string
   password: string
}

export type TSearchConversationParams = {
   email?: string
   username?: string
   nameOfUser?: string
}

export type TStartConversationParams = {
   recipientId: number
}

export type T1v1Conversation = TConversation & {
   recipient: TUserWithProfile
}

export type TRegisterUserParams = {
   email: string
   password: string
   firstName: string
   lastName: string
   birthday: Date
}

export type TSearchUsersData = {
   id: number
   email: string
   username: string | null
   Profile: {
      id: number
      fullName: string
      avatar: string | null
   } | null
}

export type TGetFriendRequestsData = {
   id: number
   Sender: TUserWithProfile
   Recipient: TUserWithProfile
   createdAt: string
   status: EFriendRequestStatus
}

export type TGetFriendRequestsParams = {
   userId: number
   limit: number
   lastFriendRequestId?: number
}

export type TFriendRequestActionParams = {
   friendRequestId: number
   action: EFriendRequestStatus
}

export type TGetFriendsData = {
   id: number
   senderId: number
   createdAt: string
   Recipient: TUserWithProfile
}

export type TGetFriendsParams = {
   userId: number
   limit: number
   lastFriendRequestId?: number
}

export type TSearchUsersParams = {
   keyword: string
   limit: number
   lastUserId?: number
}
