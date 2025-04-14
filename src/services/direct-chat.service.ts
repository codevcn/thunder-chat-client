import { getFetchDirectChat, getFetchEmojis } from "@/apis/direct-chat"
import { DirectChatError } from "@/utils/custom-errors"
import { EDirectChatErrMsgs } from "@/utils/enums"
import type { TDirectChatData } from "@/apis/types"
import type { TGetEmojisServiceRes } from "@/app/api/types"

class DirectChatService {
   async fetchDirectChat(directChatId: number): Promise<TDirectChatData> {
      const { data } = await getFetchDirectChat(directChatId)
      if (!data) {
         throw new DirectChatError(EDirectChatErrMsgs.CONV_NOT_FOUND)
      }
      return data
   }

   async fetchEmojis(): Promise<TGetEmojisServiceRes> {
      const { data } = await getFetchEmojis()
      return {
         activity: data.activity.map(({ name, path }) => ({ alt: name, name, src: path })),
         foodDrink: data.foodDrink.map(({ name, path }) => ({ alt: name, name, src: path })),
         smileyPeople: data.smileyPeople.map(({ name, path }) => ({ alt: name, name, src: path })),
         travelPlaces: data.travelPlaces.map(({ name, path }) => ({ alt: name, name, src: path })),
         all: data.all.map(({ name, path }) => ({ alt: name, name, src: path })),
      }
   }
}

export const directChatService = new DirectChatService()
