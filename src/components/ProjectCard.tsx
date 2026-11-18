import type { ShowcaseProject } from '../data/types.ts';
import { STATUS_LABEL, TRACKS, assetUrl } from '../data/projects.ts';
import { ExternalIcon, GitHubIcon, LayersIcon } from './Icons.tsx';

interface ProjectCardProps {
  project: ShowcaseProject;
  onOpen: (id: string, trigger: HTMLElement) => void;
}

const TRACK_LABEL = Object.fromEntries(TRACKS.map((t) => [t.id, t.label]));
const MAX_TECH = 6;

export function StatusBadges({ project }: { project: ShowcaseProject }) {
  return (
    <>
      <span className={`badge badge-status status-${project.status}`}>{STATUS_LABEL[project.status]}</span>
      {project.synthetic_data && (
        <span className="badge badge-warn" title="Built or evaluated on generated or fictional data">
          Synthetic data
        </span>
      )}
    </>
  );
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const { brief, metrics, case_study } = project;
  const extraTech = project.tech.length - MAX_TECH;

  return (
    <article className="project-card glass" aria-labelledby={`p-${project.id}`}>
      <header className="project-head">
        <p className="eyebrow mono">{project.tagline}</p>
        <h3 id={`p-${project.id}`}>{project.title}</h3>
        <div className="badges">
          {project.tracks.map((t) => (
            <span key={t} className={`badge badge-track track-${t}`}>
              {TRACK_LABEL[t]}
            </span>
          ))}
          <StatusBadges project={project} />
        </div>
      </header>

      <ol className="flow-strip mono" aria-label="Architecture overview">
        {case_study.architecture.slice(0, 4).map((node) => (
          <li key={node.label}>{node.label}</li>
        ))}
      </ol>

      <dl className="pai">
        <div>
          <dt>Problem</dt>
          <dd>{brief.problem}</dd>
        </div>
        <div>
          <dt>Architecture</dt>
          <dd>{brief.approach}</dd>
        </div>
        <div>
          <dt>Impact</dt>
          <dd>
            {metrics.length > 0 ? (
              <ul className="metric-list">
                {metrics.slice(0, 2).map((m) => (
                  <li key={m.label}>
                    <span className="metric-value mono">{m.value}</span>
                    <span className="metric-label">{m.label}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <ul className="outcome-list">
                {brief.outcomes.slice(0, 2).map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            )}
          </dd>
        </div>
      </dl>

      <ul className="tech" aria-label="Tech stack">
        {project.tech.slice(0, MAX_TECH).map((t) => (
          <li key={t} className="chip mono">
            {t}
          </li>
        ))}
        {extraTech > 0 && <li className="chip chip-more mono">+{extraTech}</li>}
      </ul>

      <footer className="project-actions">
        <button
          type="button"
          className="btn btn-primary btn-sm"
          onClick={(e) => onOpen(project.id, e.currentTarget)}
          aria-haspopup="dialog"
        >
          <LayersIcon size={15} />
          Architecture &amp; design
        </button>
        <a className="btn btn-ghost btn-sm" href={project.github_url} target="_blank" rel="noreferrer">
          <GitHubIcon size={15} />
          Code
          <span className="sr-only"> for {project.title} on GitHub</span>
        </a>
        {project.demo_url && (
          <a className="btn btn-ghost btn-sm" href={assetUrl(project.demo_url)} target="_blank" rel="noreferrer">
            <ExternalIcon size={15} />
            Demo
            <span className="sr-only"> of {project.title}</span>
          </a>
        )}
      </footer>
    </article>
  );
}
