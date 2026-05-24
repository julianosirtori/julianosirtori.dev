import { ReactNode } from "react";

interface QuoteProps {
  children: ReactNode;
  cite?: string;
  author?: string;
}

export function Quote({ children, cite, author }: QuoteProps) {
  return (
    <figure className="my-8">
      <blockquote className="border-accent text-fg border-l-2 pl-5 text-xl leading-relaxed italic">
        {children}
      </blockquote>
      {(author || cite) && (
        <figcaption className="text-fg-subtle mt-2 pl-5 text-sm not-italic">
          {author}
          {author && cite ? ", " : ""}
          {cite && <cite className="not-italic">{cite}</cite>}
        </figcaption>
      )}
    </figure>
  );
}
