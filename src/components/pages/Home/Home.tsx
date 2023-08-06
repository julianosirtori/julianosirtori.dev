import { AboutMe } from "./sections/AboutMe";
import { Contacts } from "./sections/Contacts";
import { Presentation } from "./sections/Presentation";
import { Quote } from "./sections/Quote";
import { Skills } from "./sections/Skills";

export const Home = () => {
  return (
    <div className="flex w-full flex-col gap-24 pb-28 lg:gap-28 ">
      <Presentation />
      <Quote />
      <Skills />
      <AboutMe />
      <Contacts />
    </div>
  );
};
