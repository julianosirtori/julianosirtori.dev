import Link from "next/link";

interface NotFoundPageProps {
  title: string;
  description: string;
  linkLabel: string;
  href: string;
}

export function NotFoundPage({
  title,
  description,
  linkLabel,
  href,
}: NotFoundPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-5 py-16 sm:py-24">
      <section className="border-border grid w-full gap-10 overflow-hidden border-y py-12 md:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] md:items-end md:py-16">
        <div aria-hidden="true">
          <p className="text-fg-subtle mb-8 font-mono text-xs tracking-[0.14em] uppercase">
            HTTP status
          </p>
          <p className="text-fg text-[clamp(7rem,24vw,15rem)] leading-[0.72] font-semibold tracking-[-0.09em]">
            404
          </p>
        </div>

        <div className="flex flex-col items-start md:pb-1">
          <h1
            id="not-found-title"
            className="text-fg text-3xl font-semibold tracking-tight text-balance sm:text-4xl"
          >
            {title}
          </h1>
          <p className="text-fg-muted mt-4 max-w-[46ch] text-base leading-relaxed">
            {description}
          </p>
          <Link
            href={href}
            className="bg-fg text-bg hover:bg-fg/90 mt-8 inline-flex rounded-md px-4 py-2.5 text-sm font-medium transition-colors"
          >
            {linkLabel}
          </Link>
        </div>
      </section>
    </main>
  );
}
