"use client"

import { CustomTooltip } from "@/components/materials"
import { Mic, Paperclip, Send, Smile } from "lucide-react"
import { chattingService } from "@/services/chatting.service"
import type { TDirectChat } from "@/utils/types"
import { useUser } from "@/hooks/user"
import { AutoResizeTextField } from "@/components/materials"
import toast from "react-hot-toast"
import { useAppSelector } from "@/hooks/redux"
import { memo, useEffect, useRef, useState, Suspense, lazy } from "react"
import { useRootLayoutContext } from "@/hooks/layout"
import { createPortal } from "react-dom"

const LazyEmojiPicker = lazy(() => import("../../components/materials/emoji-picker"))

const Fallback = () => (
   <div className="">
      <div>loading...</div>
   </div>
)

type TAddEmojiProps = {
   textFieldRef: React.RefObject<HTMLDivElement | null>
}

const AddEmoji = ({ textFieldRef }: TAddEmojiProps) => {
   const [show, setShow] = useState(false) // Hiển thị/ẩn picker
   const addEmojiPopoverRef = useRef<HTMLDivElement>(null)
   const addEmojiBtnRef = useRef<HTMLButtonElement>(null)
   const appRootEle = useRootLayoutContext().appRootRef!.current!

   const handleSelectEmoji = (emojiObject: EmojiClickData) => {
      const textField = textFieldRef.current
      if (textField) {
         console.log('>>> emo:', emojiObject.emoji)
         textField.innerText += emojiObject.emoji // Thêm emoji vào ô nhập
      }
      setShow(false)
   }

   const openEmojiPicker = () => {
      setShow((prev) => !prev)
   }

   const detectCollisionAndAdjust = () => {
      const addEmojiBtn = addEmojiBtnRef.current
      const addEmojiPopover = addEmojiPopoverRef.current
      if (addEmojiBtn && addEmojiPopover) {
         const buttonRect = addEmojiBtn.getBoundingClientRect()
         const popoverRect = addEmojiPopover.getBoundingClientRect()

         const setPopoverPosition = (top: number, left: number) => {
            addEmojiPopover.style.cssText = `top: ${top}px; left: ${left}px; position: fixed; z-index: 999;`
         }

         const conversationsListRect = (
            appRootEle.querySelector("#NAME-Conversations-List") as HTMLElement
         ).getBoundingClientRect()

         const top = buttonRect.top - popoverRect.height - 10
         const left = buttonRect.left + buttonRect.width / 2 - popoverRect.width / 2
         const conversationsListRight = conversationsListRect.right

         setPopoverPosition(
            top,
            left < conversationsListRight + 10 ? conversationsListRight + 10 : left
         )
      }
   }

   useEffect(() => {
      if (show) {
         detectCollisionAndAdjust()
      }
   }, [show])

   return (
      <div className="flex text-gray-500 hover:text-regular-violet-cl relative bottom-0 left-0 cursor-pointer">
         {show &&
            createPortal(
               <div ref={addEmojiPopoverRef} className="fixed top-0 left-0">
                  <Suspense fallback={<Fallback />}>
                     <LazyEmojiPicker
                        emojiStyle={EmojiStyle.FACEBOOK}
                        onSelectEmoji={handleSelectEmoji}
                        searchPlaceholder="Search emoji..."
                     />
                  </Suspense>
               </div>,
               document.body
            )}
         <button ref={addEmojiBtnRef} onClick={openEmojiPicker} id="oke-vcn-btn-emoji">
            <Smile />
         </button>
      </div>
   )
}

type TMessageTextFieldProps = {
   directChat: TDirectChat
   setIsTyping: (isTyping: boolean) => void
   isTyping: boolean
   textFieldRef: React.RefObject<HTMLDivElement | null>
   textFieldContainerRef: React.RefObject<HTMLDivElement | null>
}

