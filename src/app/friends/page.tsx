import { FriendsList } from "./friends-list"
import { Navigation } from "@/components/navigation"
import { AddFriendSection } from "./add-friend"

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
      <div className="flex FriendsPage bg-regular-black-cl w-full relative">
         <Navigation />

         <div className="flex w-full relative z-20">
            <Actions />
            <FriendsList />
         </div>
      </div>
   )
}

export default FriendsPage
