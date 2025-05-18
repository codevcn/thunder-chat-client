import { clientAxios } from "@/configs/axios"
import type { TGlobalSearchData } from "@/utils/types/be-api"

export const searchGlobally = async (keyword: string) =>
   await clientAxios.get<TGlobalSearchData>("/search/global-search", {
      params: {
         keyword,
      },
   })
