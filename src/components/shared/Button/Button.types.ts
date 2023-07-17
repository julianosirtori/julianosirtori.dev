import { IconsMaps } from "../Icon/Icons";
import { Variants } from "./Button";

export interface IButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof Variants;
  icon?: keyof typeof IconsMaps;
}