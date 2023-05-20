import { getDictionary } from '@/app/[lang]/dictionaries'
import { Locale } from '@/config/i18n-config'

interface Props {
  params: {
    lang: Locale
  }
}

export default async function Home({ params: { lang } }: Props) {
  const dict = await getDictionary(lang);

  return (
    <main>
      <h1>{dict.home.page1.title}</h1>
    </main>
  )
}
