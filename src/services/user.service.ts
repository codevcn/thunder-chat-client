import { getSearchUsers } from "@/apis/user"
import type { TSearchUsersData } from "@/utils/types"

class UserService {
   async searchUsers(keyword: string): Promise<TSearchUsersData[]> {
      const { data } = await getSearchUsers(keyword)
      return data
   }
}

export const userService = new UserService()
