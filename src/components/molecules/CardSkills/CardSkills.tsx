import { ICardSkillsProps } from "./CardSkills.types"

export const CardSkills = ({ title, skills }: ICardSkillsProps) => {
  return (
    <div className="border border-gray flex flex-col  w-[220px]">
      <div className="border-b border-gray py-2">
        <span className="ml-2 text-white font-semibold">
          {title}
        </span>

      </div>
      <div className="flex flex-row gap-2 flex-wrap p-2">
        {skills.map((skill) => (
          <span className="text-gray" key={skill}>{skill}</span>
        ))}
      </div>
    </div>
  )
}