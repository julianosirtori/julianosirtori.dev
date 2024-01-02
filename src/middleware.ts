import { config as configI18n } from "@/locales/config";
import createIntlMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";

const handleI18nRouting = createIntlMiddleware(configI18n);

export function middleware(request: NextRequest) {
  const response = handleI18nRouting(request);
  return response;
}

export const config = {
  matcher: ["/((?!cdn|auth|api|_next|sitemap.xml|robots.txt|.*\\..*).*)"],
};
