import { useTranslations } from "next-intl";
import { FeaturedPostsProps } from "./FeaturedPosts.types";
import Link from "next/link";
import dayjs from "dayjs";
import Image from "next/image";

export const FeaturedPosts = ({ posts }: FeaturedPostsProps) => {
  const t = useTranslations("blog");

  if (posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-14 w-full">
      <h2 className="px-2 text-2xl font-semibold leading-8 text-primary">
        {t("featuredArticles")}
      </h2>
      <div className="mt-5 flex flex-col gap-5 lg:flex-row ">
        {posts.map((post) => (
          <Link
            key={post._id}
            href={`/blog/${post.slug}`}
            className="flex flex-1 flex-col "
          >
            <h3 className="text-lg font-bold text-primary">{post.title}</h3>
            <p className="line-clamp-2 overflow-hidden text-ellipsis text-sm leading-6	 text-secondary">
              {post.description}
            </p>
            <p className="mt-1 text-sm text-primary">
              {`${post.readTime} ${t("readTime")}`}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
