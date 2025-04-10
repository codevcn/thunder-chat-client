"use client"

import { JSX, useEffect, useRef } from "react"
import { EAuthStatus } from "@/utils/enums"
import { clientSocket } from "@/configs/socket"
import toast from "react-hot-toast"
import { ESocketEvents, ESocketInitEvents } from "@/utils/events/socket-events"
import { useAuth } from "@/hooks/auth"
import { useUser } from "@/hooks/user"
import { chattingService } from "@/services/chatting.service"

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
   const { authStatus } = useAuth()
   const user = useUser()
   const tempFlagUseEffectRef = useRef<boolean>(true)

   useEffect(() => {
      if (tempFlagUseEffectRef.current) {
         tempFlagUseEffectRef.current = false
         if (authStatus === EAuthStatus.AUTHENTICATED && user) {
            clientSocket.socket.on(ESocketInitEvents.connect, () => {
               console.log(">>> Socket connected to server")
               chattingService.sendOfflineMessages()
            })

            clientSocket.socket.on(ESocketInitEvents.connect_error, (error) => {
               console.log(">>> Socket fails to connect to server >>>", error)
               toast.error("Something went wrong! Can't connect to Server")
            })

            clientSocket.socket.on(ESocketEvents.error, (payload) => {
               toast.error(payload.message)
            })

            clientSocket.setAuth(user.id)
            clientSocket.socket.connect()
         } else if (authStatus === EAuthStatus.UNAUTHENTICATED) {
            clientSocket.socket.disconnect()
         }
      }
      return () => {
         clientSocket.socket.off(ESocketInitEvents.connect)
         clientSocket.socket.off(ESocketInitEvents.connect_error)
         clientSocket.socket.off(ESocketEvents.error)
      }
   }, [authStatus])

   return children
}
