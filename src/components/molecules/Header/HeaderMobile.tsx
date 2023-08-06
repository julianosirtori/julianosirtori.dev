import { useState } from "react";
import Link from "next/link";

import { IHeaderProps } from "./Header.types";
import { HeaderSelectLang } from "./HeaderSelectLang";
import { HeaderDarkMode } from "./HeaderDarkMode";

export const HeaderMobile = ({ links }: IHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-primary relative  m-auto flex w-full flex-row items-end justify-between px-4 pb-2 pt-4">
      <Link href="/">
        <span className="text-lg font-bold text-highlight">Juliano</span>
      </Link>
      <div className="flex flex-row items-center">
        <HeaderSelectLang />
        <HeaderDarkMode />
        {links.length > 0 && (
          <>
            <button
              onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
              className="text-highlight"
            >
              {isMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect
                    width="1"
                    height="1"
                    transform="matrix(1 0 0 -1 11 12)"
                    fill="currentColor"
                  />
                  <rect
                    x="3"
                    y="19.9706"
                    width="24"
                    height="2"
                    transform="rotate(-45 3 19.9706)"
                    fill="currentColor"
                  />
                  <rect
                    x="4"
                    y="3"
                    width="24"
                    height="2"
                    transform="rotate(45 4 3)"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <rect y="5" width="24" height="2" fill="currentColor" />
                  <rect
                    x="9"
                    y="12"
                    width="15"
                    height="2"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
            {isMenuOpen && (
              <nav className="bg-primary fixed left-0 top-12 z-50 h-[calc(100vh_-_48px)] w-full px-4 pt-12">
                <ul className="flex flex-col justify-between gap-8">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                        onClick={() => setIsMenuOpen(false)}
                        href={link.href}
                        className="text-primary text-3xl font-bold"
                      >
                        <span className="text-primary">#</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </header>
  );
};
