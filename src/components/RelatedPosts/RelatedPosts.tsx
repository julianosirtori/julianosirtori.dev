import { Link } from "@/locales/navigation";

export interface RelatedPostItem {
  title: string;
  slug: string;
  date: string;
  readTime: number;
}

interface RelatedPostsProps {
  posts: RelatedPostItem[];
  label: string;
  readTime: string;
  locale: string;
}

export function RelatedPosts({
  posts,
  label,
  readTime,
  locale,
}: RelatedPostsProps) {
  if (posts.length === 0) return null;

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString(locale === "pt" ? "pt-BR" : "en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    });

  return (
    <section aria-label={label} className="border-border border-t pt-8">
      <h2 className="text-fg mb-4 text-lg font-medium tracking-tight">
        {label}
      </h2>
      <ul className="flex flex-col gap-1">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group hover:bg-bg-muted focus-visible:ring-accent -mx-3 flex flex-col gap-2 rounded-sm px-3 py-4 transition-colors focus-visible:ring-2 focus-visible:outline-none"
            >
              <h3 className="text-fg group-hover:text-accent text-base leading-relaxed font-medium transition-colors">
                {post.title}
              </h3>
              <div className="text-fg-muted flex flex-wrap items-center gap-x-2 gap-y-1 text-xs">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <span aria-hidden>·</span>
                <span>
                  {post.readTime} {readTime}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
