import { experience, formatPeriod, formatTenure, profile } from '../data/profile.ts';
import { PinIcon } from './Icons.tsx';
import { Section } from './Section.tsx';

export function Experience() {
  const edu = profile.education;
  return (
    <Section
      id="experience"
      eyebrow="01 · Experience"
      title="Engineering experience"
      intro="Six internships, most recent first. Each role leads with its measured outcomes."
    >
      <ol className="xp-timeline">
        {experience.map((job) => (
          <li key={`${job.org}-${job.start}`} className={`xp-item${job.current ? ' is-current' : ''}`}>
            <span className="xp-node" aria-hidden="true" />
            <article className="xp-card glass" aria-labelledby={`xp-${job.start}`}>
              <div className="xp-meta">
                <p className="xp-org">{job.org}</p>
                <p className="xp-loc">
                  <PinIcon size={13} />
                  {job.location}
                </p>
                <p className="xp-period mono">{formatPeriod(job)}</p>
                <div className="xp-badges">
                  {job.current && (
                    <span className="badge badge-live mono">
                      <span className="pulse" aria-hidden="true" />
                      Current
                    </span>
                  )}
                  <span className="badge badge-tenure mono">{formatTenure(job)}</span>
                </div>
                <span className="badge badge-domain">{job.domain}</span>
              </div>

              <div className="xp-body">
                <h3 id={`xp-${job.start}`}>{job.role}</h3>

                {job.impact.length > 0 && (
                  <ul className="xp-impact" aria-label="Key impact">
                    {job.impact.map((m) => (
                      <li key={m.label} className="impact-pill mono">
                        <strong>{m.value}</strong>
                        <span>{m.label}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <ul className="bullets">
                  {job.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>

                <ul className="tech xp-stack" aria-label="Tech stack">
                  {job.stack.map((s) => (
                    <li key={s} className="chip mono">
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </li>
        ))}
      </ol>

      <article className="edu-card glass" aria-label="Education">
        <p className="eyebrow mono">Education</p>
        <h3>{edu.degree}</h3>
        <p className="xp-org">
          {edu.school} · {edu.location}
        </p>
        <p className="xp-period mono">
          {edu.detail} · {edu.period}
        </p>
      </article>
    </Section>
  );
}
