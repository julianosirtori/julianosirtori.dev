import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { Link } from "@/locales/navigation";
import { HeaderSelectLang } from "./HeaderSelectLang";
import { HeaderKBar } from "./HeaderKbar";
import { HeaderItemWrapper } from "./HeaderItemWrapper";
import { ThemeToggle } from "@/components/ThemeToggle";

export const Header = () => {
  const t = useTranslations("global.header");

  const links = useMemo(() => {
    return [
      { label: t("about"), href: "/about" },
      { label: t("blog"), href: "/blog" },
      { label: t("projects"), href: "/projects" },
    ];
  }, [t]);

  return (
    <header className="border-border bg-bg/80 sticky top-0 z-10 flex w-full flex-row flex-wrap items-center justify-between border-b backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-6xl flex-row flex-wrap items-center justify-between px-5 py-4">
        <Link
          href="/"
          className="text-fg hover:text-accent text-base font-medium tracking-tight transition-colors"
          aria-label="juliano sirtori, home"
        >
          <span className="hidden sm:inline">juliano sirtori.</span>
          <span className="sm:hidden">js.</span>
        </Link>

        <nav className="order-3 mt-3 w-full sm:order-2 sm:mt-0 sm:w-auto">
          <ul className="text-fg-muted flex flex-row justify-center gap-1 text-sm sm:gap-2">
            {links.map((link) => (
              <HeaderItemWrapper key={link.label} href={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-fg hover:bg-bg-muted inline-block rounded-md px-3 py-2 transition-colors"
                >
                  {link.label}
                </Link>
              </HeaderItemWrapper>
            ))}
          </ul>
        </nav>

        <div className="order-2 flex flex-row items-center gap-2 sm:order-3">
          <Link
            target="_blank"
            href="https://cv.julianosirtori.dev/"
            className="text-fg-muted hover:text-fg text-sm transition-colors"
          >
            CV
          </Link>
          <HeaderSelectLang />
          <ThemeToggle />
          <HeaderKBar />
        </div>
      </div>
    </header>
  );
};
