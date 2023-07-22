'use client'
import { useReducedMotion, motion } from "framer-motion"
import { Title } from "@/components/molecules/Title"
import { IPageProps, IPageSectionProps } from "./Page.type"

export const Root = ({ title, subtitle, children, hideHeader = false, className, ...props }: IPageProps) => {
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  return (
    <div className={`flex flex-col bg-background w-full max-w-screen-lg m-auto p-8 ${className}`} {...props}>
      {!hideHeader && (
        <motion.div
          initial="initial"
          animate="visible"
          variants={{
            initial: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
          }} className="w-full flex flex-col gap-6 pb-8"
        >
          <motion.div variants={childVariants}>
            <Title variant="primary" className="mb-3" >
              {title}
            </Title>
          </motion.div>
          <p className="text-gray">{subtitle}</p>

        </motion.div>
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