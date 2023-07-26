import { Post } from "contentlayer/generated";

export interface IPostItemProps extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}