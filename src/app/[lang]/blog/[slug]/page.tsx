import { allPosts } from "contentlayer/generated";
import { notFound } from "next/navigation";

interface IPostProps {
  params: {
    slug: string;
  };
}

export default async function Post({ params }: IPostProps) {
  const post = allPosts.find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  return (
    <main>
      <h1>Post</h1>
    </main>
  );
}
