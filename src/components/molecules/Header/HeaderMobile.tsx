import { useState } from "react"
import Link from "next/link"

import { IHeaderMobileProps } from "./Header.types"



export const HeaderMobile = ({ links }: IHeaderMobileProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="relative flex justify-between items-end pt-4 pb-2 px-4 w-full flex-row bg-background m-auto">
      <span className="text-white font-bold text-base">Juliano</span>
      <button onClick={() => setIsMenuOpen(isOpen => !isOpen)}>
        {isMenuOpen ? (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect width="1" height="1" transform="matrix(1 0 0 -1 11 12)" fill="#D9D9D9" />
          <rect x="3" y="19.9706" width="24" height="2" transform="rotate(-45 3 19.9706)" fill="#D9D9D9" />
          <rect x="4" y="3" width="24" height="2" transform="rotate(45 4 3)" fill="#D9D9D9" />
        </svg>) : (<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect y="5" width="24" height="2" fill="#D9D9D9" />
          <rect x="9" y="12" width="15" height="2" fill="#D9D9D9" />
        </svg>)}
      </button>
      {isMenuOpen && (
        <nav className="fixed z-50 w-full h-[calc(100vh_-_48px)] top-12 left-0 px-4 pt-12 bg-background">
          <ul className="flex flex-col justify-between gap-8">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="font-bold text-white text-3xl">
                  <span className="text-primary" >#</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}