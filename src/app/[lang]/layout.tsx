import { Analytics } from '@vercel/analytics/react';

import { useLocale } from 'next-intl';
import { notFound } from 'next/navigation';

import { Header } from "@/components/molecules/Header";
import { Footer } from "@/components/molecules/Footer";
import { Icon } from "@/components/atoms/Icon";

interface BlogRootLayoutProps {
  children: React.ReactNode,
  params: {
    lang: string,
  }
}

export default async function BlogRootLayout({ children, params }: BlogRootLayoutProps) {
  const locale = useLocale();

  // Show a 404 error if the user requests an unknown locale
  if (params.lang !== locale) {
    notFound();
  }

  return (
    <html>
      <body className='bg-background'>
        <Header />
        <main>
          <div className="absolute hidden top-0 left-4 flex-col gap-2 justify-center items-center lg:flex">
            <div className="w-[1px] h-36 bg-gray" />
            <a href="https://github.com/julianosirtori/julianosirtori.dev" target="_blank">
              <Icon name="IconGithub" />
            </a>
            <a href="https://discordapp.com/users/juliano_sirtori" target="_blank">
              <Icon name="IconDiscord" />
            </a>
            <a href="https://www.linkedin.com/in/juliano-sirtori/" target="_blank">
              <Icon name="IconLinkedin" />
            </a>
          </div>
          {children}
        </main>
        <Footer />
        <Analytics />
      </body>
    </html>
  )
}
