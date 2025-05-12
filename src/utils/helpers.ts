import dayjs from "dayjs"
import type { TFormData } from "./types/global"
import DOMPurify from "dompurify"

export const setLastSeen = (date: string) => {
   return dayjs(date).format("MM/DD/YYYY, h:mm A")
}

export function isValueInEnum<T extends object>(value: string, enumObject: T): boolean {
   return Object.values(enumObject).includes(value)
}

export const getPathWithQueryString = (): string => {
   return window.location.pathname + window.location.search
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
