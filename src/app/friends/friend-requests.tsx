"use client"

import type { TGetFriendRequestsData } from "@/utils/types/be-api"
import { CustomAvatar, CustomDropdown } from "@/components/materials"
import { Spinner } from "@/components/materials/spinner"
import { useUser } from "@/hooks/user"
import { friendService } from "@/services/friend.service"
import axiosErrorHandler from "@/utils/axios-error-handler"
import { displayTimeDifference } from "@/utils/date-time"
import { EInternalEvents, EFriendRequestStatus } from "@/utils/enums"
import { ArrowLeft, ArrowRight, Repeat, CheckCircle, Filter, Trash } from "lucide-react"
// import { Tooltip, Dropdown } from "antd"
import { CustomTooltip } from "@/components/materials"
import { useEffect, useMemo, useRef, useState } from "react"
import toast from "react-hot-toast"
import { customEventManager } from "@/utils/events/custom-events"
import type { TUserWithoutPassword } from "@/utils/types/global"
import { EPaginations } from "@/utils/enums"

type TRequestCardProps = {
   req: TGetFriendRequestsData
   loading: TLoading | null
   user: TUserWithoutPassword
   onFriendRequestActions: (
      action: EFriendRequestStatus.ACCEPTED | EFriendRequestStatus.REJECTED,
      friendRequestId: number,
      friendEmail: string
   ) => void
}

const RequestCard = ({ req, loading, onFriendRequestActions, user }: TRequestCardProps) => {
   const { Sender, createdAt, id, status, Recipient } = req
   const isSentRequest = user.id === Sender.id

   let userInfo = Sender
   if (isSentRequest) {
      userInfo = Recipient
   }

   const { Profile, email } = userInfo

   return (
      <div className="flex justify-between items-center w-full mb-3 gap-x-5 px-4 py-3 bg-regular-modal-content-bgcl rounded-md">
         <div className="flex items-center gap-x-3">
            <div>
               <CustomAvatar
                  src={Profile?.avatar || undefined}
                  imgSize={45}
                  fallback={Profile?.fullName[0]}
               />
            </div>
            <div className="h-fit">
               <div>
                  <span className="mb-1 font-bold">{Profile?.fullName || "Unnamed"}</span>
                  <span className="text-sm text-regular-placeholder-cl">{` (${displayTimeDifference(createdAt)})`}</span>
               </div>
               <div className="text-sm text-regular-placeholder-cl">
                  <span>{isSentRequest ? `Sent to ${email}` : `Received from ${email}`}</span>
               </div>
            </div>
         </div>
         {status === EFriendRequestStatus.PENDING ? (
            isSentRequest ? (
               <div className="px-3 py-2 rounded-md text-black bg-regular-white-cl">Pending.</div>
            ) : (
               <div className="flex items-center gap-x-7">
                  {loading === `request-card-ACCEPTED-${id}` ? (
                     <Spinner size="small" />
                  ) : (
                     <CustomTooltip title="Accept" placement="bottom">
                        <button
                           className="hover:scale-125 transition-transform"
                           onClick={() =>
                              onFriendRequestActions(EFriendRequestStatus.ACCEPTED, id, email)
                           }
                        >
                           <CheckCircle size={20} />
                        </button>
                     </CustomTooltip>
                  )}
                  {loading === `request-card-REJECTED-${id}` ? (
                     <Spinner size="small" />
                  ) : (
                     <CustomTooltip title="Reject" placement="bottom">
                        <button
                           className="hover:scale-125 transition-transform"
                           onClick={() =>
                              onFriendRequestActions(EFriendRequestStatus.REJECTED, id, email)
                           }
                        >
                           <Trash size={20} className="text-regular-red-cl" />
                        </button>
                     </CustomTooltip>
                  )}
               </div>
            )
         ) : status === EFriendRequestStatus.ACCEPTED ? (
            <div className="px-3 py-2 rounded-md text-white bg-regular-green-cl">
               The invitation has been accepted.
            </div>
         ) : (
            <div className="px-3 py-2 rounded-md text-white bg-regular-red-cl">
               The invitation has been rejected.
            </div>
         )}
      </div>
   )
}

type TLoadMoreBtnProps = {
   onLoadMore: () => void
   hidden: boolean
}

const LoadMoreBtn = ({ onLoadMore, hidden }: TLoadMoreBtnProps) => {
   const [isLastRequest, setIsLastRequest] = useState<boolean>(false)

   useEffect(() => {
      customEventManager.on(EInternalEvents.LAST_FRIEND_REQUEST, (payload) => {
         setIsLastRequest(true)
      })
      return () => {
         customEventManager.off(EInternalEvents.LAST_FRIEND_REQUEST)
      }
   }, [])

   return (
      <div className="flex mt-7" hidden={isLastRequest || hidden}>
         <button
            onClick={onLoadMore}
            className="hover:bg-regular-hover-bgcl m-auto cursor-pointer px-5 py-2 rounded-md bg-regular-button-bgcl"
         >
            Load More
         </button>
      </div>
   )
}

