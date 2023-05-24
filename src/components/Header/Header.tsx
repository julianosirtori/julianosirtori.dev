"use client"
import Link from "next/link"
import Image from "next/image"
import useIsMobile from "@/utils/useIsMobile"
import { useGetLanguage } from "@/utils/useGetLanguage"

import { Locale } from "@/config/i18n-config"
import { useMemo } from "react"
import { I18n } from "@/common/types"


export const getLinks = (locale: Locale) => ([
  { href: `/${locale}/#about-me`, labelKey: 'about' },
  { href: `/${locale}/#projects`, labelKey: 'projects' },
  { href: `/${locale}/blog`, labelKey: 'blog' },
  { href: `/${locale}/#contact`, labelKey: 'contact' },
])

interface HeaderProps extends I18n {

}


export const Header = ({ i18n }: HeaderProps) => {
  const isMobile = useIsMobile()
  const language = useGetLanguage();

  const links = useMemo(() => getLinks(language), [language])

  return (
    <header className="bg-bgPrimary text-primary flex flex-row w-full justify-evenly items-center py-4">
      <Link href={'/'}>
        <Image src="/images/simple_logo.svg" alt="" width={48} height={28} />
      </Link>
      {!isMobile && (
        <nav className="flex flex-row gap-12">
          {links.map(({ href, labelKey }) => (
            <Link key={href} href={href} className="font-mono text-center text-xl px-4 py-2 italic">{i18n[labelKey]}</Link>
          ))}
        </nav>
      )}
    </header>
  )
}