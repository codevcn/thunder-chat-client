"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useRef, Fragment, useState } from "react"
import { CheckCheck } from "lucide-react"
import { useEffect, memo } from "react"
import { fetchDirectMessagesThunk } from "@/redux/messages/messages.thunk"
import type { TStateDirectMessage, TUserWithoutPassword } from "@/utils/types"
import { Spinner } from "@/components/materials/spinner"
import dayjs from "dayjs"
import { EEventNames, EPaginations, ESortTypes, ETimeFormats } from "@/utils/enums"
import { ScrollToBottomMessageBtn } from "./scroll-to-bottom-msg-btn"
import { createPortal } from "react-dom"
import { useUser } from "@/hooks/user"
import { clientSocket } from "@/configs/socket"
import { ESocketEvents } from "@/utils/events/socket-events"
import { pushNewMessages } from "@/redux/messages/messages.slice"
import { displayMessageStickyTime } from "@/utils/date-time"
import { customEventManager } from "@/utils/events/custom-events"
import axiosErrorHandler from "@/utils/axios-error-handler"
import toast from "react-hot-toast"
import { SHOW_SCROLL_BTN_THRESHOLD } from "@/utils/constants"

type TMessageProps = {
   message: TStateDirectMessage
   user: TUserWithoutPassword
   isNewMsg: boolean
}

const Message = ({ message, isNewMsg, user }: TMessageProps) => {
   const { authorId, content, createdAt } = message

   const msgTime = dayjs(createdAt).format(ETimeFormats.HH_mm)

   return (
      <div className="w-full text-regular-white-cl">
         {user.id === authorId ? (
            <div className="flex justify-end w-full">
               <div
                  className={`${isNewMsg ? "animate-new-own-message" : ""} max-w-[70%] w-max bg-regular-violet-cl rounded-t-2xl rounded-bl-2xl py-1.5 pb-1 px-2`}
               >
                  <p className="text-end break-words whitespace-pre-wrap text-sm inline break-all">
                     {content}
                  </p>
                  <div className="flex justify-end items-center gap-x-1 mt-1 w-max">
                     <span className="text-xs text-regular-creator-msg-time-cl leading-none">
                        {msgTime}
                     </span>
                     <div className="flex ml-0.5">
                        <CheckCheck size={15} />
                     </div>
                  </div>
               </div>
            </div>
         ) : (
            <div className="flex justify-start w-full">
               <div
                  className={`${isNewMsg ? "animate-new-friend-message" : ""} max-w-[70%] w-max bg-regular-dark-gray-cl rounded-t-2xl rounded-br-2xl pt-1.5 pb-1 px-2 relative`}
               >
                  <p className="max-w-full break-words whitespace-pre-wrap text-sm inline break-all">
                     {content}
                  </p>
                  <div className="flex justify-end items-center mt-1">
                     <span className="text-xs text-regular-creator-msg-time-cl">{msgTime}</span>
                  </div>
               </div>
            </div>
         )}
      </div>
   )
}

const NoMessagesYet = () => {
   return (
      <div className="flex-col items-center gap-y-1 m-auto text-base w-2/4 cursor-pointer">
         <p className="font-bold">No messages here yet...</p>
         <p className="text-center">Send a message or tap on the greeting below.</p>
         <p className="bg-regular-violet-cl font-bold p-5 py-2 mt-2 rounded-lg hover:scale-105 transition">
            SAY HELLO!
         </p>
      </div>
   )
}

type TStickyTimeProps = {
   stickyTime: string
}

const StickyTime = ({ stickyTime }: TStickyTimeProps) => {
   return (
      <div className="flex w-full py-2 text-regular-text-secondary-cl">
         <div className="m-auto py-0.5 px-1 cursor-pointer font-bold">{stickyTime}</div>
      </div>
   )
}

type TMappedMessagesProps = {
   messages: TStateDirectMessage[]
   user: TUserWithoutPassword
}

const MappedMessages = ({ messages, user }: TMappedMessagesProps) =>
   messages.map((message, index) => {
      const stickyTime = displayMessageStickyTime(message.createdAt, messages[index - 1]?.createdAt)

      return (
         <Fragment key={message.id}>
            {stickyTime && <StickyTime stickyTime={stickyTime} />}
            <Message message={message} key={message.id} isNewMsg={!!message.isNewMsg} user={user} />
         </Fragment>
      )
   })

type TMessagesProps = {
   directChatId: number
}

type TMessagesLoadingState = "loading-messages"

