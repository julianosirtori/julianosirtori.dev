import Image from 'next/image'
import { getDictionary } from '@/app/[lang]/dictionaries'
import { Locale } from '@/config/i18n-config'
import Link from 'next/link'

interface HomeProps {
  params: {
    lang: Locale
  }
}

const links = [
  { href: 'https://twitter.com/julianosirtori', label: 'Twitter' },
  { href: 'https://instagram.com/julianosirtori', label: 'Instagram' },
  { href: 'https://www.linkedin.com/in/juliano-sirtori/', label: 'LinkedIn' },
  { href: 'https://dev.to/julianosirtori', label: 'Dev.to' },
]

export default async function Home({ params: { lang } }: HomeProps) {
  const dict = await getDictionary(lang);

  return (
    <div className='flex justify-center items-center h-screen w-full bg-bgPrimary'>
      <main className='w-[390px] px-8'>
        <Image src="/images/juliano.jpg" width={150} height={150} alt="A man with smiling"
          className="border border-8 border-primary rounded-full mb-8" />
        <h1 className='text-3xl font-bold text-primary'>{dict.title}</h1>
        <h1 className='text-xl mb:text-3xl  text-primary mb-8'>{dict.subTitle}</h1>
        <ul>
          {links.map(({ href, label }) => (
            <li key={href} className='text-primary underline text-xl mb-1'>
              <Link href={href} target='_blank'>
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
