"use client"

import type { TGetEmojisServiceRes } from "@/app/api/types"
import { directChatService } from "@/services/direct-chat.service"
import axiosErrorHandler from "@/utils/axios-error-handler"
import type { TEmoji } from "@/utils/types"
import { useEffect, useRef, useState } from "react"
import toast from "react-hot-toast"
import { FixedSizeGrid } from "react-window"
import type { GridChildComponentProps } from "react-window"
import { CustomTooltip } from "./tooltip"
import { Spinner } from "./spinner"
import { eventEmitter } from "@/utils/event-emitter/event-emitter"
import { EInternalEvents } from "@/utils/event-emitter/events"

const GRID_COLUMN_COUNT: number = 7

type EmojiTabProps = {
   icon: string
   label: string
   activeTab: EEmojiCategory
   tabType: EEmojiCategory
   onClick: (tabType: EEmojiCategory) => void
}

const EmojiTab = ({ icon, label, activeTab, tabType, onClick }: EmojiTabProps) => {
   return (
      <CustomTooltip title={label} placement="bottom">
         <div
            className={`p-2 rounded-full transition-colors ${
               activeTab === tabType ? "bg-regular-hover-bgcl" : "hover:bg-regular-hover-bgcl"
            }`}
            onClick={() => {
               onClick(tabType)
            }}
         >
            <span className="text-xl">{icon}</span>
         </div>
      </CustomTooltip>
   )
}

const EmojiCell = ({ data, rowIndex, columnIndex, style }: GridChildComponentProps<TEmoji[]>) => {
   const index = rowIndex * GRID_COLUMN_COUNT + columnIndex
   if (index >= data.length) return null

   const emojiData = data[index]

   return (
      <button
         className="QUERY-emoji-btn p-1.5 hover:bg-gray-700 rounded-md transition-colors"
         title={emojiData.name}
         style={style}
         data-emoji-data={JSON.stringify(emojiData)}
      >
         <img src={emojiData.src} alt={emojiData.alt} className="w-full h-full" />
      </button>
   )
}

type EmojiCategoryProps = {
   title: string
   emojis: TEmoji[]
}

const EmojisList = ({ title, emojis }: EmojiCategoryProps) => {
   const width: number = 300
   const height: number = 265

   return (
      <div className="w-full">
         <h3 className="w-full text-sm font-medium mb-2 text-regular-text-secondary-cl">{title}</h3>
         <FixedSizeGrid
            columnCount={GRID_COLUMN_COUNT}
            columnWidth={width / GRID_COLUMN_COUNT}
            height={height}
            rowCount={Math.ceil(emojis.length / GRID_COLUMN_COUNT)}
            rowHeight={42.85}
            width={width}
            itemData={emojis}
            style={{ overflowX: "hidden", overflowY: "scroll" }}
            className="no-scrollbar"
         >
            {({ columnIndex, rowIndex, style, data }) => (
               <EmojiCell data={data} style={style} columnIndex={columnIndex} rowIndex={rowIndex} />
            )}
         </FixedSizeGrid>
      </div>
   )
}

enum EEmojiCategory {
   RECENT = "RECENT",
   SMILEYS_PEOPLE = "SMILEYS_PEOPLE",
   FOOD_DRINK = "FOOD_DRINK",
   ACTIVITY = "ACTIVITY",
   TRAVEL_PLACES = "TRAVEL_PLACES",
}

type TEmojiPickerProps = {
   onSelectEmoji: (emoji: TEmoji) => void
   onHideShowPicker: (show: boolean) => void
   addEmojiBtnRef: React.RefObject<HTMLButtonElement | null>
}

