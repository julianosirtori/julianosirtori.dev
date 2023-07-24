import { useTranslations } from "next-intl"
import Link from "next/link"

import * as Page from "@/components/templates/Page/Page"

import { IBlogProps } from "./Blog.types"


export const Blog = ({ posts }: IBlogProps) => {
  const t = useTranslations('blog')
  return (
    <Page.Root title={t('title')} subtitle={t('subTitle')} >
      <Page.Section>
        {posts
          .sort((a, b) => {
            if (new Date(a.publishedAt) > new Date(b.publishedAt)) {
              return -1;
            }
            return 1;
          })
          .map((post) => (
            <Link
              key={post.slug}
              className="flex flex-col space-y-1 mb-4"
              href={`/blog/${post.slug}`}
            >
              <div className="w-full flex flex-col">
                <p className="text-neutral-900 dark:text-neutral-100 tracking-tight">
                  {post.title}
                </p>
              </div>
            </Link>
          ))}
      </Page.Section>
    </Page.Root>
  )
}

