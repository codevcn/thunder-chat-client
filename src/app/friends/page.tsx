"use client"

import { FriendsList } from "./friends-list"
import { Navigation } from "@/components/navigation"
import { AddFriend } from "./add-friend"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAddressBook, faBan, faEnvelope } from "@fortawesome/free-solid-svg-icons"
import { FriendRequests } from "./friend-requests"
import { Blocked } from "./blocked"
import { useSearchParams } from "next/navigation"
import { EActions } from "./sharing"
import { useRouter } from "next/navigation"

const actions: TabsProps["items"] = [
   {
      key: EActions.friends_list,
      label: "My Friends",
      icon: <FontAwesomeIcon icon={faAddressBook} />,
   },
   {
      key: EActions.add_friend_requests,
      label: "Friend Invitations",
      icon: <FontAwesomeIcon icon={faEnvelope} />,
   },
   {
      key: EActions.blocked,
      label: "Blocked",
      icon: <FontAwesomeIcon icon={faBan} />,
   },
]

const Actions = () => {
   const searchParams = useSearchParams()
   const qsAction = searchParams.get("action") || EActions.friends_list
   const router = useRouter()

   const changeTab = (key: string) => {
      router.push(`/friends?action=${key}`)
   }

   return (
      <div className="w-full">
         <div className="flex mt-5 gap-x-10 justify-between h-fit w-full px-10 border-b border-regular-hover-card-cl border-solid">
            <Tabs
               activeKey={qsAction}
               items={actions}
               onChange={changeTab}
               size="large"
               tabPosition="top"
            />
            <AddFriend />
         </div>
         <div className="py-5">
            {qsAction === EActions.friends_list ? (
               <FriendsList />
            ) : qsAction === EActions.add_friend_requests ? (
               <FriendRequests />
            ) : (
               qsAction === EActions.blocked && <Blocked />
            )}
         </div>
      </div>
   )
}

const FriendsPage = () => {
   return (
      <div className="FriendsPage flex FriendsPage bg-regular-black-cl w-full relative">
         <Navigation />
         <Actions />
      </div>
   )
}

export default FriendsPage
