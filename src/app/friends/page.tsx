"use client"

import { FriendsList } from "./friends-list"
import { Navigation } from "@/components/layout/navigation"
import { AddFriend } from "./add-friend"
import { Contact, Ban, Mail } from "lucide-react"
import { FriendRequests } from "./friend-requests"
import { Blocked } from "./blocked"
import { useSearchParams } from "next/navigation"
import { EActions } from "./sharing"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/materials"

type TActions = {
   key: EActions
   label: string
   icon: React.JSX.Element
}

const actions: TActions[] = [
   {
      key: EActions.FRIENDS_LIST,
      label: "My Friends",
      icon: <Contact />,
   },
   {
      key: EActions.ADD_FRIEND_REQUESTS,
      label: "Friend Invitations",
      icon: <Mail />,
   },
   {
      key: EActions.BLOCKED,
      label: "Blocked",
      icon: <Ban />,
   },
]

const Actions = () => {
   const searchParams = useSearchParams()
   const qsAction = searchParams.get("action") || EActions.FRIENDS_LIST
   const router = useRouter()

   const changeTab = (key: string) => {
      router.push(`/friends?action=${key}`)
   }

   return (
      <div className="w-full">
         <div className="flex mt-5 gap-x-10 justify-between h-fit w-full px-10 border-b border-regular-hover-card-cl border-solid">
            <Tabs
               defaultValue="account"
               className="w-[400px] py-5"
               onValueChange={changeTab}
               value={qsAction}
            >
               <TabsList>
                  {actions.map(({ key, label }) => (
                     <TabsTrigger value={key}>{label}</TabsTrigger>
                  ))}
               </TabsList>
               <TabsContent forceMount value={EActions.FRIENDS_LIST}>
                  <FriendsList />
               </TabsContent>
               <TabsContent forceMount value={EActions.ADD_FRIEND_REQUESTS}>
                  <FriendRequests />
               </TabsContent>
               <TabsContent forceMount value={EActions.BLOCKED}>
                  <Blocked />
               </TabsContent>
            </Tabs>
            <AddFriend />
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
