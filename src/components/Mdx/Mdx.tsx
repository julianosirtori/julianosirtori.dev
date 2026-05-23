"use client";

import { useMDXComponent } from "next-contentlayer2/hooks";
import { ComponentProps } from "react";

import { CodeBlock } from "@/components/CodeBlock";
import { Callout } from "./Callout";
import { Quote } from "./Quote";
import { Aside } from "./Aside";
import { Figure } from "./Figure";

interface MdxProps {
  code: string;
}

const components = {
  pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
  Callout,
  Quote,
  Aside,
  Figure,
};

export const Mdx = ({ code }: MdxProps) => {
  const Component = useMDXComponent(code);
  return <Component components={components} />;
};
