"use client"

import { CustomTooltip } from "@/components/materials"
import { Mic, Paperclip, Send, Smile } from "lucide-react"
import { chattingService } from "@/services/chatting.service"
import type { TDirectChat, TEmoji } from "@/utils/types"
import { useUser } from "@/hooks/user"
import { AutoResizeTextField } from "@/components/materials"
import toast from "react-hot-toast"
import { useAppSelector } from "@/hooks/redux"
import { memo, useEffect, useRef, useState, Suspense, lazy } from "react"
import { useRootLayoutContext } from "@/hooks/layout"
import { createPortal } from "react-dom"
import { renderToStaticMarkup } from "react-dom/server"
import { eventEmitter } from "@/utils/event-emitter/event-emitter"
import { EInternalEvents } from "@/utils/event-emitter/events"
import { clientSocket } from "@/utils/socket/client-socket"
import { ESocketEvents } from "@/utils/socket/events"

const LazyEmojiPicker = lazy(() => import("../../components/materials/emoji-picker"))

const Fallback = () => (
   <div className="rounded-lg overflow-hidden bg-emoji-picker-bgcl w-full h-full"></div>
)

type TAddEmojiProps = {
   textFieldRef: React.RefObject<HTMLDivElement | null>
}

const EmojiImg = ({ alt, name, src }: TEmoji) => {
   return (
      <img
         className="STYLE-emoji-img"
         src={src}
         alt={alt}
         data-emoji-data={JSON.stringify({ alt, name, src })}
      />
   )
}

const AddEmoji = ({ textFieldRef }: TAddEmojiProps) => {
   const [showPicker, setShowPicker] = useState(false) // Hiển thị/ẩn picker
   const addEmojiPopoverRef = useRef<HTMLDivElement>(null)
   const addEmojiBtnRef = useRef<HTMLButtonElement>(null)
   const appRootEle = useRootLayoutContext().appRootRef!.current!

   const handleSelectEmoji = (emojiObject: TEmoji) => {
      const textField = textFieldRef.current
      if (textField) {
         const emojiInString = renderToStaticMarkup(
            <EmojiImg alt={emojiObject.alt} name={emojiObject.name} src={emojiObject.src} />
         )
         eventEmitter.emit(EInternalEvents.MSG_TEXTFIELD_EDITED, { textContent: emojiInString })
      }
   }

   const handleOpenEmojiPicker = () => {
      setShowPicker((prev) => !prev)
   }

   const detectCollisionAndAdjust = () => {
      const addEmojiBtn = addEmojiBtnRef.current
      const addEmojiPopover = addEmojiPopoverRef.current
      if (addEmojiBtn && addEmojiPopover) {
         const buttonRect = addEmojiBtn.getBoundingClientRect()
         const popoverRect = addEmojiPopover.getBoundingClientRect()

         const conversationsListRect = (
            appRootEle.querySelector("#QUERY-conversations-list") as HTMLElement
         ).getBoundingClientRect()

         let top: number = buttonRect.top - popoverRect.height - 25
         let left: number = buttonRect.left + buttonRect.width / 2 - popoverRect.width / 2
         const conversationsListRight = conversationsListRect.right

         top = top < 0 ? 10 : top
         left = left < conversationsListRight + 10 ? conversationsListRight + 10 : left

         addEmojiPopover.style.cssText = `top: ${top}px; left: ${left}px; position: fixed; z-index: 99;`

         requestAnimationFrame(() => {
            addEmojiPopover.classList.add("animate-scale-up", "origin-bottom")
         })
      }
   }

   useEffect(() => {
      if (showPicker) {
         detectCollisionAndAdjust()
      }
   }, [showPicker])

   return (
      <div className="flex text-gray-500 hover:text-regular-violet-cl relative bottom-0 left-0 cursor-pointer">
         {showPicker &&
            createPortal(
               <div
                  ref={addEmojiPopoverRef}
                  className="fixed top-0 left-0 h-emoji-picker w-emoji-picker"
               >
                  <Suspense fallback={<Fallback />}>
                     <LazyEmojiPicker
                        onSelectEmoji={handleSelectEmoji}
                        onHideShowPicker={setShowPicker}
                        addEmojiBtnRef={addEmojiBtnRef}
                     />
                  </Suspense>
               </div>,
               document.body
            )}
         <button ref={addEmojiBtnRef} onClick={handleOpenEmojiPicker}>
            <Smile />
         </button>
      </div>
   )
}

