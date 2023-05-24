import { getDictionary } from '@/app/[lang]/dictionaries'
import { Locale } from '@/config/i18n-config'
import { Home as HomePage } from '@/components/pages/Home'

interface HomeProps {
  params: {
    lang: Locale
  }
}

export default async function Home({ params: { lang } }: HomeProps) {
  const dict = await getDictionary(lang);
  return <HomePage i18n={dict.home} />
}
