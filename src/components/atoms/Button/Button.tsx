import { Icon } from "@/components/atoms/Icon";
import { IButtonProps } from "./Button.types";

export const Variants = {
  primary: {
    button: "border-primary hover:bg-primary active:opacity-50",
    span: "text-primary",
  },
  secondary: {
    button: "border-primary hover:bg-gray active:opacity-50",
    span: "text-secondary",
  },
};

export const Button = ({
  icon,
  variant = "primary",
  className,
  children,
}: IButtonProps) => {
  const variantStyles = Variants[variant];

  return (
    <button
      className={`bg-primary flex flex-row gap-2 border px-4 py-2  ${variantStyles.button} ${className}`}
    >
      <span className={`font-semibold ${variantStyles.span}`}>{children}</span>
      {icon && <Icon name={icon} height="21px" width="21px" />}
    </button>
  );
};
