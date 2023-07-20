'use client'
import { Button } from "@/components/shared/Button/Button"
import { ImageSVG } from "@/components/shared/ImageSVG"
import { useReducedMotion, motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

export const Presentation = () => {
  const shouldReduceMotion = useReducedMotion()

  const childVariants = {
    initial: { opacity: 0, y: shouldReduceMotion ? 0 : 25 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }
  return (
    <section className="flex flex-col gap-6 px-4 mt-5 w-full lg:flex-row lg:max-w-5xl lg:mt-16 lg:m-auto lg:items-center overflow-hidden">
      <motion.div
        initial="initial"
        animate="visible"
        variants={{
          initial: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }} className="w-full flex flex-col gap-6 pb-8"
      >
        <motion.h1 variants={childVariants} className="font-semibold text-2xl text-white max-w-sm ">
          Juliano is a <span className="text-primary">front-end web developer</span>
        </motion.h1>
        <motion.p variants={childVariants} className="text-gray ">I specialize in designing and implementing seamless user interactions on the web, utilizing JavaScript, React, and HTML to create captivating and dynamic digital experiences.</motion.p>
        <motion.div
          className="w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <Link href="/#contact">
            <Button className="max-w-[160px]" role="link">
              Contact me!!
            </Button>
          </Link>

        </motion.div>

      </motion.div>
      <div className="flex w-full flex-col items-center overflow-hidden">
        <div className="relative w-full h-80 max-w-sm">
          <ImageSVG name="logo" width="104px" height="104px" className="z-0 absolute top-10 left-[-8px]" />
          <Image src="/images/Juliano.png" fill alt="Juliano`s photo" className="absolute z-1" />
          <ImageSVG name="dots" width="56px" height="56px" className="z-2 absolute bottom-8 right-4" />
        </div>
        <div className="border border-gray p-2 flex flex-row gap-2 w-full">
          <div className="w-4 h-4 bg-primary" />
          <div className="flex flex-col lg:flex-row">
            <span className="text-gray font-semibold mr-2">Currently working on</span>
            <a href="https://ciandt.com/br/pt-br" target="_blank">
              <span className="text-white font-bold">Portfolio</span>
            </a>

          </div>
        </div>
      </div>


    </section>
  )
}