"use client"

import { clientAxios, requestConfig } from "@/configs/axios"
import { useState } from "react"

export default function FaqPage() {
   const [loading, setLoading] = useState(false)

   const todo = () => {
      setLoading(true)
      clientAxios
         .get("/temp/dl-all-msg", requestConfig)
         .then((res) => {
            console.log(">>> res:", res.data)
         })
         .catch((err) => {
            console.error(">>> err:", err)
         })
         .finally(() => {
            setLoading(false)
         })
   }

   const todo2 = () => {
      setLoading(true)
      clientAxios
         .post("/temp/all-msg", { msgOffset: 80, directChatId: 1, limit: 20, sortType: "ASC" })
         .finally(() => {
            setLoading(false)
         })
   }

   return (
      <div className="p-2">
         <button onClick={todo} className="p-3 bg-pink-200 text-black">
            {loading ? "Loading..." : "Delete All Messages"}
         </button>
         <br />
         <br />
         <button onClick={todo2} className="p-3 bg-pink-200 text-black">
            {loading ? "Loading..." : "Get All Messages"}
         </button>
      </div>
   )
}
