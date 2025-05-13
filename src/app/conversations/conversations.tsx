"use client"

import { CustomAvatar, CustomTooltip } from "@/components/materials"
import { Search as SearchIcon, ArrowLeft, X } from "lucide-react"
import dayjs from "dayjs"
import { useDebounce } from "@/hooks/debounce"
import type { TUserWithProfile } from "@/utils/types/be-api"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { startDirectChatThunk } from "@/redux/conversations/conversations-thunks"
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import validator from "validator"
import { Spinner } from "@/components/materials/spinner"
import { IconButton } from "@/components/materials/icon-button"
import { useRouter } from "next/navigation"
import { sortDirectChatsByPinned } from "@/redux/conversations/conversations-selectors"
import { unwrapResult } from "@reduxjs/toolkit"
import Image from "next/image"

const MAX_NUMBER_OF_PINNED_CONVERSATIONS: number = 3

type TResultProps = {
   convResult: TUserWithProfile
   handleStartDirectChat: (id: number) => void
}

const Result = ({ convResult, handleStartDirectChat }: TResultProps) => {
   const { Profile, id } = convResult
   const fullName = Profile?.fullName || "Unnamed"

   return (
      <CustomTooltip title="Click to open a chat" placement="right">
         <div
            className="flex w-full p-3 py-2 cursor-pointer hover:bg-regular-hover-card-cl rounded-xl gap-3"
            onClick={() => handleStartDirectChat(id)}
         >
            <div>
               {Profile && Profile.avatar ? (
                  <CustomAvatar src={Profile.avatar} imgSize={50} />
               ) : (
                  <CustomAvatar imgSize={50} fallback={fullName[0]} />
               )}
            </div>
            <div className="flex flex-col justify-center gap-1">
               <span className="font-bold text-base">{fullName}</span>
               <span className="text-xs text-regular-icon-cl">{"Last seen 10/08/2023"}</span>
            </div>
         </div>
      </CustomTooltip>
   )
}

type TResultsProps = {
   loading: boolean
}

const Results = ({ loading }: TResultsProps) => {
   const [searchResults, setSearchResults] = useState<TUserWithProfile[] | null>(null)
   const router = useRouter()
   const dispatch = useAppDispatch()

   const startDirectChat = async (id: number) => {
      const res = await dispatch(startDirectChatThunk({ recipientId: id }))
      const convData = unwrapResult(res)

      router.push("/directChats/" + convData.id)
   }

   return searchResults && searchResults.length > 0 ? (
      searchResults.map((result) => (
         <Result
            key={result.id}
            convResult={result}
            handleStartDirectChat={() => startDirectChat(result.id)}
         />
      ))
   ) : (
      <div className="flex justify-center items-center pt-5">
         {loading && <Spinner className="h-[40px]" />}
      </div>
   )
}

const ChatCards = () => {
   const directChats = useAppSelector(sortDirectChatsByPinned)

   const getPinIndexClass = (pinIndex: number): string => {
      switch (pinIndex) {
         case 1:
            return "order-1"
         case 2:
            return "order-2"
         case 3:
            return "order-3"
         default:
            return "order-4"
      }
   }

   return (
      directChats &&
      directChats.length > 0 &&
      directChats.map(({ id, avatar, lastMessageTime, pinIndex, subtitle, title }) => (
         <div
            className={`flex gap-x-2 items-center px-3 py-3 w-full cursor-pointer hover:bg-regular-hover-card-cl rounded-xl ${getPinIndexClass(pinIndex)}`}
            key={id}
         >
            <div>
               <CustomAvatar className="mt-auto" src={avatar} imgSize={50} />
            </div>
            <div className="w-[195px]">
               <div className="flex justify-between items-center w-full gap-3">
                  <h3 className="truncate font-bold w-fit">{title}</h3>
                  <div className="text-[10px] w-max text-regular-icon-cl">
                     {dayjs(lastMessageTime).format("MMM D, YYYY")}
                  </div>
               </div>
               <div className="flex justify-between items-center mt-1 box-border gap-3">
                  <p className="truncate text-regular-placeholder-cl">{subtitle}</p>
                  {pinIndex &&
                     pinIndex !== -1 &&
                     pinIndex <= MAX_NUMBER_OF_PINNED_CONVERSATIONS && (
                        <CustomTooltip title="This directChat was pinned" placement="bottom">
                           <Image
                              src="/icons/pinned-conv.svg"
                              alt="Pinned Icon"
                              width={21}
                              height={21}
                              color="#766ac8"
                           />
                        </CustomTooltip>
                     )}
               </div>
            </div>
         </div>
      ))
   )
}

