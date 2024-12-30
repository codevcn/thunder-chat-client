"use client"

import { FriendsList } from "./friends-list"
import { Navigation } from "@/components/navigation"
import { AddFriend } from "./add-friend"
import { Tabs } from "antd"
import type { TabsProps } from "antd"
import { useEffect, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAddressBook, faBan, faCommentDots } from "@fortawesome/free-solid-svg-icons"
import { AddFriendRequests } from "./add-friend-requests"
import { Blocked } from "./blocked"
import { useSearchParams } from "next/navigation"
import { isValueInEnum } from "@/utils/helpers"
import { EActions } from "./sharing"

const actions: TabsProps["items"] = [
   {
      key: EActions.friends_list,
      label: "My Friends",
      icon: <FontAwesomeIcon icon={faAddressBook} />,
   },
   {
      key: EActions.add_friend_requests,
      label: "Add Friend Invitations",
      icon: <FontAwesomeIcon icon={faCommentDots} />,
   },
   {
      key: EActions.blocked,
      label: "Blocked",
      icon: <FontAwesomeIcon icon={faBan} />,
   },
]

const Actions = () => {
   const [active, setActive] = useState<EActions>(EActions.friends_list)
   const searchParams = useSearchParams()
   const qsAction = searchParams.get("action")

   const changeTab = (key: string) => {
      setActive(key as EActions)
   }

   useEffect(() => {
      if (qsAction && isValueInEnum(qsAction, EActions)) {
         setActive(qsAction as EActions)
      }
   }, [qsAction])

   return (
      <div className="w-full">
         <div className="flex mt-5 gap-x-10 justify-between h-fit w-full px-10 border-b border-regular-hover-card-cl border-solid">
            <Tabs
               activeKey={active}
               items={actions}
               onChange={changeTab}
               size="large"
               tabPosition="top"
            />
            <AddFriend />
         </div>
         <div className="mt-5">
            {active === EActions.friends_list ? (
               <FriendsList />
            ) : active === EActions.add_friend_requests ? (
               <AddFriendRequests />
            ) : (
               active === EActions.blocked && <Blocked />
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
