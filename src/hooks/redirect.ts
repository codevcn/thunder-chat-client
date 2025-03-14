import { getRouteWithQueryString } from "@/utils/helpers"
import { useRouter } from "next/navigation"

export const useAuthRedirect = () => {
   const params = new URLSearchParams(window.location.search)
   const redirect = params.get("redirect") || "/account"
   const router = useRouter()
   return ({ refresh }: { refresh: boolean }) => {
      if (refresh) {
         window.open(redirect, "_self")
      } else {
         router.push(redirect)
      }
   }
}

export const useRedirectToLogin = () => {
   const router = useRouter()
   return () => {
      const redirect = `/login-sign-up?redirect=${getRouteWithQueryString()}`
      router.push(redirect)
   }
}