type TSearchProps = {
   setSearching: Dispatch<SetStateAction<boolean>>
   setIsTyping: Dispatch<SetStateAction<boolean>>
   isTyping: boolean
}

const SearchBar = ({ setIsTyping, setSearching, isTyping }: TSearchProps) => {
   const inputRef = useRef<HTMLInputElement>(null)
   const debounce = useDebounce()
   const dispatch = useAppDispatch()
   const [searchResult, setSearchResult] = useState<TUserWithProfile[]>([])

   const searchConversations = (searchData: TSearchDirectChatParams) => {
      setSearching(true)
   }

   const searchHandler = async (e: ChangeEvent<HTMLInputElement>) => {
      let searchValue = e.target.value.trim()
      if (!searchValue) return

      let searchData: TSearchDirectChatParams = {}

      if (validator.isEmail(searchValue)) {
         searchData.email = searchValue
      } else if (searchValue.includes(" ")) {
         searchData.nameOfUser = searchValue
      } else {
         searchData.username = searchValue
      }

      searchConversations(searchData)
   }

   const closeSearch = () => {
      if (inputRef.current?.value) inputRef.current.value = ""
      setIsTyping(false)
   }

   const clearInput = () => {
      if (inputRef.current?.value) inputRef.current.value = ""
   }

   return (
      <div className="flex gap-1 items-center px-2 box-border text-regular-placeholder-cl">
         <div
            className={`flex ${isTyping ? "animate-appear-zoom-in-s40" : "animate-disappear-zoom-out-s40"}`}
         >
            <IconButton
               className="flex justify-center items-center h-[40px] w-[40px]"
               onClick={closeSearch}
               title="Cancel"
            >
               <ArrowLeft color="currentColor" size={20} />
            </IconButton>
         </div>

         <div className="flex flex-auto relative w-full">
            <span className="absolute top-1/2 -translate-y-1/2 z-20 left-3">
               <SearchIcon color="currentColor" size={20} />
            </span>

            <input
               type="text"
               className="box-border h-[40px] w-full px-10 rounded-full transition duration-200 border-2 placeholder:text-regular-placeholder-cl outline-none text-white bg-regular-hover-card-cl border-regular-hover-card-cl hover:border-regular-violet-cl hover:bg-regular-hover-card-cl focus:border-regular-violet-cl"
               placeholder="Search..."
               onChange={debounce(searchHandler, 300)}
               onFocus={() => setIsTyping(true)}
               ref={inputRef}
            />

            <IconButton
               className="flex justify-center items-center right-1 h-[35px] w-[35px] absolute top-1/2 -translate-y-1/2 z-20"
               onClick={clearInput}
               title="Clear"
            >
               <X color="currentColor" />
            </IconButton>
         </div>
      </div>
   )
}

export const Conversations = () => {
   const [isTyping, setIsTyping] = useState<boolean>(false)
   const [searching, setSearching] = useState<boolean>(false)

   return (
      <div
         id="QUERY-conversations-list"
         className="screen-medium-chatting:flex flex-col hidden w-convs-list py-3 box-border h-full bg-regular-dark-gray-cl border-regular-hover-card-cl border-r"
      >
         <SearchBar setIsTyping={setIsTyping} setSearching={setSearching} isTyping={isTyping} />

         <div className="relative z-10 grow overflow-hidden">
            <div
               className={`${isTyping ? "animate-super-zoom-out-fade-in" : "animate-super-zoom-in-fade-out"} py-5 absolute top-0 left-0 z-20 px-2 box-border w-full h-full overflow-x-hidden overflow-y-auto STYLE-styled-scrollbar`}
            >
               <div className="font-bold pl-3 pb-1 text-regular-icon-cl">Result</div>
               <Results loading={searching} />
            </div>

            <div
               className={`${isTyping ? "animate-zoom-fade-out" : "animate-zoom-fade-in"} !flex flex-col w-full absolute top-0 left-0 z-30 px-2 h-full overflow-x-hidden overflow-y-auto STYLE-styled-scrollbar`}
            >
               <ChatCards />
            </div>
         </div>
      </div>
   )
}
