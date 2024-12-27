"use client"

import { useRef, useState } from "react"
import { FriendsList } from "./friends-list"
import { userService } from "@/services/user.service"
import { Flex, Modal, Avatar, Divider, Input, InputRef, Tooltip } from "antd"
import { Navigation } from "@/components/navigation"
import { TSearchUserData } from "@/utils/types"
import axiosErrorHanlder from "@/utils/axios-error-hanlder"
import toast from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUser, faSearch, faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useDebounce } from "@/hooks/debounce"

type TUserCardProps = {
   item: TSearchUserData
}

const AddFriendBtn = () => {
   const [users, setUsers] = useState<TSearchUserData[] | null>(null)
   const searchInputRef = useRef<InputRef>(null)
   const [showModalAddFriend, setShowModalAddFriend] = useState<boolean>(false)
   const debounce = useDebounce(300)

   const searchUsers = async () => {
      const keyword = searchInputRef.current?.input?.value
      if (!keyword) {
         setUsers(null)
         return
      }
      try {
         const users = await userService.searchUsers(keyword)
         console.log(">>> users:", { users })
         setUsers(users)
      } catch (error) {
         console.error(">>> error:", error)
         toast.error(axiosErrorHanlder.handleHttpError(error).message)
      }
   }

   const catchEnter = () => {
      const keyword = searchInputRef.current?.input?.value
      if (!keyword) {
         toast.error("Please enter the keyword")
         return
      }
      searchUsers()
   }

   const UserCard = ({ item }: TUserCardProps) => {
      let avatar, fullName, email
      if ("Profile" in item) {
         const profile = item.Profile
         avatar = profile?.avatar
         fullName = profile?.fullName || "Unnamed"
         email = item.email
      } else {
         avatar = item.avatar
         fullName = item.fullName
         email = item.User.email
      }
      avatar = avatar || <FontAwesomeIcon icon={faUser} />

      return (
         <div className="hover:bg-regular-icon-btn-cl flex items-center gap-x-1 rounded-md py-1 px-1 cursor-pointer relative">
            <Avatar {...(avatar ? { src: avatar } : { icon: avatar })} size={45} />
            <div className="text-white">
               <p>{fullName}</p>
               <p className="text-[#a3a3a3]">{email}</p>
            </div>

            <Tooltip title="Send add friend request" placement="right">
               <button className="absolute right-5 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform">
                  <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
               </button>
            </Tooltip>
         </div>
      )
   }

   return (
      <div>
         <button onClick={() => setShowModalAddFriend(true)}>Add</button>

         <Modal
            title={<p className="bg-[#313131] text-white">Loading Modal</p>}
            open={showModalAddFriend}
            onCancel={() => setShowModalAddFriend(false)}
            styles={{ content: { backgroundColor: "#313131" } }}
            footer={[
               <button
                  className="border-2 border-[#939393] border-solid px-5 rounded-[5px] text-white hover:bg-regular-icon-btn-cl"
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
                     className="w-full py-1"
                     suffix={<FontAwesomeIcon icon={faSearch} />}
                     onPressEnter={catchEnter}
                     onChange={debounce(searchUsers)}
                     ref={searchInputRef}
                  />
               </div>
               <Divider className="regular-divider">
                  <span className="text-white">Result</span>
               </Divider>
               <div className="flex flex-col gap-y-2">
                  {users && users.length > 0 ? (
                     users.map((item) => <UserCard key={item.id} item={item} />)
                  ) : (
                     <div className="text-center mt-5 text-[#939393]">No Users Found.</div>
                  )}
               </div>
            </div>
         </Modal>
      </div>
   )
}

const Actions = () => {
   return (
      <div>
         <div></div>
         <AddFriendBtn />
      </div>
   )
}

const FriendsPage = () => {
   return (
      <Flex className="FriendsPage bg-regular-black-cl w-full relative">
         <Navigation />

         <Flex className="w-full relative z-20">
            <Actions />
            <FriendsList />
         </Flex>
      </Flex>
   )
}

export default FriendsPage
