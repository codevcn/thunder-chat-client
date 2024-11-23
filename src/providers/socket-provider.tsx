"use client"

import { socketClientChatting, SocketContextChatting } from "@/contexts/socket.context"
import { useSocketConnection } from "@/hooks/socket-connection"

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
   useSocketConnection()
   return (
      <SocketContextChatting.Provider value={socketClientChatting}>
         {children}
      </SocketContextChatting.Provider>
   )
}