type TMessageTextFieldProps = {
   directChat: TDirectChat
   setHasContent: (hasContent: boolean) => void
   hasContent: boolean
   textFieldRef: React.RefObject<HTMLDivElement | null>
   textFieldContainerRef: React.RefObject<HTMLDivElement | null>
}

const MessageTextField = ({
   directChat,
   setHasContent,
   hasContent,
   textFieldRef,
   textFieldContainerRef,
}: TMessageTextFieldProps) => {
   const { recipientId, creatorId, id } = directChat
   const user = useUser()!

   const handleTyping = (msg: string) => {
      if (msg.trim() && msg.length > 0) {
         setHasContent(true)
      } else {
         setHasContent(false)
      }
      clientSocket.socket.emit(ESocketEvents.typing_direct, {
         receiverId: recipientId === user.id ? creatorId : recipientId,
         isTyping: true,
      })
   }

   const sendMessage = (msgToSend: string) => {
      if (
         !msgToSend ||
         msgToSend.length === 0 ||
         textFieldRef.current?.querySelector(".QUERY-empty-placeholder")
      )
         return
      chattingService.sendMessage(
         user.id === recipientId ? creatorId : recipientId,
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

   const handleCatchEnter = (msg: string) => {
      sendMessage(msg)
   }

   const handleBlur = () => {
      textFieldContainerRef.current?.classList.remove("outline-regular-violet-cl")
      if (!textFieldRef.current?.innerHTML) {
         setHasContent(false)
      }
      clientSocket.socket.emit(ESocketEvents.typing_direct, {
         receiverId: recipientId === user.id ? creatorId : recipientId,
         isTyping: false,
      })
   }

   return (
      <div className="relative bg-regular-dark-gray-cl grow py-[15.5px] px-2">
         <AutoResizeTextField
            className="block bg-transparent outline-none w-full hover:bg-transparent whitespace-pre-wrap break-all leading-tight focus:bg-transparent z-10 styled-scrollbar border-transparent text-white hover:border-transparent focus:border-transparent focus:shadow-none"
            onEnterPress={handleCatchEnter}
            onContentChange={handleTyping}
            maxHeight={300}
            lineHeight={1.5}
            textFieldRef={textFieldRef}
            onBlur={handleBlur}
            initialHeight={21}
            textSize={14}
            id="STYLE-type-msg-bar"
         />
         <span
            className={`${hasContent ? "animate-hide-placeholder" : "animate-grow-placeholder"} leading-tight left-2.5 z-0 absolute top-1/2 -translate-y-1/2 text-regular-placeholder-cl`}
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
   const [hasContent, setHasContent] = useState<boolean>(false)
   const textFieldContainerRef = useRef<HTMLDivElement | null>(null)

   const handleClickOnTextFieldContainer = (e: React.MouseEvent<HTMLElement>) => {
      const textField = textFieldRef.current
      textFieldContainerRef.current?.classList.add("outline-regular-violet-cl")
      if (e.target === textField) return
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
         <div className="flex gap-2.5 items-end pt-2 pb-4 z-999 box-border w-type-message-bar">
            <div
               onClick={handleClickOnTextFieldContainer}
               ref={textFieldContainerRef}
               className="flex cursor-text grow items-center gap-2 relative z-10 rounded-2xl bg-regular-dark-gray-cl px-3 outline-2 outline outline-regular-dark-gray-cl hover:outline-regular-violet-cl transition-[outline] duration-200"
            >
               <AddEmoji textFieldRef={textFieldRef} />
               <MessageTextField
                  hasContent={hasContent}
                  directChat={directChat}
                  setHasContent={setHasContent}
                  textFieldRef={textFieldRef}
                  textFieldContainerRef={textFieldContainerRef}
               />
               <button className="text-gray-500 hover:text-regular-violet-cl cursor-pointer relative bottom-0 right-0">
                  <Paperclip />
               </button>
            </div>

            <CustomTooltip
               title={hasContent ? "Send message" : "Record voice message"}
               placement="top"
            >
               <div
                  className={`${hasContent ? "text-regular-violet-cl" : "text-gray-500"} bg-regular-dark-gray-cl rounded-full p-[27px] relative hover:text-white flex justify-center items-center cursor-pointer hover:bg-regular-violet-cl`}
               >
                  <div
                     className={`${hasContent ? "animate-hide-icon" : "animate-grow-icon"} absolute`}
                  >
                     <Mic />
                  </div>
                  <div
                     className={`${hasContent ? "animate-grow-icon" : "animate-hide-icon"} absolute`}
                  >
                     <Send />
                  </div>
               </div>
            </CustomTooltip>
         </div>
      )
   )
})
