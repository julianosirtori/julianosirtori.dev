import { getDictionary } from '@/app/[lang]/dictionaries'
import { Locale } from '@/config/i18n-config'
import { Header } from "@/components/Header/Header"

interface BlogRootLayoutProps {
  children: React.ReactNode,
  params: {
    lang: Locale
  }
}

export default async function BlogRootLayout({ children, params: { lang } }: BlogRootLayoutProps) {
  const dict = await getDictionary(lang);

  return (
    <>
      <Header i18n={dict.header} />
      {children}
    </>
  )
}
