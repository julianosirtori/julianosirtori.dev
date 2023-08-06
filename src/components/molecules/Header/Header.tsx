import { useMemo } from "react";

import { useTranslations } from "next-intl";
import { featureFlags } from "@/utils/featureFlag";
import { ILinkItem } from "./Header.types";
import { HeaderClient } from "./HeaderClient";

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

    const contact = featureFlags.CONTACTS && {
      label: t("contact"),
      href: "/#contact",
    };

    return [about, blog, contact].filter((item) => !!item) as ILinkItem[];
  }, [t]);

  return <HeaderClient links={links} />;
};
