import { usePathname } from 'next/navigation';
import { Locale } from '@/config/i18n-config';


export function useGetLanguage(): Locale {
  const pathname = usePathname();
  const language = pathname.split('/')[1] as Locale;
  return language;
}

