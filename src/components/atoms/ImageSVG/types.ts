import { SVGMaps } from "./SVGs";

export interface IImageSVGProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof SVGMaps;
}
