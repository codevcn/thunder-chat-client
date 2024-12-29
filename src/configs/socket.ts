import type { IEmitSocketEvents, IListenSocketEvents } from "@/utils/events/events-interfaces"
import { ESocketNamespaces } from "@/utils/events/socket-namespaces"
import { io, Socket } from "socket.io-client"

export const clientSocket: Socket<IListenSocketEvents, IEmitSocketEvents> = io(
   process.env.NEXT_PUBLIC_SERVER_HOST + `/${ESocketNamespaces.app}`,
   {
      autoConnect: false,
      withCredentials: true,
      auth: {
         clientId: null,
      },
   }
)
