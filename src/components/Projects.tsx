import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { STATUS_LABEL, TRACKS, moreProjects, showcase } from '../data/projects.ts';
import type { Track } from '../data/types.ts';
import { ArchitectureDialog } from './ArchitectureDialog.tsx';
import { ProjectCard } from './ProjectCard.tsx';
import { GitHubIcon } from './Icons.tsx';
import { Section } from './Section.tsx';
import { profile } from '../data/profile.ts';

type Filter = Track | 'all';

const HASH_PREFIX = '#projects/';

function projectFromHash(): string | null {
  const { hash } = window.location;
  if (!hash.startsWith(HASH_PREFIX)) return null;
  const id = decodeURIComponent(hash.slice(HASH_PREFIX.length));
  return showcase.some((p) => p.id === id) ? id : null;
}

export function Projects() {
  const [filter, setFilter] = useState<Filter>('all');
  const [openId, setOpenId] = useState<string | null>(projectFromHash);
  const trigger = useRef<HTMLElement | null>(null);

  const visible = useMemo(
    () => (filter === 'all' ? showcase : showcase.filter((p) => p.tracks.includes(filter))),
    [filter],
  );
  const openProject = showcase.find((p) => p.id === openId) ?? null;

  useEffect(() => {
    if (projectFromHash()) document.getElementById('projects')?.scrollIntoView();
    const onHash = () => setOpenId(projectFromHash());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  const open = useCallback((id: string, el: HTMLElement) => {
    trigger.current = el;
    setOpenId(id);
    history.replaceState(null, '', `${HASH_PREFIX}${id}`);
  }, []);

  const close = useCallback(() => {
    setOpenId(null);
    if (window.location.hash.startsWith(HASH_PREFIX)) history.replaceState(null, '', '#projects');
    trigger.current?.focus();
    trigger.current = null;
  }, []);

  return (
    <Section
      id="projects"
      eyebrow="02 · Projects"
      title="Systems I've designed and shipped"
      intro="Each card follows problem → architecture → impact. Open the architecture view for the data flow, the trade-offs I made, and benchmarks traced to result files committed in each repository."
    >
      <div className="filters" role="group" aria-label="Filter projects by role track">
        {TRACKS.map((t) => {
          const count = t.id === 'all' ? showcase.length : showcase.filter((p) => p.tracks.includes(t.id as Track)).length;
          return (
            <button
              key={t.id}
              type="button"
              className="filter-btn"
              aria-pressed={filter === t.id}
              onClick={() => setFilter(t.id)}
            >
              {t.label}
              <span className="filter-count mono">{count}</span>
            </button>
          );
        })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing {visible.length} projects
      </p>

      <div className="project-grid">
        {visible.map((p) => (
          <ProjectCard key={p.id} project={p} onOpen={open} />
        ))}
      </div>

      <details className="more-repos glass">
        <summary>
          <span>More public repositories</span>
          <span className="filter-count mono">{moreProjects.length}</span>
        </summary>
        <ul>
          {moreProjects.map((p) => (
            <li key={p.id}>
              <a href={p.github_url} target="_blank" rel="noreferrer">
                {p.title}
              </a>
              <span className="badge badge-status">{STATUS_LABEL[p.status]}</span>
              {p.synthetic_data && <span className="badge badge-warn">Synthetic data</span>}
              <p>{p.summary}</p>
            </li>
          ))}
        </ul>
        <a className="btn btn-ghost btn-sm" href={`${profile.links.github}?tab=repositories`} target="_blank" rel="noreferrer">
          <GitHubIcon size={15} />
          All repositories on GitHub
        </a>
      </details>

      <ArchitectureDialog project={openProject} onClose={close} />
    </Section>
  );
}
