import { IconsMaps } from "./Icons"
import { IIConsProps } from "./types"

export const Icon = ({ name, ...props }: IIConsProps) => {
  const Element = IconsMaps[name]
  return (
    <Element {...props} />
  )
}