export enum ESocketInitEvents {
   client_connected = "client_connected",
   connect_error = "connect_error",
}

export enum ESocketEvents {
   send_message_direct = "send_message:direct",
   error = "error",
   send_friend_request = "friend_request:send",
   recovered_connection = "recovered_connection",
}
