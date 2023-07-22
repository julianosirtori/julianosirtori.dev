import { IconsMaps } from "./Icons"
import { IIConsProps } from "./Icon.types"

export const Icon = ({ name, ...props }: IIConsProps) => {
  const Element = IconsMaps[name]
  return (
    <Element {...props} />
  )
}