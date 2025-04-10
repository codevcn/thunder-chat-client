import React, { useState, useRef, useCallback } from "react"

const AutoResizeTextField: React.FC = () => {
   const [text, setText] = useState<string>("")
   const textRef = useRef<HTMLDivElement | null>(null)

   // Đặt con trỏ vào cuối nội dung của contenteditable
   const setCaretToEnd = () => {
      if (!textRef.current) return

      const selection = window.getSelection()
      if (!selection) return

      const range = document.createRange()
      const content = textRef.current

      // Nếu nội dung trống, thêm một khoảng trắng (\u00A0) để giữ con trỏ
      if (content.innerText.trim() === "") {
         content.innerHTML = "<br>"
      }

      // Đặt con trỏ vào cuối nội dung
      range.selectNodeContents(content)
      range.collapse(false) // Đặt con trỏ ở cuối

      selection.removeAllRanges()
      selection.addRange(range)
   }

   // Xử lý sự kiện khi nội dung thay đổi
   const handleChange = useCallback(() => {
      if (textRef.current) {
         const content = textRef.current.innerText.trim()
         setText(content)

         // Kiểm tra nếu nội dung trống, thêm placeholder và đặt con trỏ
         if (content === "") {
            textRef.current.innerHTML = "<br>" // Thêm thẻ <br> để giữ con trỏ
            setCaretToEnd() // Đặt con trỏ vào cuối
         }
      }
   }, [])

   // Xử lý sự kiện khi nhấn phím
   const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter") {
         if (event.shiftKey) {
            // Shift + Enter: Tạo dòng mới bằng cách chèn <br>
            event.preventDefault()
            insertLineBreak()
         } else {
            // Chỉ Enter: Ngăn hành vi mặc định và xử lý riêng nếu cần
            event.preventDefault()
            console.log("Enter pressed without shift")
         }
      }
   }, [])

   // Chèn dòng mới (<br>) vào vị trí con trỏ hiện tại
   const insertLineBreak = () => {
      if (!textRef.current) return

      const selection = window.getSelection()
      if (!selection || !selection.rangeCount) return

      const range = selection.getRangeAt(0) // Lấy phạm vi chọn hiện tại
      const br = document.createElement("br") // Tạo thẻ <br>

      // Chèn thẻ <br> vào vị trí con trỏ
      range.deleteContents() // Xóa nội dung được chọn (nếu có)
      range.insertNode(br) // Chèn thẻ <br>

      // Thêm một khoảng trống (space) sau thẻ <br> để tránh lỗi hiển thị trên một số trình duyệt
      const space = document.createTextNode("\u00A0") // Non-breaking space
      range.insertNode(space)

      // Di chuyển con trỏ sau thẻ <br>
      const newRange = document.createRange()
      newRange.setStartAfter(space)
      newRange.collapse(true)

      // Cập nhật lựa chọn
      selection.removeAllRanges()
      selection.addRange(newRange)
   }

   // Điều chỉnh chiều cao tự động
   const adjustHeight = useCallback(() => {
      if (textRef.current) {
         const div = textRef.current
         div.style.height = "auto" // Đặt lại chiều cao để tính toán chính xác
         div.style.height = `${Math.min(div.scrollHeight, 200)}px` // Giới hạn max-height là 200px
      }
   }, [])

   return (
      <div
         ref={textRef}
         contentEditable
         onInput={handleChange}
         onKeyDown={handleKeyDown}
         onKeyUp={adjustHeight} // Điều chỉnh chiều cao sau mỗi lần nhập
         style={{
            width: "100%",
            minHeight: "56px", // Chiều cao khởi tạo
            maxHeight: "200px", // Chiều cao tối đa
            overflowY: "auto", // Hiển thị thanh cuộn khi vượt quá maxHeight
            border: "1px solid #ccc",
            padding: "8px",
            boxSizing: "border-box",
            outline: "none",
            whiteSpace: "pre-wrap", // Cho phép xuống dòng tự nhiên
            wordWrap: "break-word", // Ngắt từ khi cần thiết
         }}
      />
   )
}

export default AutoResizeTextField
