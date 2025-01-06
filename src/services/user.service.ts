import type { TSearchUsersData } from "@/apis/types"
import { getSearchUsers } from "@/apis/user"
import { EPaginations } from "@/utils/enums"

class UserService {
   async searchUsers(keyword: string): Promise<TSearchUsersData[]> {
      const { data } = await getSearchUsers({
         keyword,
         limit: EPaginations.MAX_SEARCH_USERS_PER_PAGE,
      })
      return data
   }
}

export const userService = new UserService()
