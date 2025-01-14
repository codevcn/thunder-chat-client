import dayjs from "dayjs"
import { THE_LAST_DIRECT_CHAT_ID_NAME } from "./constants"

export const storeDirectChatIdAtLocal = (id: string) => {
   localStorage.setItem(THE_LAST_DIRECT_CHAT_ID_NAME, id)
}

export const getDirectChatIdFromLocal = () => {
   return localStorage.getItem(THE_LAST_DIRECT_CHAT_ID_NAME)
}

export const setLastSeen = (date: string) => {
   return dayjs(date).format("MM/DD/YYYY, h:mm A")
}

export function isValueInEnum<T extends object>(value: string, enumObject: T): boolean {
   return Object.values(enumObject).includes(value)
}

export const getRouteWithQueryString = (url: string = window.location.href): string => {
   const urlObject = new URL(url)
   return `${urlObject.pathname}${urlObject.search}`
}
