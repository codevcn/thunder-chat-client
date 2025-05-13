"use client"

import { useEffect, useRef } from "react"
import { localStorageManager } from "@/utils/local-storage"
import { RootLayoutContext } from "@/contexts/root-layout.context"
import { clientSocket } from "@/utils/socket/client-socket"
import { ESocketEvents } from "@/utils/socket/events"
import { getPathWithQueryString } from "@/utils/helpers"
import type { TUserWithProfile } from "@/utils/types/be-api"
import { toast } from "sonner"
import { ETabs } from "@/app/friends/sharing"
import { useRouter } from "next/navigation"

export const AppLayoutProvider = ({ children }: { children: React.ReactNode }) => {
   const appRootRef = useRef<HTMLDivElement>(null)
   const router = useRouter()

   const setLastPageAccessed = () => {
      localStorageManager.setLastPageAccessed(getPathWithQueryString())
   }

   const handleFriendRequest = (userData: TUserWithProfile) => {
      const { Profile, email } = userData
      toast(`User "${Profile?.fullName || email}" sent you an add friend request`, {
         action: {
            label: "View",
            onClick: () => {
               router.push(`/friends?action=${ETabs.ADD_FRIEND_REQUESTS}`)
            },
         },
      })
   }

   useEffect(() => {
      clientSocket.socket.on(ESocketEvents.send_friend_request, handleFriendRequest)
      setLastPageAccessed()
      return () => {
         clientSocket.socket.off(ESocketEvents.send_friend_request, handleFriendRequest)
      }
   }, [])

   return (
      <div ref={appRootRef} id="App-Root" className="bg-regular-dark-gray-cl">
         <RootLayoutContext.Provider value={{ appRootRef }}>{children}</RootLayoutContext.Provider>
      </div>
   )
}
