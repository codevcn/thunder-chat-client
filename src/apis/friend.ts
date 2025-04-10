import { client_axios } from "@/configs/axios"
import { requestConfig } from "./init"
import type { TSuccess } from "@/utils/types"
import type {
   TFriendRequestActionParams,
   TGetFriendRequestsData,
   TGetFriendRequestsParams,
   TGetFriendsData,
   TGetFriendsParams,
} from "./types"

export const postSendFriendRequest = (senderId: number, recipientId: number) =>
   client_axios.post<TSuccess>(
      "friend/send-friend-request",
      { senderId, recipientId },
      requestConfig
   )

export const getFriendRequests = (payload: TGetFriendRequestsParams) =>
   client_axios.get<TGetFriendRequestsData[]>("friend/get-friend-requests", {
      ...requestConfig,
      params: payload,
   })

export const getFriends = (payload: TGetFriendsParams) =>
   client_axios.get<TGetFriendsData[]>("friend/get-friends", {
      ...requestConfig,
      params: payload,
   })

export const postFriendRequestAction = (payload: TFriendRequestActionParams) =>
   client_axios.post<TSuccess>("friend/friend-request-action", payload, requestConfig)
