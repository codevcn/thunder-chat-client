"use client"

import { Spinner } from "@/components/spinner"
import { useEffect, useState } from "react"

type TFriendRequestData = {}

type TLoading = "friend-requests"

export const AddFriendRequests = () => {
   const [requests, setRequest] = useState<TFriendRequestData[]>()
   const [loading, setLoading] = useState<TLoading | null>()

   const getFriendRequestsHandler = async () => {
      setLoading("friend-requests")
      try {
      } catch (error) {}
      setLoading(null)
   }

   useEffect(() => {
      getFriendRequestsHandler()
   }, [])

   return (
      <div>
         {loading === "friend-requests" ? (
            <div>
               <Spinner />
            </div>
         ) : requests && requests.length > 0 ? (
            requests.map(({}) => (
               <div key={1}>
                  <div></div>
               </div>
            ))
         ) : (
            <div></div>
         )}
      </div>
   )
}
