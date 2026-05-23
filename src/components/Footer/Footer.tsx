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
    { label: "LinkedIn", href: t("social.linkedin"), icon: LinkedInLogoIcon },
    { label: "GitHub", href: t("social.github"), icon: GitHubLogoIcon },
    { label: "Discord", href: t("social.discord"), icon: DiscordLogoIcon },
    { label: "Twitter", href: t("social.twitter"), icon: TwitterLogoIcon },
  ];

  return (
    <footer className="border-border text-fg-muted mt-auto w-full border-t">
      <div className="mx-auto flex w-full max-w-6xl flex-row flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm">
        <p className="text-fg-subtle">
          © {new Date().getFullYear()} juliano sirtori
        </p>
        <ul className="flex flex-row items-center gap-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-label={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-fg hover:bg-bg-muted inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors"
                >
                  <Icon className="h-4 w-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
};
