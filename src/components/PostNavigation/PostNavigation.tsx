import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";

import { Link } from "@/locales/navigation";

export interface PostNavItem {
  title: string;
  slug: string;
}

interface PostNavigationProps {
  prev?: PostNavItem | null;
  next?: PostNavItem | null;
  labels: { prev: string; next: string };
}

export function PostNavigation({ prev, next, labels }: PostNavigationProps) {
  if (!prev && !next) return null;

  return (
    <nav
      aria-label="post navigation"
      className="border-border grid gap-3 border-t pt-8 sm:grid-cols-2"
    >
      {prev ? (
        <Link
          href={`/blog/${prev.slug}`}
          className="border-border hover:border-fg-muted group flex flex-col gap-1 rounded-lg border p-4 transition-colors"
        >
          <span className="text-fg-subtle inline-flex items-center gap-1 text-xs">
            <ArrowLeftIcon className="h-3 w-3" />
            {labels.prev}
          </span>
          <span className="text-fg group-hover:text-accent text-sm font-medium transition-colors">
            {prev.title}
          </span>
        </Link>
      ) : (
        <span />
      )}

      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="border-border hover:border-fg-muted group flex flex-col items-end gap-1 rounded-lg border p-4 text-right transition-colors"
        >
          <span className="text-fg-subtle inline-flex items-center gap-1 text-xs">
            {labels.next}
            <ArrowRightIcon className="h-3 w-3" />
          </span>
          <span className="text-fg group-hover:text-accent text-sm font-medium transition-colors">
            {next.title}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
