"use client"

import { DirectChats } from "./conversations"
import { Chat } from "./chat"
import { Flex } from "antd"
import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setChatBackground } from "@/redux/settings/settings.slice"
import backgroundDarkPattern from "@/assets/images/chat_bg/chat-bg-pattern-dark.ad38368a9e8140d0ac7d.png"
import { Navigation } from "@/components/navigation"

const ChatBackground = () => {
   const chatBackground = useAppSelector(({ settings }) => settings.theme.chatBackground)
   const dispatch = useAppDispatch()

   useEffect(() => {
      dispatch(setChatBackground(backgroundDarkPattern.src))
   }, [chatBackground])

   return (
      <div
         style={chatBackground ? { backgroundImage: `url(${chatBackground})` } : {}}
         className="h-full w-full absolute top-0 left-0 z-10"
      ></div>
   )
}

const ConversationPage = () => {
   return (
      <Flex className="ConversationPage bg-regular-black-cl w-full relative">
         <ChatBackground />

         <Navigation />

         <Flex className="w-full relative z-20">
            <DirectChats />

            <Chat />
         </Flex>
      </Flex>
   )
}

export default ConversationPage
