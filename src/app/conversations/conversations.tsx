"use client"

import { Avatar, Tooltip, Flex } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMagnifyingGlass, faArrowLeft, faXmark } from "@fortawesome/free-solid-svg-icons"
import dayjs from "dayjs"
import { useDebounce } from "@/hooks/debounce"
import type { TUserWithProfile } from "@/utils/types"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"
import { startDirectChatThunk } from "@/redux/conversations/conversations-thunks"
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react"
import validator from "validator"
import { Spinner } from "@/components/spinner"
import { IconButton } from "@/components/icon-button"
import { useRouter } from "next/navigation"
import { sortDirectChatsByPinned } from "@/redux/conversations/conversations-selectors"
import { unwrapResult } from "@reduxjs/toolkit"
import { MAX_NUMBER_OF_PINNED_CONVERSATIONS } from "@/utils/constants"
import { PinnedConvIcon } from "@/components/icons"
import { TSearchDirectChatParams } from "@/apis/types"

type TResultProps = {
   convResult: TUserWithProfile
   handleStartDirectChat: (id: number) => void
}

const Result = ({ convResult, handleStartDirectChat }: TResultProps) => {
   const { Profile, id } = convResult
   const fullName = Profile?.fullName || "Unnamed"

   return (
      <Tooltip title="Click to open a chat" placement="right">
         <Flex
            className="w-full p-3 py-2 cursor-pointer hover:bg-regular-hover-card-cl rounded-xl gap-3"
            onClick={() => handleStartDirectChat(id)}
         >
            <div>
               {Profile && Profile.avatar ? (
                  <Avatar src={Profile.avatar} size={50} />
               ) : (
                  <Avatar size={50}>{fullName}</Avatar>
               )}
            </div>
            <Flex vertical justify="center" className="gap-1">
               <span className="font-bold text-base">{fullName}</span>
               <span className="text-xs text-regular-icon-cl">{"Last seen 10/08/2023"}</span>
            </Flex>
         </Flex>
      </Tooltip>
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
      const conv_data = unwrapResult(res)

      router.push("/directChats/" + conv_data.id)
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
      <Flex className="pt-5" justify="center" align="center">
         {loading && <Spinner className="h-[40px]" />}
      </Flex>
   )
}

const DirectChatCards = () => {
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
            <Flex>
               <Avatar className="mt-auto" src={avatar} size={50} />
            </Flex>
            <div className="w-[195px]">
               <Flex justify="space-between" align="center" className="w-full gap-3">
                  <h3 className="truncate font-bold w-fit">{title}</h3>
                  <div className="text-[10px] w-max text-regular-icon-cl">
                     {dayjs(lastMessageTime).format("MMM D, YYYY")}
                  </div>
               </Flex>
               <Flex justify="space-between" align="center" className="mt-1 box-border gap-3">
                  <p className="truncate text-regular-placeholder-text-cl">{subtitle}</p>
                  {pinIndex &&
                     pinIndex !== -1 &&
                     pinIndex <= MAX_NUMBER_OF_PINNED_CONVERSATIONS && (
                        <Tooltip title="This directChat was pinned" placement="bottom">
                           <div>
                              <PinnedConvIcon className="h-[21px] w-[21px]" color="#766ac8" />
                           </div>
                        </Tooltip>
                     )}
               </Flex>
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

const Search = ({ setIsTyping, setSearching, isTyping }: TSearchProps) => {
   const input_ref = useRef<HTMLInputElement>(null)
   const debounce = useDebounce(300)
   // const dispatch = useAppDispatch()

   const search = async (e: ChangeEvent<HTMLInputElement>) => {
      let search_value = e.target.value.trim()
      if (!search_value) return

      let search_data: TSearchDirectChatParams = {}

      if (validator.isEmail(search_value)) {
         search_data.email = search_value
      } else if (search_value.includes(" ")) {
         search_data.nameOfUser = search_value
      } else {
         search_data.username = search_value
      }

      setSearching(true)
      // await dispatch(searchDirectChatThunk(search_data))
      setSearching(false)
   }

   const cancelSearch = () => {
      if (input_ref.current?.value) input_ref.current.value = ""
      setIsTyping(false)
   }

   const clearInput = () => {
      if (input_ref.current?.value) input_ref.current.value = ""
      // dispatch(clearSearchResult({}))
   }

   return (
      <Flex gap={5} align="center" className="px-3 box-border">
         <div
            className={`flex ${isTyping ? "animate-appear-zoom-in-s40" : "animate-disappear-zoom-out-s40"}`}
         >
            <IconButton
               className="flex justify-center items-center h-[40px] w-[40px]"
               onClick={cancelSearch}
               title="Cancel"
            >
               <FontAwesomeIcon icon={faArrowLeft} />
            </IconButton>
         </div>

         <div className="flex flex-auto relative w-full">
            <span className="absolute top-1/2 -translate-y-1/2 z-20 left-3.5">
               <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>

            <input
               type="text"
               className="box-border h-[40px] w-full px-10 rounded-full transition duration-200 border-2 placeholder:text-regular-placeholder-text-cl outline-none text-white bg-regular-hover-card-cl border-regular-hover-card-cl hover:border-regular-violet-cl hover:bg-regular-hover-card-cl focus:border-regular-violet-cl"
               placeholder="Search..."
               onChange={debounce(search)}
               onFocus={() => setIsTyping(true)}
               ref={input_ref}
            />

            <IconButton
               className="flex justify-center items-center right-1 h-[35px] w-[35px] absolute top-1/2 -translate-y-1/2 z-20"
               onClick={clearInput}
               title="Clear"
            >
               <FontAwesomeIcon icon={faXmark} />
            </IconButton>
         </div>
      </Flex>
   )
}

export const DirectChats = () => {
   const [isTyping, setIsTyping] = useState<boolean>(false)
   const [searching, setSearching] = useState<boolean>(false)

   return (
      <Flex
         className="hidden screen-medium-chatting:flex gap-3 w-convs-list-width pt-3 pb-2 box-border h-screen bg-regular-darkGray-cl border-regular-hover-card-cl border-r"
         vertical
      >
         <Search setIsTyping={setIsTyping} setSearching={setSearching} isTyping={isTyping} />

         <div className="relative z-10 h-full overflow-hidden">
            <div
               className={`${isTyping ? "animate-super-zoom-out-fade-in" : "animate-super-zoom-in-fade-out"} pt-3 absolute top-0 left-0 z-20 px-3 box-border w-full h-full overflow-x-hidden overflow-y-auto styled-scrollbar`}
            >
               <div className="font-bold pl-3 pb-1 text-regular-icon-cl">Result</div>
               <Results loading={searching} />
            </div>

            <div
               className={`${isTyping ? "animate-zoom-fade-out" : "animate-zoom-fade-in"} !flex flex-col w-full absolute top-0 left-0 z-30 px-2 h-full overflow-x-hidden overflow-y-auto styled-scrollbar`}
            >
               <DirectChatCards />
            </div>
         </div>
      </Flex>
   )
}
