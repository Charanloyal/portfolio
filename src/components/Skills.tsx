import { skills } from '../data/profile.ts';
import { Section } from './Section.tsx';

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="03 · Skills"
      title="Technical skills"
      intro="Grouped by domain: languages, AI systems, distributed backends, data platforms and delivery tooling."
    >
      <dl className="skills-matrix glass">
        {skills.map((g) => (
          <div key={g.group} className="skills-row">
            <dt>{g.group}</dt>
            <dd>
              <ul className="tech">
                {g.items.map((item) => (
                  <li key={item} className="chip mono">
                    {item}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
