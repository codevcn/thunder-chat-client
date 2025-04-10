"use client"

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "@/lib/utils"

const Avatar = React.forwardRef<
   React.ElementRef<typeof AvatarPrimitive.Root>,
   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
   <AvatarPrimitive.Root
      ref={ref}
      className={cn("relative flex shrink-0 overflow-hidden rounded-full", className)}
      {...props}
   />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

const AvatarImage = React.forwardRef<
   React.ElementRef<typeof AvatarPrimitive.Image>,
   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
   <AvatarPrimitive.Image
      ref={ref}
      className={cn("aspect-square h-full w-full", className)}
      {...props}
   />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

const AvatarFallback = React.forwardRef<
   React.ElementRef<typeof AvatarPrimitive.Fallback>,
   React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
   <AvatarPrimitive.Fallback
      ref={ref}
      className={cn("flex h-full w-full items-center justify-center rounded-full", className)}
      {...props}
   />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

type TCustomAvatarProps = Partial<{
   src: string
   alt: string
   imgSize: number
   fallback: React.ReactNode
   className: string
   imageClassName: string
   fallbackClassName: string
}>

const CustomAvatar = ({
   src,
   alt,
   imgSize,
   fallback,
   className,
   fallbackClassName,
   imageClassName,
}: TCustomAvatarProps) => {
   return (
      <Avatar className={className} style={{ width: imgSize, height: imgSize }}>
         <AvatarImage
            src={src}
            alt={alt}
            style={{ width: imgSize, height: imgSize }}
            className={imageClassName}
         />
         <AvatarFallback style={{ width: imgSize, height: imgSize }} className={fallbackClassName}>
            {fallback}
         </AvatarFallback>
      </Avatar>
   )
}

export { CustomAvatar }
