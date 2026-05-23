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
    });

  return (
    <section aria-label={label} className="border-border border-t pt-8">
      <h2 className="text-fg-subtle mb-4 font-mono text-xs tracking-wide uppercase">
        {label}
      </h2>
      <ul className="flex flex-col gap-1">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="group hover:bg-bg-muted -mx-3 flex flex-col gap-1 rounded-lg px-3 py-2 transition-colors"
            >
              <h3 className="text-fg group-hover:text-accent text-sm font-medium transition-colors">
                {post.title}
              </h3>
              <div className="text-fg-subtle flex items-center gap-2 text-xs">
                <time>{formatDate(post.date)}</time>
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
