import { languages } from "@/locales/languages";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";

const handleI18nRouting = createIntlMiddleware({
  locales: Object.keys(languages),
  defaultLocale: "en",
  localePrefix: "always",
});

export function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ["/((?!cdn|auth|api|_next|sitemap.xml|robots.txt|.*\\..*).*)"],
};
