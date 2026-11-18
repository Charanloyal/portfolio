import { experience, profile } from '../data/profile.ts';
import { Section } from './Section.tsx';

export function Experience() {
  const edu = profile.education;
  return (
    <Section
      id="experience"
      eyebrow="01 · Experience"
      title="Engineering experience"
      intro="Six internships, most recent first. Each bullet states the measured outcome of the work."
    >
      <ol className="timeline">
        {experience.map((job) => (
          <li key={`${job.org}-${job.period}`} className={`timeline-item${job.current ? ' is-current' : ''}`}>
            <span className="timeline-dot" aria-hidden="true" />
            <article className="timeline-card glass">
              <header className="timeline-head">
                <div>
                  <h3>{job.role}</h3>
                  <p className="timeline-org">{job.org}</p>
                </div>
                <p className="timeline-meta mono">
                  <span>{job.period}</span>
                  <span>{job.location}</span>
                </p>
              </header>
              <ul className="bullets">
                {job.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </article>
          </li>
        ))}
      </ol>

      <article className="edu-card glass" aria-label="Education">
        <p className="eyebrow mono">Education</p>
        <h3>{edu.degree}</h3>
        <p className="timeline-org">
          {edu.school} · {edu.location}
        </p>
        <p className="timeline-meta mono">
          <span>{edu.detail}</span>
          <span>{edu.period}</span>
        </p>
      </article>
    </Section>
  );
}
