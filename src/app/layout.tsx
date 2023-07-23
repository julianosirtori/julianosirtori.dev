import { ReactNode } from 'react';
import './globals.css';

type RootLayoutProps = { children: ReactNode };

export default function RootLayout({ children }: RootLayoutProps) {
  return children;
}