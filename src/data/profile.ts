export interface ImpactMetric {
  value: string;
  label: string;
  source: string;
}

export interface RoleMetric {
  value: string;
  label?: string;
}

export interface Role {
  role: string;
  org: string;
  /** Short company name for the #work tab rail. */
  short: string;
  /** Two-letter monogram shown on the tab. */
  mark: string;
  /** Year and month the role started, YYYY-MM. */
  start: string;
  /** Year and month the role ended, YYYY-MM; omitted for a current role. */
  end?: string;
  location: string;
  type: string;
  domain: string;
  current?: boolean;
  impact: RoleMetric[];
  /** Bullet text; wrap metrics and key terms in **double asterisks** to bold them. */
  bullets: string[];
  stack: string[];
}

export interface SkillGroup {
  group: string;
  items: string[];
}

export interface Hackathon {
  name: string;
  detail: string;
  /** Placement or award, shown as a badge when set. */
  result?: string;
}

export const githubUser = __GITHUB_USER__;
export const githubUrl = `https://github.com/${githubUser}`;

export const profile = {
  name: 'B. Charan Kumar Reddy',
  firstNames: 'B. Charan Kumar',
  lastName: 'Reddy',
  shortName: 'Charan',
  headline: 'Distributed Systems & AI Infrastructure Engineer',
  pitch: [
    'I build low-latency LLM inference pipelines and Raft-based distributed systems,',
    'and the high-throughput data pipelines that feed them.',
  ],
  availability: 'Open to SWE-I / SDE-I / AI-Infra / FDE Roles',
  targetRoles: ['SWE-I / SDE-I', 'AI Infrastructure & AI/ML Engineering', 'Forward Deployed Engineer (FDE)', 'Data Engineering'],
  location: 'Bengaluru, India',
  mobility: 'Open to relocation & remote',
  siteUrl: `https://${githubUser}.github.io/portfolio/`,
  email: 'charan.workmaill@gmail.com',
  secondaryEmail: 'charankumarreddy2028@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1WdwS-cfhYwjDMigkE3VQWP5TRUIQqMt5/view',
  links: {
    github: githubUrl,
    linkedin: 'https://www.linkedin.com/in/b-charan-kumar-reddy/',
    leetcode: 'https://leetcode.com/u/charan_red/',
  },
  education: {
    degree: 'B.Tech, Computer Science and Engineering',
    school: 'SRM Institute of Science and Technology',
    location: 'Chennai, India',
    detail: 'CGPA 8.7 / 10',
    period: 'Expected 2027',
  },
};

export const impactMetrics: ImpactMetric[] = [
  {
    value: '−36%',
    label: 'LLM inference latency, 2.5\u00a0s → 1.6\u00a0s',
    source: 'INT8 quantization + prompt caching · General Motors',
  },
  {
    value: '500K+',
    label: 'vector embeddings indexed at 92% retrieval recall',
    source: 'FAISS + Pinecone semantic search · General Motors',
  },
  {
    value: '2 of 5',
    label: 'nodes can fail while Raft keeps committing writes',
    source: 'Leader election + log replication · RaftKV failover tests',
  },
  {
    value: '1st',
    label: 'place, Software Engineering Hackathon',
    source: 'Automated LLM-powered code generation system',
  },
];

