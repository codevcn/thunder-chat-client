"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useRef, Fragment } from "react"
import { Flex } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCheckDouble } from "@fortawesome/free-solid-svg-icons"
import { useEffect, memo } from "react"
import { fetchDirectMessagesThunk } from "@/redux/messages/messages.thunk"
import type { TDirectMessage, TUserWithoutPassword } from "@/utils/types"
import { Spinner } from "@/components/spinner"
import dayjs from "dayjs"
import { EEventNames } from "@/utils/enums"
import { ScrollToBottomMessageBtn } from "./scroll-to-bottom-msg-btn"
import { createPortal } from "react-dom"
import { useUser } from "@/hooks/user"
import { clientSocket } from "@/configs/socket"
import { ESocketEvents } from "@/utils/events/socket-events"
import { pushNewMessages } from "@/redux/messages/messages.slice"
import { handleMessageStickyTime } from "@/utils/date-time"
import { customEventManager } from "@/utils/events/custom-events"

type TMessageProps = {
   message: TDirectMessage
   user: TUserWithoutPassword
   isNewMsg: boolean
}

const Message = ({ message, isNewMsg, user }: TMessageProps) => {
   const { authorId, content, createdAt } = message

   const msgTime = dayjs(createdAt).format("hh:mm")

   return (
      <div className="Message-Container max-w-full">
         {user.id === authorId ? (
            <Flex className="w-full" justify="space-between">
               <span></span>
               <div
                  className={`${isNewMsg ? "animate-new-own-message" : ""} bg-regular-violet-cl rounded-t-2xl rounded-bl-2xl py-1.5 px-2 relative`}
               >
                  <p className="text-sm inline break-all whitespace-pre">{content}</p>
                  <div className="float-right ml-3 relative right-0 top-1">
                     <span className="text-xs text-regular-creator-msg-time-cl">{msgTime}</span>
                     <div className="inline-block ml-0.5">
                        <FontAwesomeIcon icon={faCheckDouble} fontSize={12} />
                     </div>
                  </div>
               </div>
            </Flex>
         ) : (
            <div
               className={`${isNewMsg ? "animate-new-friend-message" : ""} bg-regular-darkGray-cl rounded-t-2xl rounded-br-2xl pt-1.5 pb-2 px-2 w-fit relative`}
            >
               <p className="text-sm inline break-all whitespace-pre">{content}</p>
               <span className="text-xs text-regular-recipient-msg-time-cl float-right ml-3 relative right-0 top-2">
                  {msgTime}
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

type TMessagesProps = {
   directChatId: number
}

export const Messages = memo(({ directChatId }: TMessagesProps) => {
   const { messages, fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const dispatch = useAppDispatch()
   const user = useUser()
   const messages_container_ref = useRef<HTMLDivElement>(null)
   const tempFlagUseEffect = useRef<boolean>(true)
   console.log(">>> old messages:", messages)

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

   const fetchDirectMessages = async () => {
      await dispatch(fetchDirectMessagesThunk(directChatId))
   }

   const publishScrollToBottomMsgEvent = () => {
      customEventManager.on(EEventNames.SCROLL_TO_BOTTOM_MSG, (payload) => {
         scrollToBottomMessage()
      })
   }

   useEffect(() => {
      if (tempFlagUseEffect.current) {
         tempFlagUseEffect.current = false
         fetchDirectMessages()
         publishScrollToBottomMsgEvent()

         clientSocket.socket.on(ESocketEvents.send_message_direct, (newMessage) => {
            const { id, authorId, createdAt, content } = newMessage
            dispatch(
               pushNewMessages([
                  {
                     id,
                     authorId,
                     content,
                     directChatId,
                     createdAt,
                     isNewMsg: true,
                  },
               ])
            )
            clientSocket.setMessageOffset(new Date(createdAt), directChatId)
         })

         clientSocket.socket.on(ESocketEvents.recovered_connection, (newMessages) => {
            console.log(">>> new messages:", newMessages)
            if (newMessages && newMessages.length > 0) {
               dispatch(pushNewMessages(newMessages))
               const { createdAt } = newMessages.at(-1)!
               clientSocket.setMessageOffset(new Date(createdAt), directChatId)
            }
         })

         return () => {
            messages_container_ref.current?.removeEventListener("scroll", () => {})
            customEventManager.off(EEventNames.SCROLL_TO_BOTTOM_MSG)
         }
      }
   }, [])

   const mapMessage = (messages: TDirectMessage[], user: TUserWithoutPassword) =>
      messages.map((message, index) => {
         const sticky_time = handleMessageStickyTime(
            message.createdAt,
            messages[index - 1]?.createdAt
         )

         return (
            <Fragment key={message.id}>
               {sticky_time && <StickyTime sticky_time={sticky_time} />}

               <Message
                  message={message}
                  key={message.id}
                  isNewMsg={!!message.isNewMsg}
                  user={user}
               />
            </Fragment>
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
