import { profile } from '../data/profile.ts';
import { useCopy } from '../hooks/useToast.ts';
import { ArrowRightIcon, CopyIcon, GitHubIcon, MailIcon, PinIcon } from './Icons.tsx';

const WHOAMI: [string, string][] = [
  ['role', 'Distributed Systems & AI-Infra Engineer'],
  ['now', 'AI/ML Intern @ General Motors'],
  ['edu', 'B.Tech ECE (Data Science), SRM IST · 2027'],
  ['stack', 'Python · FastAPI · Kafka · Redis · LangGraph'],
  ['target', 'SDE-I · SWE-I · FDE · AI/ML · Data'],
];

export function Hero() {
  const copy = useCopy();

  return (
    <section className="hero container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="availability">
          <span className="pulse" aria-hidden="true" />
          {profile.availability}
        </p>

        <h1 id="hero-title">
          <span className="hero-name">{profile.name}</span>
          <span className="hero-role">
            {profile.headline}
            <span className="hero-focus">{profile.focus}</span>
          </span>
        </h1>

        <p className="hero-sub">{profile.subheadline}</p>

        <p className="hero-meta mono">
          <PinIcon size={15} />
          {profile.location} · {profile.mobility}
        </p>

        <div className="hero-ctas">
          <a className="btn btn-primary" href="#projects">
            Explore Architecture
            <ArrowRightIcon size={16} />
          </a>
          <a className="btn btn-ghost" href={profile.links.github} target="_blank" rel="noreferrer">
            <GitHubIcon size={16} />
            View GitHub
          </a>
          <a className="btn btn-ghost" href="#contact">
            <MailIcon size={16} />
            Contact Me
          </a>
        </div>

        <button
          type="button"
          className="copy-email mono"
          onClick={() => copy(profile.email, 'Email copied to clipboard')}
          aria-label={`Copy email address ${profile.email}`}
        >
          <span>{profile.email}</span>
          <CopyIcon size={15} />
        </button>
      </div>

      <aside className="hero-card glass" aria-label="Profile summary">
        <div className="hero-card-head">
          <img
            src={`${import.meta.env.BASE_URL}avatar.jpg`}
            alt={`Portrait of ${profile.name}`}
            width={72}
            height={72}
            className="avatar"
            fetchPriority="high"
          />
          <div>
            <p className="hero-card-name">{profile.name}</p>
            <p className="hero-card-loc mono">{profile.location}</p>
          </div>
        </div>
        <div className="terminal mono" role="group" aria-label="Summary">
          <p className="terminal-prompt">
            <span className="t-accent">$</span> whoami --verbose
          </p>
          <dl>
            {WHOAMI.map(([key, value]) => (
              <div key={key} className="terminal-row">
                <dt>{key}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </aside>
    </section>
  );
}
