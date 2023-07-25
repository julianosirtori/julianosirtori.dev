import { useMDXComponent } from 'next-contentlayer/hooks';

interface MdxProps {
  code: string;
}

export const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code);

  return (
    <article >
      <Component />
    </article>
  );
}