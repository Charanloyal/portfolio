import { certifications, hackathons, profile } from '../data/profile.ts';
import { CodeIcon, TrophyIcon } from './Icons.tsx';
import { Section } from './Section.tsx';

export function Achievements() {
  return (
    <Section id="achievements" eyebrow="04 · Achievements" title="Hackathons, problem solving & certifications">
      <div className="achieve-grid">
        {hackathons.map((h) => (
          <article key={h.name} className="achieve-card glass">
            <span className="achieve-icon" aria-hidden="true">
              <TrophyIcon size={20} />
            </span>
            <h3>{h.name}</h3>
            {h.result && <p className="badge badge-gold">{h.result}</p>}
            <p>{h.detail}</p>
          </article>
        ))}
        <article className="achieve-card glass">
          <span className="achieve-icon" aria-hidden="true">
            <CodeIcon size={20} />
          </span>
          <h3>550+ problems on LeetCode</h3>
          <p>Top 5.83% globally. Consistent practice in data structures and algorithms.</p>
          <a className="text-link mono" href={profile.links.leetcode} target="_blank" rel="noreferrer">
            leetcode.com/u/charan_red
          </a>
        </article>
      </div>

      <div className="cert-grid">
        {certifications.map((group) => (
          <article key={group.group} className="cert-group glass" aria-labelledby={`cert-${group.group}`}>
            <h3 id={`cert-${group.group}`}>{group.group}</h3>
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