const EmojiPicker = ({ onSelectEmoji, onHideShowPicker, addEmojiBtnRef }: TEmojiPickerProps) => {
   const [emojis, setEmojis] = useState<TGetEmojisServiceRes>()
   const [activeTab, setActiveTab] = useState<EEmojiCategory>(EEmojiCategory.SMILEYS_PEOPLE)
   const pickerRef = useRef<HTMLDivElement | null>(null)

   const fetchEmojis = () => {
      directChatService
         .fetchEmojis()
         .then((res) => {
            setEmojis(res)
         })
         .catch((error) => {
            toast.error(axiosErrorHandler.handleHttpError(error).message)
         })
   }

   const handleClickOutside = (e: MouseEvent) => {
      const picker = pickerRef.current
      if (picker) {
         if (
            !picker.contains(e.target as Node) &&
            !addEmojiBtnRef.current?.contains(e.target as Node)
         ) {
            onHideShowPicker(false)
         }
      }
   }

   useEffect(() => {
      eventEmitter.on(EInternalEvents.CLICK_ON_LAYOUT, handleClickOutside)
      fetchEmojis()
      return () => {
         eventEmitter.off(EInternalEvents.CLICK_ON_LAYOUT, handleClickOutside)
      }
   }, [])

   const handleEmojiClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const target = e.target as HTMLButtonElement
      let emojiData: TEmoji | null = null
      if (target.classList.contains("QUERY-emoji-btn")) {
         emojiData = JSON.parse(target.dataset.emojiData!) as TEmoji
      } else if (target.closest(".QUERY-emoji-btn")) {
         const emojiBtn = target.closest(".QUERY-emoji-btn") as HTMLButtonElement
         emojiData = JSON.parse(emojiBtn.dataset.emojiData!) as TEmoji
      }
      if (emojiData) {
         onSelectEmoji(emojiData)
      }
   }

   return (
      <div
         ref={pickerRef}
         className="rounded-lg overflow-hidden bg-emoji-picker-bgcl w-full h-full"
      >
         {/* Emoji Tabs */}
         <div className="flex overflow-x-auto p-2 gap-3 border-t border-gray-700">
            <EmojiTab
               icon="🕒"
               label="Recent"
               tabType={EEmojiCategory.RECENT}
               activeTab={activeTab}
               onClick={setActiveTab}
            />
            <EmojiTab
               icon="😀"
               label="Smileys"
               tabType={EEmojiCategory.SMILEYS_PEOPLE}
               activeTab={activeTab}
               onClick={setActiveTab}
            />
            <EmojiTab
               icon="🐱"
               label="Food"
               tabType={EEmojiCategory.FOOD_DRINK}
               activeTab={activeTab}
               onClick={setActiveTab}
            />
            <EmojiTab
               icon="🍔"
               label="Activity"
               tabType={EEmojiCategory.ACTIVITY}
               activeTab={activeTab}
               onClick={setActiveTab}
            />
            <EmojiTab
               icon="🚌"
               label="Travel"
               tabType={EEmojiCategory.TRAVEL_PLACES}
               activeTab={activeTab}
               onClick={setActiveTab}
            />
         </div>

         {/* Emojis */}
         <div className="flex px-3 w-full" onClick={handleEmojiClick}>
            {emojis ? (
               activeTab === EEmojiCategory.RECENT ? (
                  <EmojisList title="Frequently Used" emojis={[]} />
               ) : activeTab === EEmojiCategory.SMILEYS_PEOPLE ? (
                  <EmojisList title="Smileys & People" emojis={emojis.smileyPeople} />
               ) : activeTab === EEmojiCategory.FOOD_DRINK ? (
                  <EmojisList title="Food & Drink" emojis={emojis.foodDrink} />
               ) : activeTab === EEmojiCategory.ACTIVITY ? (
                  <EmojisList title="Activity" emojis={emojis.activity} />
               ) : (
                  activeTab === EEmojiCategory.TRAVEL_PLACES && (
                     <EmojisList title="Travel & Places" emojis={emojis.travelPlaces} />
                  )
               )
            ) : (
               <div className="m-auto pt-10">
                  <Spinner size="medium" color="text-white" />
               </div>
            )}
         </div>
      </div>
   )
}

export default EmojiPicker
