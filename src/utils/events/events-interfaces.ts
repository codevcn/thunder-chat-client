import type {
   TDirectMessage,
   TSendDirectMessageErrorRes,
   TSuccess,
   TUserWithProfile,
} from "../types"
import { ESocketEvents, ESocketInitEvents } from "./socket-events"
import type { TChattingPayload, TWsErrorResponse } from "./types"

export interface IListenSocketEvents {
   [ESocketInitEvents.connect]: () => void
   [ESocketInitEvents.connect_error]: (payload: unknown) => void
   [ESocketEvents.error]: (error: TWsErrorResponse) => void
   [ESocketEvents.send_message_direct]: (newMessage: TDirectMessage) => void
   [ESocketEvents.send_friend_request]: (sender: TUserWithProfile) => void
   [ESocketEvents.recovered_connection]: (messages: TDirectMessage[]) => void
}

export interface IEmitSocketEvents {
   [ESocketEvents.send_message_direct]: (
      message: TChattingPayload,
      cb: (data: TSendDirectMessageErrorRes | TSuccess) => void
   ) => void
}
