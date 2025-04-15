import dayjs from "dayjs"
import { THE_LAST_DIRECT_CHAT_ID_NAME } from "./constants"
import type { TFormData } from "./types"
import DOMPurify from "dompurify"

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

export function extractFormData<T extends TFormData>(formEle: HTMLFormElement): T {
   const formData = new FormData(formEle)
   const data: any = {}

   for (const [key, value] of formData.entries()) {
      const currentValue = data[key]
      if (currentValue) {
         if (Array.isArray(currentValue)) {
            currentValue.push(value)
         } else {
            data[key] = [currentValue, value]
         }
      } else {
         data[key] = value
      }
   }

   return data
}

export const pureNavigator = (url: string) => {
   window.location.href = url
}

export const getCurrentLocationPath = (): string => {
   return window.location.pathname
}

export const santizeMsgContent = (htmlStr: string): string => {
   return DOMPurify.sanitize(htmlStr)
}
