import {
   getFriendRequests,
   getFriends,
   postFriendRequestAction,
   postSendFriendRequest,
} from "@/apis/friend"
import type {
   TFriendRequestActionParams,
   TGetFriendRequestsData,
   TGetFriendRequestsParams,
   TGetFriendsData,
   TGetFriendsParams,
} from "@/apis/types"
import type { TSuccess } from "@/utils/types"

class FriendService {
   async sendFriendRequest(userId: number, recipientId: number): Promise<TSuccess> {
      const { data } = await postSendFriendRequest(userId, recipientId)
      return data
   }

   async getFriendRequests(payload: TGetFriendRequestsParams): Promise<TGetFriendRequestsData[]> {
      const { data } = await getFriendRequests(payload)
      return data
   }

   async friendRequestAction(payload: TFriendRequestActionParams): Promise<TSuccess> {
      const { data } = await postFriendRequestAction(payload)
      return data
   }

   async getFriends(payload: TGetFriendsParams): Promise<TGetFriendsData[]> {
      const { data } = await getFriends(payload)
      return data
   }
}

export const friendService = new FriendService()
