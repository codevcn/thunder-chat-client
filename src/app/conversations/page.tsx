"use client"

import { Navigation } from "./navigation"
import { Conversations } from "./conversations"
import { Chat } from "./chat"
import { Flex } from "antd"
import { memo, useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { setChatBackground } from "@/redux/settings/settings.slice"
import backgroundDarkPattern from "@/assets/images/chat_bg/chat-bg-pattern-dark.ad38368a9e8140d0ac7d.png"

const MainSection = memo(() => {
   return (
      <>
         <Navigation />

         <Flex className="w-full relative z-20">
            <Conversations />

            <Chat />
         </Flex>
      </>
   )
})

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
         <MainSection />
      </Flex>
   )
}

export default ConversationPage