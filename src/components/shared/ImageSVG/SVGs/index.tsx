import { Dots } from './Dots';
import { Logo } from './Logo';


export const SVGMaps = {
  logo: (props: React.SVGProps<SVGSVGElement>) => <Logo {...props} />,
  dots: (props: React.SVGProps<SVGSVGElement>) => <Dots {...props} />,
}