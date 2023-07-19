import { Button } from "@/components/shared/Button/Button"
import { ImageSVG } from "@/components/shared/ImageSVG"
import Image from "next/image"

export const Presentation = () => {
  return (
    <section className="flex flex-col gap-6 px-4 mt-5 w-full lg:flex-row lg:max-w-5xl lg:mt-16 lg:m-auto lg:items-center">
      <div className="w-full flex flex-col gap-6 pb-8">
        <h1 className="font-semibold text-2xl text-white max-w-sm ">
          Juliano is a <span className="text-primary">front-end web developer</span>
        </h1>
        <p className="text-gray ">He crafts responsive websites where technologies meet creativity</p>
        <Button className="max-w-[160px]">
          Contact me!!
        </Button>
      </div>
      <div className="flex w-full flex-col items-center">
        <div className="relative w-full h-80 max-w-sm">
          <ImageSVG name="logo" width="104px" height="104px" className="z-0 absolute top-10 left-[-8px]" />
          <Image src="/images/Juliano.png" fill alt="Juliano`s photo" className="absolute z-1" />
          <ImageSVG name="dots" width="56px" height="56px" className="z-2 absolute bottom-8 right-4" />
        </div>
        <div className="border border-gray p-2 flex flex-row gap-2 w-full">
          <div className="w-4 h-4 bg-primary" />
          <div className="flex flex-col lg:flex-row">
            <span className="text-gray font-semibold mr-2">Currently working on</span>
            <span className="text-white font-bold">Portfolio</span>
          </div>
        </div>
      </div>


    </section>
  )
}