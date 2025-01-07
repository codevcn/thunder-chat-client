import type { TDirectMessage } from "@/utils/types"
import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { fetchDirectMessagesThunk } from "./messages.thunk"
import type { TDirectChatData } from "@/apis/types"
import type { TNewDirectMessage } from "@/utils/events/types"
import { fetchDirectChatThunk, startDirectChatThunk } from "../conversations/conversations-thunks"

type TMessagesState = {
   directChat: TDirectChatData | null
   messages: TDirectMessage[] | null
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
      pushNewMessages: (state, action: PayloadAction<TDirectMessage[]>) => {
         state.messages?.push(...action.payload)
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
         (state, action: PayloadAction<TNewDirectMessage[]>) => {
            state.messages = action.payload
            state.fetchedMsgs = true
         }
      )
   },
})

export const { pushNewMessages } = messagesSlice.actions
