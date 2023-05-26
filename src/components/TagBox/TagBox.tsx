export interface TagBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string,
  children: React.ReactNode,
  withOutTagClose?: boolean,
  container?: {
    className?: string,
  },

}

export const TagBox = ({ text, children, container, withOutTagClose = false, ...props }: TagBoxProps) => {
  return (
    <div className="" {...props}>
      <span className="font-mono italic text-sm opacity-40 leading-none">{`<${text}>`}</span>
      <div className={`pl-5 ${container?.className ?? ''}`}>
        {children}
      </div>
      {withOutTagClose ? null : <span className="font-mono italic text-sm opacity-40 leading-none">{`</${text}>`}</span>}
    </div>
  )
}