"use client"

import { getUserByEmail } from "@/apis/user"
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

   const test_api = async () => {
      if (user) {
         try {
            setLoading(true)
            const { data } = await getUserByEmail(user?.email)
            setLoading(false)
            console.log(">>> testing data >>>", data)
            setData(data)
         } catch (error) {
            console.error(">>> testing error >>>", error)
         }
      }
   }

   useEffect(() => {
      test_api()
   }, [user])

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

   return (
      <div>
         <h2>
            <div>account</div>
            <br />
            <p>
               <span className="text-regular-placeholder-text-cl">ID: </span>
               <span>{user?.id || "None"}</span>
            </p>
            <br />
            <p>
               <span className="text-regular-placeholder-text-cl">Email: </span>
               <span>{user?.email || "None"}</span>
            </p>
            <br />
            <p>
               <span className="text-regular-placeholder-text-cl">Full name: </span>
               <span>{data?.Profile?.fullName || "None"}</span>
            </p>
            <br />
            <br />
            <Link href={"/conversations?cid=1"}>conversation</Link>
            <br />
            <Link href={"/friends"}>friends</Link>
         </h2>

         <div className="m-5">
            <textarea
               className="text-black p-5 resize-none"
               rows={10}
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
