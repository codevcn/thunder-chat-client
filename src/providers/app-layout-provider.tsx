"use client"

import { clientSocket } from "@/configs/socket"
import { ESocketEvents } from "@/utils/events/socket-events"
import Link from "next/link"
import { useEffect } from "react"
import toast, { useToasterStore } from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowRight, faCircleInfo } from "@fortawesome/free-solid-svg-icons"
import { MAX_NUMBER_OF_TOASTS } from "@/utils/constants"
import { EActions } from "@/app/friends/sharing"

export const AppLayoutProvider = ({ children }: { children: React.ReactNode }) => {
   const { toasts } = useToasterStore()

   useEffect(() => {
      clientSocket.socket.on(ESocketEvents.send_friend_request, (payload) => {
         const { Profile, email } = payload
         toast(() => (
            <div className="flex items-center justify-between gap-x-3">
               <FontAwesomeIcon icon={faCircleInfo} size="lg" />
               <span className="font-bold">{`User "${Profile?.fullName || email}" sent you an add friend request`}</span>
               <Link
                  href={`/friends?action=${EActions.add_friend_requests}`}
                  className="px-2 py-[5px]"
               >
                  <FontAwesomeIcon icon={faArrowRight} className="text-black" size="lg" />
               </Link>
            </div>
         ))
      })
   }, [])

   const limitDisplayedToasts = () => {
      setTimeout(() => {
         toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= MAX_NUMBER_OF_TOASTS) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) for no exit animation
      }, 0)
   }

   useEffect(() => {
      limitDisplayedToasts()
   }, [toasts])

   return (
      <div id="App-Wrapper" className="bg-regular-darkGray-cl">
         {children}
      </div>
   )
}
