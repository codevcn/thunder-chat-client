import type { TStateDirectMessage } from "@/utils/types"
import { PayloadAction, createSlice, current } from "@reduxjs/toolkit"
import { fetchDirectMessagesThunk } from "./messages.thunk"
import type { TDirectChatData, TGetDirectMessagesData } from "@/apis/types"
import { fetchDirectChatThunk, startDirectChatThunk } from "../conversations/conversations-thunks"

type TMessagesState = {
   directChat: TDirectChatData | null
   messages: TStateDirectMessage[] | null
   fetchedMsgs: boolean
}

const initialState: TMessagesState = {
   directChat: null,
   messages: null,
   fetchedMsgs: false,
}

export const messagesSlice = createSlice({
   initialState,
   name: "messages",
   reducers: {
      pushNewMessages: (state, action: PayloadAction<TStateDirectMessage[]>) => {
         const currentMessages = current(state).messages
         state.messages =
            currentMessages && currentMessages.length > 0
               ? [...currentMessages, ...action.payload]
               : action.payload
      },
   },
   extraReducers: (builder) => {
      builder.addCase(
         startDirectChatThunk.fulfilled,
         (state, action: PayloadAction<TDirectChatData>) => {
            state.directChat = action.payload
         }
      )
      builder.addCase(
         fetchDirectChatThunk.fulfilled,
         (state, action: PayloadAction<TDirectChatData>) => {
            state.directChat = action.payload
         }
      )
      builder.addCase(
         fetchDirectMessagesThunk.fulfilled,
         (state, action: PayloadAction<TGetDirectMessagesData>) => {
            const currentMessages = current(state).messages
            state.messages =
               currentMessages && currentMessages.length > 0
                  ? [...action.payload.directMessages, ...currentMessages]
                  : action.payload.directMessages
            state.fetchedMsgs = true
         }
      )
   },
})

export const { pushNewMessages } = messagesSlice.actions
