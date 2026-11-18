export type ProjectStatus = 'complete' | 'in-progress' | 'experimental' | 'learning';

export interface Metric {
  label: string;
  value: string;
  /** Committed file (and field) in the project repository that the number comes from. */
  evidence: string;
}

export interface ArchitectureNode {
  label: string;
  detail: string;
}

export interface CaseStudy {
  problem: string;
  architecture: ArchitectureNode[];
  decisions: string[];
  testing: string[];
  results: string[];
  limitations: string[];
}

export interface Brief {
  problem: string;
  approach: string;
  outcomes: string[];
}

export interface CatalogueProject {
  id: string;
  title: string;
  repo: string;
  github_url: string;
  summary: string;
  category: string;
  secondary_categories: string[];
  tech: string[];
  status: ProjectStatus;
  synthetic_data: boolean;
  brief?: Brief;
  featured_rank: number | null;
  demo_url: string | null;
  demo_kind: string | null;
  demo_note: string | null;
  docs_url: string | null;
  updated: string;
  metrics: Metric[];
  image: string | null;
  image_alt: string | null;
  case_study: CaseStudy | null;
}

export type Track = 'ai' | 'systems' | 'data';

export interface ShowcaseProject extends CatalogueProject {
  brief: Brief;
  case_study: CaseStudy;
  tracks: Track[];
  tagline: string;
}
