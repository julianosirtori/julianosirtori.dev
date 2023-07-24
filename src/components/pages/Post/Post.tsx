import * as Page from "@/components/templates/Page/Page"
import { IPostProps } from "./Post.type"
import { Mdx } from '@/components/atoms/Mdx';

export const Post = ({ post }: IPostProps) => {

  return (
    <Page.Root title={post.title}  >
      <Page.Section>
        <Mdx code={post.body.code} />
      </Page.Section>
    </Page.Root>
  )
}