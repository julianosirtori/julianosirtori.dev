import * as Page from "@/components/templates/Page/Page"
import { IPostProps } from "./Post.type"
import { Mdx } from '@/components/atoms/Mdx';
import Link from "next/link";
import { ArrowLeftIcon } from '@radix-ui/react-icons'
import { useLocale } from "next-intl";
import { useMemo } from "react";
import Image from "next/image";

export const Post = ({ post }: IPostProps) => {
  const locale = useLocale();

  const dateFormatted = useMemo(() => {
    return new Date(post.date).toLocaleString(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }, [post.date, locale])

  return (
    <section className="w-full max-w-screen-lg m-auto flex flex-col px-4">

      <Link href='/blog' className="flex  mt-12 mb-8 items-center">
        <ArrowLeftIcon className="text-white mr-4" width={24} height={24} />
        <span className="text-white font-semibold text-lg">Back to overview</span>
      </Link>
      <header className="flex flex-col w-full mb-10">
        <h2 className="text-primary text-2xl font-bold">{post.title}</h2>
        <h3 className="text-gray text-lg font-medium mt-2">{`${dateFormatted} - ${post.readTime} min read`}</h3>
        <div className="relative mt-10">
          <div className="aspect-h-2 aspect-w-3">
            <Image src={post.urlImage} fill alt={post.bannerAlt || ''} className="object-cover w-full " />
          </div>
        </div>
      </header>
      <main>
        <Mdx code={post.body.code} />
      </main>

    </section>
  )
}