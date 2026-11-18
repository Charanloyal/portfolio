export interface ImpactMetric {
  value: string;
  label: string;
  source: string;
}

export interface RoleMetric {
  value: string;
  label: string;
}

export interface Role {
  role: string;
  org: string;
  /** Year and month the role started, YYYY-MM. */
  start: string;
  /** Year and month the role ended, YYYY-MM; omitted for a current role. */
  end?: string;
  location: string;
  domain: string;
  current?: boolean;
  impact: RoleMetric[];
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
  shortName: 'Charan',
  headline: 'Distributed Systems & AI Infrastructure Engineer',
  focus: 'SDE · FDE · AI-Infra',
  subheadline:
    'Engineering low-latency LLM inference pipelines, Raft-based distributed storage, and high-throughput backend systems.',
  availability: 'Open to SDE-I / SWE-I, FDE & AI/ML Roles',
  targetRoles: ['SDE-I / SWE-I', 'Forward Deployed Engineer (FDE)', 'AI / ML Engineering', 'Data Engineering'],
  location: 'Bengaluru, India',
  mobility: 'Open to relocation & remote',
  siteUrl: `https://${githubUser}.github.io/portfolio/`,
  email: 'charan.workmaill@gmail.com',
  secondaryEmail: 'charankumarreddy2028@gmail.com',
  resumeUrl: 'https://drive.google.com/file/d/1WdwS-cfhYwjDMigkE3VQWP5TRUIQqMt5/view',
  links: {
    github: githubUrl,
    linkedin: 'https://www.linkedin.com/in/b-charan-kumar-reddy',
    leetcode: 'https://leetcode.com/u/charan_red/',
  },
  education: {
    degree: 'B.Tech, Electronics and Communication Engineering (Data Science)',
    school: 'SRM Institute of Science and Technology',
    location: 'Chennai, India',
    detail: 'CGPA 8.7 / 10',
    period: 'Expected May 2027',
  },
};

export const impactMetrics: ImpactMetric[] = [
  {
    value: '36%',
    label: 'LLM inference latency cut, 2.5 s → 1.6 s',
    source: 'INT8 quantization + prompt caching · Labmentix',
  },
  {
    value: '18 h → 5 min',
    label: 'CAD die-face creation per vehicle panel',
    source: 'Python automation in Siemens NX · General Motors',
  },
  {
    value: '0.77 ms',
    label: 'p50 online feature lookup (p99 1.62 ms)',
    source: 'Redis feature serving · FeatureHub benchmark',
  },
  {
    value: '550+',
    label: 'LeetCode problems solved, top 5.83% globally',
    source: 'Data structures & algorithms · leetcode/charan_red',
  },
];

