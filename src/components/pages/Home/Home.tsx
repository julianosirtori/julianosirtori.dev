import { I18n } from "@/common/types"
import { AboutMe, Contact, Experiences, Projects } from "./sections"

interface HomeProps extends I18n {

}

export const Home = ({ i18n }: HomeProps) => {
  return (
    <main className="bg-bgPrimary">
      <AboutMe />
      <Contact />
      <Experiences />
      <Projects />
    </main>)
}