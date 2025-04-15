"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useRef, useState, useEffect, memo, useCallback } from "react"
import { CheckCheck } from "lucide-react"
import { fetchDirectMessagesThunk } from "@/redux/messages/messages.thunk"
import type { TStateDirectMessage, TUserWithoutPassword } from "@/utils/types"
import { Spinner } from "@/components/materials/spinner"
import dayjs from "dayjs"
import { EPaginations, ESortTypes, ETimeFormats } from "@/utils/enums"
import { ScrollToBottomMessageBtn } from "./scroll-to-bottom-msg-btn"
import { createPortal } from "react-dom"
import { useUser } from "@/hooks/user"
import { pushNewMessages } from "@/redux/messages/messages.slice"
import { displayMessageStickyTime } from "@/utils/date-time"
import axiosErrorHandler from "@/utils/axios-error-handler"
import toast from "react-hot-toast"
import { SHOW_SCROLL_BTN_THRESHOLD } from "@/utils/constants"
import { EInternalEvents } from "@/utils/event-emitter/events"
import { clientSocket } from "@/utils/socket/client-socket"
import { ESocketEvents } from "@/utils/socket/events"
import { eventEmitter } from "@/utils/event-emitter/event-emitter"
import { santizeMsgContent } from "@/utils/helpers"

const SCROLL_ON_MESSAGES_THRESHOLD: number = 100

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

type TMessageProps = {
   message: TStateDirectMessage
   user: TUserWithoutPassword
   stickyTime: string | null
}

const Message = memo(({ message, user, stickyTime }: TMessageProps) => {
   const { authorId, content, createdAt, isNewMsg, id } = message

   const msgTime = dayjs(createdAt).format(ETimeFormats.HH_mm)

   return (
      <>
         {stickyTime && <StickyTime stickyTime={stickyTime} />}

         <div className="w-full text-regular-white-cl" data-msg-id={id}>
            {user.id === authorId ? (
               <div className="flex justify-end w-full">
                  <div
                     className={`${isNewMsg ? "animate-new-own-message" : ""} max-w-[70%] w-max bg-regular-violet-cl rounded-t-2xl rounded-bl-2xl py-1.5 pb-1 px-2`}
                  >
                     <div
                        className="text-end break-words whitespace-pre-wrap text-sm inline"
                        dangerouslySetInnerHTML={{ __html: santizeMsgContent(content) }}
                     ></div>
                     <div className="flex justify-end items-center gap-x-1 mt-1.5 w-max">
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
               <div
                  className={`${isNewMsg ? "QUERY-unread-message" : ""} origin-left flex justify-start w-full`}
               >
                  <div
                     className={`${isNewMsg ? "animate-friend-new-message" : ""} max-w-[70%] w-max bg-regular-dark-gray-cl rounded-t-2xl rounded-br-2xl pt-1.5 pb-1 px-2 relative`}
                  >
                     <div
                        className="max-w-full break-words whitespace-pre-wrap text-sm inline"
                        dangerouslySetInnerHTML={{ __html: santizeMsgContent(content) }}
                     ></div>
                     <div className="flex justify-end items-center mt-1.5">
                        <span className="text-xs text-regular-creator-msg-time-cl">{msgTime}</span>
                     </div>
                  </div>
               </div>
            )}
         </div>
      </>
   )
})

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

type TMappedMessagesProps = {
   messages: TStateDirectMessage[]
   user: TUserWithoutPassword
}

const MappedMessages = ({ messages, user }: TMappedMessagesProps) =>
   messages.map((message, index) => {
      const stickyTime = displayMessageStickyTime(message.createdAt, messages[index - 1]?.createdAt)

      return <Message message={message} key={message.id} user={user} stickyTime={stickyTime} />
   })

type TMessagesProps = {
   directChatId: number
}

type TMessagesLoadingState = "loading-messages"

type TUnreadMessages = {
   count: number
   firstUnreadOffsetTop: number
}

