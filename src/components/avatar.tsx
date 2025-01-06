import { Avatar } from "antd"
import { UserOutlined } from "@ant-design/icons"
import { JSX } from "react"

type TCustomAvatarProps = Partial<{
   avatarSrc: string | null
   avatarIcon: JSX.Element | null
   size: number
   className: string
}>

export const CustomAvatar = ({ avatarIcon, avatarSrc, className, size }: TCustomAvatarProps) => {
   return (
      <Avatar
         {...(avatarSrc ? { src: avatarSrc } : { icon: avatarIcon || <UserOutlined /> })}
         size={size || 45}
         className={`align-middle ${className}`}
      />
   )
}
