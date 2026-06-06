import { config } from "@/lib/config";

interface SkillCategoryProps {
  title: string;
  skills: string[] | { name: string; level?: number }[];
  showLevel?: boolean;
}

function SkillCategory({ title, skills, showLevel }: SkillCategoryProps) {
  return (
    <div>
      <h3 className="mb-3 font-mono text-xs uppercase tracking-wider text-zinc-500">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => {
          const name = typeof skill === "string" ? skill : skill.name;
          const level = typeof skill === "string" ? null : skill.level;
          return (
            <span
              key={name}
              className="rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-1.5 text-sm transition-colors hover:border-accent/50 hover:text-accent"
              title={showLevel && level ? `${level}%` : undefined}
            >
              {name}
              {showLevel && level && (
                <span className="ml-1.5 font-mono text-xs text-zinc-500">
                  {level}%
                </span>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function Skills() {
  return (
    <section className="section-container" id="skills">
      <h2 className="section-title">Skills & Tools</h2>
      <div className="grid gap-8 sm:grid-cols-2">
        <SkillCategory
          title="Languages"
          skills={config.skills.languages}
          showLevel
        />
        <SkillCategory title="Frameworks" skills={config.skills.frameworks} />
        <SkillCategory title="Platforms" skills={config.skills.platforms} />
        <SkillCategory title="AI / ML" skills={config.skills.ai_ml} />
        <SkillCategory title="Security" skills={config.skills.security} />
        <SkillCategory title="Tools" skills={config.skills.tools} />
      </div>
    </section>
  );
}
