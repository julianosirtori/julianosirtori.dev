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

  return (
    <li
      {...props}
      className={clsx({
        "border-b border-white text-primary": pathname.includes(href),
      })}
    >
      {children}
    </li>
  );
}
