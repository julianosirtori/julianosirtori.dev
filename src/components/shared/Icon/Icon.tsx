import { IconsMaps } from "./Icons"
import { IIConsProps } from "./types"

export const Icon = ({ name, }: IIConsProps) => {
  const Element = IconsMaps[name]
  return (
    <Element />
  )
}