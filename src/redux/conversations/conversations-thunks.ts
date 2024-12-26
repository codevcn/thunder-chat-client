import { conversationService } from "@/services/conversations.service"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const searchConversationThunk = createAsyncThunk(
   "conversations/search",
   conversationService.searchConversationService
)
