// @ts-nocheck

import React, { useState } from "react"
import { ChevronDown, Check } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const Index = () => {
   const [country, setCountry] = useState("Vietnam")
   const [phoneCode, setPhoneCode] = useState("+84")
   const [keepSignedIn, setKeepSignedIn] = useState(true)

   const [isLoaded, setIsLoaded] = useState(false)

   React.useEffect(() => {
      setIsLoaded(true)
   }, [])

   return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
         <div
            className={`flex flex-col items-center max-w-md w-full transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
         >
            <div className="w-24 h-24 mb-6 rounded-full overflow-hidden bg-telegram flex items-center justify-center">
               <img
                  src="/lovable-uploads/b5ed2070-7e20-41ba-81e0-9518abcaa590.png"
                  alt="Telegram Logo"
                  className="w-24 h-24 animate-fade-in"
                  onError={(e) => {
                     const target = e.target as HTMLImageElement
                     target.src =
                        "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OCIgaGVpZ2h0PSI0OCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48cGF0aCBkPSJtMjIgMi05LjkgOS45Ii8+PHBhdGggZD0iTTIyIDIgMTUgMjIgMTAgMTMgMiA4IDIyIDIiLz48cGF0aCBkPSI1IDE5IDE1IDEyIi8+PC9zdmc+"
                     target.parentElement!.style.backgroundColor = "#2AABEE"
                  }}
               />
            </div>

            <h1 className="text-3xl font-bold text-white mb-2 animate-fade-in">Telegram</h1>

            <p className="text-center text-gray-400 mb-8 text-sm animate-fade-in">
               Please confirm your country code and enter your phone number.
            </p>

            <div className="w-full space-y-4 animate-fade-in">
               <div className="space-y-1.5">
                  <label htmlFor="country" className="text-xs text-gray-500 px-1">
                     Country
                  </label>
                  <div className="relative">
                     <select
                        id="country"
                        className="telegram-select pr-10"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                     >
                        <option value="Vietnam">Vietnam</option>
                        <option value="United States">United States</option>
                        <option value="China">China</option>
                        <option value="Japan">Japan</option>
                        <option value="Korea">Korea</option>
                        <option value="Thailand">Thailand</option>
                     </select>
                     <ChevronDown
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"
                        size={18}
                     />
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label htmlFor="phone" className="text-xs text-gray-500 px-1">
                     Your phone number
                  </label>
                  <input
                     id="phone"
                     type="tel"
                     className="telegram-input"
                     placeholder="Your phone number"
                     defaultValue={phoneCode}
                  />
               </div>

               <div className="flex items-center space-x-2 pt-2">
                  <Checkbox
                     id="keep-signed-in"
                     className="telegram-checkbox"
                     checked={keepSignedIn}
                     onCheckedChange={(checked) => setKeepSignedIn(checked as boolean)}
                  />
                  <label
                     htmlFor="keep-signed-in"
                     className="text-sm font-medium text-gray-300 cursor-pointer"
                  >
                     Keep me signed in
                  </label>
               </div>
            </div>

            <button className="qr-button">LOG IN BY QR CODE</button>
         </div>
      </div>
   )
}

export default Index
