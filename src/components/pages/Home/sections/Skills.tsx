import { CardSkills } from "@/components/molecules/CardSkills";
import { ImageSVG } from "@/components/atoms/ImageSVG";
import { Title } from "@/components/molecules/Title";
import { useFeatureFlag } from "@/utils/featureFlag";

export const Skills = () => {
  const showSkills = useFeatureFlag("ABOUT");
  const skills = [
    {
      title: "Languages",
      skills: ["JavaScript", "TypeScript", "Python"],
    },
    {
      title: "Frameworks",
      skills: ["React", "Next.js", "Express", "Remix", "Vue"],
    },
    {
      title: "Database",
      skills: ["MongoDB", "PostgreSQL"],
    },
    {
      title: "Tools",
      skills: ["Git", "GitHub", "Jira", "Confluence", "Figma"],
    },
    {
      title: "Others",
      skills: ["Agile", "Scrum", "Kanban"],
    },
  ];

  if (!showSkills) {
    return null;
  }

  return (
    <section className="m-auto w-full max-w-screen-lg  ">
      <Title level={2} variant="secondary" className="mb-4 px-4 ">
        Skills
      </Title>
      <div className="flex w-full flex-row justify-between">
        <div className="relative hidden flex-1 lg:block">
          <ImageSVG
            name="rectangle"
            width="52px"
            height="52px"
            className="absolute right-5 top-[40%] text-highlight"
          />
          <ImageSVG
            name="rectangle"
            width="86px"
            height="86px"
            className="text-primary absolute right-10 top-0"
          />
          <ImageSVG
            name="dots"
            width="63px"
            height="63px"
            className="text-secondary absolute top-[10%]"
          />
          <ImageSVG
            name="dots"
            width="63px"
            height="63px"
            className="text-primary absolute left-[50%] top-[60%]"
          />
          <ImageSVG
            name="logo"
            width="113px"
            height="113px"
            className="absolute bottom-[10%] left-4 text-highlight"
          />
        </div>
        <div className="grid grid-flow-col grid-rows-2 gap-4 overflow-x-scroll pl-4 lg:overflow-hidden">
          {skills.map((skill, index) => (
            <CardSkills key={index} {...skill} />
          ))}
        </div>
      </div>
    </section>
  );
};
