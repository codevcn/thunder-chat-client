"use client"

import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useRef, useState, useEffect, memo } from "react"
import { CheckCheck, Check } from "lucide-react"
import { fetchDirectMessagesThunk } from "@/redux/messages/messages.thunk"
import type { TDirectMessage, TStateDirectMessage, TUserWithoutPassword } from "@/utils/types"
import { Spinner } from "@/components/materials/spinner"
import dayjs from "dayjs"
import { EPaginations, ESortTypes, ETimeFormats } from "@/utils/enums"
import { ScrollToBottomMessageBtn } from "./scroll-to-bottom-msg-btn"
import { createPortal } from "react-dom"
import { useUser } from "@/hooks/user"
import { pushNewMessages, updateMessages } from "@/redux/messages/messages.slice"
import { displayMessageStickyTime } from "@/utils/date-time"
import axiosErrorHandler from "@/utils/axios-error-handler"
import toast from "react-hot-toast"
import { SHOW_SCROLL_BTN_THRESHOLD } from "@/utils/constants"
import { EInternalEvents } from "@/utils/event-emitter/events"
import { clientSocket } from "@/utils/socket/client-socket"
import { ESocketEvents } from "@/utils/socket/events"
import { eventEmitter } from "@/utils/event-emitter/event-emitter"
import { santizeMsgContent } from "@/utils/helpers"
import { EMessageStatus } from "@/utils/socket/enums"
import type { TDirectChatData } from "@/apis/types"
import type { TMsgSeenListenPayload } from "@/utils/socket/types"

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
   const { authorId, content, createdAt, isNewMsg, id, status } = message

   const msgTime = dayjs(createdAt).format(ETimeFormats.HH_mm)

   return (
      <>
         {stickyTime && <StickyTime stickyTime={stickyTime} />}

         <div className="w-full text-regular-white-cl">
            {user.id === authorId ? (
               <div className={`QUERY-user-message-${id} flex justify-end w-full`}>
                  <div
                     className={`${isNewMsg ? "animate-new-user-message -translate-x-[3.5rem] translate-y-[1rem] opacity-0" : ""} max-w-[70%] w-max bg-regular-violet-cl rounded-t-2xl rounded-bl-2xl py-1.5 pb-1 pl-2 pr-1`}
                  >
                     <div
                        className="text-end break-words whitespace-pre-wrap text-sm inline"
                        dangerouslySetInnerHTML={{ __html: santizeMsgContent(content) }}
                     ></div>
                     <div className="flex justify-end items-center gap-x-1 mt-1.5 w-full">
                        <span className="text-xs text-regular-creator-msg-time-cl leading-none">
                           {msgTime}
                        </span>
                        <div className="flex ml-0.5">
                           {status === EMessageStatus.SENT ? (
                              <Check size={15} />
                           ) : (
                              status === EMessageStatus.SEEN && <CheckCheck size={15} />
                           )}
                        </div>
                     </div>
                  </div>
               </div>
            ) : (
               <div
                  className={`${isNewMsg || status === EMessageStatus.SENT ? "QUERY-unread-message" : ""} origin-left flex justify-start w-full`}
                  data-msg-id={id}
               >
                  <div
                     className={`${isNewMsg ? "animate-new-friend-message translate-x-[3.5rem] translate-y-[1rem] opacity-0" : ""} max-w-[70%] w-max bg-regular-dark-gray-cl rounded-t-2xl rounded-br-2xl pt-1.5 pb-1 px-2 relative`}
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
   directChat: TDirectChatData
}

type TMessagesLoadingState = "loading-messages"

type TUnreadMessages = {
   count: number
   firstUnreadOffsetTop: number
}

export const Messages = memo(({ directChat }: TMessagesProps) => {
   const { id: directChatId, recipientId, creatorId, lastSentMessageId } = directChat
   const { messages, fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const [loading, setLoading] = useState<TMessagesLoadingState>()
   const user = useUser()!
   const messagesContainer = useRef<HTMLDivElement>(null) // Tham chiếu đến phần tử chứa danh sách tin nhắn
   const hasMoreMessages = useRef<boolean>(true) // Biến để kiểm tra xem còn tin nhắn nào để tải thêm hay không
   const firstScrollToBottom = useRef<boolean>(true) // Biến để kiểm tra xem đã cuộn xuống dưới lần đầu hay chưa
   const finalMessageId = useRef<number>(-1) // Biến để lưu ID của tin nhắn cuối cùng trong danh sách
   const msgOffset = useRef<number>(lastSentMessageId) // Biến lưu offset để tải thêm tin nhắn
   const dispatch = useAppDispatch()
   const tempFlagUseEffectRef = useRef<boolean>(true)
   const messagesPreCount = useRef<number>(0) // Biến để lưu số lượng tin nhắn trước đó trong danh sách
   const unreadMessagesRef = useRef<TUnreadMessages>({ count: 0, firstUnreadOffsetTop: -1 }) // Biến để lưu thông tin về tin nhắn chưa đọc

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
               // Lưu ID của tin nhắn cuối cùng
            }
            const finalMessageData = messages[messages.length - 1]
            if (finalMessageId.current !== finalMessageData.id) {
               // Chỉ cuộn xuống dưới khi có tin nhắn mới từ user hoặc friend
               finalMessageId.current = finalMessageData.id
               if (
                  msgsContainerEle.scrollTop + msgsContainerEle.clientHeight >
                  msgsContainerEle.scrollHeight - SCROLL_ON_MESSAGES_THRESHOLD
               ) {
                  // Cuộn khi màn hình chỉ đang cách mép dưới 100px
                  msgsContainerEle.scrollTo({
                     top: msgsContainerEle.scrollHeight,
                     behavior: "smooth",
                  })
               } else if (finalMessageData.authorId === user.id) {
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

   // Thiết lập mốc thời gian để lấy tin nhắn, nếu không có tin nhắn nào thì lấy thời gian hiện tại
   const initMessageOffset = () => {
      if (messages && messages.length > 0) {
         msgOffset.current = messages[0].id
      }
   }

   const fetchDirectMessages = async (
      directChatId: number,
      msgOffset: number,
      isFirstTime: boolean
   ) => {
      const msgsContainerEle = messagesContainer.current
      if (!msgsContainerEle) return
      setLoading("loading-messages")
      const scrollHeightBefore = msgsContainerEle.scrollHeight // Chiều cao trước khi thêm
      const scrollTopBefore = msgsContainerEle.scrollTop // Vị trí cuộn từ top
      dispatch(
         fetchDirectMessagesThunk({
            directChatId,
            msgOffset,
            limit: EPaginations.DIRECT_MESSAGES_PAGE_SIZE,
            sortType: ESortTypes.ASC,
            isFirstTime,
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

   // Hàm xử lý việc cuộn đoạn chat lên tin nhắn trên cùng
   const handleScrollToTopMessage = (e: Event) => {
      const messagesContainer = e.currentTarget as HTMLElement
      if (
         messagesContainer.scrollHeight - messagesContainer.scrollTop <
         messagesContainer.clientHeight + SHOW_SCROLL_BTN_THRESHOLD
      ) {
         eventEmitter.emit(EInternalEvents.SCROLL_TO_BOTTOM_MSG_UI)
      } else {
         eventEmitter.emit(EInternalEvents.SCROLL_OUT_OF_BOTTOM)
         // Check if the user scrolled to the top then fetch more messages
         if (messagesContainer.scrollTop < 10 && hasMoreMessages.current && !loading) {
            fetchDirectMessages(directChatId, msgOffset.current, false)
         }
      }
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

   // Cuộn đến cuối danh sách tin nhắn hoặc cuộn đến tin nhắn đầu tiên chưa đọc
   const handleScrollToBottomMsg = () => {
      const unreadMessages = unreadMessagesRef.current
      if (unreadMessages.count > 0 && unreadMessages.firstUnreadOffsetTop !== -1) {
         scrollToFirstUnreadMessage()
      } else {
         scrollToBottomMessage()
      }
   }

   // Xử lý sự kiện gửi tin nhắn từ đối phương
   const handleSendDirectMessage = (newMessage: TDirectMessage) => {
      const { id, authorId, createdAt, content, status } = newMessage
      dispatch(
         pushNewMessages([
            {
               id,
               authorId,
               content,
               directChatId,
               createdAt,
               status,
               isNewMsg: true,
            },
         ])
      )
      clientSocket.setMessageOffset(id, directChatId)
   }

   // Xử lý sự kiện kết nối lại từ server
   const handleRecoverdConnection = (newMessages: TDirectMessage[]) => {
      if (newMessages && newMessages.length > 0) {
         dispatch(pushNewMessages(newMessages))
         const { id } = newMessages[newMessages.length - 1]
         clientSocket.setMessageOffset(id, directChatId)
      }
   }

   // Xử lý tin nhắn chưa đọc nằm ngoài vùng nhìn thấy
   const handleUnreadMsgOutOfVisibleView = (
      messagesContainer: HTMLElement,
      unreadMessage: HTMLElement
   ) => {
      if (unreadMessage.offsetTop > messagesContainer.scrollTop + messagesContainer.clientHeight) {
         // Nếu tin nhắn chưa đọc nằm ngoài vùng nhìn thấy
         eventEmitter.emit(EInternalEvents.UNREAD_MESSAGES_COUNT, unreadMessagesRef.current.count)
      }
   }

   // Kiểm tra và setup tin nhắn chưa đọc khi dữ liệu danh sách tin nhắn thay đổi
   const checkUnreadMessage = () => {
      const msgsContainerEle = messagesContainer.current
      if (
         msgsContainerEle &&
         messages &&
         messages.length > 0 &&
         messages.length > messagesPreCount.current
      ) {
         const unreadMessageEles =
            msgsContainerEle.querySelectorAll<HTMLElement>(".QUERY-unread-message")
         if (unreadMessageEles && unreadMessageEles.length > 0) {
            const unreadMessages = unreadMessagesRef.current
            unreadMessages.firstUnreadOffsetTop = unreadMessageEles[0].offsetTop
            unreadMessages.count = unreadMessageEles.length
            for (const msgEle of unreadMessageEles) {
               handleUnreadMsgInVisibleView(
                  msgsContainerEle,
                  msgEle,
                  parseInt(msgEle.getAttribute("data-msg-id")!)
               )
               handleUnreadMsgOutOfVisibleView(msgsContainerEle, msgEle)
            }
         }
      }
   }

   // Xử lý tin nhắn chưa đọc khi cuộn vào vùng nhìn thấy
   const handleUnreadMsgInVisibleView = (
      messagesContainer: HTMLElement,
      unreadMessage: HTMLElement,
      msgId: number
   ) => {
      if (
         unreadMessage.offsetTop + unreadMessage.offsetHeight <
         messagesContainer.scrollTop + messagesContainer.clientHeight
      ) {
         // Nếu tin nhắn chưa đọc nằm trong vùng nhìn thấy
         unreadMessage.classList.remove("QUERY-unread-message")
         const unreadMessages = unreadMessagesRef.current
         if (unreadMessages.count > 0) unreadMessages.count -= 1
         unreadMessages.firstUnreadOffsetTop = -1
         eventEmitter.emit(EInternalEvents.UNREAD_MESSAGES_COUNT, unreadMessages.count)
         clientSocket.socket.emit(ESocketEvents.message_seen_direct, {
            messageId: msgId,
            receiverId: recipientId === user.id ? creatorId : recipientId,
         })
      }
   }

   // Hàm xử lý việc cuộn các tin nhắn vào vùng nhìn thấy
   const handleScrollMsgIntoVisibleView = (e: Event) => {
      const msgsContainerEle = e.currentTarget as HTMLElement
      const unreadMessages = msgsContainerEle.querySelectorAll<HTMLElement>(".QUERY-unread-message")
      if (unreadMessages && unreadMessages.length > 0) {
         for (const msg of unreadMessages) {
            handleUnreadMsgInVisibleView(
               msgsContainerEle,
               msg,
               parseInt(msg.getAttribute("data-msg-id")!)
            )
         }
      }
   }

   // Hàm xử lý việc cuộn đoạn chat
   const handleScrollMsgsContainer = (e: Event) => {
      handleScrollMsgIntoVisibleView(e)
      handleScrollToTopMessage(e)
   }

   // Cập nhật số lượng tin nhắn sau khi dữ liệu danh sách tin nhắn thay đổi
   const updateMessagesCount = () => {
      messagesPreCount.current = messages?.length || 0
   }

   // Xử lý sự kiện đã đọc tin nhắn từ đối phương
   const handleMessageSeen = ({ messageId, status }: TMsgSeenListenPayload) => {
      dispatch(updateMessages([{ msgId: messageId, msgUpdates: { status } }]))
   }

   useEffect(() => {
      initMessageOffset()
      requestAnimationFrame(() => {
         scrollToBottomOnMessages()
         checkUnreadMessage()
         updateMessagesCount()
      })
   }, [messages])

   useEffect(() => {
      if (tempFlagUseEffectRef.current) {
         tempFlagUseEffectRef.current = false
         if (!messages || messages.length === 0) {
            fetchDirectMessages(directChatId, msgOffset.current, true)
         }
      }
      messagesContainer.current?.addEventListener("scroll", handleScrollMsgsContainer)
      eventEmitter.on(EInternalEvents.SCROLL_TO_BOTTOM_MSG_ACTION, handleScrollToBottomMsg)
      clientSocket.socket.on(ESocketEvents.send_message_direct, handleSendDirectMessage)
      clientSocket.socket.on(ESocketEvents.recovered_connection, handleRecoverdConnection)
      clientSocket.socket.on(ESocketEvents.message_seen_direct, handleMessageSeen)
      return () => {
         messagesContainer.current?.removeEventListener("scroll", handleScrollMsgsContainer)
         eventEmitter.off(EInternalEvents.SCROLL_TO_BOTTOM_MSG_ACTION, handleScrollToBottomMsg)
         clientSocket.socket.off(ESocketEvents.recovered_connection, handleRecoverdConnection)
         clientSocket.socket.off(ESocketEvents.send_message_direct, handleSendDirectMessage)
         clientSocket.socket.off(ESocketEvents.message_seen_direct, handleMessageSeen)
      }
   }, [])

   return (
      <>
         {createPortal(<ScrollToBottomMessageBtn />, document.body)}

         <div
            className="flex flex-col items-center w-full h-full overflow-y-scroll overflow-x-hidden styled-scrollbar px-3 box-border"
            ref={messagesContainer}
         >
            {fetchedMsgs ? (
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
