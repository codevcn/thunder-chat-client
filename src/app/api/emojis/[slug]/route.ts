import { NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"

const getEmojiFiles = async (publicDir: string, dirname: string) => {
   const dirPath = path.join(publicDir, "emojis", dirname)
   const files = await fs.readdir(dirPath)
   return files
      .filter((file) => file.endsWith(".webp"))
      .map((file) => ({
         name: file,
         path: `/emojis/${dirname}/${file}`,
      }))
}

export async function GET() {
   const publicDir = path.join(process.cwd(), "public")

   try {
      const foodDrinkEmojis = await getEmojiFiles(publicDir, "food-drink")
      const activity = await getEmojiFiles(publicDir, "activity")
      const travelPlaces = await getEmojiFiles(publicDir, "travel-places")
      const smileyPeople = await getEmojiFiles(publicDir, "smiley-people")

      return NextResponse.json({
         foodDrink: foodDrinkEmojis,
         flags: activity,
         all: [...foodDrinkEmojis, ...activity, ...smileyPeople, ...travelPlaces],
      })
   } catch (error) {
      return NextResponse.json({ error: "Failed to load emojis" }, { status: 500 })
   }
}
