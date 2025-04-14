"use client"

import type { TGetFriendsData } from "@/apis/types"
import { CustomAvatar } from "@/components/materials"
import { Spinner } from "@/components/materials/spinner"
import { useUser } from "@/hooks/user"
import { friendService } from "@/services/friend.service"
import axiosErrorHandler from "@/utils/axios-error-handler"
import { displayTimeDifference } from "@/utils/date-time"
import { EInternalEvents } from "@/utils/enums"
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { customEventManager } from "@/utils/events/custom-events"
import { EPaginations } from "@/utils/enums"

type TFriendCardProps = {
   friend: TGetFriendsData
}

const FriendCard = ({ friend }: TFriendCardProps) => {
   const { Recipient, createdAt } = friend
   const { Profile, email } = Recipient

   return (
      <div className="flex justify-between items-center w-full mb-3 gap-x-5 px-4 py-3 bg-regular-modal-content-bgcl rounded-md">
         <div className="flex items-center gap-x-3">
            <div>
               <CustomAvatar src={Profile?.avatar || undefined} imgSize={45} />
            </div>
            <div className="h-fit">
               <div>
                  <span className="mb-1 font-bold">{Profile?.fullName || "Unnamed"}</span>
               </div>
               <div className="text-sm text-regular-placeholder-cl">
                  <span>{email}</span>
               </div>
            </div>
         </div>
         <div className="text-regular-placeholder-cl italic">
            {`Was friend ${displayTimeDifference(createdAt)}`}
         </div>
      </div>
   )
}

type TLoadMoreBtnProps = {
   onLoadMore: () => void
   hidden: boolean
}

const LoadMoreBtn = ({ onLoadMore, hidden }: TLoadMoreBtnProps) => {
   const [isLastFriend, setIsLastFriend] = useState<boolean>(false)

   useEffect(() => {
      customEventManager.on(EInternalEvents.LAST_FRIEND_REQUEST, (payload) => {
         setIsLastFriend(true)
      })
      return () => {
         customEventManager.off(EInternalEvents.LAST_FRIEND_REQUEST)
      }
   }, [])

   return (
      <div className="flex mt-7" hidden={isLastFriend || hidden}>
         <button
            onClick={onLoadMore}
            className="hover:bg-regular-hover-bgcl m-auto cursor-pointer px-5 py-2 rounded-md bg-regular-button-bgcl"
         >
            Load More
         </button>
      </div>
   )
}

type TLoading = "friends"

export const FriendsList = () => {
   const [friends, setFriends] = useState<TGetFriendsData[]>([])
   const [loading, setLoading] = useState<TLoading | null>(null)
   const user = useUser()
   const tempFlagUseEffectRef = useRef<boolean>(true)

   const filteredFriends = useMemo(() => {
      return friends
   }, [friends])

   const getFriendsHandler = async (lastFriendId?: number) => {
      setLoading("friends")
      friendService
         .getFriends({
            limit: EPaginations.FRIENDS_PAGE_SIZE,
            userId: user!.id,
            lastFriendId,
         })
         .then((friends) => {
            if (friends && friends.length > 0) {
               setFriends((pre) => [...pre, ...friends])
            } else {
               customEventManager.dispatchEvent(EInternalEvents.LAST_FRIEND_REQUEST)
            }
         })
         .catch((error) => {
            console.error(">>> error:", error)
            toast.error(axiosErrorHandler.handleHttpError(error).message)
         })
         .finally(() => {
            setLoading(null)
         })
   }

   useEffect(() => {
      if (tempFlagUseEffectRef.current) {
         tempFlagUseEffectRef.current = false
         if (!friends || friends.length === 0) {
            getFriendsHandler()
         }
      }
   }, [])

   const onLoadMore = () => {
      if (friends) {
         const friendsLen = friends.length
         if (friendsLen > 0) {
            getFriendsHandler(friends[friendsLen - 1].id)
         }
      }
   }

   return (
      <div className="px-5">
         <div className="mb-4 border-b border-regular-hover-card-cl border-solid pb-3"></div>
         <div>
            {filteredFriends && filteredFriends.length > 0
               ? filteredFriends.map((friend) => <FriendCard key={friend.id} friend={friend} />)
               : !loading && (
                    <div className="mt-10 text-center text-regular-placeholder-cl">
                       There's no friends now.
                    </div>
                 )}
         </div>
         <div className="flex w-full justify-center mt-5" hidden={!loading}>
            <Spinner size="medium" />
         </div>
         <LoadMoreBtn onLoadMore={onLoadMore} hidden={loading === "friends"} />
      </div>
   )
}
