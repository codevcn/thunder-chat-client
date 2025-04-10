type TIconButtonProps = {
   children: React.JSX.Element
   className?: string
   onClick?: (e: React.MouseEvent<HTMLDivElement>) => void
   title?: string
}

export const IconButton = ({ children, className, onClick, title }: TIconButtonProps) => {
   return (
      <div
         className={`${className || ""} p-1.5 transition duration-200 hover:bg-regular-icon-btn-cl cursor-pointer rounded-full`}
         title={title || ""}
         onClick={onClick}
      >
         {children}
      </div>
   )
}
