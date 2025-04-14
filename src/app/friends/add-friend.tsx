"use client"

import axiosErrorHandler from "@/utils/axios-error-handler"
import toast from "react-hot-toast"
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faSearch, faClose, faPaperPlane, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { Search, Send, UserPlus } from "lucide-react"
import { useDebounce, useDebounceLeading } from "@/hooks/debounce"
import { Spinner } from "@/components/materials/spinner"
import { useUser } from "@/hooks/user"
// import { Modal, Divider, Input, InputRef, Tooltip } from "antd"
import { userService } from "@/services/user.service"
import { useCallback, useRef, useState } from "react"
import type { TSearchUsersData } from "@/apis/types"
import { friendService } from "@/services/friend.service"
import {
   CustomAvatar,
   CustomDialog,
   CustomTooltip,
   TextField,
   Divider,
} from "@/components/materials"
// import { CustomAvatar } from "@/components/avatar"

type TUserCardProps = {
   item: TSearchUsersData
   loading: TLoading
   onSendFriendRequest: (recipientId: number) => void
}

const UserCard = ({ item, loading, onSendFriendRequest }: TUserCardProps) => {
   const profile = item.Profile
   let avatarSrc = profile?.avatar
   let fullName = profile?.fullName
   const recipientId = item.id

   return (
      <div className="hover:bg-regular-icon-btn-cl flex items-center gap-x-3 rounded-md py-2 px-3 relative">
         <CustomAvatar src={avatarSrc || undefined} imgSize={45} />
         <div className="text-white">
            {fullName && <p className="-translate-y-1.5">{fullName}</p>}
            <p className="text-[#a3a3a3]">{item.email}</p>
         </div>

         <CustomTooltip title="Send friend request" placement="right">
            {loading === `user-card-${recipientId}` ? (
               <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Spinner size="small" />
               </div>
            ) : (
               <button
                  onClick={() => onSendFriendRequest(recipientId)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer"
               >
                  <Send className="text-white" />
               </button>
            )}
         </CustomTooltip>
      </div>
   )
}

type TLoading = "searching" | `user-card-${number}` | null

export const AddFriend = () => {
   const [users, setUsers] = useState<TSearchUsersData[]>([])
   const [showModalAddFriend, setShowModalAddFriend] = useState<boolean>(false)
   const debounce = useDebounce()
   const [loading, setLoading] = useState<TLoading>(null)
   const user = useUser()
   const debounceLeading = useDebounceLeading(2000)
   const inputRef = useRef<HTMLInputElement>(null)

   const searchUsers = useCallback(
      debounce(async () => {
         setLoading("searching")
         const keyword = inputRef.current?.value
         if (keyword) {
            try {
               const users = await userService.searchUsers(keyword)
               setUsers(users)
            } catch (error) {
               console.error(">>> error:", error)
               toast.error(axiosErrorHandler.handleHttpError(error).message)
            }
         }
         setLoading(null)
      }, 300),
      []
   )

   const catchEnter = () => {
      if (!inputRef.current?.value) {
         toast.error("Please enter the keyword")
         return
      }
      searchUsers()
      return
   }

   const sendFriendRequest = async (recipientId: number) => {
      setLoading(`user-card-${recipientId}`)
      try {
         await friendService.sendFriendRequest(user!.id, recipientId)
         toast.success("Sent friend request successfully!")
      } catch (error) {
         console.error(">>> 111 error:", error)
         toast.error(axiosErrorHandler.handleHttpError(error).message)
      }
      setLoading(null)
   }

   return (
      <div>
         <button
            onClick={() => setShowModalAddFriend(true)}
            className="flex gap-x-2 items-center transition-colors bg-white text-black px-4 py-[6px] border-2 border-white border-solid hover:bg-transparent hover:text-white rounded-md"
         >
            <UserPlus />
            <span>Add Friend</span>
         </button>

         <CustomDialog open={showModalAddFriend}>
            <div className="bg-[#313131]">
               <p className="bg-regular-modal-content-bgcl text-white">Add Friends</p>
               <div className="mt-5">
                  <TextField
                     placeholder="Enter email or user name here..."
                     classNames={{ input: "w-full py-1 text-base" }}
                     suffixIcon={<Search />}
                     onPressEnter={catchEnter}
                     onChange={searchUsers}
                     ref={inputRef}
                  />
               </div>
               <Divider textContent="Result" className="text-white"></Divider>
               <div className="flex flex-col gap-y-2 styled-modal-scrollbar overflow-y-auto max-h-80">
                  {loading === "searching" ? (
                     <div className="flex w-full justify-center mt-5">
                        <Spinner color="text-white" className="h-7" />
                     </div>
                  ) : users && users.length > 0 ? (
                     users.map((item) => (
                        <UserCard
                           key={item.id}
                           item={item}
                           loading={loading}
                           onSendFriendRequest={debounceLeading(sendFriendRequest)}
                        />
                     ))
                  ) : (
                     <div className="w-full text-center mt-5 text-regular-placeholder-cl">
                        No Users Found.
                     </div>
                  )}
               </div>
               <button
                  className="border-2 border-[#939393] border-solid px-5 py-2 rounded-[5px] text-white hover:bg-regular-icon-btn-cl"
                  onClick={() => setShowModalAddFriend(false)}
                  key={"close-btn"}
               >
                  Close
               </button>
            </div>
         </CustomDialog>
      </div>
   )
}
