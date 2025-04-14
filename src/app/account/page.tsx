"use client"

import { clientAxios } from "@/configs/axios"
import { clientSocket } from "@/configs/socket"
import { useUser } from "@/hooks/user"
import { TUserWithProfile } from "@/utils/types"
import Link from "next/link"
import { useEffect, useRef, useState } from "react"

const Account = () => {
   const [loading, setLoading] = useState<boolean>(false)
   const input_ref = useRef<HTMLTextAreaElement>(null)
   const [message, setMessage] = useState<string>()
   const user = useUser()
   const [data, setData] = useState<TUserWithProfile | null>(null)

   useEffect(() => {
      clientSocket.socket.io.on("reconnect", (attempt) => {
         console.log(">>> attempt:", attempt)
      })
   }, [])

   const test_api = async () => {
      try {
         await clientAxios.get("healthcheck")
      } catch (error) {
         console.error(">>> error:", error)
      }
   }

   const print = (value: string): string => {
      return '"' + value + '"'
   }

   const onChange: React.ChangeEventHandler<HTMLTextAreaElement> = async (e) => {
      const value = e.target.value
      console.log(">>> onChange >>>", print(value))
   }

   const onKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = async (e) => {
      console.log(">>> onKeyDown")
      if (e.key === "Enter") {
         console.log(">>> run enter")
         setMessage("")
      }
   }

   const disconnectSocket = async () => {
      clientSocket.socket.disconnect()
   }

   const connectSocket = async () => {
      clientSocket.socket.connect()
   }

   return (
      <div>
         <h2>
            <div>account</div>
            <br />
            <p>
               <span className="text-regular-placeholder-cl">ID: </span>
               <span>{user?.id || "None"}</span>
            </p>
            <br />
            <p>
               <span className="text-regular-placeholder-cl">Email: </span>
               <span>{user?.email || "None"}</span>
            </p>
            <br />
            <p>
               <span className="text-regular-placeholder-cl">Full name: </span>
               <span>{data?.Profile?.fullName || "None"}</span>
            </p>
            <br />
            <br />
            <Link href={"/conversations?cid=1"}>conversation</Link>
            <br />
            <Link href={"/friends"}>friends</Link>
         </h2>

         <button className="px-3 py-2 mt-3 bg-black text-white" onClick={connectSocket}>
            connect socket
         </button>
         <br />
         <button className="px-3 py-2 mt-3 bg-black text-white" onClick={disconnectSocket}>
            disconnect socket
         </button>

         <div className="m-5">
            <textarea
               className="text-black p-5 resize-none"
               rows={3}
               onChange={onChange}
               onKeyDown={onKeyDown}
               ref={input_ref}
            ></textarea>
         </div>

         <div className="mt-10 bg-gray-300 text-black">
            {loading ? (
               <h2>Loading...</h2>
            ) : (
               <button onClick={test_api} className="p-5 bg-pink-300">
                  test api
               </button>
            )}
         </div>
      </div>
   )
}

export default Account
