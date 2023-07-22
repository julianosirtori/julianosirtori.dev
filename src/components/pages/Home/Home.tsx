import { Icon } from "@/components/atoms/Icon"
import { AboutMe } from "./sections/AboutMe"
import { Contacts } from "./sections/Contacts"
import { Presentation } from "./sections/Presentation"
import { Quote } from "./sections/Quote"
import { Skills } from "./sections/Skills"

export const Home = () => {
  return (
    <div className="w-full flex flex-col gap-24 lg:gap-28 pb-28">
      <Presentation />
      <Quote />
      <Skills />
      <AboutMe />
      <Contacts />
    </div>
  )
}