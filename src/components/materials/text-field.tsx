import { X } from "lucide-react"

type TTextFieldProps = Partial<{
   type: React.HTMLInputTypeAttribute
   classNames: Partial<{
      wrapper: string
      input: string
      clearIcon: string
   }>
   name: string
   inputId: string
   suffixIcon: React.ReactNode
   prefixIcon: React.ReactNode
   placeholder: string
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
   onPressEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void
   ref: React.RefObject<HTMLInputElement | null>
   onClear: (e: React.MouseEvent<HTMLElement>) => void
}>

export const TextField = ({
   type,
   classNames,
   inputId,
   name,
   suffixIcon,
   prefixIcon,
   placeholder,
   onPressEnter,
   onChange,
   ref,
   onClear,
}: TTextFieldProps) => {
   const catchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
         if (onPressEnter) {
            onPressEnter(e)
         }
      }
   }

   return (
      <div className={`${classNames?.wrapper || ""} relative`}>
         <div className="absolute left-1 top-1/2 -translate-y-1/2">{suffixIcon}</div>
         <input
            type={type || "text"}
            className={classNames?.input}
            id={inputId}
            name={name}
            placeholder={placeholder}
            onKeyDown={catchEnter}
            onChange={onChange}
            ref={ref}
         />
         <div className="absolute right-1 top-1/2 -translate-y-1/2">
            {onClear ? <X className={classNames?.clearIcon} /> : prefixIcon}
         </div>
      </div>
   )
}
