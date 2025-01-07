import { directChatService } from "@/services/direct-chat.service"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const startDirectChatThunk = createAsyncThunk(
   "messages/start",
   directChatService.startDirectChat
)

export const fetchDirectChatThunk = createAsyncThunk(
   "messages/fetchDirectChat",
   directChatService.fetchDirectChat
)
