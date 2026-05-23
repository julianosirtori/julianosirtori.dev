import { ReactNode } from "react";

interface AsideProps {
  children: ReactNode;
  label?: string;
}

export function Aside({ children, label = "aside" }: AsideProps) {
  return (
    <aside className="border-border my-6 border-l-2 pl-5">
      <p className="text-fg-subtle mb-1 font-mono text-xs tracking-wide uppercase">
        {label}
      </p>
      <div className="text-fg-muted text-sm leading-relaxed [&>p]:my-1 [&>p:first-child]:mt-0 [&>p:last-child]:mb-0">
        {children}
      </div>
    </aside>
  );
}
