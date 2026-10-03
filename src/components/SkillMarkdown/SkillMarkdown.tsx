import type { ComponentProps } from "react";
import type { Root } from "hast";
import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment, jsx, jsxs } from "react/jsx-runtime";

import { CodeBlock } from "@/components/CodeBlock";

export interface SkillMarkdownProps {
  /** Sanitized tree from renderSkillMarkdown. */
  tree: Root;
}

/** SKILL.md body in the blog's prose style. Skill content is in English. */
export function SkillMarkdown({ tree }: SkillMarkdownProps) {
  return (
    <div lang="en" className="prose">
      {toJsxRuntime(tree, {
        Fragment,
        jsx,
        jsxs,
        components: {
          pre: (props: ComponentProps<"pre">) => <CodeBlock {...props} />,
        },
      })}
    </div>
  );
}
