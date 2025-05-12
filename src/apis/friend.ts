import { clientAxios, requestConfig } from "@/configs/axios"
import type { TSuccess } from "@/utils/types/global"
import type {
   TFriendRequestActionParams,
   TGetFriendRequestsData,
   TGetFriendRequestsParams,
   TGetFriendsData,
   TGetFriendsParams,
} from "../utils/types/be-api"

export const postSendFriendRequest = (senderId: number, recipientId: number) =>
   clientAxios.post<TSuccess>(
      "friend/send-friend-request",
      { senderId, recipientId },
      requestConfig
   )

export const getFriendRequests = (payload: TGetFriendRequestsParams) =>
   clientAxios.get<TGetFriendRequestsData[]>("friend/get-friend-requests", {
      ...requestConfig,
      params: payload,
   })

export const getFriends = (payload: TGetFriendsParams) =>
   clientAxios.get<TGetFriendsData[]>("friend/get-friends", {
      ...requestConfig,
      params: payload,
   })

export const postFriendRequestAction = (payload: TFriendRequestActionParams) =>
   clientAxios.post<TSuccess>("friend/friend-request-action", payload, requestConfig)
