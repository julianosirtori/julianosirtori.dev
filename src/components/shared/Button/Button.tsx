import { Icon } from "../Icon"
import { IButtonProps } from "./Button.types"

export const Variants = {
  primary: {
    button: "border-primary hover:bg-primary active:opacity-50",
    span: "text-white"
  },
  secondary: {
    button: "border-gray hover:bg-gray active:opacity-50",
    span: "text-gray"
  },
}

export const Button = ({ icon, variant = "primary", className, children }: IButtonProps) => {
  const variantStyles = Variants[variant]

  return (
    <button className={`px-4 py-2 border flex flex-row gap-2 bg-background  ${variantStyles.button} ${className}`}>
      <span className={`font-semibold ${variantStyles.span}`}>{children}</span>
      {icon && <Icon name={icon} height="21px" width="21px" />}
    </button>
  )
}
