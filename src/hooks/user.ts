import type { TUserWithoutPassword } from "@/utils/types"
import { useAppSelector } from "./redux"

type TUseUserReturn = TUserWithoutPassword | null

export const useUser = (): TUseUserReturn => {
   const user = useAppSelector(({ user }) => user.user)
   return user
}
