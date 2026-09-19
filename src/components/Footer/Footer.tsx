"use client";
import {
  DiscordLogoIcon,
  GitHubLogoIcon,
  LinkedInLogoIcon,
  TwitterLogoIcon,
} from "@radix-ui/react-icons";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";

import { usePathname } from "next/navigation";
import { NewsletterBlock } from "@/components/Audience/Newsletter";
import { copyFor } from "@/components/Audience/copy";

export const Footer = () => {
  const t = useTranslations("global");
  const lang = useLocale();
  const path = usePathname();
  const copy = copyFor(lang);
  const showForm =
    !/\/(newsletter|admin)(\/|$)/.test(path) && !/\/blog\/[^/]+/.test(path);

  const links = [
    { label: "LinkedIn", href: t("social.linkedin"), icon: LinkedInLogoIcon },
    { label: "GitHub", href: t("social.github"), icon: GitHubLogoIcon },
    { label: "Discord", href: t("social.discord"), icon: DiscordLogoIcon },
    { label: "Twitter", href: t("social.twitter"), icon: TwitterLogoIcon },
  ];

  return (
    <footer className="border-border text-fg-muted mt-auto w-full border-t">
      {showForm && (
        <div className="mx-auto max-w-6xl px-5">
          <NewsletterBlock source="footer" />
        </div>
      )}
      <div className="mx-auto flex w-full max-w-6xl flex-row flex-wrap items-center justify-between gap-3 px-5 py-8 text-sm">
        <p className="text-fg-muted">
          © {new Date().getFullYear()} juliano sirtori
        </p>
        <nav
          aria-label={lang === "pt" ? "Comunidade" : "Community"}
          className="flex gap-5"
        >
          <Link
            className="hover:text-accent inline-flex min-h-11 items-center"
            href={`/${lang}/newsletter`}
          >
            Newsletter
          </Link>
          <Link
            className="hover:text-accent inline-flex min-h-11 items-center"
            href={`/${lang}/guestbook`}
          >
            {copy.guestbook}
          </Link>
        </nav>
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
                  className="hover:text-fg hover:bg-bg-muted inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors"
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
