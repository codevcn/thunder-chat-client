"use client"

import { getRouteWithQueryString, pureNavigator } from "@/utils/helpers"
import { useRouter } from "next/navigation"

export const useAuthRedirect = () => {
   return () => {
      const redirect = new URLSearchParams(window.location.search).get("redirect") || "/account"
      pureNavigator(redirect)
   }
}

export const useRedirectToLogin = () => {
   const router = useRouter()
   return () => {
      const redirect = `/?redirect=${getRouteWithQueryString()}`
      router.push(redirect)
   }
}