export const experience: Role[] = [
  {
    role: 'AI & Automation Engineering Intern',
    org: 'General Motors Technical Center India',
    short: 'General Motors',
    mark: 'GM',
    start: '2026-07',
    location: 'Bengaluru, India',
    type: 'Engineering Internship',
    domain: 'Manufacturing Engineering AI & LLM Infra',
    current: true,
    impact: [
      { value: '−36%', label: 'inference latency (2.5\u00a0s → 1.6\u00a0s)' },
      { value: '500K+', label: 'document embeddings' },
      { value: '92%', label: 'retrieval recall' },
    ],
    bullets: [
      "Engineered production **machine learning, LLM and workflow automation** tools for General Motors' Manufacturing Engineering organization.",
      'Cut LLM inference latency by **36% (from 2.5 s to 1.6 s)** by implementing **INT8 quantization** and deterministic **prompt caching**.',
      'Architected a semantic search and retrieval pipeline indexing **500,000+ technical document embeddings** with **FAISS** and **Pinecone**, achieving **92% retrieval accuracy**.',
    ],
    stack: ['Python', 'INT8 Quantization', 'Prompt Caching', 'FAISS', 'Pinecone', 'RAG Pipelines', 'LLM Systems'],
  },
  {
    role: 'Software Developer Intern',
    org: 'TIQWorld Pvt. Ltd.',
    short: 'TIQWorld',
    mark: 'TQ',
    start: '2026-06',
    end: '2026-07',
    location: 'Chennai, India',
    type: 'Engineering Internship',
    domain: 'Full-Stack & Backend Engineering',
    impact: [{ value: 'Production web architecture' }, { value: 'API performance & SDLC' }],
    bullets: [
      'Developed and shipped modular **full-stack web features** and **RESTful backend services** in a fast-paced production environment.',
      'Collaborated on **database schema optimization**, **API integration** and **automated testing** workflows to improve application responsiveness.',
    ],
    stack: ['TypeScript', 'JavaScript', 'REST APIs', 'SQL', 'Git', 'CI/CD'],
  },
  {
    role: 'Software Engineer Intern',
    org: 'The Developers Arena',
    short: 'The Developers Arena',
    mark: 'DA',
    start: '2026-02',
    end: '2026-05',
    location: 'Remote · India',
    type: 'Engineering Internship',
    domain: 'Backend & Software Engineering',
    impact: [{ value: 'Modular backend services' }, { value: 'Automated test coverage' }],
    bullets: [
      'Built clean, modular **backend services** and **RESTful API** endpoints following production software-engineering and version-control standards.',
      'Implemented automated **unit and integration test suites** to reduce regression defects across releases.',
    ],
    stack: ['Python', 'Java', 'REST APIs', 'PostgreSQL', 'Git'],
  },
  {
    role: 'AI & ML Engineer Intern',
    org: 'Labmentix',
    short: 'Labmentix',
    mark: 'LM',
    start: '2025-07',
    end: '2025-09',
    location: 'Remote · India',
    type: 'Engineering Internship',
    domain: 'Applied Machine Learning',
    impact: [{ value: 'End-to-end ML pipelines' }, { value: 'Automated model inference' }],
    bullets: [
      'Designed and evaluated **supervised ML models**, **feature engineering pipelines** and automated **batch and real-time inference** workflows.',
      'Standardized **model validation metrics** and data preprocessing scripts for **reproducible ML experimentation**.',
    ],
    stack: ['Python', 'scikit-learn', 'Pandas', 'Feature Engineering', 'SQL'],
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function parseMonth(value: string): { year: number; month: number } {
  const [year, month] = value.split('-').map(Number);
  return { year: year ?? 0, month: (month ?? 1) - 1 };
}

/** "Jul 2026 – Present", "Jun 2026" or "Feb 2026 – May 2026". */
export function formatPeriod(role: Pick<Role, 'start' | 'end'>): string {
  const label = (v: string) => {
    const { year, month } = parseMonth(v);
    return `${MONTHS[month]} ${year}`;
  };
  if (!role.end) return `${label(role.start)} – Present`;
  return role.start === role.end ? label(role.start) : `${label(role.start)} – ${label(role.end)}`;
}

/** Inclusive length of a role in months, e.g. "4 mos"; current roles count up to `now`. */
export function formatTenure(role: Pick<Role, 'start' | 'end'>, now: Date = new Date()): string {
  const start = parseMonth(role.start);
  const end = role.end ? parseMonth(role.end) : { year: now.getFullYear(), month: now.getMonth() };
  const months = Math.max(1, (end.year - start.year) * 12 + (end.month - start.month) + 1);
  if (months < 12) return `${months} mo${months === 1 ? '' : 's'}`;
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return `${years} yr${years === 1 ? '' : 's'}${rest ? ` ${rest} mo${rest === 1 ? '' : 's'}` : ''}`;
}

export const skills: SkillGroup[] = [
  {
    group: 'Languages',
    items: ['Python', 'C++', 'Java', 'SQL', 'TypeScript', 'JavaScript'],
  },
  {
    group: 'AI & LLM Infrastructure',
    items: [
      'Multi-Agent Systems (LangGraph)',
      'RAG Pipelines',
      'INT8 Quantization',
      'Prompt Caching',
      'LLM Evaluation & Guardrails',
      'FAISS',
      'Pinecone',
      'Qdrant',
      'PyTorch',
      'Hugging Face + LoRA',
    ],
  },
  {
    group: 'Distributed Systems & Backend',
    items: [
      'Raft Consensus',
      'gRPC',
      'Redis (ZSETs / Lua)',
      'Kafka',
      'REST APIs (FastAPI)',
      'Microservices',
      'Async Concurrency',
      'Circuit Breakers',
    ],
  },
  {
    group: 'Data & ML',
    items: [
      'PostgreSQL',
      'Vector Databases',
      'ETL Pipelines',
      'Debezium CDC',
      'Spark / PySpark',
      'Apache Iceberg',
      'Airflow',
      'scikit-learn',
      'XGBoost',
      'SHAP',
      'A/B Testing (Z-Tests, SRM)',
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: ['Docker', 'Microsoft Azure', 'AWS', 'Google Cloud', 'GitHub Actions CI/CD', 'Prometheus', 'Linux', 'Git'],
  },
];

export const hackathons: Hackathon[] = [
  {
    name: 'Software Engineering Hackathon',
    detail: 'Built an automated, LLM-powered code generation system.',
    result: '1st Place',
  },
  {
    name: 'TenzorX 2026 National AI Hackathon',
    detail: 'National-level AI hackathon, 2026.',
  },
  {
    name: 'Google Cloud Gen AI Exchange Hackathon 2025',
    detail: 'Generative AI hackathon run by Google Cloud.',
  },
];

export const certifications: { group: string; items: string[] }[] = [
  {
    group: 'Cloud certifications',
    items: [
      'AWS Certified Developer – Associate',
      'AWS Certified Cloud Practitioner',
      'Google Cloud Associate Cloud Engineer',
      'Google Cloud Digital Leader',
      'Microsoft Azure Developer Associate',
      'Microsoft Azure Fundamentals',
      'Oracle Cloud Infrastructure certification',
    ],
  },
  {
    group: 'Professional certificates',
    items: [
      'IBM Data Engineering Professional Certificate',
      'Google Data Analytics Professional Certificate',
      'Meta Full Stack Professional Certificate',
      'IIT Madras Data Science certification',
    ],
  },
];