enum EFilterLabels {
   ALL = "ALL",
   SENT = "SENT",
   RECEIVED = "RECEIVED",
}

type TLoading =
   | "friend-requests"
   | `request-card-${EFriendRequestStatus.ACCEPTED | EFriendRequestStatus.REJECTED}-${number}`
   | null

type TMenuItemProps = {
   children: React.JSX.Element | React.JSX.Element[]
   type: EFilterLabels
}

export const FriendRequests = () => {
   const [requests, setRequests] = useState<TGetFriendRequestsData[]>([])
   const [loading, setLoading] = useState<TLoading>(null)
   const user = useUser()
   const [filter, setFilter] = useState<EFilterLabels>(EFilterLabels.ALL)
   const tempFlagUseEffectRef = useRef<boolean>(true)

   const filterRequests = (requests: TGetFriendRequestsData[]): TGetFriendRequestsData[] => {
      switch (filter) {
         case EFilterLabels.SENT:
            return requests.filter((req) => req.Sender.id === user!.id)
         case EFilterLabels.RECEIVED:
            return requests.filter((req) => req.Sender.id !== user!.id)
      }
      return requests
   }

   const filteredRequests = useMemo(() => {
      if (requests && requests.length > 0) {
         return filterRequests(requests)
      }
      return requests
   }, [filter, requests])

   const getFriendRequestsHandler = async (lastFriendRequestId?: number) => {
      setLoading("friend-requests")
      friendService
         .getFriendRequests({
            limit: EPaginations.FRIEND_REQUESTS_PAGE_SIZE,
            userId: user!.id,
            lastFriendRequestId,
         })
         .then((requests) => {
            if (requests && requests.length > 0) {
               setRequests((pre) => [...pre, ...requests])
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
         if (!requests || requests.length === 0) {
            getFriendRequestsHandler()
         }
      }
   }, [])

   const friendRequestActions = async (
      action: EFriendRequestStatus.ACCEPTED | EFriendRequestStatus.REJECTED,
      friendRequestId: number,
      friendEmail: string
   ) => {
      setLoading(`request-card-${action}-${friendRequestId}`)
      try {
         await friendService.friendRequestAction({ action, friendRequestId })
         if (action === EFriendRequestStatus.ACCEPTED) {
            toast.success(`The user ${friendEmail} now becomes your friend.`)
         } else {
            toast.success(`You rejected invitation of the user ${friendEmail}.`)
         }
      } catch (error) {
         console.error(">>> error:", error)
         toast.error(axiosErrorHandler.handleHttpError(error).message)
      }
      setLoading(null)
   }

   const onLoadMore = () => {
      if (requests) {
         const requestsLen = requests.length
         if (requestsLen > 0) {
            getFriendRequestsHandler(requests[requestsLen - 1].id)
         }
      }
   }

   const activeClass: string = "underline font-bold"

   const MenuItem = ({ children, type }: TMenuItemProps) => (
      <div
         className={`flex gap-x-2 hover:underline ${filter === type ? activeClass : ""}`}
         onClick={() => setFilter(type)}
      >
         {children}
      </div>
   )

   return (
      <div className="px-5">
         <div className="mb-4 border-b border-regular-hover-card-cl border-solid pb-3">
            <CustomDropdown
               triggerButton={
                  <button className="flex items-center gap-x-2 px-4 py-2 rounded-md bg-regular-modal-content-bgcl">
                     <Filter />
                     <span className="text-lg leading-none">{filter}</span>
                  </button>
               }
            >
               <MenuItem type={EFilterLabels.ALL}>
                  <Repeat />
                  <span>All</span>
               </MenuItem>
               <MenuItem type={EFilterLabels.ALL}>
                  <ArrowRight />
                  <span>Sent</span>
               </MenuItem>
               <MenuItem type={EFilterLabels.ALL}>
                  <ArrowLeft />
                  <span>Received</span>
               </MenuItem>
            </CustomDropdown>
         </div>
         <div>
            {filteredRequests && filteredRequests.length > 0
               ? filteredRequests.map((req) => (
                    <RequestCard
                       key={req.id}
                       req={req}
                       loading={loading}
                       onFriendRequestActions={friendRequestActions}
                       user={user!}
                    />
                 ))
               : !loading && (
                    <div className="mt-10 text-center text-regular-placeholder-cl">
                       There's no invitations now.
                    </div>
                 )}
         </div>
         <div className="flex w-full justify-center mt-5" hidden={!(loading === "friend-requests")}>
            <Spinner size="medium" />
         </div>
         <LoadMoreBtn onLoadMore={onLoadMore} hidden={loading === "friend-requests"} />
      </div>
   )
}
