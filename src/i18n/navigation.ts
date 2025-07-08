import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// Lightweight wrappers around Next.js' navigation
// APIs that consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

export const languages = {
  en: {
    native: "English",
    flag: "gb",
  },
  pt: {
    native: "Português (Brasil)",
    flag: "pt-br",
  },
} satisfies Record<
  string,
  {
    native: string;
    flag: string;
  }
>;
