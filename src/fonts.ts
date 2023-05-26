import {  Space_Mono, Darker_Grotesque } from 'next/font/google'

export const SpaceMono = Space_Mono({ 
  weight: ['400', '700'], 
  style: ['normal', 'italic'], 
  subsets: ['latin'], 
  display: 'swap',
  variable: '--font-space-mono', 
})

export const DarkerGrotesque = Darker_Grotesque({ 
  weight: ['900'], 
  style: 'normal', 
  display: 'swap',
  subsets: ['latin'], 
  variable: '--font-darker-grotesque', 
})