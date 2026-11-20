import { impactMetrics, profile } from '../data/profile.ts';
import { useCopy } from '../hooks/useToast.ts';
import { ArrowDownIcon, CopyIcon, GitHubIcon, LinkedInIcon, PinIcon } from './Icons.tsx';

export function Hero() {
  const copy = useCopy();

  return (
    <section id="about" className="hero container" aria-labelledby="hero-title">
      <div className="hero-main">
        <div className="hero-copy">
          <p className="availability">
            <span className="pulse" aria-hidden="true" />
            {profile.availability}
          </p>

          <h1 id="hero-title">
            <span className="hero-name">
              {profile.firstNames} <em>{profile.lastName}</em>
            </span>
            <span className="hero-role">{profile.headline}</span>
          </h1>

          <p className="hero-pitch">
            {profile.pitch[0]}
            <br className="br-desktop" /> {profile.pitch[1]}
          </p>

          <p className="hero-meta mono">
            <PinIcon size={14} />
            {profile.location} · {profile.mobility}
          </p>

          <div className="hero-ctas">
            <a className="btn btn-primary" href="#work">
              Explore Work
              <ArrowDownIcon size={16} />
            </a>
            <a className="btn btn-ghost" href={profile.links.github} target="_blank" rel="noreferrer">
              <GitHubIcon size={16} />
              GitHub
            </a>
            <a className="btn btn-ghost" href={profile.links.linkedin} target="_blank" rel="noreferrer">
              <LinkedInIcon size={15} />
              LinkedIn
            </a>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => copy(profile.email, 'Email copied to clipboard')}
              aria-label={`Copy email address ${profile.email}`}
            >
              <CopyIcon size={15} />
              Copy Email
            </button>
          </div>
        </div>

        <figure className="hero-portrait">
          <img
            src={`${import.meta.env.BASE_URL}avatar.jpg`}
            alt={`Portrait of ${profile.name}`}
            width={900}
            height={992}
            fetchPriority="high"
          />
          <figcaption className="mono">
            <span>{profile.name}</span>
            <span>{profile.location}</span>
          </figcaption>
        </figure>
      </div>

      <ul className="kpi-grid" aria-label="Impact highlights">
        {impactMetrics.map((m) => (
          <li key={m.label} className="kpi-cell glass">
            <p className="kpi-value mono">{m.value}</p>
            <p className="kpi-label">{m.label}</p>
            <p className="kpi-source mono">{m.source}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
