import { useLocale } from "next-intl";
import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Balancer from "react-wrap-balancer";
import { IPostItemProps } from "./PostItem.type";

export const PostItem = ({ post }: IPostItemProps) => {
  const locale = useLocale();

  const dateFormatted = useMemo(() => {
    return new Date(post.date).toLocaleString(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }, [post.date, locale]);

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="bg-primary border-primary hover:border-primary flex max-w-xs flex-col border"
    >
      <div className="relative h-96  w-full overflow-hidden">
        <Image
          src={post.urlImage}
          fill
          alt={post.bannerAlt || ""}
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2 p-4">
        <span className="text-secondary">{`${dateFormatted} - ${post.readTime} min read`}</span>
        <Balancer className="text-x text-primary font-bold">
          {post.title}
        </Balancer>
      </div>
    </Link>
  );
};
