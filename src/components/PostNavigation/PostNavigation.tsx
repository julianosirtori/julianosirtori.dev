import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

import { Link } from "@/locales/navigation";

export interface PostNavItem {
  title: string;
  slug: string;
}

interface PostNavigationProps {
  prev?: PostNavItem | null;
  next?: PostNavItem | null;
  labels: { prev: string; next: string; navigation: string };
}

export function PostNavigation({ prev, next, labels }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label={labels.navigation}
      className="border-border grid gap-6 border-t pt-6 sm:grid-cols-2 sm:gap-10"
    >
      {prev && (
        <Link
          href={`/blog/${prev.slug}`}
          className="group hover:bg-bg-muted focus-visible:ring-accent -mx-3 flex flex-col gap-3 rounded-sm px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none"
        >
          <span className="text-fg-muted inline-flex items-center gap-2 text-xs">
            <ArrowLeftIcon aria-hidden="true" className="h-3.5 w-3.5" />
            {labels.prev}
          </span>
          <span className="text-fg group-hover:text-accent text-base leading-relaxed font-medium transition-colors">
            {prev.title}
          </span>
        </Link>
      )}

      {next && (
        <Link
          href={`/blog/${next.slug}`}
          className="group hover:bg-bg-muted focus-visible:ring-accent -mx-3 flex flex-col gap-3 rounded-sm px-3 py-3 transition-colors focus-visible:ring-2 focus-visible:outline-none sm:col-start-2 sm:items-end sm:text-right"
        >
          <span className="text-fg-muted inline-flex items-center gap-2 text-xs">
            {labels.next}
            <ArrowRightIcon aria-hidden="true" className="h-3.5 w-3.5" />
          </span>
          <span className="text-fg group-hover:text-accent text-base leading-relaxed font-medium transition-colors">
            {next.title}
          </span>
        </Link>
      )}
    </nav>
  );
}
