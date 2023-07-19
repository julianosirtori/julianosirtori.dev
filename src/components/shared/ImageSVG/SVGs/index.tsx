import { Dots } from './Dots';
import { Logo } from './Logo';
import { Rectangle } from './Rectangle';


export const SVGMaps = {
  logo: (props: React.SVGProps<SVGSVGElement>) => <Logo {...props} />,
  dots: (props: React.SVGProps<SVGSVGElement>) => <Dots {...props} />,
  rectangle: (props: React.SVGProps<SVGSVGElement>) => <Rectangle {...props} />,
}