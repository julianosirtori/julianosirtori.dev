import { I18n } from "@/common/types"
import { AboutMe, Contact, Experiences, Projects } from "./sections"
import { Presentation } from "./sections/Presentation"

export const Home = ({ i18n }: I18n) => {
  return (
    <main className="bg-bgPrimary">
      <Presentation i18n={i18n} />
      <AboutMe />
      <Contact />
      <Experiences />
      <Projects />
    </main>)
}