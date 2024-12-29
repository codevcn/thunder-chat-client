"use client"

import { clientSocket } from "@/configs/socket"
import { ESocketEvents } from "@/utils/events/socket-events"
import { useEffect } from "react"
import toast from "react-hot-toast"

export const FriendsList = () => {
   useEffect(() => {
      clientSocket.on(ESocketEvents.send_friend_request, (payload) => {
         toast.success("a friend " + payload.email + " just send you a kkk")
      })
   }, [])

   return (
      <div>
         <div></div>
      </div>
   )
}
