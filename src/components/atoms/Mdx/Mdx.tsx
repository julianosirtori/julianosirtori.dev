import { useMDXComponent } from "next-contentlayer/hooks";

interface MdxProps {
  code: string;
}

export const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code);

  return (
    <article className="prose prose-stone max-w-none pb-8 dark:prose-invert hover:prose-a:text-blue-500">
      <Component />
    </article>
  );
};