export const experience: Role[] = [
  {
    role: 'AI/ML Student Intern',
    org: 'General Motors Technical Center India',
    start: '2026-07',
    location: 'Bengaluru, India',
    domain: 'Manufacturing AI & Automation',
    current: true,
    impact: [
      { value: '18 h → 5 min', label: 'die-face creation per panel' },
      { value: '7 engineers', label: 'using the CAD quality tool' },
      { value: '~47 h/month', label: 'manual work saved' },
    ],
    bullets: [
      'Build AI/ML and Python automation for Manufacturing Engineering workflows in Siemens NX.',
      'Automated die-face creation for hood, fender, roof and door panels, cutting it from 18 hours to 5 minutes per panel.',
      'Built a tool that checks and scores CAD surface quality on die faces, now used by 7 engineers on the team.',
      'Together these save the team about 47 hours of manual work a month.',
    ],
    stack: ['Python', 'Siemens NX', 'CAD automation', 'Surface-quality analysis', 'AI/ML tooling'],
  },
  {
    role: 'Full Stack Developer Intern',
    org: 'IIT Madras',
    start: '2026-06',
    end: '2026-06',
    location: 'Chennai, India',
    domain: 'Full-Stack SDE',
    impact: [
      { value: '10+', label: 'REST APIs shipped' },
      { value: '−35%', label: 'integration defects' },
      { value: '−50%', label: 'deployment time' },
    ],
    bullets: [
      'Built 10+ REST APIs and Docker CI/CD, cutting integration defects by 35% and deployment time by 50%.',
      'Shipped a real-time task and chat board as a TypeScript monorepo with WebSockets, Redis caching and offline fallbacks.',
    ],
    stack: ['TypeScript', 'React', 'Express', 'WebSockets', 'Redis', 'Docker', 'GitHub Actions'],
  },
  {
    role: 'Software Engineer Intern',
    org: 'The Developers Arena',
    start: '2026-02',
    end: '2026-05',
    location: 'Hyderabad, India',
    domain: 'Backend & Automation',
    impact: [
      { value: '50+/week', label: 'tickets auto-classified' },
      { value: '−40%', label: 'manual triage effort' },
    ],
    bullets: [
      'Automated Python classification of 50+ Jira/ServiceNow tickets a week, cutting manual triage effort by 40%.',
      'Developed modular backend services and REST APIs with automated CI testing, following production SDLC practices.',
    ],
    stack: ['Python', 'REST APIs', 'Text classification', 'Jira', 'ServiceNow', 'CI testing'],
  },
  {
    role: 'Machine Learning Intern',
    org: 'Technex, IIT (BHU) Varanasi',
    start: '2025-09',
    end: '2025-12',
    location: 'Remote',
    domain: 'Applied ML',
    impact: [
      { value: '+18%', label: 'F1-score on 50K+ records' },
      { value: '88%', label: 'cross-validated accuracy' },
    ],
    bullets: [
      'Raised F1-score by 18% on 50,000+ records through PyTorch and scikit-learn tuning with 5-fold cross-validation.',
      'Trained 5 ML models to 88% cross-validated accuracy, guarded by automated regression test suites.',
    ],
    stack: ['PyTorch', 'scikit-learn', 'Cross-validation', 'Hyperparameter tuning', 'Regression tests'],
  },
  {
    role: 'AI & ML Engineer Intern (promoted)',
    org: 'Labmentix',
    start: '2025-07',
    end: '2025-09',
    location: 'Remote',
    domain: 'LLM Inference & RAG',
    impact: [
      { value: '−36%', label: 'LLM latency (2.5 s → 1.6 s)' },
      { value: '60% faster', label: 'log diagnostics' },
    ],
    bullets: [
      'Cut LLM inference latency by 36% (2.5 s → 1.6 s) with INT8 quantization and prompt caching, benchmarked before and after.',
      'Delivered a FastAPI log-analysis service using SSE-streaming multi-agent RAG, making diagnostics 60% faster.',
      'Built end-to-end ML models, feature engineering pipelines and automated inference workflows.',
    ],
    stack: ['Python', 'INT8 quantization', 'Prompt caching', 'FastAPI', 'SSE streaming', 'Multi-agent RAG'],
  },
  {
    role: 'Data Science Intern',
    org: 'Skill Intern',
    start: '2024-10',
    end: '2024-12',
    location: 'Remote',
    domain: 'Experimentation & Analytics',
    impact: [],
    bullets: [
      'Built AeroTest, an A/B testing tool with power-based sample sizing, two-proportion z-tests, sample-ratio-mismatch checks and ROI projection.',
      'Built ChurnIntel, an explainable churn-risk demo with per-feature contributions and a retention-campaign ROI simulator.',
    ],
    stack: ['Python', 'SciPy', 'statsmodels', 'JavaScript', 'Chart.js'],
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
    items: ['Python', 'SQL', 'TypeScript / JavaScript', 'Java', 'C++'],
  },
  {
    group: 'AI, ML & LLM Systems',
    items: [
      'Multi-agent architectures (LangGraph)',
      'RAG: hybrid BM25 + vector, reranking',
      'INT8 quantization',
      'Prompt caching',
      'LLM evaluation & guardrails',
      'FAISS',
      'Pinecone',
      'Qdrant',
      'PyTorch',
      'Hugging Face Transformers',
      'LoRA / PEFT',
      'scikit-learn',
      'XGBoost',
      'SHAP',
      'ONNX Runtime',
    ],
  },
  {
    group: 'Backend & Distributed Systems',
    items: [
      'Raft consensus',
      'gRPC & Protocol Buffers',
      'REST APIs (FastAPI)',
      'Async I/O (asyncio)',
      'Redis: Lua, ZSET rate limiting',
      'Circuit breakers & EWMA routing',
      'Celery work queues',
      'Microservices',
    ],
  },
  {
    group: 'Data & Storage',
    items: [
      'PostgreSQL',
      'Apache Kafka',
      'Debezium (CDC)',
      'Apache Spark / PySpark',
      'Apache Iceberg',
      'Trino',
      'Apache Airflow',
      'Great Expectations',
      'Vector databases',
      'A/B testing: z-tests, SRM',
    ],
  },
  {
    group: 'Cloud, DevOps & Tooling',
    items: [
      'Docker & Compose',
      'GitHub Actions CI/CD',
      'AWS',
      'Google Cloud',
      'Microsoft Azure',
      'Prometheus',
      'OpenTelemetry',
      'Linux',
      'Git',
    ],
  },
];

export const hackathons: Hackathon[] = [
  {
    name: 'Software Engineering Hackathon',
    detail: 'Built an automated, LLM-powered code generation system.',
  },
  {
    name: 'TenzorX 2026 National AI Hackathon',
    detail: 'National-level AI hackathon, 2026.',
  },
  {
    name: 'Google Cloud Gen AI Exchange Hackathon',
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
