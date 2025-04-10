"use client"

import { EAuthStatus } from "@/utils/enums"
import { JSX, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRedirectToLogin } from "@/hooks/redirect"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/auth"
import { AppLoading } from "./app-loading"

type TGuardProps = {
   children: JSX.Element
}

const Guard = ({ children }: TGuardProps) => {
   const { authStatus } = useAuth()
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
   const redirectToLogin = useRedirectToLogin()

   const checkAuthStatus = () => {
      if (authStatus === EAuthStatus.AUTHENTICATED) {
         setIsAuthenticated(true)
      } else if (authStatus === EAuthStatus.UNAUTHENTICATED) {
         toast.error("Session expires or not an authenticated user!")
         redirectToLogin()
      }
   }

   useEffect(() => {
      checkAuthStatus()
   }, [authStatus])

   if (isAuthenticated) return children

   return <AppLoading />
}

type TRouteGuardProps = {
   children: JSX.Element
   nonGuardRoutes: string[]
}

export const RouteGuard = ({ children, nonGuardRoutes }: TRouteGuardProps) => {
   if (nonGuardRoutes.includes(usePathname())) {
      return children
   }

   return <Guard>{children}</Guard>
}