const MessageTextField = ({
   directChat,
   setIsTyping,
   isTyping,
   textFieldRef,
   textFieldContainerRef,
}: TMessageTextFieldProps) => {
   const user = useUser()

   const handleContentChange = (msg: string) => {
      if (msg.length > 0 && msg.trim()) {
         setIsTyping(true)
         return
      }
      setIsTyping(false)
   }

   const sendMessage = async (msgToSend: string) => {
      if (!msgToSend || msgToSend.length === 0) return
      const { recipientId, id, creatorId } = directChat
      chattingService.sendMessage(
         user!.id === recipientId ? creatorId : recipientId,
         msgToSend,
         id,
         crypto.randomUUID(),
         new Date(),
         (data) => {
            if ("success" in data && data.success) {
               chattingService.setAcknowledgmentFlag(true)
               chattingService.recursiveSendingQueueMessages()
            } else if ("isError" in data && data.isError) {
               toast.error("Error when sending message")
            }
         }
      )
   }

   const catchEnter = (msg: string) => {
      sendMessage(msg)
   }

   const handleBlur = () => {
      textFieldContainerRef.current?.classList.remove("border-regular-violet-cl")
      setIsTyping(false)
   }

   return (
      <div className="relative bg-regular-dark-gray-cl w-type-message-bar py-2 px-2">
         <AutoResizeTextField
            className="flex items-center bg-transparent outline-none w-full hover:bg-transparent leading-tight focus:bg-transparent text-base z-10 styled-scrollbar border-transparent text-white hover:border-transparent focus:border-transparent focus:shadow-none"
            onEnterPress={catchEnter}
            onContentChange={handleContentChange}
            maxHeight={300}
            lineHeight={1.6}
            textFieldRef={textFieldRef}
            onBlur={handleBlur}
         />
         <span
            className={`${isTyping ? "animate-hide-placeholder" : "animate-grow-placeholder"} leading-tight left-2.5 z-0 absolute top-1/2 -translate-y-1/2 text-regular-placeholder-cl`}
         >
            Message...
         </span>
      </div>
   )
}

type TTypeMessageBarProps = {
   directChat: TDirectChat
}

export const TypeMessageBar = memo(({ directChat }: TTypeMessageBarProps) => {
   const { fetchedMsgs } = useAppSelector(({ messages }) => messages)
   const textFieldRef = useRef<HTMLDivElement | null>(null)
   const [isTyping, setIsTyping] = useState<boolean>(false)
   const textFieldContainerRef = useRef<HTMLDivElement | null>(null)

   const startTyping = (e: React.MouseEvent<HTMLElement>) => {
      if (e.target === textFieldRef.current) return
      textFieldContainerRef.current?.classList.add("border-regular-violet-cl")
      const textField = textFieldRef.current
      if (textField) {
         textField.focus()
         // Đặt con trỏ ở cuối nội dung
         const range = document.createRange()
         const selection = window.getSelection()
         range.selectNodeContents(textField)
         range.collapse(false) // false để đặt con trỏ ở cuối, true để đặt ở đầu
         if (selection) {
            selection.removeAllRanges()
            selection.addRange(range)
         }
      }
   }

   return (
      fetchedMsgs && (
         <div className="flex gap-2 items-center pt-2 pb-4 z-999 box-border">
            <div
               onClick={startTyping}
               ref={textFieldContainerRef}
               className="cursor-text flex items-center gap-2 h-type-msg-bar relative z-10 rounded-2xl bg-regular-dark-gray-cl px-3 border-2 border-regular-dark-gray-cl hover:border-regular-violet-cl transition duration-200"
            >
               <AddEmoji textFieldRef={textFieldRef} />
               <MessageTextField
                  isTyping={isTyping}
                  directChat={directChat}
                  setIsTyping={setIsTyping}
                  textFieldRef={textFieldRef}
                  textFieldContainerRef={textFieldContainerRef}
               />
               <div className="text-gray-500 hover:text-regular-violet-cl cursor-pointer relative bottom-0 right-0">
                  <Paperclip />
               </div>
            </div>

            <CustomTooltip title={isTyping ? "Send message" : "Record voice message"} side="top">
               <div
                  className={`${isTyping ? "text-regular-violet-cl" : "text-gray-500"} bg-regular-dark-gray-cl rounded-full p-[27px] relative hover:text-white flex justify-center items-center cursor-pointer hover:bg-regular-violet-cl`}
               >
                  <div
                     className={`${isTyping ? "animate-hide-icon" : "animate-grow-icon"} absolute`}
                  >
                     <Mic />
                  </div>
                  <div
                     className={`${isTyping ? "animate-grow-icon" : "animate-hide-icon"} absolute`}
                  >
                     <Send />
                  </div>
               </div>
            </CustomTooltip>
         </div>
      )
   )
})
