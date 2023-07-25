import { useLocale } from "next-intl";
import { useMemo } from "react";
import Image from "next/image"
import { IPostItemProps } from "../PostItem/PostItem.type"

export const FeaturedPost = ({ post }: IPostItemProps) => {
  const locale = useLocale();

  const dateFormatted = useMemo(() => {
    return new Date(post.date).toLocaleString(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }, [post.date, locale])

  return (
    <div className="w-full flex flex-row">
      <div className="flex flex-col">
        <h2>Featured article</h2>
        <h3>{post.title}</h3>
        <span className="text-gray">{`${dateFormatted} - ${post.readTime} min read`}</span>
      </div>
      <div className="relative w-full  h-96 overflow-hidden">
        <Image src={post.urlImage} fill alt={post.bannerAlt || ''} className="object-cover" />
      </div>
    </div>
  )
}