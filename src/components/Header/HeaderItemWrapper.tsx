"use client";

import clsx from "clsx";
import { usePathname } from "next/navigation";

export function HeaderItemWrapper({
  children,
  href,
  ...props
}: {
  href: string;
  children: React.ReactNode;
}) {
  const pathname: string = usePathname();
  const isActive = pathname.includes(href);

  return (
    <li
      {...props}
      className={clsx("relative", {
        "after:bg-accent after:absolute after:right-3 after:bottom-1 after:left-3 after:h-px after:content-['']":
          isActive,
      })}
    >
      {children}
    </li>
  );
}
