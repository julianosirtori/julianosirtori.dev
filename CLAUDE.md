# CLAUDE.md - AI Assistant Guide for julianosirtori.dev

This document provides comprehensive guidance for AI assistants working with this codebase.

## Project Overview

**julianosirtori.dev** is a personal blog and portfolio website for Juliano Sirtori, a Front-end Developer. It's a modern Next.js 14 application featuring:

- Bilingual support (English and Portuguese)
- MDX-based blog with 22 articles
- Project showcases
- Contact form with email integration
- Command palette navigation (Cmd+K)

## Tech Stack

| Category | Technology |
|----------|------------|
| Framework | Next.js 14.2.4 (App Router) |
| Language | TypeScript 5.0.4 |
| UI Library | React 18.3.1 |
| Styling | Tailwind CSS 3.3.2 |
| Content | Contentlayer + MDX |
| i18n | next-intl 3.15.2 |
| Email | Resend + React Email |
| Animations | Framer Motion |
| Testing | Vitest + Testing Library |
| Package Manager | pnpm |
| Node Version | 20.9.0 (see .nvmrc) |

## Quick Commands

```bash
pnpm dev      # Start development server (localhost:3000)
pnpm build    # Create production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
pnpm test     # Run Vitest tests
```

## Project Structure

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [lang]/             # Localized pages (en, pt)
│   │   │   ├── page.tsx        # Home page
│   │   │   ├── about/          # About page
│   │   │   ├── blog/           # Blog listing + [slug] posts
│   │   │   ├── contact/        # Contact form page
│   │   │   ├── projects/       # Projects showcase
│   │   │   └── layout.tsx      # Localized layout
│   │   ├── api/email/          # Email API route
│   │   ├── fonts/              # Custom fonts
│   │   ├── layout.tsx          # Root layout
│   │   ├── sitemap.ts          # Sitemap generation
│   │   └── robots.ts           # Robots.txt generation
│   ├── components/             # Reusable React components
│   ├── locales/                # i18n translations (en/, pt/)
│   ├── utils/                  # Utility functions
│   ├── data/                   # Static data (projects, experiences)
│   ├── common/                 # Shared constants and types
│   └── middleware.ts           # i18n routing middleware
├── content/                    # Blog articles in MDX
│   ├── en/                     # English articles (11)
│   └── pt/                     # Portuguese articles (11)
├── public/                     # Static assets
├── __tests__/                  # Test files
└── .husky/                     # Git hooks (pre-commit)
```

## Code Conventions

### Component Structure

Components follow a modular folder structure:
```
src/components/ComponentName/
├── ComponentName.tsx      # Main component
├── ComponentName.types.ts # Type definitions (if needed)
└── index.ts               # Re-export for clean imports
```

**Import pattern:**
```typescript
import { ComponentName } from "@/components/ComponentName"
```

### Naming Conventions

- **Components**: PascalCase (`Header`, `ContactForm`, `CommandBar`)
- **Functions/Variables**: camelCase
- **Constants**: UPPERCASE (`LOCALES`)
- **Type Interfaces**: Prefix with `I` or suffix with `Props` (`IPostProps`, `CommandBarProps`)

### Client vs Server Components

- **Server Components** (default): Pages, layouts, data-fetching components
- **Client Components**: Use `"use client"` directive for interactivity (forms, animations, kbar)

### Path Aliases

```typescript
import { something } from "@/components/..."     // → ./src/...
import { Post } from "contentlayer/generated"    // → ./.contentlayer/generated
```

### Styling

- **Primary**: Tailwind CSS utility classes
- **Theme**: CSS variables for colors (see `tailwind.config.ts`)
- **Responsive**: Mobile-first with breakpoints (`min-[480px]:`, `sm:`, `lg:`)
- **Dark mode**: Built-in with custom Dracula-inspired palette

## Internationalization (i18n)

### Supported Languages

- **English (en)** - Default
- **Portuguese (pt)** - Brazilian Portuguese

### URL Structure

```
/{lang}/{page}
/en/blog           # English blog
/pt/blog           # Portuguese blog
/en/blog/my-post   # English blog post
```

### Using Translations

```typescript
import { useTranslations } from "next-intl";

