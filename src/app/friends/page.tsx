"use client"

import { useRef, useState } from "react"
import { FriendsList } from "./friends-list"
import { userService } from "@/services/user.service"
import { Flex, Modal, Avatar, Divider, Input, InputRef, Tooltip } from "antd"
import { Navigation } from "@/components/navigation"
import type { TSearchUsersData } from "@/utils/types"
import axiosErrorHanlder from "@/utils/axios-error-hanlder"
import toast from "react-hot-toast"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faClose, faPaperPlane } from "@fortawesome/free-solid-svg-icons"
import { useDebounce } from "@/hooks/debounce"
import { UserOutlined } from "@ant-design/icons"
import { Spinner } from "@/components/spinner"
import { postSendFriendRequest } from "@/apis/friend"
import { useUser } from "@/hooks/user"

type TUserCardProps = {
   item: TSearchUsersData
}

const AddFriendSection = () => {
   const [users, setUsers] = useState<TSearchUsersData[] | null>(null)
   const searchInputRef = useRef<InputRef>(null)
   const [showModalAddFriend, setShowModalAddFriend] = useState<boolean>(false)
   const debounce = useDebounce(300)
   const [loading, setLoading] = useState<"searching" | null>(null)
   const user = useUser()

   const searchUsers = async () => {
      setLoading("searching")
      const keyword = searchInputRef.current?.input?.value
      if (keyword) {
         try {
            const users = await userService.searchUsers(keyword)
            console.log(">>> users:", { users })
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

   const UserCard = ({ item }: TUserCardProps) => {
      const profile = item.Profile
      let avatarSrc = profile?.avatar
      let avatarIcon = <UserOutlined />
      let fullName = profile?.fullName

      return (
         <div className="hover:bg-regular-icon-btn-cl flex items-center gap-x-3 rounded-md py-1 px-1 relative">
            <Avatar
               {...(avatarSrc ? { src: avatarSrc } : { icon: avatarIcon })}
               size={45}
               className="align-middle"
            />
            <div className="text-white">
               {fullName && <p className="mb-1">{fullName}</p>}
               <p className="text-[#a3a3a3]">{item.email}</p>
            </div>

            <Tooltip title="Send add friend request" placement="right">
               <button
                  onClick={async () => {
                     try {
                        await postSendFriendRequest(user!.id, item.id)
                     } catch (error) {
                        console.error(">>> error:", error)
                     }
                  }}
                  className="absolute right-5 top-1/2 -translate-y-1/2 hover:scale-125 transition-transform cursor-pointer"
               >
                  <FontAwesomeIcon icon={faPaperPlane} className="text-white" />
               </button>
            </Tooltip>
         </div>
      )
   }

   return (
      <div>
         <button
            onClick={async () => {
               setShowModalAddFriend(true)
            }}
         >
            Add
         </button>

         <Modal
            title={<p className="bg-[#313131] text-white">Add Friends</p>}
            open={showModalAddFriend}
            onCancel={() => setShowModalAddFriend(false)}
            styles={{ content: { backgroundColor: "#313131" } }}
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
               <div className="flex flex-col gap-y-2">
                  {loading === "searching" ? (
                     <div className="flex w-full justify-center mt-5">
                        <Spinner color="text-white" className="h-7" />
                     </div>
                  ) : users && users.length > 0 ? (
                     users.map((item) => <UserCard key={item.id} item={item} />)
                  ) : (
                     <div className="w-full text-center mt-5 text-[#939393]">No Users Found.</div>
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
         <AddFriendSection />
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
