import { impactMetrics } from '../data/profile.ts';

export function ImpactBar() {
  return (
    <section className="container impact" aria-label="Impact highlights">
      <ul className="impact-grid">
        {impactMetrics.map((m) => (
          <li key={m.label} className="impact-item glass">
            <p className="impact-value mono">{m.value}</p>
            <p className="impact-label">{m.label}</p>
            <p className="impact-source mono">{m.source}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
