import { useLocale } from "next-intl";
import { useMemo } from "react";
import Image from "next/image"
import Link from "next/link";
import Balancer from "react-wrap-balancer"
import { IPostItemProps } from "./PostItem.type"


export const PostItem = ({ post }: IPostItemProps) => {
  const locale = useLocale();

  const dateFormatted = useMemo(() => {
    return new Date(post.date).toLocaleString(locale, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    })
  }, [post.date, locale])

  return (
    <Link href={post.slug} className="flex flex-col max-w-xs bg-background border border-gray hover:border-primary">
      <div className="relative w-full  h-96 overflow-hidden">
        <Image src={post.urlImage} fill alt={post.bannerAlt || ''} className="object-cover" />
      </div>

      <div className="flex flex-col p-4 gap-2">
        <span className="text-gray">{`${dateFormatted} - ${post.readTime} min read`}</span>
        <Balancer className="text-x font-bold text-white">{post.title}</Balancer>
      </div>
    </Link>
  )
}