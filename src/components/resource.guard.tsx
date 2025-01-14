"use client"

import { EAuthStatus } from "@/utils/enums"
import { JSX, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useRedirectToLogin } from "@/hooks/redirect"
import { AppLoading } from "./app-loading"
import { usePathname } from "next/navigation"
import { useAuth } from "@/hooks/auth"
import { useUser } from "@/hooks/user"

type TGuardProps = {
   children: JSX.Element
}

const Guard = ({ children }: TGuardProps) => {
   const { authStatus } = useAuth()
   const user = useUser()
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
   const redirect_to_login = useRedirectToLogin()

   const checkAuthStatus = () => {
      if (authStatus === EAuthStatus.AUTHENTICATED && user) {
         setIsAuthenticated(true)
      } else if (authStatus === EAuthStatus.UNAUTHENTICATED) {
         toast.error("Session expires or not an authenticated user!")
         redirect_to_login()
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
