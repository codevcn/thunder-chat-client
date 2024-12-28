"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import React, { useRef } from "react"
import { Flex } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons"
import { useEffect, memo } from "react"
import { fetchMessagesThunk } from "@/redux/messages/messages.thunk"
import type { TConvMessage, TMessage, TUserWithoutPassword } from "@/utils/types"
import { Spinner } from "@/components/spinner"
import dayjs from "dayjs"
import { EEventNames, ETimeGapOfStickyTimes, ETimeFormats } from "@/utils/enums"
import { ScrollToBottomEventor } from "@/utils/custom-events"
import { ScrollToBottomMessageBtn } from "./scroll-to-bottom-msg-btn"
import { createPortal } from "react-dom"
import { useUser } from "@/hooks/user"
import socketClientChatting from "@/configs/socket"
import { EChattingEvents } from "@/utils/events/chatting-events"
import { pushMsg } from "@/redux/messages/messages.slice"

type TMessageProps = {
   message: TMessage
   user: TUserWithoutPassword
   isNewMsg: boolean
}

const Message = ({ message, isNewMsg, user }: TMessageProps) => {
   const { authorId, content, createdAt: msgTime } = message

   const time = dayjs(msgTime).format("hh:mm")
   const addMsgAnimation = isNewMsg ? "animate-add-message" : ""

   return (
      <div className="Message-Container max-w-full">
         {user.id === authorId ? (
            <Flex className="w-full" justify="space-between">
               <span></span>
               <div
                  className={`${addMsgAnimation} bg-regular-violet-cl rounded-t-2xl rounded-bl-2xl py-1.5 px-2 relative`}
               >
                  <p className="text-sm inline break-all">{content}</p>
                  <div className="float-right ml-3 relative right-0 top-1">
                     <span className="text-xs text-regular-creator-msg-time-cl">{time}</span>
                     <div className="inline-block ml-0.5">
                        <FontAwesomeIcon icon={faCheckDouble} fontSize={12} />
                     </div>
                  </div>
               </div>
            </Flex>
         ) : (
            <div
               className={`${addMsgAnimation} bg-regular-darkGray-cl rounded-t-2xl rounded-br-2xl pt-1.5 pb-2 px-2 w-fit relative`}
            >
               <p className="text-sm inline break-all">{content}</p>
               <span className="text-xs text-regular-recipient-msg-time-cl float-right ml-3 relative right-0 top-2">
                  {time}
               </span>
            </div>
         )}
      </div>
   )
}

const NoMessagesYet = () => {
   return (
      <Flex vertical align="center" gap={2} className="m-auto text-base w-2/4 cursor-pointer">
         <p className="font-bold">No messages here yet...</p>
         <p className="text-center">Send a message or tap on the greeting below.</p>
         <p className="bg-regular-violet-cl font-bold p-5 py-2 mt-2 rounded-lg hover:scale-105 transition">
            SAY HELLO!
         </p>
      </Flex>
   )
}

const StickyTime = ({ sticky_time }: { sticky_time: string }) => {
   return (
      <div className="flex w-full py-2">
         <div className="m-auto py-0.5 px-1 cursor-pointer font-bold">{sticky_time}</div>
      </div>
   )
}

export const Messages = memo(({ conversationId }: { conversationId: number }) => {
   const { messages, fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const dispatch = useAppDispatch()
   const user = useUser()
   const messages_container_ref = useRef<HTMLDivElement>(null)

   const scrollToBottomMessage = async () => {
      messages_container_ref.current?.scrollTo({
         top: -100,
         behavior: "instant",
      })
      messages_container_ref.current?.scrollTo({
         top: -1,
         behavior: "smooth",
      })
   }

   const sendMsgScrollAnimate = () => {
      messages_container_ref.current?.scrollTo({
         top: -1,
         behavior: "smooth",
      })
   }

   useEffect(() => {
      sendMsgScrollAnimate()
   }, [messages])

   const fetchMessages = async () => {
      await dispatch(fetchMessagesThunk(conversationId))
   }

   const publishScrollToBottomMsgEvent = () => {
      messages_container_ref.current?.addEventListener(EEventNames.SCROLL_TO_BOTTOM_MSG, (e) => {
         if (ScrollToBottomEventor.isThisEvent(e)) {
            scrollToBottomMessage()
         }
      })
   }

   useEffect(() => {
      fetchMessages()
      publishScrollToBottomMsgEvent()

      socketClientChatting.on(EChattingEvents.send_message_1v1, (data: TMessage) => {
         console.log(">>> payload:", data)
         const { id, authorId, conversationId, createdAt, content } = data
         dispatch(
            pushMsg({
               id,
               authorId,
               content,
               conversationId,
               createdAt,
               isNewMsg: true,
            })
         )
      })

      return () => {
         messages_container_ref.current?.removeEventListener("scroll", () => {})
         messages_container_ref.current?.removeEventListener(
            EEventNames.SCROLL_TO_BOTTOM_MSG,
            () => {}
         )
      }
   }, [])

   const handleStickyTime = (pre_msg_time: string, current_msg_time: string): string | null => {
      const pre_time_data = dayjs(pre_msg_time)
      const current_time_data = dayjs(current_msg_time)
      const today_time_data = dayjs()

      if (current_time_data.diff(pre_time_data, "day") === 0) {
         if (current_time_data.diff(pre_time_data, "hour") > ETimeGapOfStickyTimes.IN_HOURS) {
            return current_time_data.format(ETimeFormats.HH_mm)
         }
      } else {
         if (current_time_data.diff(today_time_data, "day") === 0) {
            return "Today"
         }

         return current_time_data.format(ETimeFormats.MMMM_DD_YYYY)
      }

      return null
   }

   const handleStickyTimeOfFirstMsg = (current_msg_time: string): string | null => {
      const current_time_data = dayjs(current_msg_time)
      const today_time_data = dayjs()

      if (current_time_data.diff(today_time_data, "day") === 0) {
         return "Today"
      }

      return current_time_data.format(ETimeFormats.MMMM_DD_YYYY)
   }

   const mapMessage = (messages: TConvMessage[], user: TUserWithoutPassword) =>
      messages.map((message, index) => {
         const sticky_time =
            index > 0
               ? handleStickyTime(messages[index - 1].createdAt, message.createdAt)
               : handleStickyTimeOfFirstMsg(message.createdAt)

         return (
            <React.Fragment key={message.id}>
               {sticky_time && <StickyTime sticky_time={sticky_time} />}

               <Message
                  message={message}
                  key={message.id}
                  isNewMsg={!!message.isNewMsg}
                  user={user}
               />
            </React.Fragment>
         )
      })

   return (
      <>
         {createPortal(
            <ScrollToBottomMessageBtn messagesContainerRef={messages_container_ref} />,
            document.body
         )}

         <Flex
            className="w-full h-full overflow-y-auto styled-scrollbar flex-col-reverse px-3 box-border"
            vertical
            align="center"
            ref={messages_container_ref}
         >
            {fetchedMsgs && user ? (
               messages && messages.length > 0 ? (
                  <Flex className="py-2 box-border w-messages-list-width gap-y-2" vertical>
                     {mapMessage(messages, user)}
                  </Flex>
               ) : (
                  <NoMessagesYet />
               )
            ) : (
               <div className="m-auto w-11 h-11">
                  <Spinner />
               </div>
            )}
         </Flex>
      </>
   )
})
