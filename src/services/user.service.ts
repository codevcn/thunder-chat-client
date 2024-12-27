import { getSearchUsers } from "@/apis/user"
import type { TSearchUserData } from "@/utils/types"

class UserService {
   async searchUsers(keyword: string): Promise<TSearchUserData[]> {
      const { data } = await getSearchUsers(keyword)
      return data
   }
}

export const userService = new UserService()
