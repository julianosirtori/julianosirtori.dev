import { useMDXComponent } from 'next-contentlayer/hooks';

interface MdxProps {
  code: string;
}

export const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code);

  return (
    <article className='prose lg:prose-xl prose-stone dark:prose-invert hover:prose-a:text-blue-500 max-w-none'>
      <Component />
    </article>
  );
}