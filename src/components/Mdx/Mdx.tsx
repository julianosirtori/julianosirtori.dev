"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { CodeBlock } from "@/components/CodeBlock";
import { ComponentProps } from "react";

interface MdxProps {
  code: string;
}

const components = {
  pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
};

/* eslint-disable react-hooks/static-components -- contentlayer's useMDXComponent intentionally creates a stateless component from MDX code */
function MdxContent({ code }: MdxProps) {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
}
/* eslint-enable react-hooks/static-components */

export const Mdx = ({ code }: MdxProps) => {
  return (
    <article className="prose prose-stone m-auto w-full max-w-3xl pb-5">
      <MdxContent code={code} />
    </article>
  );
};
