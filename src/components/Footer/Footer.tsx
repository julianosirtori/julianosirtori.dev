import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { useTranslations } from "next-intl";
import Link from "next/link";

export const Footer = () => {
  const t = useTranslations("global");

  const links = [
    {
      label: "LinkedIn",
      href: t("social.linkedin"),
      icon: <LinkedInLogoIcon className="h-6 w-6 text-primary" />,
    },
    {
      label: "Github",
      href: t("social.github"),
      icon: <GitHubLogoIcon className="h-6 w-6 text-primary" />,
    },
    {
      label: "Discord",
      href: t("social.discord"),
      icon: <DiscordLogoIcon className="h-6 w-6 text-primary" />,
    },
    {
      label: "Twitter",
      href: t("social.twitter"),
      icon: <TwitterLogoIcon className="h-6 w-6 text-primary" />,
    },
  ];

  return (
    <footer className=" flex w-full justify-center px-5 text-sm font-medium text-secondary ">
      {links.map((link) => (
        <Link
          href={link.href}
          key={link.href}
          target="_blank"
          className="flex flex-row  items-center gap-2 p-5 text-secondary hover:text-primary sm:w-[130px] sm:[&>i]:hidden sm:[&>i]:hover:block"
        >
          <span className="hidden h-6 sm:block">{link.label}</span>
          <i>{link.icon}</i>
        </Link>
      ))}
    </footer>
  );
};
