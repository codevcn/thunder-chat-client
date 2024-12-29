import { postCheckAuth } from "@/apis/auth"
import type { TUserWithoutPassword } from "@/utils/types"

class AuthService {
   async checkAuth(): Promise<TUserWithoutPassword> {
      const { data } = await postCheckAuth()
      console.log(">>> data:", data)
      return data
   }
}

export const authService = new AuthService()
