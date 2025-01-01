"use client"

import type { TGetFriendRequestsData } from "@/apis/types"
import { CustomAvatar } from "@/components/avatar"
import { Spinner } from "@/components/spinner"
import { useUser } from "@/hooks/user"
import { friendService } from "@/services/friend.service"
import axiosErrorHanlder from "@/utils/axios-error-hanlder"
import { handleTimeDifference } from "@/utils/date-time"
import { EEventNames, EFriendRequestStatus } from "@/utils/enums"
import {
   faArrowLeft,
   faArrowRight,
   faArrowRightArrowLeft,
   faCircleCheck,
   faFilter,
   faTrash,
} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Tooltip, Dropdown } from "antd"
import { useEffect, useMemo, useState } from "react"
import toast from "react-hot-toast"
import type { MenuProps } from "antd"
import { customEventManager } from "@/utils/custom-events"
import type { TUserWithoutPassword } from "@/utils/types"
import { MAX_FRIEND_REQUESTS_PAGINATION } from "@/utils/constants"

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
   const { Sender, createdAt, id, status } = req
   const { Profile, email } = Sender

   const isSentRequest = user.id === Sender.id

   return (
      <div className="flex justify-between items-center w-full mb-3 gap-x-5 px-4 py-3 bg-regular-modal-content-bgcl rounded-md">
         <div className="flex items-center gap-x-3">
            <div>
               <CustomAvatar avatarSrc={Profile?.avatar} size={45} />
            </div>
            <div className="h-fit">
               <div>
                  <span className="mb-1 font-bold">{Profile?.fullName || "Unnamed"}</span>
                  <span className="text-sm text-regular-placeholder-text-cl">{` (${handleTimeDifference(createdAt)})`}</span>
               </div>
               <div className="text-sm text-regular-placeholder-text-cl">
                  <span>{email}</span>
               </div>
            </div>
         </div>
         {status === EFriendRequestStatus.PENDING ? (
            isSentRequest ? (
               <span></span>
            ) : (
               <div className="flex items-center gap-x-7">
                  {loading === `request-card-ACCEPT-${id}` ? (
                     <Spinner size="small" />
                  ) : (
                     <Tooltip title="Accept" placement="bottom">
                        <button
                           className="hover:scale-125 transition-transform"
                           onClick={() =>
                              onFriendRequestActions(EFriendRequestStatus.ACCEPTED, id, email)
                           }
                        >
                           <FontAwesomeIcon icon={faCircleCheck} size="lg" />
                        </button>
                     </Tooltip>
                  )}
                  {loading === `request-card-REJECTED-${id}` ? (
                     <Spinner size="small" />
                  ) : (
                     <Tooltip title="Reject" placement="bottom">
                        <button
                           className="hover:scale-125 transition-transform"
                           onClick={() =>
                              onFriendRequestActions(EFriendRequestStatus.REJECTED, id, email)
                           }
                        >
                           <FontAwesomeIcon
                              icon={faTrash}
                              size="lg"
                              className="text-regular-red-cl"
                           />
                        </button>
                     </Tooltip>
                  )}
               </div>
            )
         ) : status === EFriendRequestStatus.ACCEPTED ? (
            <div className="text-regular-green-cl italic opacity-70">
               The invitation has been accepted.
            </div>
         ) : (
            <div className="text-regular-red-cl italic opacity-70">
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
      document.addEventListener(EEventNames.LAST_FRIEND_REQUEST, (e) => {
         setIsLastRequest(true)
      })
      return () => {
         document.removeEventListener(EEventNames.LAST_FRIEND_REQUEST, () => {})
      }
   }, [])

   return (
      <div className="flex mt-7" hidden={isLastRequest || hidden}>
         <button
            onClick={onLoadMore}
            className="hover:bg-regular-regular-hover-bgcl m-auto cursor-pointer px-5 py-2 rounded-md bg-regular-button-bgcl"
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

const menuFilter = (filter: EFilterLabels): MenuProps["items"] => {
   const activeClass: string = "underline font-bold"
   return [
      {
         key: EFilterLabels.ALL,
         label: (
            <div
               className={`flex gap-x-2 hover:underline ${filter === EFilterLabels.ALL ? activeClass : ""}`}
            >
               <FontAwesomeIcon icon={faArrowRightArrowLeft} />
               <span>All</span>
            </div>
         ),
      },
      {
         key: EFilterLabels.SENT,
         label: (
            <div
               className={`flex gap-x-2 hover:underline ${filter === EFilterLabels.SENT ? activeClass : ""}`}
            >
               <FontAwesomeIcon icon={faArrowRight} />
               <span>Sent</span>
            </div>
         ),
      },
      {
         key: EFilterLabels.RECEIVED,
         label: (
            <div
               className={`flex gap-x-2 hover:underline ${filter === EFilterLabels.RECEIVED ? activeClass : ""}`}
            >
               <FontAwesomeIcon icon={faArrowLeft} />
               <span>Received</span>
            </div>
         ),
      },
   ]
}

type TLoading =
   | "friend-requests"
   | `request-card-${EFriendRequestStatus.ACCEPTED | EFriendRequestStatus.REJECTED}-${number}`

export const FriendRequests = () => {
   const [requests, setRequests] = useState<TGetFriendRequestsData[]>()
   const [loading, setLoading] = useState<TLoading | null>(null)
   const user = useUser()
   const [filter, setFilter] = useState<EFilterLabels>(EFilterLabels.ALL)

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
      try {
         const requestsResult = await friendService.getFriendRequests({
            limit: MAX_FRIEND_REQUESTS_PAGINATION,
            userId: user!.id,
            lastFriendRequestId,
         })
         if (requestsResult && requestsResult.length > 0) {
            setRequests(requestsResult)
         } else {
            document.dispatchEvent(customEventManager.createEvent(EEventNames.LAST_FRIEND_REQUEST))
         }
      } catch (error) {
         console.error(">>> error:", error)
         toast.error(axiosErrorHanlder.handleHttpError(error).message)
      }
      setLoading(null)
   }

   useEffect(() => {
      getFriendRequestsHandler()
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
         toast.error(axiosErrorHanlder.handleHttpError(error).message)
      }
      setLoading(null)
   }

   const pickFilter: MenuProps["onClick"] = ({ key }) => {
      setFilter(key as EFilterLabels)
   }

   const onLoadMore = () => {
      if (requests && requests.length > 0) {
         getFriendRequestsHandler(requests[requests.length - 1].id)
      }
   }

   return (
      <div className="px-5">
         <div className="mb-4 border-b border-regular-hover-card-cl border-solid pb-3">
            <Dropdown menu={{ items: menuFilter(filter), onClick: pickFilter, activeKey: filter }}>
               <button className="flex items-center gap-x-2 px-4 py-2 rounded-md bg-regular-modal-content-bgcl">
                  <FontAwesomeIcon icon={faFilter} />
                  <span className="text-lg leading-none">{filter}</span>
               </button>
            </Dropdown>
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
                    <div className="mt-10 text-center text-regular-placeholder-text-cl">
                       There's no invitations now.
                    </div>
                 )}
         </div>
         <div className="flex w-full justify-center mt-5" hidden={!loading}>
            <Spinner size="medium" />
         </div>
         <LoadMoreBtn onLoadMore={onLoadMore} hidden={loading === "friend-requests"} />
      </div>
   )
}
