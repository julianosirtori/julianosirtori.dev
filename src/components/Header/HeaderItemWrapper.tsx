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
        "after:content[''] relative text-primary after:absolute after:left-0 after:right-0 after:top-5 after:m-auto after:h-[1px] after:w-6  after:bg-primary":
          pathname.includes(href),
      })}
    >
      {children}
    </li>
  );
}
