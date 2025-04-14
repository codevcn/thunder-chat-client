import type { TEmoji } from "@/utils/types"

export type TGetEmojisRes = {
   foodDrink: TGetEmojiFile[]
   activity: TGetEmojiFile[]
   travelPlaces: TGetEmojiFile[]
   smileyPeople: TGetEmojiFile[]
   all: TGetEmojiFile[]
}

export type TGetEmojisErrRes = {
   error: string
}

export type TGetEmojiFile = {
   name: string
   path: string
}

export type TGetEmojisServiceRes = {
   foodDrink: TEmoji[]
   activity: TEmoji[]
   travelPlaces: TEmoji[]
   smileyPeople: TEmoji[]
   all: TEmoji[]
}
