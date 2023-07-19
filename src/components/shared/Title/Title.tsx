import { ITitleProps } from "./Title.types"

export const titleVariants = {
  primary: {
    line: 'hidden',
    character: '/',
  },
  secondary: {
    line: '',
    character: '#'
  },
}

export const Title = ({ children, className, level = 1, variant = 'primary', ...props }: ITitleProps) => {
  const TypeHeading = `h${level}` as keyof JSX.IntrinsicElements
  const variantStyle = titleVariants[variant]

  return (
    <div className={`flex w-full flex-row text-3xl gap-4 items-center ${className}`} {...props}>
      <TypeHeading className="text-white m-0 font-semibold">
        <span className="text-primary">{variantStyle.character}</span>
        {children}
      </TypeHeading>
      <div className={`w-1/3 h-[1px] bg-primary ${variantStyle.line}`} />
    </div>
  )
}