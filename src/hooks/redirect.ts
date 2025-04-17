"use client"

import { getPathWithQueryString, pureNavigator } from "@/utils/helpers"
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
      const redirect = `/?redirect=${getPathWithQueryString()}`
      router.push(redirect)
   }
}
