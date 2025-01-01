import { getCheckAuth } from "@/apis/auth"
import type { TUserWithoutPassword } from "@/utils/types"

class AuthService {
   async checkAuth(): Promise<TUserWithoutPassword> {
      const { data } = await getCheckAuth()
      return data
   }
}

export const authService = new AuthService()