export const Messages = memo(({ directChatId }: TMessagesProps) => {
   const { messages, fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const [loading, setLoading] = useState<TMessagesLoadingState>()
   const user = useUser()
   const chatBox = useRef<HTMLDivElement>(null)
   const hasMoreMessages = useRef<boolean>(true)
   const firstScrollToBottom = useRef<boolean>(true)
   const finalMessageId = useRef<number>(-1)
   const msgTime = useRef<Date>(new Date())
   const dispatch = useAppDispatch()
   const tempFlagUseEffectRef = useRef<boolean>(true)

   const scrollToBottomMessage = () => {
      const chatBoxEle = chatBox.current
      if (chatBoxEle) {
         chatBoxEle.scrollTo({
            top: chatBoxEle.scrollHeight - chatBoxEle.clientHeight - 100,
            behavior: "instant",
         })
         chatBoxEle.scrollTo({
            top: chatBoxEle.scrollHeight,
            behavior: "smooth",
         })
      }
   }

   const scrollToBottomMessageHandler = () => {
      if (messages && messages.length > 0) {
         const chatBoxEle = chatBox.current
         if (chatBoxEle) {
            if (firstScrollToBottom.current) {
               firstScrollToBottom.current = false
               chatBoxEle.scrollTo({
                  top: chatBoxEle.scrollHeight,
                  behavior: "instant",
               })
            }
            const finalMessage = messages.at(-1)!
            if (finalMessageId.current !== finalMessage.id) {
               finalMessageId.current = finalMessage.id
               if (chatBoxEle.scrollTop + chatBoxEle.clientHeight > chatBoxEle.scrollHeight - 100) {
                  chatBoxEle.scrollTo({
                     top: chatBoxEle.scrollHeight,
                     behavior: "smooth",
                  })
               } else if (finalMessage.authorId === user!.id) {
                  chatBoxEle.scrollTo({
                     top: chatBoxEle.scrollHeight,
                     behavior: "smooth",
                  })
               }
            }
         }
      }
   }

   const setMsgTime = () => {
      if (messages && messages.length > 0) {
         msgTime.current = new Date(messages[0].createdAt)
      }
   }

   useEffect(() => {
      setMsgTime()
      scrollToBottomMessageHandler()
   }, [messages])

   const fetchDirectMessages = async (directChatId: number, msgTime: Date) => {
      const chatBoxEle = chatBox.current
      if(!chatBoxEle) return
      setLoading("loading-messages")
      const scrollHeightBefore = chatBoxEle.scrollHeight // Chiều cao trước khi thêm
      const scrollTopBefore = chatBoxEle.scrollTop // Vị trí cuộn từ top
      dispatch(
         fetchDirectMessagesThunk({
            directChatId,
            msgTime,
            limit: EPaginations.DIRECT_MESSAGES_PAGE_SIZE,
            sortType: ESortTypes.ASC,
         })
      )
         .unwrap()
         .then((result) => {
            if (result) {
               hasMoreMessages.current = result.hasMoreMessages
            }
         })
         .catch((error) => {
            toast.error(axiosErrorHandler.handleHttpError(error).message)
         })
         .finally(() => {
            const scrollHeightAfter = chatBoxEle.scrollHeight // Chiều cao sau khi thêm
            const heightAdded = scrollHeightAfter - scrollHeightBefore // Chênh lệch chiều cao
            // Giữ nguyên khoảng cách từ lúc bắt đầu cuộn trước khi thêm các tin nhắn mới
            chatBoxEle.scrollTop = scrollTopBefore + heightAdded
            setLoading(undefined)
         })
   }

   function scrollChatBoxListner(this: HTMLDivElement, e: Event) {
      if (this.scrollHeight - this.scrollTop < this.clientHeight + SHOW_SCROLL_BTN_THRESHOLD) {
         customEventManager.dispatchEvent(EEventNames.SCROLL_TO_BOTTOM_MSG_UI)
      } else {
         customEventManager.dispatchEvent(EEventNames.SCROLL_OUT_OF_BOTTOM)
         // Check if the user scrolled to the top then fetch more messages
         if (this.scrollTop === 0 && hasMoreMessages.current && !loading) {
            fetchDirectMessages(directChatId, msgTime.current)
         }
      }
   }

   const listenScrollGetMoreMessages = () => {
      if (chatBox.current) {
         chatBox.current.addEventListener("scroll", scrollChatBoxListner)
         customEventManager.on(EEventNames.SCROLL_TO_BOTTOM_MSG_ACTION, (payload) => {
            scrollToBottomMessage()
         })
      }
   }

   const listenSendDirectMessage = () => {
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
   }

   const listenRecoverdConnection = () => {
      clientSocket.socket.on(ESocketEvents.recovered_connection, (newMessages) => {
         if (newMessages && newMessages.length > 0) {
            dispatch(pushNewMessages(newMessages))
            const { createdAt } = newMessages.at(-1)!
            clientSocket.setMessageOffset(new Date(createdAt), directChatId)
         }
      })
   }

   useEffect(() => {
      if (tempFlagUseEffectRef.current) {
         tempFlagUseEffectRef.current = false
         if (!messages || messages.length === 0) {
            fetchDirectMessages(directChatId, msgTime.current)
         }
      }
      listenScrollGetMoreMessages()
      listenSendDirectMessage()
      listenRecoverdConnection()
      return () => {
         chatBox.current?.removeEventListener("scroll", scrollChatBoxListner)
         customEventManager.off(EEventNames.SCROLL_TO_BOTTOM_MSG_ACTION)
         clientSocket.socket.off(ESocketEvents.recovered_connection)
         clientSocket.socket.off(ESocketEvents.send_message_direct)
      }
   }, [])

   return (
      <>
         {createPortal(<ScrollToBottomMessageBtn />, document.body)}

         <div
            className="flex flex-col items-center w-full h-full overflow-y-scroll overflow-x-hidden styled-scrollbar px-3 box-border"
            ref={chatBox}
         >
            {fetchedMsgs && user ? (
               messages && messages.length > 0 ? (
                  <div className="flex flex-col justify-end items-center py-3 box-border w-messages-list gap-y-2">
                     {hasMoreMessages.current && loading === "loading-messages" && (
                        <div className="flex w-full justify-center">
                           <Spinner size="small" />
                        </div>
                     )}
                     <MappedMessages messages={messages} user={user} />
                  </div>
               ) : (
                  <NoMessagesYet />
               )
            ) : (
               <div className="m-auto w-11 h-11">
                  <Spinner size="medium" />
               </div>
            )}
         </div>
      </>
   )
})
