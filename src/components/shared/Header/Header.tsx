'use client'
import useIsMobile from "@/utils/useIsMobile"

import { useMemo } from "react"

import { HeaderMobile } from './HeaderMobile'
import { HeaderDesktop } from "./HeaderDesktop"

export const Header = () => {
  const isMobile = useIsMobile()

  const links = useMemo(() => {
    return [
      {
        label: 'home',
        href: '/'
      },
      {
        label: 'projects',
        href: '/projects'
      },
      {
        label: 'about-me',
        href: '/about'
      },
      {
        label: 'blog',
        href: '/contact'
      },
    ]
  }, [])

  if (isMobile) {
    return <HeaderMobile links={links} />
  }

  return (
    <HeaderDesktop links={links} />
  )
}