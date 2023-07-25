'use client'
import useIsMobile from "@/utils/useIsMobile"

import { HeaderMobile } from './HeaderMobile'
import { HeaderDesktop } from "./HeaderDesktop"
import { IHeaderProps, } from "./Header.types"

export const HeaderClient = ({ links }: IHeaderProps) => {
  const isMobile = useIsMobile()

  if (isMobile) {
    return <HeaderMobile links={links} />
  }

  return (
    <HeaderDesktop links={links} />
  )
}