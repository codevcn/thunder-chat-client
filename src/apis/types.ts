import type { EFriendRequestStatus, ESortTypes } from "@/utils/enums"
import type { TDirectChat, TDirectMessage, TUserWithProfile } from "@/utils/types"

export type TLoginUserParams = {
   email: string
   password: string
   keepSigned: boolean
}

export type TSearchDirectChatParams = {
   email?: string
   username?: string
   nameOfUser?: string
}

export type TStartDirectChatParams = {
   recipientId: number
}

export type TDirectChatData = TDirectChat & {
   Recipient: TUserWithProfile
}

export type TRegisterUserParams = {
   email: string
   password: string
   firstName: string
   lastName: string
   birthday: string
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
   lastFriendId?: number
}

export type TSearchUsersParams = {
   keyword: string
   limit: number
   lastUserId?: number
}

export type TGetDirectMsgsParamsDTO = {
   msgTime: Date
   directChatId: number
   limit: number
   sortType: ESortTypes
}

export type TGetDirectMessagesData = {
   hasMoreMessages: boolean
   directMessages: TDirectMessage[]
}
