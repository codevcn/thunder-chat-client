"use client"

import axiosErrorHanlder from "@/utils/axios-error-hanlder"
import toast from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faClose, faPaperPlane, faUserPlus } from "@fortawesome/free-solid-svg-icons"
import { useDebounce, useDebounceLeading } from "@/hooks/debounce"
import { Spinner } from "@/components/spinner"
import { useUser } from "@/hooks/user"
import { Modal, Divider, Input, InputRef, Tooltip } from "antd"
import { userService } from "@/services/user.service"
import { useRef, useState } from "react"
import type { TSearchUsersData } from "@/apis/types"
import { friendService } from "@/services/friend.service"
import { CustomAvatar } from "@/components/avatar"

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
         <CustomAvatar avatarSrc={avatarSrc} size={45} />
         <div className="text-white">
            {fullName && <p className="-translate-y-1.5">{fullName}</p>}
            <p className="text-[#a3a3a3]">{item.email}</p>
         </div>

         <Tooltip title="Send friend request" placement="right">
            {loading === `user-card-${recipientId}` ? (
               <div className="absolute right-5 top-1/2 -translate-y-1/2">
                  <Spinner size="small" />
               </div>
            ) : (
               <button
                  onClick={() => onSendFriendRequest(recipientId)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer"
               >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
               </button>
            )}
         </Tooltip>
      </div>
   )
}

type TLoading = "searching" | `user-card-${number}` | null

export const AddFriend = () => {
   const [users, setUsers] = useState<TSearchUsersData[]>([])
   const searchInputRef = useRef<InputRef>(null)
   const [showModalAddFriend, setShowModalAddFriend] = useState<boolean>(false)
   const debounce = useDebounce(300)
   const [loading, setLoading] = useState<TLoading>(null)
   const user = useUser()
   const debounceLeading = useDebounceLeading(2000)

   const searchUsers = async () => {
      setLoading("searching")
      const keyword = searchInputRef.current?.input?.value
      if (keyword) {
         try {
            const users = await userService.searchUsers(keyword)
            setUsers(users)
         } catch (error) {
            console.error(">>> error:", error)
            toast.error(axiosErrorHanlder.handleHttpError(error).message)
         }
      }
      setLoading(null)
   }

   const catchEnter = () => {
      const keyword = searchInputRef.current?.input?.value
      if (keyword) {
         searchUsers()
         return
      }
      toast.error("Please enter the keyword")
   }

   const sendFriendRequest = async (recipientId: number) => {
      setLoading(`user-card-${recipientId}`)
      try {
         await friendService.sendFriendRequest(user!.id, recipientId)
         toast.success("Sent friend request successfully!")
      } catch (error) {
         console.error(">>> 111 error:", error)
         toast.error(axiosErrorHanlder.handleHttpError(error).message)
      }
      setLoading(null)
   }

   return (
      <div>
         <button
            onClick={() => setShowModalAddFriend(true)}
            className="flex gap-x-2 items-center transition-colors bg-white text-black px-4 py-[6px] border-2 border-white border-solid hover:bg-transparent hover:text-white rounded-md"
         >
            <FontAwesomeIcon icon={faUserPlus} />
            <span>Add Friend</span>
         </button>

         <Modal
            title={<p className="bg-regular-modal-content-bgcl text-white">Add Friends</p>}
            open={showModalAddFriend}
            onCancel={() => setShowModalAddFriend(false)}
            styles={{ content: { backgroundColor: "#313131" } }}
            className="top-5"
            footer={[
               <button
                  className="border-2 border-[#939393] border-solid px-5 py-2 rounded-[5px] text-white hover:bg-regular-icon-btn-cl"
                  onClick={() => setShowModalAddFriend(false)}
                  key={"close-btn"}
               >
                  Close
               </button>,
            ]}
            closeIcon={
               <FontAwesomeIcon icon={faClose} className="text-white hover:scale-125 transition" />
            }
         >
            <div className="mb-5">
               <div className="mt-5">
                  <Input
                     placeholder="Enter email or user name here..."
                     allowClear
                     className="w-full py-1 text-base"
                     suffix={<FontAwesomeIcon icon={faSearch} />}
                     onPressEnter={catchEnter}
                     onChange={debounce(searchUsers)}
                     ref={searchInputRef}
                  />
               </div>
               <Divider className="regular-divider">
                  <span className="text-white">Result</span>
               </Divider>
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
                     <div className="w-full text-center mt-5 text-regular-placeholder-text-cl">
                        No Users Found.
                     </div>
                  )}
               </div>
            </div>
         </Modal>
      </div>
   )
}
