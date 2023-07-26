import { Blog as BlogPage } from "@/components/pages/Blog";

import { allPosts } from 'contentlayer/generated';

export default async function Blog() {
  return (
    <BlogPage posts={allPosts} />
  )
}