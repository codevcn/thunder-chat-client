import type { TSearchUsersData } from "@/apis/types"
import { getSearchUsers } from "@/apis/user"
import { EPaginations } from "@/utils/enums"

class UserService {
   async searchUsers(keyword: string): Promise<TSearchUsersData[]> {
      const { data } = await getSearchUsers({
         keyword,
         limit: EPaginations.SEARCH_USERS_PAGE_SIZE,
      })
      return data
   }
}

export const userService = new UserService()
