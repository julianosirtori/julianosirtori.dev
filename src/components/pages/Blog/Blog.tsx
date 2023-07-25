import { useTranslations } from "next-intl"
import Link from "next/link"

import * as Page from "@/components/templates/Page/Page"

import { IBlogProps } from "./Blog.types"
import { PostItem } from "@/components/molecules/PostItem/PostItem"
import { useMemo } from "react"


export const Blog = ({ posts }: IBlogProps) => {
  const t = useTranslations('blog')

  const postSorted = useMemo(() => {
    return posts.sort((a, b) => {
      if (new Date(a.date) > new Date(b.date)) {
        return -1;
      }
      return 1;
    })
  }, [posts])

  return (
    <Page.Root title={t('title')} subtitle={t('subTitle')} >
      <Page.Section>
        <div className="grid grid-flow-row grid-cols-1 lg:grid-cols-3 gap-4 mb-8">
          {postSorted.map((post) => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>

      </Page.Section>
    </Page.Root>
  )
}

