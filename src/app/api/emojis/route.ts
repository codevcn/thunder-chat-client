import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import { HttpStatusCode } from "axios"
import type { TGetEmojiFile, TGetEmojisErrRes, TGetEmojisRes } from "../types"

const publicDir = path.join(process.cwd(), "public")

const getEmojiFiles = async (dirname: string): Promise<TGetEmojiFile[]> => {
   const dirPath = path.join(publicDir, "emojis", dirname)
   const files = await fs.readdir(dirPath)
   return files.map((file) => ({
      name: file,
      path: `/emojis/${dirname}/${file}`,
   }))
}

export async function GET(): Promise<NextResponse<TGetEmojisRes> | NextResponse<TGetEmojisErrRes>> {
   try {
      const foodDrinkEmojis = await getEmojiFiles("food-drink")
      const activityEmojis = await getEmojiFiles("activity")
      const travelPlacesEmojis = await getEmojiFiles("travel-places")
      const smileyPeopleEmojis = await getEmojiFiles("smiley-people")

      return NextResponse.json<TGetEmojisRes>({
         foodDrink: foodDrinkEmojis,
         activity: activityEmojis,
         travelPlaces: travelPlacesEmojis,
         smileyPeople: smileyPeopleEmojis,
         all: [...smileyPeopleEmojis, ...foodDrinkEmojis, ...foodDrinkEmojis, ...activityEmojis],
      })
   } catch (error) {
      return NextResponse.json<TGetEmojisErrRes>(
         { error: "Failed to load emojis" },
         { status: HttpStatusCode.InternalServerError }
      )
   }
}
