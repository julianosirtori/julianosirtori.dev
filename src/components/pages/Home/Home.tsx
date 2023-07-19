import { Icon } from "@/components/shared/Icon"
import { AboutMe } from "./sections/AboutMe"
import { Contacts } from "./sections/Contacts"
import { Presentation } from "./sections/Presentation"
import { Quote } from "./sections/Quote"
import { Skills } from "./sections/Skills"

export const Home = () => {
  return (
    <div className="w-full flex flex-col relative gap-24 lg:gap-28 pb-28">
      <div className="absolute hidden top-[-64px] left-4 flex-col gap-2 justify-center items-center lg:flex">
        <div className="w-[1px] h-36 bg-gray" />
        <Icon name="IconGithub" />
        <Icon name="IconDiscord" />
        <Icon name="IconLinkedin" />
      </div>
      <Presentation />
      <Quote />
      <Skills />
      <AboutMe />
      <Contacts />
    </div>
  )
}