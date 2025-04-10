import { useRef } from "react"

export const useDebounce = () => {
   const timer = useRef<NodeJS.Timeout>(undefined)
   return <P extends any[]>(func: (...args: P) => void, delayInMs: number) => {
      return (...args: Parameters<typeof func>) => {
         clearTimeout(timer.current)
         timer.current = setTimeout(() => {
            func(...args)
         }, delayInMs)
      }
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
