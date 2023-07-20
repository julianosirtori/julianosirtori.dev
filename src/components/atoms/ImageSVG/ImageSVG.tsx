import { SVGMaps } from "./SVGs"
import { IImageSVGProps } from "./types"

export const ImageSVG = ({ name, ...props }: IImageSVGProps) => {
  const Element = SVGMaps[name]
  return (
    <Element {...props} />
  )
}