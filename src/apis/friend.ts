import { client_axios } from "@/configs/axios"
import { request_config } from "./init"

export const postSendFriendRequest = (senderId: number, recipientId: number) =>
   client_axios.post("friend/send-friend-request", { senderId, recipientId }, request_config)
