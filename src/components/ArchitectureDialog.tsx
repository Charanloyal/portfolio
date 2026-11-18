import { useEffect, useRef } from 'react';
import type { ShowcaseProject } from '../data/types.ts';
import { assetUrl } from '../data/projects.ts';
import { CloseIcon, ExternalIcon, GitHubIcon } from './Icons.tsx';
import { StatusBadges } from './ProjectCard.tsx';

interface ArchitectureDialogProps {
  project: ShowcaseProject | null;
  onClose: () => void;
}

export function ArchitectureDialog({ project, onClose }: ArchitectureDialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (project && !dialog.open) {
      dialog.showModal();
      dialog.scrollTop = 0;
    } else if (!project && dialog.open) {
      dialog.close();
    }
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="arch-dialog"
      aria-labelledby="arch-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {project && <DialogBody project={project} onClose={() => ref.current?.close()} />}
    </dialog>
  );
}

function DialogBody({ project, onClose }: { project: ShowcaseProject; onClose: () => void }) {
  const cs = project.case_study;
  return (
    <div className="arch-panel glass">
      <header className="arch-head">
        <div>
          <p className="eyebrow mono">Architecture &amp; system design</p>
          <h2 id="arch-title">{project.title}</h2>
          <p className="arch-tagline">{project.tagline}</p>
          <div className="badges">
            <StatusBadges project={project} />
          </div>
        </div>
        <button type="button" className="icon-btn" onClick={onClose} aria-label="Close architecture details">
          <CloseIcon />
        </button>
      </header>

      <div className="arch-links">
        <a className="btn btn-ghost btn-sm" href={project.github_url} target="_blank" rel="noreferrer">
          <GitHubIcon size={15} />
          Repository
        </a>
        {project.demo_url && (
          <a className="btn btn-ghost btn-sm" href={assetUrl(project.demo_url)} target="_blank" rel="noreferrer">
            <ExternalIcon size={15} />
            Demo
          </a>
        )}
        {project.demo_note && <p className="arch-note">{project.demo_note}</p>}
      </div>

      {project.image && (
        <img
          className="arch-image"
          src={assetUrl(project.image)}
          alt={project.image_alt ?? ''}
          loading="lazy"
          width={1200}
          height={675}
        />
      )}

      <section className="arch-block" aria-labelledby="arch-problem">
        <h3 id="arch-problem">Problem</h3>
        <p>{cs.problem}</p>
      </section>

      <section className="arch-block" aria-labelledby="arch-flow">
        <h3 id="arch-flow">Data flow</h3>
        <ol className="flow">
          {cs.architecture.map((node, i) => (
            <li key={node.label} className="flow-node">
              <span className="flow-index mono" aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <div>
                <p className="flow-label">{node.label}</p>
                <p className="flow-detail">{node.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="arch-block" aria-labelledby="arch-tradeoffs">
        <h3 id="arch-tradeoffs">Key engineering trade-offs</h3>
        <ul className="bullets">
          {cs.decisions.map((d) => (
            <li key={d}>{d}</li>
          ))}
        </ul>
      </section>

      <section className="arch-block" aria-labelledby="arch-bench">
        <h3 id="arch-bench">Benchmarks &amp; results</h3>
        {project.metrics.length > 0 ? (
          <div className="table-wrap">
            <table className="bench">
              <thead>
                <tr>
                  <th scope="col">Measurement</th>
                  <th scope="col">Result</th>
                  <th scope="col">Evidence in repository</th>
                </tr>
              </thead>
              <tbody>
                {project.metrics.map((m) => (
                  <tr key={m.label}>
                    <th scope="row">{m.label}</th>
                    <td className="mono bench-value">{m.value}</td>
                    <td className="mono bench-evidence">{m.evidence}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="muted">No benchmark numbers are published for this project yet. Verified outcomes:</p>
        )}
        <ul className="bullets">
          {cs.results.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
      </section>

      <div className="arch-split">
        <section className="arch-block" aria-labelledby="arch-testing">
          <h3 id="arch-testing">Testing</h3>
          <ul className="bullets">
            {cs.testing.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </section>
        <section className="arch-block" aria-labelledby="arch-limits">
          <h3 id="arch-limits">Known limitations</h3>
          <ul className="bullets">
            {cs.limitations.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </section>
      </div>

      <ul className="tech" aria-label="Tech stack">
        {project.tech.map((t) => (
          <li key={t} className="chip mono">
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}
