import { conversationService } from "@/services/conversations.service"
import { messageService } from "@/services/message.service"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const startConversationThunk = createAsyncThunk(
   "messages/start",
   conversationService.startConversationService
)

export const fetchConversationThunk = createAsyncThunk(
   "messages/fetchConversation",
   conversationService.fetchConversationService
)

export const fetchMessagesThunk = createAsyncThunk(
   "messages/fetchMessages",
   messageService.fetchMessagesService
)
