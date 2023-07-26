import { Post } from "contentlayer/generated";

export interface IFeaturedPost extends React.HTMLAttributes<HTMLDivElement> {
  post: Post
}