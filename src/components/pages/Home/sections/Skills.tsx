import { CardSkills } from "@/components/molecules/CardSkills"
import { ImageSVG } from "@/components/atoms/ImageSVG"
import { Title } from "@/components/molecules/Title"

export const Skills = () => {
  const skills = [
    {
      title: "Languages",
      skills: ["JavaScript", "TypeScript", "Python",]
    },
    {
      title: "Frameworks",
      skills: ["React", "Next.js", "Express", "Remix"]
    },
    {
      title: "Database",
      skills: ["MongoDB", "PostgreSQL"]
    },
    {
      title: "Tools",
      skills: ["Git", "GitHub", "Jira", "Confluence", "Figma"]
    },
    {
      title: "Others",
      skills: ["Agile", "Scrum", "Kanban"]
    },
  ]

  return (
    <section className="w-full max-w-screen-lg m-auto  ">
      <Title level={2} variant="secondary" className="mb-4 px-4 " >
        Skills
      </Title>
      <div className="flex flex-row w-full justify-between">
        <div className="hidden lg:block relative flex-1">
          <ImageSVG name="rectangle" width="52px" height="52px" className="top-[40%] right-5 absolute" />
          <ImageSVG name="rectangle" width="86px" height="86px" className="top-0 right-10 absolute" />
          <ImageSVG name="dots" width="63px" height="63px" className="top-[10%] absolute" />
          <ImageSVG name="dots" width="63px" height="63px" className="top-[60%] left-[50%] absolute" />
          <ImageSVG name="logo" width="113px" height="113px" className="bottom-[10%] left-4 absolute" />
        </div>
        <div className="grid grid-flow-col grid-rows-2 gap-4 pl-4 overflow-x-scroll lg:overflow-hidden">
          {skills.map((skill, index) => (
            <CardSkills key={index} {...skill} />
          ))}
        </div>
      </div>

    </section>
  )
}