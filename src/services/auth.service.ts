import { postCheckAuth } from "@/apis/auth"
import type { TUserWithoutPassword } from "@/utils/types"

class AuthService {
   async checkAuth(): Promise<TUserWithoutPassword> {
      try {
         const { data } = await postCheckAuth()
         return data
      } catch (error) {
         throw error
      }
   }
}

export const authService = new AuthService()
