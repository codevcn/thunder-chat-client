import { useAppSelector } from "@/hooks/redux"
import { GAP_TO_SHOW_SCROLL_BTN } from "@/utils/constants"
import { customEventManager } from "@/utils/custom-events"
import { EEventNames } from "@/utils/enums"
import { faArrowDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState, memo } from "react"

type TScrollToBottomMessageBtnProps = {
   messagesContainerRef: React.RefObject<HTMLDivElement>
}

export const ScrollToBottomMessageBtn = memo(
   ({ messagesContainerRef }: TScrollToBottomMessageBtnProps) => {
      const [showScrollBtn, setShowScrollBtn] = useState<boolean>(false)
      const { infoBarIsOpened } = useAppSelector(({ conversations }) => conversations)

      const scrollToBottomMessage = () => {
         messagesContainerRef.current?.dispatchEvent(
            customEventManager.createEvent(EEventNames.SCROLL_TO_BOTTOM_MSG)
         )
      }

      useEffect(() => {
         if (messagesContainerRef.current) {
            messagesContainerRef.current.addEventListener("scroll", function (e) {
               if (-this.scrollTop > GAP_TO_SHOW_SCROLL_BTN) {
                  setShowScrollBtn(true)
               } else {
                  setShowScrollBtn(false)
               }
            })
         }

         return () => {
            messagesContainerRef.current?.removeEventListener("scroll", () => {})
         }
      }, [])

      return (
         <div
            onClick={() => scrollToBottomMessage()}
            className={`${showScrollBtn ? "bottom-24 opacity-100" : "-bottom-20 opacity-0"} z-50 fixed right-8 cursor-pointer transition-[bottom,opacity] duration-200`}
         >
            <div
               className={`${infoBarIsOpened ? "translate-x-slide-header-icons" : "translate-x-0"} transition duration-300 ease-slide-info-bar-timing flex text-gray-400 items-center justify-center rounded-full h-6 w-6 bg-[#212121] p-4 box-content hover:bg-regular-violet-cl hover:text-white`}
            >
               <FontAwesomeIcon icon={faArrowDown} size="xl" color="inherit" />
            </div>
         </div>
      )
   }
)
