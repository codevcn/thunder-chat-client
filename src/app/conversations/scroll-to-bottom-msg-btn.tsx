import { useAppSelector } from "@/hooks/redux"
import { eventEmitter } from "@/utils/event-emitter/event-emitter"
import { EInternalEvents } from "@/utils/event-emitter/events"
import { ArrowDown } from "lucide-react"
import { useEffect, useState, memo } from "react"

export const ScrollToBottomMessageBtn = memo(() => {
   const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false)
   const { infoBarIsOpened } = useAppSelector(({ conversations }) => conversations)

   const scrollToBottomMessage = () => {
      eventEmitter.emit(EInternalEvents.SCROLL_TO_BOTTOM_MSG_ACTION)
   }

   useEffect(() => {
      eventEmitter.on(EInternalEvents.SCROLL_OUT_OF_BOTTOM, () => {
         setShowScrollBtn(true)
      })
      eventEmitter.on(EInternalEvents.SCROLL_TO_BOTTOM_MSG_UI, () => {
         setShowScrollBtn(false)
      })
      return () => {
         eventEmitter.off(EInternalEvents.SCROLL_OUT_OF_BOTTOM)
         eventEmitter.off(EInternalEvents.SCROLL_TO_BOTTOM_MSG_UI)
      }
   }, [])

   return (
      <div
         onClick={scrollToBottomMessage}
         className={`${showScrollBtn ? "bottom-24 opacity-100" : "-bottom-20 opacity-0"} z-50 fixed right-5 cursor-pointer transition-[bottom,opacity] duration-200`}
      >
         <div
            className={`${infoBarIsOpened ? "translate-x-slide-header-icons" : "translate-x-0"} transition duration-300 ease-slide-info-bar-timing flex text-gray-400 items-center justify-center rounded-full h-6 w-6 bg-[#212121] p-4 box-content hover:bg-regular-violet-cl hover:text-white`}
         >
            <ArrowDown color="currentColor" />
         </div>
      </div>
   )
})
