"use client";

import Giscus from "@giscus/react";
import { TComments } from "./Comments.types";

export const Comments = ({ locale }: TComments) => {
  return (
    <Giscus
      id="comments"
      repo="julianosirtori/julianosirtori.dev"
      repoId="R_kgDOJlgXxA"
      category="Site Comments"
      categoryId="DIC_kwDOJlgXxM4Caq6B"
      mapping="pathname"
      strict="0"
      reactions-enabled="1"
      emitMetadata="0"
      inputPosition="bottom"
      theme="dark"
      lang={locale}
    />
  );
};
