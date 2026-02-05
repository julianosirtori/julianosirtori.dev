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

export const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code);

  return (
    <article className="prose prose-stone m-auto w-full max-w-3xl pb-5">
      <Component components={components} />
    </article>
  );
};
