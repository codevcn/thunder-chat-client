import type { TUserWithProfile } from "../types"
import { ESocketEvents, ESocketInitEvents } from "./socket-events"
import type { TChattingPayload, TNewMessage, TWsErrorResponse } from "./types"

export interface IListenSocketEvents {
   [ESocketInitEvents.client_connected]: (message: string) => void
   [ESocketInitEvents.connect_error]: (payload: unknown) => void
   [ESocketEvents.error]: (error: TWsErrorResponse) => void
   [ESocketEvents.send_message_1v1]: (newMessage: TNewMessage) => void
   [ESocketEvents.send_friend_request]: (
      payload: TUserWithProfile,
      numOfMutualFriends: number
   ) => void
}

export interface IEmitSocketEvents {
   [ESocketEvents.send_message_1v1]: (
      message: TChattingPayload,
      cb: (data: unknown) => void
   ) => void
}
