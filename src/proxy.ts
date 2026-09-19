import { routing } from "@/locales/config";
import createMiddleware from "next-intl/middleware";

export default createMiddleware(routing);

export const config = {
  matcher: ["/((?!cdn|auth|api|_next|sitemap.xml|robots.txt|.*\\..*).*)"],
};
