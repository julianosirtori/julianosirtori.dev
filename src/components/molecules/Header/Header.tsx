'use client'
import useIsMobile from "@/utils/useIsMobile"

import { useMemo } from "react"

import { HeaderMobile } from './HeaderMobile'
import { HeaderDesktop } from "./HeaderDesktop"
import { useTranslations } from "next-intl"

export const Header = () => {
  const isMobile = useIsMobile()
  const t = useTranslations('global.header')

  const links = useMemo(() => {
    return [
      {
        label: t('about'),
        href: '/about'
      },
      {
        label: t('contact'),
        href: '/contacts'
      },
      {
        label: t('blog'),
        href: '/blog'
      }
    ]
  }, [t])

  if (isMobile) {
    return <HeaderMobile links={links} />
  }

  return (
    <HeaderDesktop links={links} />
  )
}