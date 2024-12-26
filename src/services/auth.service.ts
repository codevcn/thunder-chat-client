import { postCheckAuth } from "@/apis/auth"

class AuthService {
   async checkAuthService() {
      try {
         const { data } = await postCheckAuth()
         return data
      } catch (error) {
         throw error
      }
   }
}

export const authService = new AuthService()
