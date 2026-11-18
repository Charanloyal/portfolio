import type { ReactNode } from 'react';

interface SectionProps {
  id: string;
  eyebrow: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, intro, children }: SectionProps) {
  return (
    <section id={id} className="section container" aria-labelledby={`${id}-title`}>
      <header className="section-head">
        <p className="eyebrow mono">{eyebrow}</p>
        <h2 id={`${id}-title`}>{title}</h2>
        {intro && <p className="section-intro">{intro}</p>}
      </header>
      {children}
    </section>
  );
}
