import { useRef } from "react"

export const useDebounce = (delay: number) => {
   const timer = useRef<NodeJS.Timeout>(undefined)
   return (handler: (...params: any) => void) =>
      (...args: any) => {
         clearTimeout(timer.current)
         timer.current = setTimeout(() => {
            handler.apply(this, args)
         }, delay)
      }
}

export const useDebounceLeading = (delay: number) => {
   const timer = useRef<NodeJS.Timeout>(undefined)
   return (handler: (...params: any) => void) =>
      (...args: any) => {
         if (!timer.current) {
            handler.apply(this, args)
         }
         clearTimeout(timer.current)
         timer.current = setTimeout(() => {
            timer.current = undefined
         }, delay)
      }
}
