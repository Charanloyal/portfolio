import { certifications, hackathons, profile, skills } from '../data/profile.ts';
import { CodeIcon, TrophyIcon } from './Icons.tsx';
import { Section } from './Section.tsx';

export function Stack() {
  return (
    <Section
      id="stack"
      index="04"
      label="Stack & honors"
      title={
        <>
          The toolkit. <em>And the proof.</em>
        </>
      }
      intro="Grouped by domain, followed by hackathons, problem solving and certifications."
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

      <h3 className="subhead">Honors & hackathons</h3>
      <ul className="honors-grid">
        {hackathons.map((h) => (
          <li key={h.name} className={`honor-card glass${h.result ? ' is-winner' : ''}`}>
            <span className="honor-icon" aria-hidden="true">
              <TrophyIcon size={18} />
            </span>
            {h.result && <p className="tag tag-gold mono">{h.result}</p>}
            <h4>{h.name}</h4>
            <p>{h.detail}</p>
          </li>
        ))}
        <li className="honor-card glass">
          <span className="honor-icon" aria-hidden="true">
            <CodeIcon size={18} />
          </span>
          <h4>550+ problems on LeetCode</h4>
          <p>Top 5.83% globally.</p>
          <a className="text-link mono" href={profile.links.leetcode} target="_blank" rel="noreferrer">
            leetcode.com/u/charan_red
          </a>
        </li>
      </ul>

      <div className="cert-grid">
        {certifications.map((group) => (
          <article key={group.group} className="cert-group glass" aria-labelledby={`cert-${group.group}`}>
            <h4 id={`cert-${group.group}`}>{group.group}</h4>
            <ul>
              {group.items.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </Section>
  );
}
