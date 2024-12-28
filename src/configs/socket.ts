import { ESocketNamespaces } from "@/utils/events/chatting-events"
import { io } from "socket.io-client"

const socketClientChatting = io(process.env.NEXT_PUBLIC_SERVER_HOST + `/${ESocketNamespaces.app}`, {
   autoConnect: false,
   withCredentials: true,
   auth: {
      clientId: null,
   },
})

export default socketClientChatting
