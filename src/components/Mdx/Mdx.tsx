import { useMDXComponent } from "next-contentlayer/hooks";

interface MdxProps {
  code: string;
}

export const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code);

  return (
    <article className="prose prose-stone m-auto w-full max-w-3xl pb-5 ">
      <Component />
    </article>
  );
};
