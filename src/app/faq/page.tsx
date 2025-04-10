"use client"

import React, { useState, useRef, useEffect } from "react"
import "./popover.css" // File CSS tùy chỉnh

function CustomPopover() {
   const [isOpen, setIsOpen] = useState(false)
   const buttonRef = useRef<HTMLButtonElement>(null)
   const popoverRef = useRef<HTMLDivElement>(null)

   const togglePopover = () => {
      setIsOpen(!isOpen)
   }

   const calculatePosition = () => {
      if (buttonRef.current && popoverRef.current) {
         const buttonRect = buttonRef.current.getBoundingClientRect()
         const popoverRect = popoverRef.current.getBoundingClientRect()
         const windowWidth = window.innerWidth
         const windowHeight = window.innerHeight

         let top = buttonRect.bottom // Mặc định: dưới button
         let left = buttonRect.left // Mặc định: căn trái với button

         // Điều chỉnh nếu vượt mép phải
         if (left + popoverRect.width > windowWidth) {
            left = buttonRect.right - popoverRect.width
         }
         // Điều chỉnh nếu vượt mép trái
         if (left < 0) {
            left = 0
         }
         // Điều chỉnh nếu vượt mép dưới
         if (top + popoverRect.height > windowHeight) {
            top = buttonRect.top - popoverRect.height // Chuyển lên trên button
         }

         return { top, left }
      }
      return { top: 0, left: 0 }
   }

   useEffect(() => {
      if (isOpen) {
         const { top, left } = calculatePosition()
         popoverRef.current!.style.top = `${top}px`
         popoverRef.current!.style.left = `${left}px`
      }
   }, [isOpen])

   return (
      <div className="flex justify-end bg-pink-200 p-4">
         <button
            ref={buttonRef}
            onClick={togglePopover}
            style={{ margin: "0 0 0 5px" }} // Giả sử sát mép trái
            className="w-fit bg-black"
         >
            Toggle Popover
         </button>
         {isOpen && (
            <div ref={popoverRef} className="popover">
               <div className="popover-content">
                  Đây là nội dung của popover
                  <button onClick={togglePopover}>Đóng</button>
               </div>
            </div>
         )}
      </div>
   )
}

export default CustomPopover
