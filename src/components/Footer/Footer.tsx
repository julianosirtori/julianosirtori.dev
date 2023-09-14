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
      icon: <LinkedInLogoIcon className="h-6 w-6" />,
    },
    {
      label: "Github",
      href: t("social.github"),
      icon: <GitHubLogoIcon className="h-6 w-6" />,
    },
    {
      label: "Discord",
      href: t("social.discord"),
      icon: <DiscordLogoIcon className="h-6 w-6" />,
    },
    {
      label: "Twitter",
      href: t("social.twitter"),
      icon: <TwitterLogoIcon className="h-6 w-6" />,
    },
  ];

  return (
    <footer className=" flex w-full justify-center px-5 text-sm font-medium text-secondary ">
      {links.map((link) => (
        <Link href={link.href} key={link.href} className="p-5">
          <span className="hidden sm:block">{link.label}</span>
          <i className="sm:hidden">{link.icon}</i>
        </Link>
      ))}
    </footer>
  );
};
