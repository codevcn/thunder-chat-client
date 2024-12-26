import { ChatBackgroundContext } from "@/contexts/chat-background.context"
import { useContext } from "react"

export const useChatBackground = () => useContext(ChatBackgroundContext)
