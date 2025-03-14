"use client"

import { Avatar, Tooltip, Flex } from "antd"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
   faUser,
   faHouse,
   faBell,
   faGear,
   faComments,
   faUserGroup,
} from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import { memo, JSX } from "react"

type Navs = {
   label: string
   href?: string
   icon: JSX.Element
}[]

const navs: Navs = [
   {
      label: "Home",
      href: "/",
      icon: <FontAwesomeIcon icon={faHouse} />,
   },
   {
      label: "Nofication",
      icon: <FontAwesomeIcon icon={faBell} />,
   },
   {
      label: "Conversations",
      href: "/conversations",
      icon: <FontAwesomeIcon icon={faComments} />,
   },
   {
      label: "Friends",
      href: "/friends",
      icon: <FontAwesomeIcon icon={faUserGroup} />,
   },
]

export const Navigation = memo(() => {
   return (
      <div className="w-[55px] h-screen">
         <Flex
            className="fixed left-0 top-0 z-20 screen-medium-chatting:flex bg-regular-darkGray-cl border-r border-solid border-r-regular-hover-card-cl pt-6 pb-3 w-[inherit] h-[inherit] box-border"
            justify="space-between"
            vertical
            gap="middle"
         >
            <Tooltip title="Account" placement="right">
               <Link href="/account" className="flex">
                  <div className="m-auto cursor-pointer transition duration-200 hover:scale-125">
                     <Avatar icon={<FontAwesomeIcon icon={faUser} />} />
                  </div>
               </Link>
            </Tooltip>

            <Flex align="center" className="w-full" vertical>
               {navs.map(({ label, href, icon }) => (
                  <Tooltip key={label} placement="right" title={label}>
                     {href ? (
                        <Link
                           href={href}
                           className="flex w-[55px] cursor-pointer transition duration-200 hover:bg-regular-hover-card-cl py-3"
                        >
                           <div className="m-auto text-white">{icon}</div>
                        </Link>
                     ) : (
                        <div className="flex w-[55px] cursor-pointer transition duration-200 hover:bg-regular-hover-card-cl py-3">
                           <div className="m-auto">{icon}</div>
                        </div>
                     )}
                  </Tooltip>
               ))}
            </Flex>

            <Tooltip placement="right" title="Settings">
               <div className="flex w-[55px] cursor-pointer transition duration-200 hover:bg-regular-hover-card-cl py-3">
                  <div className="m-auto">
                     <FontAwesomeIcon icon={faGear} />
                  </div>
               </div>
            </Tooltip>
         </Flex>
      </div>
   )
})
