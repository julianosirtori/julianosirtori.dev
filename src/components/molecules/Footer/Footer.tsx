import { Icon } from "@/components/atoms/Icon";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = () => {
  const t = useTranslations("global");

  const links = [
    {
      label: "LinkedIn",
      href: t("social.linkedin"),
    },
    {
      label: "Github",
      href: t("social.github"),
    },
    {
      label: "Discord",
      href: t("social.discord"),
    },
    {
      label: "Twitter",
      href: t("social.twitter"),
    },
  ];

  return (
    <footer className="absolute bottom-0 flex w-full justify-center px-5 text-sm font-medium text-secondary ">
      {links.map((link) => (
        <Link href={link.href} key={link.href} className="p-5">
          <span>{link.label}</span>
        </Link>
      ))}
    </footer>
  );
};
