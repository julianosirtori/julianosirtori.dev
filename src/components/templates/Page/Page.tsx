import { Title } from "@/components/molecules/Title"
import { IPageProps, IPageSectionProps } from "./Page.type"

export const Root = ({ title, subtitle, children, hideHeader = false, className, ...props }: IPageProps) => {

  return (
    <div className={`flex flex-col bg-background w-full p-8 ${className}`} {...props}>
      {!hideHeader && (
        <>
          <Title variant="primary" className="mb-3" >
            {title}
          </Title>
          <p className="text-gray">{subtitle}</p>
        </>
      )}
      <div className="mt-16 flex flex-col w-full gap-24">
        {children}
      </div>

    </div>
  )
}

export const Section = ({ title, children, className, ...props }: IPageSectionProps) => {
  return (
    <section className={`m-auto max-w-screen-lg w-full ${className}`} {...props}>
      {!!title && (
        <Title variant="secondary" className="mb-5" line='hidden' >
          {title}
        </Title>
      )}
      {children}
    </section>
  )
}