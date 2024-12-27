import dayjs from "dayjs"
import { THE_LAST_CONVERSATION_ID_NAME } from "./constants"

export const storeConversationIdAtLocal = (id: string) => {
   localStorage.setItem(THE_LAST_CONVERSATION_ID_NAME, id)
}

export const getConversationIdFromLocal = () => {
   return localStorage.getItem(THE_LAST_CONVERSATION_ID_NAME)
}

export const setLastSeen = (date: string) => {
   return dayjs(date).format("MM/DD/YYYY, h:mm A")
}

/**
 * function to set routes don't need guard
 * @param routes are routes start with letter "/"
 * @returns routes
 */
export const setNonGuardRoutes = (...routes: string[]) => {
   return routes
}
