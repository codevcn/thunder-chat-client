"use client"

// >>> fix this: remove
import { dev_test_values } from "@/providers/test"

import { Avatar, Flex, Tooltip, Skeleton } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faPhone, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons"
import { IconButton } from "@/components/icon-button"
import { Messages } from "./messages"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { useEffect, useState, memo, ChangeEvent, useRef } from "react"
import { fetchConversationThunk } from "@/redux/messages/messages.thunk"
import { useSearchParams } from "next/navigation"
import validator from "validator"
import {
   faMicrophone,
   faPaperclip,
   faFaceSmile,
   faPaperPlane,
} from "@fortawesome/free-solid-svg-icons"
import { Input } from "antd"
import { InfoBar } from "./infoBar"
import { openInfoBar } from "@/redux/conversations/conversations-slice"
import { setLastSeen } from "@/utils/helpers"
import { chattingService } from "@/services/chatting.service"
import { TextAreaRef } from "antd/es/input/TextArea"
import type { TConversation, TSuccess } from "@/utils/types"
import toast from "react-hot-toast"

type THeaderProps = {
   infoBarIsOpened: boolean
   onOpenInfoBar: (open: boolean) => void
}

const Header = ({ infoBarIsOpened, onOpenInfoBar }: THeaderProps) => {
   const { recipient } = useAppSelector(({ messages }) => messages)

   return (
      <Flex
         justify="space-between"
         className="px-6 py-1.5 bg-regular-darkGray-cl w-full box-border h-header-height"
         gap={10}
      >
         {recipient ? (
            <Tooltip title="View user info" placement="bottom">
               <Flex gap={10} className="cursor-pointer" onClick={() => onOpenInfoBar(true)}>
                  {recipient.Profile && recipient.Profile.avatar ? (
                     <Avatar src={recipient.Profile.avatar} size={45} />
                  ) : (
                     <Avatar size={45}>{recipient.Profile?.fullName}</Avatar>
                  )}
                  <div>
                     <h3 className="text-lg font-bold">
                        {recipient.Profile?.fullName || "Unnamed"}
                     </h3>
                     <div className="text-xs text-regular-text-secondary-cl">
                        {"Last seen " + setLastSeen(dev_test_values.user_1.lastOnline)}
                     </div>
                  </div>
               </Flex>
            </Tooltip>
         ) : (
            <Flex gap={10}>
               <Skeleton.Avatar active size={45} style={{ backgroundColor: "#b8b8b826" }} />
               <Flex vertical className="h-full" justify="space-between">
                  <Skeleton.Button
                     active
                     style={{ height: 20, width: 100, backgroundColor: "#b8b8b826" }}
                  />
                  <Skeleton.Button
                     active
                     style={{ height: 20, width: 150, backgroundColor: "#b8b8b826" }}
                  />
               </Flex>
            </Flex>
         )}

         <Flex
            className={`${infoBarIsOpened ? "screen-large-chatting:translate-x-slide-header-icons" : "translate-x-0"} transition duration-300 ease-slide-info-bar-timing`}
            align="center"
            gap={10}
         >
            <Tooltip title="Search this chat" placement="bottomRight" arrow={false}>
               <div>
                  <IconButton className="flex justify-center items-center text-regular-icon-cl w-[35px] h-[35px]">
                     <FontAwesomeIcon icon={faMagnifyingGlass} size="lg" />
                  </IconButton>
               </div>
            </Tooltip>

            <Tooltip title="Call" placement="bottomRight" arrow={false}>
               <div>
                  <IconButton className="flex justify-center items-center text-regular-icon-cl w-[35px] h-[35px]">
                     <FontAwesomeIcon icon={faPhone} size="lg" />
                  </IconButton>
               </div>
            </Tooltip>

            <Tooltip title="More actions" placement="bottomRight" arrow={false}>
               <div>
                  <IconButton className="flex justify-center items-center text-regular-icon-cl w-[35px] h-[35px]">
                     <FontAwesomeIcon icon={faEllipsisVertical} size="lg" />
                  </IconButton>
               </div>
            </Tooltip>
         </Flex>
      </Flex>
   )
}

type TTypeMessageBarProps = {
   conversation: TConversation
}

type TSendMessage1v1ErrorRes = {
   isError: boolean
   message: string
}

