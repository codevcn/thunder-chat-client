import { client_axios } from "@/configs/axios"
import { request_config } from "./init"
import type { TSuccess } from "@/utils/types"

export const postSendFriendRequest = (senderId: number, recipientId: number) =>
   client_axios.post<TSuccess>(
      "friend/send-friend-request",
      { senderId, recipientId },
      request_config
   )
// >>> go on here, making get friend requests feature:
export const getFriendRequest = () => client_axios.get("friend/get-friend-requests", request_config)
