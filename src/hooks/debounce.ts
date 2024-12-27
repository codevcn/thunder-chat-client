export const useDebounce = (delay: number) => (handler: (...params: any) => void) => {
   let timer: NodeJS.Timeout
   return (...args: any) => {
      clearTimeout(timer)
      timer = setTimeout(() => {
         handler.apply(this, args)
      }, delay)
   }
}
