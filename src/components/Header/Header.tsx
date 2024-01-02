import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { Link } from "@/locales/navigation";
import { HeaderSelectLang } from "./HeaderSelectLang";
import { HeaderKBar } from "./HeaderKbar";
import { HeaderItemWrapper } from "./HeaderItemWrapper";

export const Header = () => {
  const t = useTranslations("global.header");

  const links = useMemo(() => {
    return [
      {
        label: t("about"),
        href: "/about",
      },
      {
        label: t("blog"),
        href: "/blog",
      },
      {
        label: t("projects"),
        href: "/projects",
      },
    ];
  }, [t]);

  return (
    <header className=" absolute top-0 z-10 order-1 mt-3 flex min-h-[60px] w-full flex-row flex-wrap items-center justify-between text-sm">
      <Link href="/" className="pl-5 text-lg  font-bold text-primary">
        JS
      </Link>
      <nav className=" order-3  mt-4 flex-1 px-5 text-secondary min-[480px]:order-2 min-[480px]:mt-0">
        <ul className=" flex flex-row justify-center min-[480px]:gap-4 ">
          {links.map((link) => (
            <HeaderItemWrapper key={link.label} href={link.href}>
              <Link
                href={link.href}
                className="appearance-none rounded-lg border-none px-5 py-3 uppercase duration-500 hover:bg-hover hover:text-white"
              >
                <span className="text-xs tracking-widest	">{link.label}</span>
              </Link>
            </HeaderItemWrapper>
          ))}
        </ul>
      </nav>
      <div className="order-2 flex flex-row gap-2 pr-5 min-[480px]:order-3">
        <HeaderSelectLang />
        <HeaderKBar />
      </div>
    </header>
  );
};
