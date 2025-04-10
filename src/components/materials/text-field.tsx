type TTextFieldProps = Partial<{
   type: React.HTMLInputTypeAttribute
   classNames: Partial<{ wrapper: string; input: string }>
   name: string
   inputId: string
   suffixIcon: React.ReactNode
   prefixIcon: React.ReactNode
   placeholder: string
   onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
   onPressEnter: (e: React.KeyboardEvent<HTMLInputElement>) => void
   ref: React.RefObject<HTMLInputElement | null>
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
}: TTextFieldProps) => {
   const catchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (onPressEnter) {
         if (e.key === "Enter") {
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
         <div className="absolute right-1 top-1/2 -translate-y-1/2">{prefixIcon}</div>
      </div>
   )
}
