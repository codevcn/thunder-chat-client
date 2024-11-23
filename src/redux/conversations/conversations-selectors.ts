import { createSelector } from "reselect"
import { RootState } from "../store"

export const selectConversation = (id: number) =>
   createSelector(
      ({ conversations }: RootState) => conversations.searchResults,
      (searchResults) => searchResults?.find((result) => result.id === id)
   )

export const sortConversationsByPinned = createSelector(
   ({ conversations }: RootState) => conversations.conversations,
   (conversations) => {
      if (conversations && conversations.length > 0) {
         return [...conversations].sort((next, current) => current.pinIndex - next.pinIndex)
      }
      return null
   }
)
