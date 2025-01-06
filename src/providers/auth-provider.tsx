"use client"

import { JSX, useEffect } from "react"
import { checkAuthThunk } from "@/redux/auth/auth.thunk"
import { EAuthStatus } from "@/utils/enums"
import { useAppDispatch, useAppSelector } from "@/hooks/redux"

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
   const { authStatus } = useAppSelector((state) => state.auth)
   const dispatch = useAppDispatch()

   useEffect(() => {
      if (authStatus === EAuthStatus.UNAUTHENTICATED || authStatus === EAuthStatus.UNKNOWN) {
         dispatch(checkAuthThunk())
      }
   }, [])

   return children
}
