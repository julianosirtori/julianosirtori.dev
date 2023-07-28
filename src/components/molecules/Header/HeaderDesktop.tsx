import Link from "next/link";

import { IHeaderProps } from "./Header.types";
import { HeaderSelectLang } from "./HeaderSelectLang";

export const HeaderDesktop = ({ links }: IHeaderProps) => {
  return (
    <header className="m-auto flex w-full max-w-5xl flex-row items-end justify-between bg-background px-4 pb-2 pt-8">
      <div>
        <Link href="/">
          <span className="text-base font-bold text-white">Juliano</span>
        </Link>
      </div>
      <nav>
        <ul className="flex flex-row justify-between gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-white">
                <span className="text-primary">#</span>
                {link.label}
              </Link>
            </li>
          ))}
          <li>
            <HeaderSelectLang />
          </li>
        </ul>
      </nav>
    </header>
  );
};
