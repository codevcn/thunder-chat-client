"use client"

import { useEffect } from "react"
import { EAuthStatus } from "@/utils/enums"
import socketClient from "@/configs/socket"
import toast from "react-hot-toast"
import { EChattingEvents, ESocketInitEvents } from "@/utils/events/chatting-events"
import { useAuth } from "@/hooks/auth"
import { useUser } from "@/hooks/user"

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
   const { authStatus } = useAuth()
   const user = useUser()

   useEffect(() => {
      if (authStatus === EAuthStatus.AUTHENTICATED && user) {
         socketClient.auth = {
            clientId: user.id,
         }
         socketClient.connect()

         socketClient.on(ESocketInitEvents.client_connected, (payload) => {
            console.log(">>> Socket connected to server")
         })

         socketClient.on(ESocketInitEvents.connect_error, (error) => {
            console.log(">>> Socket is fail to connect to server >>>", error)
            toast.error("Something went wrong! Can't connect to Server")
         })

         socketClient.on(EChattingEvents.error, (payload: string) => {
            toast.error(payload)
         })
      } else if (authStatus === EAuthStatus.UNAUTHENTICATED) {
         socketClient.disconnect()
      }

      return () => {
         socketClient.off(ESocketInitEvents.client_connected, () => {})
      }
   }, [authStatus])

   return children
}
