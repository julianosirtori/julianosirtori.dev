# julianosirtori.dev — design system conventions

This is the component library and editorial theme behind julianosirtori.dev, a bilingual
(EN/PT) Next.js personal site. The components are real, compiled React components exported on
`window.JulianoDS`. Compose them with their documented props; never reimplement them.

## Wrapping and setup

Components read three contexts. Wrap any screen built from them accordingly, outermost first:

- **Theme** — `next-themes` toggles light/dark via a `.dark` class on `<html>`. Wrap in the
  exported `ThemeProvider` (it sets `attribute="class"`, `defaultTheme="system"`). Tokens
  resolve to their light values without it, but `ThemeToggle` cannot switch the theme.
- **i18n** — `Footer`, `Header`, `ContactForm`, `CommandBar`, and `ButtonTapToStart` call
  `useTranslations` (next-intl). Wrap in `NextIntlClientProvider` with a `locale` and the
  `messages` object. Without messages those components throw on the missing key.
- **Command palette** — `Header` and `ButtonTapToStart` read `useCommandBar`. Render them
  inside `<CommandBar>`, which supplies the context and the ⌘K / Ctrl+K dialog.

```tsx
<ThemeProvider>
  <NextIntlClientProvider locale="en" messages={messages}>
    <CommandBar>
      <Header />
      <main>{/* page content */}</main>
      <Footer />
    </CommandBar>
  </NextIntlClientProvider>
</ThemeProvider>
```

## Styling idiom — Tailwind v4 semantic tokens

Style with Tailwind utility classes built on SEMANTIC tokens (declared in `globals.css`
`@theme`, re-themed under `.dark`). Reach for the semantic names below, not raw colors like
`bg-zinc-900`:

| Purpose | Classes |
|---|---|
| Surfaces | `bg-bg`, `bg-bg-elevated`, `bg-bg-muted` |
| Text | `text-fg`, `text-fg-muted`, `text-fg-subtle` |
| Borders | `border-border`, `border-border-strong` |
| Accent | `text-accent`, `bg-accent`, `bg-accent-muted` |
| Status | `text-success`, `text-warn`, `text-error` |
| Type | `font-sans` (Geist Sans), `font-mono` (Geist Mono) |

Spacing, radius, and layout use stock Tailwind utilities. The editorial look is restrained:
generous whitespace, thin `border-border` rules, rounded-lg cards, `transition-colors` on
hover, and small uppercase mono eyebrows for section labels
(`font-mono text-xs uppercase tracking-wide text-fg-subtle`). There is no `tailwind.config`;
new tokens belong in `globals.css` `@theme`.

## Where the truth lives

- `styles.css` (it imports the compiled token + component CSS) is the source of truth for
  which utility classes and token values exist. Read it before inventing a class name.
- Each component ships a `<Name>.prompt.md` with its props and intended usage. Read it before
  composing that component.

## A build snippet

```tsx
<section className="mx-auto max-w-2xl">
  <p className="mb-3 font-mono text-xs uppercase tracking-wide text-fg-subtle">Projects</p>
  <div className="flex flex-col gap-2">
    <ProjectCard title="Life in Weeks" href="#" year="2023" index={0} />
    <ProjectCard title="Pick-up Lines" href="#" year="2022" index={1} />
  </div>
</section>
```
