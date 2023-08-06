import { ITitleProps } from "./Title.types";

export const titleVariants = {
  primary: {
    line: "hidden",
    character: "/",
  },
  secondary: {
    line: "",
    character: "#",
  },
};

export const Title = ({
  children,
  className,
  level = 1,
  line,
  variant = "primary",
  ...props
}: ITitleProps) => {
  const TypeHeading = `h${level}` as keyof JSX.IntrinsicElements;
  const variantStyle = titleVariants[variant];

  return (
    <div
      className={`flex w-full flex-row items-center gap-4 text-3xl ${className}`}
      {...props}
    >
      <TypeHeading className="m-0 font-semibold text-highlight">
        <span className="text-highlight">{variantStyle.character}</span>
        {children}
      </TypeHeading>
      <div
        className={`bg-primary h-[1px] w-1/3 ${
          line ? line : variantStyle.line
        }`}
      />
    </div>
  );
};