export function Component() {
  const t = useTranslations("scope"); // scope = home, blog, about, etc.
  return <p>{t("key")}</p>;
}
```

### Translation Files

```
src/locales/
├── en/
│   ├── global.json    # Header, footer, shared
│   ├── home.json
│   ├── blog.json
│   ├── about.json
│   ├── projects.json
│   └── contacts.json
└── pt/ (same structure)
```

## Blog Content (Contentlayer)

### Article Location

```
content/
├── en/article-slug.mdx
└── pt/article-slug.mdx
```

### Frontmatter Schema

```yaml
title: "Article Title"
date: 2023-09-25
description: "Article description"
categories: [category1, category2]
meta:
  keywords: [keyword1, keyword2]
bannerCloudinaryId: "cloudinary-id" # or "unsplash/photo-id"
bannerCredit: "Photo by Author"
bannerAlt: "Image alt text"
draft: false # Set true to hide
```

### Computed Fields

Contentlayer automatically generates:
- `slug`: From file path
- `language`: From parent directory (en/pt)
- `url`: Full URL path
- `urlImage`: Resolved image URL (Cloudinary/Unsplash)
- `readTime`: Word count / 200 wpm

## API Routes

### Email Endpoint

`POST /api/email`

Sends contact form emails via Resend. Uses React Email templates.

## Environment Variables

Required environment variables:

```env
NEXT_PUBLIC_LOCAL_DOMAIN=https://julianosirtori.dev  # For sitemap/robots
RESEND_API_KEY=re_xxxxxxxxx                           # Resend email API
```

## Git Workflow

### Pre-commit Hooks

Husky runs on every commit:
1. `lint-staged` - ESLint + Prettier on staged files
2. `pnpm test` - Runs all tests

### Commit Guidelines

- Keep commits focused and atomic
- Use conventional commit messages when appropriate

## Testing

### Framework

Vitest with React Testing Library and jsdom environment.

### Running Tests

```bash
pnpm test          # Run all tests
pnpm test --watch  # Watch mode
```

### Test Location

Tests live in `__tests__/` directory.

## Key Dependencies

### Content Processing

- `contentlayer`: MDX to JSON pipeline
- `rehype-pretty-code`: Syntax highlighting (Dracula theme)
- `rehype-slug`: Auto heading IDs
- `rehype-autolink-headings`: Clickable heading links
- `remark-gfm`: GitHub Flavored Markdown

### UI Components

- `@radix-ui/react-*`: Accessible primitives (Select, Toast)
- `kbar`: Command palette
- `framer-motion`: Animations
- `@giscus/react`: GitHub-based comments

### Analytics

- `@vercel/analytics`: Page views
- `@vercel/speed-insights`: Performance metrics
- Google Analytics (G-VNFLVEVSCC)

## Common Tasks

### Adding a New Blog Post

1. Create MDX file in `content/{lang}/post-slug.mdx`
2. Add required frontmatter (title, date, description, etc.)
3. Write content in MDX format
4. Run `pnpm dev` to see it locally

### Adding a New Page

1. Create folder in `src/app/[lang]/page-name/`
2. Add `page.tsx` with component
3. Use `generateStaticParams()` for static generation
4. Add translations to `src/locales/{lang}/`
5. Update navigation if needed

### Adding a New Component

1. Create folder in `src/components/ComponentName/`
2. Add `ComponentName.tsx` and `index.ts`
3. Add types in `ComponentName.types.ts` if complex
4. Use `"use client"` if client-side interactivity needed

### Updating Translations

1. Edit JSON files in `src/locales/{lang}/`
2. Use same keys across all language files
3. Access via `useTranslations("scope")`

## Important Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js + Contentlayer + i18n config |
| `tailwind.config.ts` | Tailwind theme and plugins |
| `contentlayer.config.js` | Blog content schema and processing |
| `src/middleware.ts` | i18n routing middleware |
| `src/locales/config.ts` | i18n configuration |

## Notes for AI Assistants

1. **Always use pnpm** - This project uses pnpm as the package manager
2. **Check both languages** - When modifying content/translations, update both en and pt
3. **Respect TypeScript strict mode** - The project uses strict type checking
4. **Follow existing patterns** - Match component structure and naming conventions
5. **Run tests** - Always run `pnpm test` after making changes
6. **Contentlayer regeneration** - After modifying MDX files, Contentlayer rebuilds on `pnpm dev`
7. **Tailwind classes** - Use existing design tokens from `tailwind.config.ts`
