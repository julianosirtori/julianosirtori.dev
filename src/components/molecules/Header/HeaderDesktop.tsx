import Link from "next/link"

import { IHeaderProps } from "./Header.types"

export const HeaderDesktop = ({ links }: IHeaderProps) => {

  return (
    <header className="flex justify-between max-w-5xl items-end pt-8 pb-2 px-4 w-full flex-row bg-background m-auto">
      <div>
        <Link href="/">
          <span className="text-white font-bold text-base">Juliano</span>
        </Link>
      </div>
      <nav>
        <ul className="flex flex-row justify-between gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <Link href={link.href} className="font-medium text-white">
                <span className="text-primary" >#</span>{link.label}
              </Link>
            </li>
          ))}

        </ul>
      </nav>
    </header>
  )
}