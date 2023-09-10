import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { featureFlags } from "@/utils/featureFlag";
import { ILinkItem } from "./Header.types";
import Link from "next/link";
import { HeaderSelectLang } from "./HeaderSelectLang";
import { HeaderKBar } from "./HeaderKbar";

export const Header = () => {
  const t = useTranslations("global.header");

  const links = useMemo(() => {
    const about = featureFlags.ABOUT && {
      label: t("about"),
      href: "/about",
    };

    const blog = featureFlags.BLOG && {
      label: t("blog"),
      href: "/blog",
    };

    const projects = featureFlags.PROJECTS && {
      label: t("projects"),
      href: "/projects",
    };

    return [blog, about, projects].filter((item) => !!item) as ILinkItem[];
  }, [t]);

  return (
    <header className=" absolute top-0 z-10 order-1 mt-3 flex min-h-[60px] w-full flex-row flex-wrap items-center justify-between  text-sm">
      <Link href="/" className="pl-5 text-lg font-extrabold text-primary">
        JS
      </Link>
      <nav className=" order-3  mt-4 flex-1 text-secondary min-[450px]:order-2 min-[450px]:mt-0">
        <ul className=" flex flex-row justify-center min-[450px]:gap-4 ">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="appearance-none rounded-lg border-none px-5 py-3 uppercase duration-500 hover:bg-hover hover:text-white"
              >
                <span className="text-xs">{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="order-2 flex flex-row gap-2 pr-5 min-[450px]:order-3">
        <HeaderSelectLang />
        <HeaderKBar />
      </div>
    </header>
  );
};
