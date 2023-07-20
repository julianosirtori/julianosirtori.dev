import { Analytics } from '@vercel/analytics/react';
import './globals.css'

export const metadata = {
  title: 'Juliano Sirtori',
  description: 'Portfolio of Juliano Sirtori, a front-end developer',
}

interface RootLayoutProps {
  children: React.ReactNode,
}


export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html>
      <body className='bg-background'>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
