import type { TConvMessage, TConversation, TMessage, TUserWithProfile } from "@/utils/types"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
   fetchConversationThunk,
   fetchMessagesThunk,
   startConversationThunk,
} from "./messages.thunk"
import type { T1v1Conversation } from "@/apis/types"

type TMessagesState = {
   conversation: TConversation | null
   recipient: TUserWithProfile | null
   messages: TConvMessage[] | null
   fetchedMsgs: boolean
}

const initialState: TMessagesState = {
   conversation: null,
   recipient: null,
   messages: null,
   fetchedMsgs: false,
}

export const messagesSlice = createSlice({
   initialState,
   name: "messages",
   reducers: {
      pushNewMessage: (state, action: PayloadAction<TConvMessage>) => {
         state.messages?.push(action.payload)
      },
   },
   extraReducers: (builder) => {
      builder.addCase(
         startConversationThunk.fulfilled,
         (state, action: PayloadAction<T1v1Conversation>) => {
            const { recipient, ...conversation } = action.payload

            state.conversation = conversation
            state.recipient = recipient
         }
      )
      builder.addCase(
         fetchConversationThunk.fulfilled,
         (state, action: PayloadAction<T1v1Conversation>) => {
            const { recipient, ...conversation } = action.payload

            state.conversation = conversation
            state.recipient = recipient
         }
      )
      builder.addCase(fetchMessagesThunk.fulfilled, (state, action: PayloadAction<TMessage[]>) => {
         state.messages = action.payload
         state.fetchedMsgs = true
      })
   },
})

export const { pushNewMessage } = messagesSlice.actions
