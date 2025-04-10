"use client"

import React, { useState, useRef, useEffect } from "react"
import "./popover.css"

function CustomPopover() {
   const [isOpen, setIsOpen] = useState(false)
   const buttonRef = useRef<HTMLButtonElement>(null)
   const popoverRef = useRef<HTMLDivElement>(null)

   const togglePopover = () => {
      setIsOpen(!isOpen)
   }

   const detectCollisionAndAdjust = () => {
      if (buttonRef.current && popoverRef.current) {
         const buttonRect = buttonRef.current.getBoundingClientRect()
         const popoverRect = popoverRef.current.getBoundingClientRect()
         const viewportWidth = window.innerWidth
         const viewportHeight = window.innerHeight

         // Vị trí mặc định: dưới button, căn trái
         let top = buttonRect.bottom
         let left = buttonRect.left

         // Kích thước popover
         const popoverWidth = popoverRect.width
         const popoverHeight = popoverRect.height

         // Phát hiện va chạm với các cạnh
         const collision = {
            left: left < 0,
            right: left + popoverWidth > viewportWidth,
            bottom: top + popoverHeight > viewportHeight,
            top: top < 0, // Ít xảy ra với vị trí mặc định là dưới
         }

         // Điều chỉnh vị trí dựa trên va chạm
         if (collision.right) {
            left = viewportWidth - popoverWidth - 5 // Căn sát mép phải
         }
         if (collision.left) {
            left = 0 // Căn sát mép trái
         }
         if (collision.bottom) {
            top = buttonRect.top - popoverHeight // Chuyển lên trên button
         }
         if (collision.top) {
            top = 0 // Căn sát mép trên (nếu cần)
         }

         // Cập nhật vị trí popover
         popoverRef.current.style.top = `${top}px`
         popoverRef.current.style.left = `${left}px`
      }
   }

   useEffect(() => {
      if (isOpen) {
         detectCollisionAndAdjust()
      }
   }, [isOpen])

   return (
      <div className="flex justify-end bg-pink-200 p-4">
         <button
            ref={buttonRef}
            onClick={togglePopover}
            style={{ margin: "0 0 0 5px" }} // Giả sử sát mép trái
            className="bg-black"
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
