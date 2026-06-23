/*
 * Hand-authored Claude Design bundle entry for julianosirtori.dev.
 *
 * This repo is a Next.js application, not a packaged component library, so
 * there is no dist/ to bundle. design-sync builds window.JulianoDS from this
 * file: it re-exports the site's presentational components and a
 * PreviewProvider that supplies the next-intl messages and next-themes context
 * the components read, so preview cards render styled instead of crashing on a
 * missing provider.
 *
 * Keep the export list in sync with componentSrcMap in .design-sync/config.json
 * (same names). Re-sync rebuilds from this file.
 */
// Must be first: defines globalThis.process before any bundled module evaluates.
import "./ds-polyfills";
import type { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// next-intl messages (English). Each locale JSON is one namespace, matching
// useTranslations("global"), useTranslations("contacts.email"), etc.
import global from "@/locales/en/global.json";
import home from "@/locales/en/home.json";
import about from "@/locales/en/about.json";
import contacts from "@/locales/en/contacts.json";
import blog from "@/locales/en/blog.json";
import projects from "@/locales/en/projects.json";
import guestbook from "@/locales/en/guestbook.json";
import now from "@/locales/en/now.json";
import playground from "@/locales/en/playground.json";

const messages = {
  global,
  home,
  about,
  contacts,
  blog,
  projects,
  guestbook,
  now,
  playground,
};

export function PreviewProvider({ children }: { children: ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
    >
      <NextIntlClientProvider locale="en" messages={messages} timeZone="UTC">
        {children}
      </NextIntlClientProvider>
    </NextThemesProvider>
  );
}

// ── component re-exports (window.JulianoDS.*) ───────────────────────────────
// Barrel folders are imported via /index so the esbuild paths plugin resolves a
// file (a bare directory path is unreadable). Folders without an index.ts are
// imported from their component file directly.
export { BackToTop } from "@/components/BackToTop/index";
export { BlogSearch } from "@/components/BlogSearch/index";
export { ButtonTapToStart } from "@/components/ButtonTapToStart/index";
export { CodeBlock } from "@/components/CodeBlock/index";
export { CommandBar, useCommandBar } from "@/components/CommandBar/index";
export { Comments } from "@/components/Comments/Comments";
export { ContactForm } from "@/components/ContactForm/index";
export { CopyCodeButton } from "@/components/CopyCodeButton/index";
export { FeaturedProjects } from "@/components/FeaturedProjects/index";
export { Footer } from "@/components/Footer/Footer";
export { Guestbook } from "@/components/Guestbook/index";
export { Header } from "@/components/Header/Header";
export { LatestPosts } from "@/components/LatestPosts/index";
export { Mdx } from "@/components/Mdx/index";
export { PostNavigation } from "@/components/PostNavigation/index";
export { ProjectCard } from "@/components/ProjectCard/index";
export { Reactions } from "@/components/Reactions/index";
export { ReadingProgress } from "@/components/ReadingProgress/index";
export { RelatedPosts } from "@/components/RelatedPosts/index";
export { TableOfContents } from "@/components/TableOfContents/index";
export { TechStack } from "@/components/TechStack/index";
export { Terminal } from "@/components/Terminal/index";
export { ThemeToggle } from "@/components/ThemeToggle/index";
// Exported for the conventions header's wrap guidance (no card; not in componentSrcMap).
export { ThemeProvider } from "@/components/ThemeProvider/index";
export { Toast } from "@/components/Toast/index";
export { default as TemplateEmail } from "@/components/TemplateEmail/TemplateEmail";

// MDX presentational components (sub-exports of the Mdx folder).
export { Callout } from "@/components/Mdx/Callout";
export { Aside } from "@/components/Mdx/Aside";
export { Quote } from "@/components/Mdx/Quote";
export { Figure } from "@/components/Mdx/Figure";
