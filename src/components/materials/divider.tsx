type TDividerProps = Partial<{
   height: number
   textContent: string
   className: string
}>

export const Divider = ({ height, textContent, className }: TDividerProps) => {
   return (
      <div
         className={`${className || ""} w-full relative bg-regular-divider-cl`}
         style={{ height: height || "1px" }}
      >
         {textContent && <span>{textContent}</span>}
      </div>
   )
}
