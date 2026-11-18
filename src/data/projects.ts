import catalogueData from './catalogue.json';
import { githubUrl, githubUser } from './profile.ts';
import type { CatalogueProject, ShowcaseProject, Track } from './types.ts';

/** Points repository and GitHub Pages links at the configured account, so a username change needs no data edits. */
function withCurrentOwner(project: CatalogueProject): CatalogueProject {
  const pages = (url: string | null) => url?.replace(/^https:\/\/[^./]+\.github\.io\//, `https://${githubUser}.github.io/`) ?? null;
  return {
    ...project,
    github_url: project.github_url.replace(/^https:\/\/github\.com\/[^/]+/, githubUrl),
    demo_url: pages(project.demo_url),
  };
}

export const catalogue = (catalogueData.projects as CatalogueProject[]).map(withCurrentOwner);

export const TRACKS: { id: Track | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ai', label: 'AI & Agents' },
  { id: 'systems', label: 'Distributed Systems / SDE' },
  { id: 'data', label: 'Data & ML' },
];

interface ShowcaseEntry {
  id: string;
  tracks: Track[];
  tagline: string;
  title?: string;
}

// Display order of the project showcase. Content comes from catalogue.json.
const SHOWCASE: ShowcaseEntry[] = [
  { id: 'agent-orchestration-system', tracks: ['ai', 'systems'], tagline: 'Human-gated multi-agent research DAG' },
  { id: 'multi-agent-llm-orchestration', tracks: ['ai'], tagline: 'PEVR agent DAG with deterministic verifier and repair loop' },
  { id: 'octoscale-url-shortener', tracks: ['systems'], tagline: 'URL shortener load-tested at 2.4K redirects/s with exact rate limiting' },
  { id: 'raftkv', tracks: ['systems'], tagline: 'Raft-replicated, crash-safe key-value store' },
  { id: 'full-stack-integration', tracks: ['systems'], tagline: 'Real-time task and chat board in a TypeScript monorepo', title: 'Task & Chat Board' },
  { id: 'partsense', tracks: ['data', 'ai'], tagline: 'Predictive maintenance tuned for recall on rare failures' },
  { id: 'drivedocs', tracks: ['ai', 'data'], tagline: 'Multimodal RAG with verified citations and guardrails' },
  { id: 'lakeflow', tracks: ['data', 'systems'], tagline: 'Idempotent CDC pipeline into an Iceberg lakehouse' },
  { id: 'ab-testing-platform', tracks: ['data'], tagline: 'Experiment sizing, SRM guardrail and significance engine', title: 'AeroTest' },
  { id: 'churn-predictive-agent', tracks: ['data', 'ai'], tagline: 'Explainable churn risk scoring and retention ROI' },
  { id: 'neural-gateway', tracks: ['ai', 'systems'], tagline: 'Fault-tolerant multi-provider LLM gateway' },
  { id: 'smart-loan-recovery', tracks: ['data'], tagline: 'Borrower segmentation and recovery-strategy scoring', title: 'Smart Loan Recovery' },
  { id: 'featurehub-dataguard', tracks: ['data'], tagline: 'Feature store guarded by data contracts' },
  { id: 'designiq', tracks: ['data'], tagline: 'ML surrogate for CAD/CAE design optimization with DFM checks' },
  { id: 'ticketlens', tracks: ['data', 'ai'], tagline: 'Ticket classifier benchmarked across three model families' },
  { id: 'vehicle-telemetry-anomaly-detection', tracks: ['data'], tagline: 'Stateful streaming anomaly detection with ONNX serving' },
];

/** Cards shown per filter before "Show all". */
export const INITIAL_VISIBLE = 8;

function toShowcase(entry: ShowcaseEntry): ShowcaseProject {
  const project = catalogue.find((p) => p.id === entry.id);
  if (!project) throw new Error(`Showcase project "${entry.id}" is missing from catalogue.json`);
  const { brief, case_study } = project;
  if (!brief || !case_study) throw new Error(`Showcase project "${entry.id}" needs a brief and a case_study`);
  return {
    ...project,
    brief,
    case_study,
    tracks: entry.tracks,
    tagline: entry.tagline,
    title: entry.title ?? project.title,
  };
}

export const showcase: ShowcaseProject[] = SHOWCASE.map(toShowcase);

/** Public repositories that are not in the showcase, newest first. */
export const moreProjects: CatalogueProject[] = catalogue
  .filter((p) => !SHOWCASE.some((s) => s.id === p.id))
  .sort((a, b) => b.updated.localeCompare(a.updated));

export const STATUS_LABEL: Record<CatalogueProject['status'], string> = {
  complete: 'Complete',
  'in-progress': 'In progress',
  experimental: 'Experimental',
  learning: 'Learning project',
};

/** Resolves catalogue asset and demo paths against the deployment base path. */
export function assetUrl(path: string): string {
  return /^https?:\/\//.test(path) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`;
}