const TypeMessageBar = memo(({ conversation }: TTypeMessageBarProps) => {
   const { fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const [message, setMessage] = useState<string>("")

   const typing = async (e: ChangeEvent<HTMLTextAreaElement>) => {
      const msg = e.target.value
      // stop typing when input value is "\n" after sending message
      if (/^\n$/.test(msg)) {
         setMessage("")
      } else {
         setMessage(msg)
      }
   }

   const sendMessage = async () => {
      const msgToSend = message?.trim()
      if (!msgToSend) return
      const { recipientId, id } = conversation
      chattingService.sendMessage(
         recipientId,
         msgToSend,
         id,
         crypto.randomUUID(),
         (res: TSendMessage1v1ErrorRes | TSuccess) => {
            if ("isError" in res && res.isError) {
               toast.error(res.message)
            }
         }
      )
   }

   const catchEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter") {
         e.preventDefault()
         if (e.shiftKey) {
            setMessage((pre) => pre + "\n")
         } else {
            sendMessage()
            setMessage("")
         }
      }
   }

   return (
      fetchedMsgs && (
         <Flex className="pt-2 pb-4 w-type-message-bar-width box-border" align="center" gap={10}>
            <Flex
               className="relative z-10 w-full rounded-2xl bg-regular-darkGray-cl px-3 border-2 border-regular-darkGray-cl hover:border-regular-violet-cl transition duration-200"
               align="center"
               gap={5}
            >
               <div className="text-gray-500 hover:text-regular-violet-cl relative bottom-0 left-0">
                  <FontAwesomeIcon icon={faFaceSmile} color="inherit" size="xl" />
               </div>

               <div className="relative bg-regular-darkGray-cl w-full">
                  <Input.TextArea
                     className="bg-transparent hover:bg-transparent leading-tight focus:bg-transparent text-base p-3 px-1 z-10 styled-scrollbar border-transparent text-white hover:border-transparent focus:border-transparent focus:shadow-none"
                     onChange={typing}
                     autoSize={{ minRows: 1, maxRows: 10 }}
                     onKeyDown={catchEnter}
                     value={message}
                  />
                  <span
                     className={`${message ? "animate-hide-placeholder" : "animate-grow-placeholder"} left-2 z-0 absolute top-1/2 -translate-y-1/2 text-regular-placeholder-text-cl`}
                  >
                     Message...
                  </span>
               </div>

               <div className="text-gray-500 hover:text-regular-violet-cl relative bottom-0 right-0">
                  <FontAwesomeIcon icon={faPaperclip} color="inherit" size="xl" />
               </div>
            </Flex>

            <Tooltip title={message ? "Send message" : "Record voice message"} placement="top">
               <Flex
                  className={`bg-regular-darkGray-cl rounded-full p-[27px] relative hover:text-white ${message ? "text-regular-violet-cl" : "text-gray-500"} cursor-pointer hover:bg-regular-violet-cl`}
                  justify="center"
                  align="center"
               >
                  <div
                     className={`${message ? "animate-hide-icon" : "animate-grow-icon"} absolute`}
                  >
                     <FontAwesomeIcon icon={faMicrophone} color="inherit" size="xl" />
                  </div>
                  <div
                     className={`${message ? "animate-grow-icon" : "animate-hide-icon"} absolute`}
                  >
                     <FontAwesomeIcon icon={faPaperPlane} color="inherit" size="xl" />
                  </div>
               </Flex>
            </Tooltip>
         </Flex>
      )
   )
})

export const Chat = () => {
   const { conversation } = useAppSelector(({ messages }) => messages)
   const dispatch = useAppDispatch()
   const searchParams = useSearchParams()
   const [conversationId, setConversationId] = useState<number>()
   const { infoBarIsOpened } = useAppSelector(({ conversations }) => conversations)

   const hanldeOpenInfoBar = async (open: boolean) => {
      dispatch(openInfoBar(open))
   }

   useEffect(() => {
      const conversationId = searchParams.get("cid")
      if (conversationId && validator.isNumeric(conversationId)) {
         const conv_id = parseInt(conversationId)

         dispatch(fetchConversationThunk(conv_id))

         setConversationId(conv_id)
      }
   }, [])

   return (
      conversationId &&
      conversation && (
         <Flex className="screen-medium-chatting:w-chat-n-info-container-width w-full box-border overflow-hidden relative">
            <Flex
               className="Chatting w-full box-border h-screen bg-no-repeat bg-transparent bg-cover bg-center relative"
               vertical
               align="center"
            >
               <Header infoBarIsOpened={infoBarIsOpened} onOpenInfoBar={hanldeOpenInfoBar} />

               <Flex
                  className={`${infoBarIsOpened ? "screen-large-chatting:translate-x-slide-chat-container screen-large-chatting:w-msgs-container-width" : "translate-x-0 w-full"} h-chat-container-height transition duration-300 ease-slide-info-bar-timing overflow-hidden`}
                  vertical
                  justify="space-between"
                  align="center"
               >
                  <Messages conversationId={conversationId} />

                  <TypeMessageBar conversation={conversation} />
               </Flex>
            </Flex>

            <InfoBar />
         </Flex>
      )
   )
}
