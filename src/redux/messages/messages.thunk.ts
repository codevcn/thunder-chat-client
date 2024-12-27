import { conversationService } from "@/services/conversations.service"
import { messageService } from "@/services/message.service"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const startConversationThunk = createAsyncThunk(
   "messages/start",
   conversationService.startConversation
)

export const fetchConversationThunk = createAsyncThunk(
   "messages/fetchConversation",
   conversationService.fetchConversation
)

export const fetchMessagesThunk = createAsyncThunk(
   "messages/fetchMessages",
   messageService.fetchMessages
)
