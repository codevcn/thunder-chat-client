"use client"

import { useEffect } from "react"

export default function FAQPage() {
   const todo = () => {}

   // useEffect(() => {
   //     function onConnect() {
   //         console.log(">>> run this connected")
   //     }

   //     function onDisconnect() {
   //         console.log(">>> run this disconnect")
   //     }

   //     function onFooEvent() {
   //         console.log(">>> run this foo event")
   //     }

   //     clientSocket.on("connect", onConnect)
   //     clientSocket.on("disconnect", onDisconnect)
   //     clientSocket.on("foo", onFooEvent)

   //     return () => {
   //         clientSocket.off("connect", onConnect)
   //         clientSocket.off("disconnect", onDisconnect)
   //         clientSocket.off("foo", onFooEvent)
   //     }
   // }, [])

   return (
      <div className="bg-black p-5 box-border">
         <p>FAQ Page</p>

         <button onClick={todo} className="p-3 m-5 border border-black bg-regular-darkGray-cl">
            socket
         </button>
      </div>
   )
}
