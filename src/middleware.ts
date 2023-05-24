/** 
 * For more information about internationalized routing, see:
 * https://nextjs.org/docs/app/building-your-application/routing/internationalization
 */
import { NextRequest, NextResponse } from "next/server"

import { i18n } from '@/config/i18n-config'
import { getLocale } from "@/utils/getLocale.server"

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // Redirect if there is no locale
  if (pathnameIsMissingLocale) {

    const language = request.headers.get('accept-language');
    const locale = getLocale(language)
    // e.g. incoming request is /products
    // The new URL is now /en-US/products
    return NextResponse.redirect(
      new URL(`/${locale}/${pathname}`, request.url)
    )
  }
}
 
export const config = {
 // Matcher ignoring `/_next/` and `/api/`
  matcher: ['/((?!api|_next|image|favicon.ico).*)'],
}