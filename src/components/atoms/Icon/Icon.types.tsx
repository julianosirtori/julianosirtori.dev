import { IconsMaps } from "./Icons";

export interface IIConsProps extends React.SVGProps<SVGSVGElement> {
  name: keyof typeof IconsMaps;
}

export type TIcon = React.SVGProps<SVGSVGElement>