import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { featureFlags } from "@/utils/featureFlag";
import { ILinkItem } from "./Header.types";
import Link from "next/link";
import { HeaderSelectLang } from "./HeaderSelectLang";

export const Header = () => {
  const t = useTranslations("global.header");

  const links = useMemo(() => {
    const about = featureFlags.ABOUT && {
      label: t("about"),
      href: "/#about",
    };

    const blog = featureFlags.BLOG && {
      label: t("blog"),
      href: "/blog",
    };

    const projects = featureFlags.PROJECTS && {
      label: t("projects"),
      href: "/projects",
    };

    const contact = featureFlags.CONTACTS && {
      label: t("contact"),
      href: "/#contact",
    };

    return [blog, about, projects, contact].filter(
      (item) => !!item,
    ) as ILinkItem[];
  }, [t]);

  return (
    <header className=" absolute top-0 z-10 flex min-h-[60px] w-full flex-row flex-wrap items-center justify-between px-5 text-sm">
      <Link href="/" className="font-extrabold text-primary">
        JS
      </Link>
      <nav className=" text-secondary ">
        <ul className=" flex flex-row justify-center">
          {links.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="p-5 uppercase">
                <span>{link.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div>
        <HeaderSelectLang />
      </div>
    </header>
  );
};
