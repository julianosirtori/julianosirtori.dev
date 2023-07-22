import { titleVariants } from "./Title";

export interface ITitleProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  variant?: keyof typeof titleVariants;
  line?: 'hidden' | 'block';
}