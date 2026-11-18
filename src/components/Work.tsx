import { useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { experience, formatPeriod, formatTenure, profile, type Role } from '../data/profile.ts';
import { PinIcon } from './Icons.tsx';
import { Section } from './Section.tsx';

/** Renders **bold** spans inside bullet text. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith('**') && part.endsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part,
      )}
    </>
  );
}

function RoleCard({ role, headingId }: { role: Role; headingId: string }) {
  return (
    <article className={`role-card glass${role.current ? ' is-current' : ''}`} aria-labelledby={headingId}>
      <header className="role-head">
        <div>
          <h3 id={headingId}>{role.role}</h3>
          <p className="role-org">{role.org}</p>
        </div>
        <p className="role-period mono">
          <span>{formatPeriod(role)}</span>
          <span className="role-tenure">{formatTenure(role)}</span>
        </p>
      </header>

      <ul className="role-tags" aria-label="Role details">
        {role.current && (
          <li className="tag tag-live">
            <span className="pulse" aria-hidden="true" />
            Current
          </li>
        )}
        <li className="tag">
          <PinIcon size={12} />
          {role.location}
        </li>
        <li className="tag">{role.type}</li>
        <li className="tag tag-domain">{role.domain}</li>
      </ul>

      {role.impact.length > 0 && (
        <ul className="role-impact" aria-label="Key impact">
          {role.impact.map((m) => (
            <li key={m.value + (m.label ?? '')} className={`impact-pill mono${m.label ? '' : ' is-text'}`}>
              <strong>{m.value}</strong>
              {m.label && <span>{m.label}</span>}
            </li>
          ))}
        </ul>
      )}

      <ul className="bullets">
        {role.bullets.map((b) => (
          <li key={b}>
            <Rich text={b} />
          </li>
        ))}
      </ul>

      <ul className="tech role-stack" aria-label="Tech stack">
        {role.stack.map((s) => (
          <li key={s} className="chip mono">
            {s}
          </li>
        ))}
      </ul>
    </article>
  );
}

export function Work() {
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const current = experience[active] ?? experience[0];

  const select = (index: number) => {
    const next = (index + experience.length) % experience.length;
    setActive(next);
    tabs.current[next]?.focus();
  };

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const keys: Record<string, number> = {
      ArrowDown: index + 1,
      ArrowRight: index + 1,
      ArrowUp: index - 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: experience.length - 1,
    };
    const target = keys[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target);
  };

  return (
    <Section
      id="work"
      aliases={['experience']}
      index="02"
      label="Experience"
      title={
        <>
          Where I've shipped. <em>What it moved.</em>
        </>
      }
      intro="Engineering internships across manufacturing AI, backend platforms and applied ML. Pick a company, or expand every role to scan them in order."
      actions={
        <button type="button" className="toggle-btn mono" aria-pressed={expanded} onClick={() => setExpanded((v) => !v)}>
          <span className="toggle-track" aria-hidden="true">
            <span className="toggle-thumb" />
          </span>
          Expand all roles
        </button>
      }
    >
      {expanded ? (
        <ol className="work-stack">
          {experience.map((role) => (
            <li key={role.org}>
              <RoleCard role={role} headingId={`role-${role.mark}`} />
            </li>
          ))}
        </ol>
      ) : (
        current && (
          <div className="work-split">
            <div
              className="work-tabs"
              role="tablist"
              aria-orientation="vertical"
              aria-label="Companies"
              style={{ '--active': active } as CSSProperties}
            >
              <span className="work-indicator" aria-hidden="true" />
              {experience.map((role, i) => (
                <button
                  key={role.org}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`work-tab-${i}`}
                  aria-selected={i === active}
                  aria-controls="work-panel"
                  tabIndex={i === active ? 0 : -1}
                  className="work-tab"
                  onClick={() => setActive(i)}
                  onKeyDown={(e) => onKeyDown(e, i)}
                >
                  <span className="monogram mono" aria-hidden="true">
                    {role.mark}
                  </span>
                  <span className="work-tab-text">
                    <span className="work-tab-company">{role.short}</span>
                    <span className="work-tab-role">{role.role}</span>
                    <span className="work-tab-period mono">{formatPeriod(role)}</span>
                  </span>
                </button>
              ))}
            </div>

            <div className="work-panel" role="tabpanel" id="work-panel" aria-labelledby={`work-tab-${active}`} tabIndex={0}>
              <div key={active} className="work-panel-inner">
                <RoleCard role={current} headingId="work-panel-title" />
              </div>
            </div>
          </div>
        )
      )}

      <aside className="edu-strip glass" aria-label="Education">
        <span className="section-index mono">Education</span>
        <span className="edu-degree">{profile.education.degree}</span>
        <span className="edu-school">{profile.education.school}</span>
        <span className="mono edu-meta">
          {profile.education.detail} · {profile.education.period}
        </span>
      </aside>
    </Section>
  );
}
