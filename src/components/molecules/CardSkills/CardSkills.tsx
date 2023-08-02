import { ICardSkillsProps } from "./CardSkills.types";

export const CardSkills = ({ title, skills }: ICardSkillsProps) => {
  return (
    <div className="border-primary flex w-[220px] flex-col  border">
      <div className="border-primary border-b py-2">
        <span className="text-primary ml-2 font-semibold">{title}</span>
      </div>
      <div className="flex flex-row flex-wrap gap-2 p-2">
        {skills.map((skill) => (
          <span className="text-secondary" key={skill}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
};
