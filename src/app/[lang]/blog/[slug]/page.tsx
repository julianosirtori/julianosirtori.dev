import Balancer from 'react-wrap-balancer';

import { allPosts } from 'contentlayer/generated';
import { notFound } from 'next/navigation';

import { Post as PostPage } from '@/components/pages/Post';

interface IPostProps {
  params: {
    slug: string
  }
}

export default async function Post({ params }: IPostProps) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <PostPage post={post} />
  )
}