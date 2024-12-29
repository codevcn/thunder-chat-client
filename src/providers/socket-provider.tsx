"use client"

import { useEffect } from "react"
import { EAuthStatus } from "@/utils/enums"
import { clientSocket } from "@/configs/socket"
import toast from "react-hot-toast"
import { ESocketEvents, ESocketInitEvents } from "@/utils/events/socket-events"
import { useAuth } from "@/hooks/auth"
import { useUser } from "@/hooks/user"

export const SocketProvider = ({ children }: { children: JSX.Element }) => {
   const { authStatus } = useAuth()
   const user = useUser()

   useEffect(() => {
      if (authStatus === EAuthStatus.AUTHENTICATED && user) {
         console.log(">>> user id:", user.id)
         clientSocket.auth = {
            clientId: user.id,
         }
         clientSocket.connect()

         clientSocket.on(ESocketInitEvents.client_connected, (payload) => {
            console.log(">>> Socket connected to server")
         })

         clientSocket.on(ESocketInitEvents.connect_error, (error) => {
            console.log(">>> Socket is fail to connect to server >>>", error)
            toast.error("Something went wrong! Can't connect to Server")
         })

         clientSocket.on(ESocketEvents.error, (payload) => {
            toast.error(payload.message)
         })
      } else if (authStatus === EAuthStatus.UNAUTHENTICATED) {
         clientSocket.disconnect()
      }

      return () => {
         clientSocket.off(ESocketInitEvents.client_connected, () => {})
      }
   }, [authStatus])

   return children
}
