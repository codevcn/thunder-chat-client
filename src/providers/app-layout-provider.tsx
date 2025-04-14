"use client"

import Link from "next/link"
import { useEffect, useRef } from "react"
import toast, { useToasterStore } from "react-hot-toast"
import { ArrowRight, Info } from "lucide-react"
import { MAX_NUMBER_OF_TOASTS } from "@/utils/constants"
import { EActions } from "@/app/friends/sharing"
import { localStorageManager } from "@/utils/local-storage"
import { RootLayoutContext } from "@/contexts/root-layout.context"
import { clientSocket } from "@/utils/socket/client-socket"
import { ESocketEvents } from "@/utils/socket/events"

export const AppLayoutProvider = ({ children }: { children: React.ReactNode }) => {
   const { toasts } = useToasterStore()
   const appRootRef = useRef<HTMLDivElement>(null)

   const setLastPageAccessed = () => {
      localStorageManager.setLastPageAccessed(window.location.pathname)
   }

   const listenFriendRequest = () => {
      clientSocket.socket.on(ESocketEvents.send_friend_request, (payload) => {
         const { Profile, email } = payload
         toast(() => (
            <div className="flex items-center justify-between gap-x-3">
               <Info size={20} />
               <span className="font-bold">{`User "${Profile?.fullName || email}" sent you an add friend request`}</span>
               <Link
                  href={`/friends?action=${EActions.ADD_FRIEND_REQUESTS}`}
                  className="px-2 py-[5px]"
               >
                  <ArrowRight className="text-black" size={20} />
               </Link>
            </div>
         ))
      })
   }

   const limitDisplayedToasts = () => {
      setTimeout(() => {
         toasts
            .filter((t) => t.visible) // Only consider visible toasts
            .filter((_, i) => i >= MAX_NUMBER_OF_TOASTS) // Is toast index over limit?
            .forEach((t) => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) for no exit animation
      }, 0)
   }

   useEffect(() => {
      listenFriendRequest()
      setLastPageAccessed()
      return () => {
         clientSocket.socket.off(ESocketEvents.send_friend_request)
      }
   }, [])

   useEffect(() => {
      limitDisplayedToasts()
   }, [toasts])

   return (
      <div ref={appRootRef} id="App-Root" className="bg-regular-dark-gray-cl">
         <RootLayoutContext.Provider value={{ appRootRef }}>{children}</RootLayoutContext.Provider>
      </div>
   )
}
