import Section from '../components/Section'
import Badge from '../components/Badge'
import { SKILL_CATEGORIES } from '../data/skills'

function Skills() {
  return (
    <Section id="skills">
      <h2>Skills</h2>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_CATEGORIES.map((category) => (
          <div
            key={category.name}
            className="border-border bg-surface rounded-(--radius-card) border p-6"
          >
            <h3 className="text-base">{category.name}</h3>
            <div className="mt-4 flex flex-wrap gap-2">
              {category.skills.map((skill) => (
                <Badge key={skill}>{skill}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  )
}

export default Skills
