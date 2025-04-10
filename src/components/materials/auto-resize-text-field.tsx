import { useEffect } from "react"

type AutoResizeTextFieldProps = {
   textFieldRef: React.RefObject<HTMLDivElement | null>
} & Partial<{
   onContentChange: (textContent: string) => void
   onEnterPress: (textContent: string) => void
   initialValue: string
   placeholder: string
   maxHeight: number
   minHeight: number
   className: string
   id: string
   style: React.CSSProperties
   lineHeight: number
   onBlur: () => void
   initialHeight:number
}>

export const AutoResizeTextField: React.FC<AutoResizeTextFieldProps> = ({
   onContentChange,
   onEnterPress,
   initialValue = "",
   placeholder = "Type something...",
   maxHeight = 300,
   minHeight,
   className,
   id,
   style,
   lineHeight = 1.5,
   onBlur,
   textFieldRef,
   initialHeight,
}) => {
   const setTextFieldContent = (textContent: string, textFieldEle?: HTMLDivElement) => {
      if (textFieldEle) {
         textFieldEle.innerText = textContent
      }
   }

   // Khởi tạo giá trị ban đầu và chiều cao
   useEffect(() => {
      const textFieldEle = textFieldRef.current
      if (textFieldEle) {
         setTextFieldContent(initialValue, textFieldEle)
         adjustHeight()
      }
   }, [])

   // Điều chỉnh chiều cao dựa trên nội dung
   const adjustHeight = () => {
      setTimeout(() => {
         const textFieldEle = textFieldRef.current
         if (textFieldEle) {
            textFieldEle.style.height = "auto"
            const newHeight = Math.min(
               Math.max(textFieldEle.scrollHeight, lineHeight * 14),
               maxHeight
            )
            textFieldEle.style.height = `${newHeight}px`
            // Thêm thanh cuộn khi vượt quá maxHeight
            textFieldEle.style.overflowY = textFieldEle.scrollHeight > maxHeight ? "auto" : "hidden"
         }
      }, 0)
   }

   // Xử lý khi nhập liệu
   const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      const textFieldEle = e.currentTarget
      const textContent = textFieldEle.innerText
      if (textContent.trim().length === 0) {
         setTextFieldContent(" ", textFieldEle) // Thêm khoảng trắng để giữ con trỏ
      }
      if (onContentChange) {
         onContentChange(textContent) // Gọi hàm khi có sự thay đổi nội dung
      }
      adjustHeight()
   }

   // Xử lý sự kiện nhấn phím
   const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter") {
         e.preventDefault()
         if (e.shiftKey) {
            document.execCommand("insertLineBreak")
            adjustHeight()
         } else {
            const textFieldEle = textFieldRef.current
            if (textFieldEle) {
               if (onEnterPress) {
                  onEnterPress(textFieldEle.innerText) // Lấy text hiện tại
               }
               setTextFieldContent(" ", textFieldEle) // Clear nội dung
               adjustHeight() // Cập nhật chiều cao về minHeight
            }
         }
      }
   }

   // Xử lý placeholder
   const handleBlur = () => {
      const textFieldEle = textFieldRef.current
      if (textFieldEle && !textFieldEle.innerText) {
         setTextFieldContent("", textFieldEle)
         if (onBlur) {
            onBlur()
         }
      }
   }

   return (
      <div
         ref={textFieldRef}
         contentEditable
         onInput={handleInput}
         onKeyDown={handleKeyDown}
         onBlur={handleBlur}
         style={{
            ...(style || {}),
            minHeight: `${minHeight}px`,
            maxHeight: `${maxHeight}px`,
            lineHeight,
            overflowY: "hidden",
            resize: "none",
            whiteSpace: "pre-wrap",
            wordWrap: "break-word",
            wordBreak: "break-all",
            height: initialHeight,
         }}
         className={className}
         data-placeholder={placeholder}
         id={id}
      ></div>
   )
}
