import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  /** Two-digit section number, e.g. "02". */
  index: string;
  label: string;
  title: ReactNode;
  intro?: ReactNode;
  /** Controls shown on the right of the section header, such as a view toggle. */
  actions?: ReactNode;
  /** Extra anchor ids that should land on this section, e.g. legacy links. */
  aliases?: string[];
  children: ReactNode;
}

export function Section({ id, index, label, title, intro, actions, aliases = [], children }: SectionProps) {
  return (
    <section id={id} className="section container" aria-labelledby={`${id}-title`}>
      {aliases.map((alias) => (
        <span key={alias} id={alias} className="anchor-alias" aria-hidden="true" />
      ))}
      <header className="section-head">
        <p className="section-index mono">
          <span>{index}</span> / {label}
        </p>
        <div className="section-title-row">
          <div>
            <h2 id={`${id}-title`}>{title}</h2>
            {intro && <p className="section-intro">{intro}</p>}
          </div>
          {actions && <div className="section-actions">{actions}</div>}
        </div>
      </header>
      {children}
    </section>
  );
}
