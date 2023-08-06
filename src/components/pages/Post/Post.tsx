import * as Page from "@/components/templates/Page/Page";
import { IPostProps } from "./Post.type";
import { Mdx } from "@/components/atoms/Mdx";
import Link from "next/link";
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { useLocale } from "next-intl";
import { useMemo } from "react";
import Image from "next/image";

export const Post = ({ post }: IPostProps) => {
  const locale = useLocale();

  const dateFormatted = useMemo(() => {
    return new Date(post.date).toLocaleString(locale, {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    });
  }, [post.date, locale]);

  return (
    <section className="m-auto m-auto flex w-full max-w-screen-lg max-w-screen-md flex-col px-4">
      <Link href="/blog" className="mb-8  mt-12 flex items-center">
        <ArrowLeftIcon className="text-primary mr-4" width={24} height={24} />
        <span className="text-primary text-lg font-semibold">
          Back to overview
        </span>
      </Link>
      <header className="mb-10 flex w-full flex-col">
        <h2 className="text-3xl font-bold text-highlight">{post.title}</h2>
        <h3 className="text-secondary mt-2 text-lg font-medium">{`${dateFormatted} - ${post.readTime} min read`}</h3>
        <div className="relative mt-10">
          <div className="aspect-h-2 aspect-w-3">
            <Image
              src={post.urlImage}
              fill
              alt={post.bannerAlt || ""}
              className="w-full object-cover "
            />
          </div>
        </div>
      </header>
      <main>
        <Mdx code={post.body.code} />
      </main>
    </section>
  );
};
