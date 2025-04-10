import type { IEmitSocketEvents, IListenSocketEvents } from "@/utils/events/events-interfaces"
import { ESocketNamespaces } from "@/utils/events/socket-namespaces"
import { io, Socket } from "socket.io-client"

class ClientSocket {
   readonly socket: Socket<IListenSocketEvents, IEmitSocketEvents>

   constructor() {
      this.socket = io(process.env.NEXT_PUBLIC_SERVER_HOST + `/${ESocketNamespaces.app}`, {
         autoConnect: false,
         withCredentials: true,
         auth: {},
      })
   }

   setAuth(clientId: number): void {
      this.socket.auth = {
         ...(this.socket.auth || {}),
         clientId,
      }
   }

   setMessageOffset(lastMsgTimestamp: Date, directChatId: number): void {
      this.socket.auth = {
         ...(this.socket.auth || {}),
         messageOffset: lastMsgTimestamp,
         directChatId,
      }
   }
}

export const clientSocket = new ClientSocket()
