"use client"

import { Conversations } from "./conversations"
import { Chat } from "./chat"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setChatBackground } from "@/redux/settings/settings.slice"
import { Navigation } from "@/components/layout/navigation"

const ChatBackground = () => {
   const chatBackground = useAppSelector(({ settings }) => settings.theme.chatBackground)
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(setChatBackground("/images/chat_bg/chat-bg-pattern-dark.ad38368a9e8140d0ac7d.png"))
   }, [chatBackground])

   return (
      <div
         style={chatBackground ? { backgroundImage: `url(${chatBackground})` } : {}}
         className="h-full w-full top-0 left-0 absolute z-10"
      ></div>
   )
}

const ConversationPage = () => {
   return (
      <div className="bg-regular-black-cl w-full h-screen relative">
         <ChatBackground />

         <div className="flex absolute h-full w-full top-0 left-0 bg-transparent z-20">
            <Navigation />

            <div className="flex grow relative z-20">
               <Conversations />

               <Chat />
            </div>
         </div>
      </div>
   )
}

export default ConversationPage