export const Messages = memo(({ directChatId }: TMessagesProps) => {
   const { messages, fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const [loading, setLoading] = useState<TMessagesLoadingState>()
   const user = useUser()
   const messagesContainer = useRef<HTMLDivElement>(null)
   const hasMoreMessages = useRef<boolean>(true)
   const firstScrollToBottom = useRef<boolean>(true)
   const finalMessageId = useRef<number>(-1)
   const msgTime = useRef<Date>(new Date())
   const dispatch = useAppDispatch()
   const tempFlagUseEffectRef = useRef<boolean>(true)
   const messagesPreCount = useRef<number>(0)
   const unreadMessagesRef = useRef<TUnreadMessages>({ count: 0, firstUnreadOffsetTop: -1 })

   // Xử lý cuộn xuống dưới khi nhấn nút
   const scrollToBottomMessage = () => {
      const msgsContainerEle = messagesContainer.current
      if (msgsContainerEle) {
         msgsContainerEle.scrollTo({
            top: msgsContainerEle.scrollHeight - msgsContainerEle.clientHeight - 100,
            behavior: "instant",
         })
         msgsContainerEle.scrollTo({
            top: msgsContainerEle.scrollHeight,
            behavior: "smooth",
         })
      }
   }

   // Xử lý cuộn xuống dưới khi danh sách tin nhắn thay đổi
   const scrollToBottomOnMessages = () => {
      if (messages && messages.length > 0) {
         const msgsContainerEle = messagesContainer.current
         if (msgsContainerEle) {
            if (firstScrollToBottom.current) {
               // Cuộn xuống dưới khi lần đầu tiên tải tin nhắn
               firstScrollToBottom.current = false
               msgsContainerEle.scrollTo({
                  top: msgsContainerEle.scrollHeight,
                  behavior: "instant",
               })
            } else {
               const finalMessage = messages.at(-1)!
               if (finalMessageId.current !== finalMessage.id) {
                  // Chỉ cuộn khi có tin nhắn mới
                  finalMessageId.current = finalMessage.id
                  if (
                     msgsContainerEle.scrollTop + msgsContainerEle.clientHeight >
                     msgsContainerEle.scrollHeight - SCROLL_ON_MESSAGES_THRESHOLD
                  ) {
                     // Cuộn khi có tin nhắn mới và màn hình chỉ đang cách mép dưới 100px
                     msgsContainerEle.scrollTo({
                        top: msgsContainerEle.scrollHeight,
                        behavior: "smooth",
                     })
                  } else if (finalMessage.authorId === user!.id) {
                     // Cuộn khi người dùng gửi tin nhắn
                     msgsContainerEle.scrollTo({
                        top: msgsContainerEle.scrollHeight,
                        behavior: "smooth",
                     })
                  }
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

   const fetchDirectMessages = async (directChatId: number, msgTime: Date) => {
      const msgsContainerEle = messagesContainer.current
      if (!msgsContainerEle) return
      setLoading("loading-messages")
      const scrollHeightBefore = msgsContainerEle.scrollHeight // Chiều cao trước khi thêm
      const scrollTopBefore = msgsContainerEle.scrollTop // Vị trí cuộn từ top
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
            const scrollHeightAfter = msgsContainerEle.scrollHeight // Chiều cao sau khi thêm
            const heightAdded = scrollHeightAfter - scrollHeightBefore // Chênh lệch chiều cao
            // Giữ nguyên khoảng cách từ lúc bắt đầu cuộn trước khi thêm các tin nhắn mới
            msgsContainerEle.scrollTop = scrollTopBefore + heightAdded
            setLoading(undefined)
         })
   }

   function scrollChatBoxListner(this: HTMLDivElement, _: Event) {
      if (this.scrollHeight - this.scrollTop < this.clientHeight + SHOW_SCROLL_BTN_THRESHOLD) {
         eventEmitter.emit(EInternalEvents.SCROLL_TO_BOTTOM_MSG_UI)
      } else {
         eventEmitter.emit(EInternalEvents.SCROLL_OUT_OF_BOTTOM)
         // Check if the user scrolled to the top then fetch more messages
         if (this.scrollTop === 0 && hasMoreMessages.current && !loading) {
            fetchDirectMessages(directChatId, msgTime.current)
         }
      }
   }

   const listenScrollGetMoreMessages = () => {
      messagesContainer.current?.addEventListener("scroll", scrollChatBoxListner)
   }

   const scrollToFirstUnreadMessage = () => {
      const msgsContainerEle = messagesContainer.current
      if (msgsContainerEle) {
         msgsContainerEle.scrollTo({
            top: unreadMessagesRef.current.firstUnreadOffsetTop - msgsContainerEle.clientHeight / 2,
            behavior: "instant",
         })
      }
   }

   const listenScrollToBottomMsg = () => {
      eventEmitter.on(EInternalEvents.SCROLL_TO_BOTTOM_MSG_ACTION, () => {
         const unreadMessages = unreadMessagesRef.current
         if (unreadMessages.count > 0 && unreadMessages.firstUnreadOffsetTop !== -1) {
            scrollToFirstUnreadMessage()
         } else {
            scrollToBottomMessage()
         }
      })
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

   const checkUnreadMessage = () => {
      if (messages && messages.length > 0 && messages.length > messagesPreCount.current) {
         const unreadMessageEles =
            messagesContainer.current?.querySelectorAll<HTMLElement>(".QUERY-unread-message")
         if (unreadMessageEles && unreadMessageEles.length > 0) {
            const unreadMessages = unreadMessagesRef.current
            unreadMessages.firstUnreadOffsetTop = unreadMessageEles[0].offsetTop
            unreadMessages.count = unreadMessageEles.length
            eventEmitter.emit(EInternalEvents.UNREAD_MESSAGES_COUNT, unreadMessages.count)
         }
      }
   }

   const handleUnreadMessage = (unreadMessage: HTMLElement) => {
      const msgsContainerEle = messagesContainer.current
      if (msgsContainerEle) {
         if (
            unreadMessage.offsetTop + unreadMessage.offsetHeight <
            msgsContainerEle.scrollTop + msgsContainerEle.clientHeight
         ) {
            unreadMessage.classList.remove("QUERY-unread-message")
            const unreadMessages = unreadMessagesRef.current
            unreadMessages.count -= 1
            unreadMessages.firstUnreadOffsetTop =
               msgsContainerEle.querySelectorAll<HTMLElement>(".QUERY-unread-message")[0]
                  ?.offsetTop || -1
            eventEmitter.emit(
               EInternalEvents.UNREAD_MESSAGES_COUNT,
               unreadMessagesRef.current.count
            )
         }
      }
   }

   const handleScrollMsgsContainer = useCallback(() => {
      const unreadMessages =
         messagesContainer.current?.querySelectorAll<HTMLElement>(".QUERY-unread-message")
      if (unreadMessages && unreadMessages.length > 0) {
         for (const msg of unreadMessages) {
            handleUnreadMessage(msg)
         }
      }
   }, [])

   const listenOnScrollMsgsContainer = () => {
      const msgsContainerEle = messagesContainer.current
      if (msgsContainerEle) {
         msgsContainerEle.addEventListener("scroll", handleScrollMsgsContainer)
      }
   }

   const updateMessagesCount = () => {
      messagesPreCount.current = messages?.length || 0
   }

   useEffect(() => {
      setMsgTime()
      requestAnimationFrame(() => {
         scrollToBottomOnMessages()
         checkUnreadMessage()
         updateMessagesCount() // Cập nhật số lượng tin nhắn sau khi cuộn
      })
   }, [messages])

   useEffect(() => {
      if (tempFlagUseEffectRef.current) {
         tempFlagUseEffectRef.current = false
         if (!messages || messages.length === 0) {
            fetchDirectMessages(directChatId, msgTime.current)
         }
      }
      listenOnScrollMsgsContainer()
      listenScrollGetMoreMessages()
      listenScrollToBottomMsg()
      listenSendDirectMessage()
      listenRecoverdConnection()
      return () => {
         messagesContainer.current?.removeEventListener("scroll", scrollChatBoxListner)
         messagesContainer.current?.removeEventListener("scroll", handleScrollMsgsContainer)
         eventEmitter.off(EInternalEvents.SCROLL_TO_BOTTOM_MSG_ACTION)
         clientSocket.socket.off(ESocketEvents.recovered_connection)
         clientSocket.socket.off(ESocketEvents.send_message_direct)
      }
   }, [])

   return (
      <>
         {createPortal(<ScrollToBottomMessageBtn />, document.body)}

         <div
            className="flex flex-col items-center w-full h-full overflow-y-scroll overflow-x-hidden styled-scrollbar px-3 box-border"
            ref={messagesContainer}
         >
            {fetchedMsgs && user ? (
               messages && messages.length > 0 ? (
                  <div
                     id="STYLE-user-messages"
                     className="flex flex-col justify-end items-center py-3 box-border w-messages-list gap-y-2"
                  >
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
