import { useAppSelector } from "./redux"

export const useUser = () => {
   const user = useAppSelector(({ user }) => user.user)
   return user
}
