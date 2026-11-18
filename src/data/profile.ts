export interface ImpactMetric {
  value: string;
  label: string;
  source: string;
}

export interface Role {
  role: string;
  org: string;
  period: string;
  location: string;
  current?: boolean;
  bullets: string[];
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
  headline: 'Software & AI/ML Engineer',
  focus: 'Distributed Systems, LLM Architecture & Data Pipelines',
  subheadline:
    'Building low-latency AI infrastructure, fault-tolerant distributed backends, and high-throughput data systems.',
  availability: 'Open to SWE, SDE & AI/ML Roles',
  targetRoles: ['Software Engineering (SWE / SDE)', 'AI / ML Engineering', 'Data Engineering'],
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
    period: 'Jul 2026 – Present',
    location: 'Bengaluru, India',
    current: true,
    bullets: [
      'Build AI/ML and Python automation for Manufacturing Engineering workflows in Siemens NX.',
      'Automated die-face creation for hood, fender, roof and door panels, cutting it from 18 hours to 5 minutes per panel.',
      'Built a tool that checks and scores CAD surface quality on die faces, now used by 7 engineers on the team.',
      'Together these save the team about 47 hours of manual work a month.',
    ],
  },
  {
    role: 'Full Stack Developer Intern',
    org: 'IIT Madras',
    period: 'Jun 2026',
    location: 'Chennai, India',
    bullets: ['Built 10+ REST APIs and Docker CI/CD, cutting integration defects by 35% and deployment time by 50%.'],
  },
  {
    role: 'Software Engineer Intern',
    org: 'The Developers Arena',
    period: 'Feb 2026 – May 2026',
    location: 'Hyderabad, India',
    bullets: [
      'Automated Python classification of 50+ Jira/ServiceNow tickets a week, cutting manual triage effort by 40%.',
      'Built modular backend services and REST APIs with automated tests, following production SDLC practices.',
    ],
  },
  {
    role: 'Machine Learning Intern',
    org: 'Technex, IIT (BHU) Varanasi',
    period: 'Sep 2025 – Dec 2025',
    location: 'Remote',
    bullets: [
      'Raised F1-score by 18% on 50,000+ records through PyTorch and scikit-learn tuning with 5-fold cross-validation.',
      'Trained 5 ML models to 88% cross-validated accuracy, guarded by automated regression test suites.',
    ],
  },
  {
    role: 'AI & ML Engineer Intern (promoted)',
    org: 'Labmentix',
    period: 'Jul 2025 – Sep 2025',
    location: 'Remote',
    bullets: [
      'Cut LLM inference latency by 36% (2.5 s → 1.6 s) with INT8 quantization and prompt caching, benchmarked before and after.',
      'Delivered a FastAPI log-analysis service using SSE-streaming multi-agent RAG, making diagnostics 60% faster.',
    ],
  },
  {
    role: 'Data Science Intern',
    org: 'Skill Intern',
    period: 'Oct 2024 – Dec 2024',
    location: 'Remote',
    bullets: [
      'Built AeroTest, an A/B testing tool with power-based sample sizing, two-proportion z-tests, sample-ratio-mismatch checks and ROI projection.',
      'Built ChurnIntel, an explainable churn-risk demo with per-feature contributions and a retention-campaign ROI simulator.',
    ],
  },
];

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
