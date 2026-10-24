/**
 * Charan Kumar Reddy - Developer Portfolio Hub v2.0
 * Interactive Systems & Glassmorphic Experience Engine
 */

// Architecture Specifications Dictionary for Modal Deep-Dives
const ARCHITECTURE_SPECS = {
    "spec-raftkv": {
        title: "RaftKV — Distributed Consensus Key-Value Store",
        category: "Distributed Systems & Consensus Core",
        github: "https://github.com/Charanloyal/raftkv",
        demo: null,
        docs: null,
        diagram: `sequenceDiagram
    autonumber
    Client ->> Follower (node-2): PUT("user:100", "Alice")
    Follower -->> Client: Reply NOT_LEADER (Leader Hint: "node-1:50051")
    Client ->> Leader (node-1): PUT("user:100", "Alice")
    Leader ->> SQLite WAL: Append Entry (Index=5, Term=2, Op=PUT)
    Leader ->> Follower: AppendEntries(prevIndex=4, entries=[Index=5])
    Follower ->> SQLite WAL: Persist & Reply Success(MatchIndex=5)
    Note over Leader: Quorum Reached (Majority >= 2/3 nodes)
    Leader ->> State Machine: Apply Index=5 to KeyValueStateMachine
    Leader -->> Client: PutReply(Success=True)
    Leader ->> Follower: AppendEntries(leaderCommit=5)`,
        highlights: [
            "Strict Consensus Core: Exact implementation of Ongaro & Ousterhout Raft specification in Python 3.11+.",
            "Dynamic Leader Election: Randomized election timeouts (150ms-300ms) with heartbeat timers preventing split votes.",
            "Durable Write-Ahead Log (WAL): ACID-compliant SQLite WAL engine persisting term, index, and command payloads.",
            "Log Compaction & Snapshotting: Periodic state machine serialization truncates WAL to prevent unbounded disk growth.",
            "Observability & gRPC: Prometheus metrics exporter (/metrics) monitoring election counts, commit latency, and active peer health."
        ],
        metrics: [
            { k: "Consensus Model", v: "Raft v1.0 (Strict Quorum)" },
            { k: "RPC Protocol", v: "gRPC & Protocol Buffers" },
            { k: "WAL Persistence", v: "SQLite Write-Ahead Logging" },
            { k: "Observability", v: "Prometheus /metrics" }
        ]
    },
    "spec-aos": {
        title: "Agent Orchestration System (AOS)",
        category: "Autonomous Multi-Agent Architecture",
        github: "https://github.com/Charanloyal/Agent-Orchestration-System-",
        demo: null,
        docs: null,
        diagram: `flowchart LR
    Brief[User Brief] --> Planner[Planner Agent]
    Planner --> TypedPlan[Typed Research Plan]
    TypedPlan --> Gate1{Human Approval}
    Gate1 -- Approved --> Researcher[Parallel Researchers]
    Researcher --> Cites[Cited Evidence Draft]
    Cites --> Reviewer[Reviewer Agent (Max 2 Rounds)]
    Reviewer --> Gate2{Human Sign-Off}
    Gate2 -- Approved --> Export[Final Export & Artifact]`,
        highlights: [
            "Cooperative Multi-Agent Flow: Orchestrates Planner, Researcher, Writer, and Reviewer agents in a typed, deterministic pipeline.",
            "Double Human-in-the-Loop Gates: Requires human authorization for research scope and final cited report version.",
            "Strict Evidence Attribution: Bounded parallel search enforcing inline source citation graphs.",
            "Enterprise Architecture: FastAPI async workers, PostgreSQL 17 ACID persistence with Alembic migrations, and React + Vite UI."
        ],
        metrics: [
            { k: "Agent Loop", v: "4 Cooperative Typed Roles" },
            { k: "Database", v: "PostgreSQL 17 + Alembic" },
            { k: "Frontend UI", v: "React + TS + Vite SPA" },
            { k: "Review Boundary", v: "Max 2 Review Cycles" }
        ]
    },
    "spec-featurehub": {
        title: "FeatureHub + DataGuard: Machine Learning Platform",
        category: "Data Platform & Production MLOps",
        github: "https://github.com/Charanloyal/featurehub-dataguard",
        demo: "https://sympathy-mesh-microphone-oakland.trycloudflare.com",
        docs: "https://crafts-leaves-spring-beef.trycloudflare.com",
        diagram: `flowchart TD
    RawData[Streaming & Batch Data] --> DG[DataGuard Contract Guard]
    DG --> Diff{Schema Drift?}
    Diff -- Breaking --> BlockCI[100% CI Rejection & Alert]
    Diff -- Clean --> FH[FeatureHub Store]
    FH --> Online[(Redis Online Store: <1ms)]
    FH --> Offline[(PostgreSQL / Parquet Offline Store)]
    Offline --> PIT[Leak-Free PIT Join Engine]
    PIT --> Training[Model Training Sets (0% Leakage)]
    Online --> Serving[Low-Latency Model Inference]`,
        highlights: [
            "Leak-Free Point-In-Time (PIT) Joins: As-of joins ensure training datasets have zero temporal data leakage.",
            "Sub-Millisecond Online Serving: Atomic Redis key lookups supplying 122 validated features for production inference.",
            "Automated CI Schema Diffing: Blocks 100% of breaking backward-incompatibility schema mutations in pull requests.",
            "Great Expectations Quality Suites: 276 comprehensive unit and integration tests passing with 100% success rate."
        ],
        metrics: [
            { k: "Test Suite", v: "276 / 276 Tests Passed (100%)" },
            { k: "Online Lookups", v: "< 1ms Redis Response" },
            { k: "Features Active", v: "122 Validated Features" },
            { k: "Data Governance", v: "OpenLineage Column Graphs" }
        ]
    },
    "spec-neural-gateway": {
        title: "NeuralGateway: Distributed LLM Inference Gateway",
        category: "AI Infrastructure & Distributed Routing",
        github: "https://github.com/Charanloyal/neural-gateway",
        demo: "https://neural-gateway-core.onrender.com/",
        docs: "https://neural-gateway-core.onrender.com/docs",
        diagram: `flowchart LR
    Client[Client App] --> Gateway[FastAPI NeuralGateway]
    Gateway --> RL{Redis Lua Token Bucket}
    RL -- Exceeded --> 429[HTTP 429 Rate Limited]
    RL -- Allowed --> CB{Circuit Breaker State}
    CB -- Open --> Fallback[Provider Failover]
    CB -- Closed --> LLM[Upstream LLM Provider]
    Gateway -. Async Event .-> Kafka[(Kafka Telemetry Stream)]
    Kafka --> Prom[Prometheus /metrics]`,
        highlights: [
            "Tiered Atomic Rate Limiting: Lua scripts executed on Redis nodes preventing race conditions under heavy concurrency.",
            "Distributed Event Streaming: Every request telemetry, token consumption, and latency metric streamed to Apache Kafka.",
            "Three-State Circuit Breakers: Closed, Open, and Half-Open states prevent cascade failures during upstream LLM provider degradation.",
            "Live Interactive Command Center: Interactive dashboard with real-time provider switching and Swagger UI at /docs."
        ],
        metrics: [
            { k: "Rate Limiter", v: "Atomic Redis Lua Buckets" },
            { k: "Streaming Bus", v: "Apache Kafka 7.5.0" },
            { k: "Telemetry", v: "Prometheus v2.51.0" },
            { k: "Deployment", v: "Live Render Command Center" }
        ]
    },
    "spec-agent-forge": {
        title: "AgentForge: Enterprise Agentic RAG Platform",
        category: "Autonomous AI & Intelligent Retrieval",
        github: "https://github.com/Charanloyal/agent-forge",
        demo: "https://agent-forge-to4e.onrender.com",
        docs: "https://agent-forge-to4e.onrender.com/docs",
        diagram: `flowchart TD
    Q[User Complex Query] --> LangGraph[LangGraph State Machine]
    LangGraph --> Expand[Multi-Hop Query Expansion]
    Expand --> Sparse[Sparse BM25 Index]
    Expand --> Dense[Dense Qdrant Vectors]
    Sparse & Dense --> RRF[Reciprocal Rank Fusion]
    RRF --> CrossEnc[Cross-Encoder Neural Reranker]
    CrossEnc --> Synthesize[LLM Response Generation]
    Synthesize --> Reflect{Critique & Reflection}
    Reflect -- Needs Revision --> Expand
    Reflect -- Grounded --> Output[Final Grounded Answer]`,
        highlights: [
            "Cyclic Agentic Reflection: LangGraph cyclical graph loops back to re-retrieve if context grounding confidence falls below threshold.",
            "Hybrid Retrieval + RRF: Merges lexical keyword precision (BM25) with semantic vector recall (Qdrant).",
            "Cross-Encoder Re-Ranking: Scores passage-query pairs directly with deep attention models, eliminating false-positive citations.",
            "Programmatic Scoring Harness: Rigorous deterministic evaluation benchmark scoring answer relevancy and context faithfulness."
        ],
        metrics: [
            { k: "State Machine", v: "LangGraph 0.2.0" },
            { k: "Vector Engine", v: "Qdrant v1.9.7" },
            { k: "Re-Ranking", v: "Cross-Encoder Transformer" },
            { k: "Evaluation", v: "Programmatic RAGTriad" }
        ]
    },
    "spec-lakeflow": {
        title: "LakeFlow: CDC Lakehouse Engine",
        category: "Data Engineering & Streaming Architecture",
        github: "https://github.com/Charanloyal/lakeflow",
        demo: "https://lakeflow-demo.onrender.com/lakeflow/",
        docs: null,
        diagram: `flowchart LR
    PG[(PostgreSQL 16 WAL)] -->|pgoutput| DBZ[Debezium Kafka Connect]
    DBZ -->|Keyed by PK| Kafka[(Kafka 3.9 KRaft)]
    Kafka --> Spark[Spark 3.5 Structured Streaming]
    Spark -->|LSN-Guarded MERGE| Bronze[(Iceberg bronze.cdc_events)]
    Spark -->|Silver MERGE| Silver[(Iceberg silver.orders)]
    Spark -->|Rejects| DLQ[(Iceberg ops.dlq_events)]
    Bronze & Silver --> Trino[Trino 476 Query Engine]
    Trino --> API[FastAPI Control Plane] --> UI[Next.js UI]`,
        highlights: [
            "Verifiable Delivery Semantics: Exactly-once ingestion semantics guarding against duplicates, retries, and schema drift.",
            "LSN-Guarded MERGE: Spark Structured Streaming validates Log Sequence Numbers to guarantee deterministic state ordering.",
            "Iceberg Table Format: ACID lakehouse storage on MinIO with time-travel snapshots and partition pruning.",
            "Interactive Control Plane: FastAPI backend with Next.js frontend and automated Airflow maintenance DAGs."
        ],
        metrics: [
            { k: "Streaming Engine", v: "Apache Spark 3.5" },
            { k: "Table Format", v: "Apache Iceberg on MinIO" },
            { k: "CDC Bus", v: "Kafka 3.9 KRaft + Debezium" },
            { k: "Query Speed", v: "Sub-Second via Trino 476" }
        ]
    },
    "spec-octoscale": {
        title: "OctoScale: Distributed URL Shortener",
        category: "High-Scale Distributed Systems",
        github: "https://github.com/Charanloyal/octoscale-url-shortener",
        demo: "https://octoscale-web.onrender.com",
        docs: "https://octoscale-web.onrender.com/docs",
        diagram: `flowchart TD
    Client[HTTP Client] --> API[FastAPI Router]
    API --> RateLimit{Redis ZSET Sliding Window}
    RateLimit -- Blocked --> 429[HTTP 429 Rate Limit]
    RateLimit -- Allowed --> Cache{Redis Cache Hit?}
    Cache -- Yes --> Redirect[302 Redirect]
    Cache -- No --> DB[(PostgreSQL Database)]
    DB --> CacheWrite[Write-Through Redis]
    CacheWrite --> Redirect
    API -. Async Task .-> Analytics[Click Analytics Logger]`,
        highlights: [
            "10,000+ Requests / Sec Throughput: Architected with non-blocking async IO and connection pooling.",
            "Sliding-Window Rate Limiter: Redis Sorted Sets (ZSET) timestamp tracking prevents traffic spikes and API abuse.",
            "Atomic Identifier Generation: High-speed Redis counter with automatic PostgreSQL sequence recovery.",
            "Clean Layered OOP Architecture: Separated Presentation, Service, and Repository persistence layers."
        ],
        metrics: [
            { k: "Throughput", v: "10,000+ Req/Sec" },
            { k: "Rate Limiter", v: "Redis ZSET Sliding Window" },
            { k: "Base Encoding", v: "Bijective Base62" },
            { k: "Test Coverage", v: "86% Statement Coverage" }
        ]
    },
    "spec-agentcodex": {
        title: "AgentCodex: Multi-Agent LLM Code Synthesizer",
        category: "Autonomous AI & Intelligent Synthesis",
        github: "https://github.com/Charanloyal/multi-agent-llm-code-generator",
        demo: "https://multi-agent-llm-code-generator.onrender.com",
        docs: null,
        diagram: `flowchart TD
    Req[Code Synthesis Request] --> Cache{Query Hash Cache?}
    Cache -- Hit (0.04s) --> Return[Immediate Return]
    Cache -- Miss --> SSE[FastAPI SSE Stream]
    SSE --> Hop1[Multi-Hop RAG Context Expansion]
    Hop1 --> Synth[Synthesis Agent: Drafts Code]
    Synth --> Crit[Critique Agent: Reviews Lint/Bugs]
    Crit -- Needs Refinement --> Synth
    Crit -- Validated --> Stream[Stream to IDE via SSE]`,
        highlights: [
            "0.04s Query Cache Hit: Write-through cache hashes semantic requests to deliver instant cached responses.",
            "Cooperative Critique Loop: Synthesis and Critique agents iteratively polish generated Python code.",
            "Live SSE Streaming: Streams token-by-token code generation directly to the black-and-gold glassmorphic IDE.",
            "Multi-Hop Context Expansion: Retrieval engine traverses related syntax docs before drafting."
        ],
        metrics: [
            { k: "Cached Latency", v: "0.04 Seconds" },
            { k: "Stream Protocol", v: "Server-Sent Events (SSE)" },
            { k: "Agent Architecture", v: "Dual-Agent Cooperative Loop" },
            { k: "Runtime Engine", v: "FastAPI + Asyncio" }
        ]
    },
    "spec-smartrecovery": {
        title: "SmartRecovery: ML Credit Risk & Recovery Engine",
        category: "Fintech & Predictive Modeling",
        github: "https://github.com/Charanloyal/Smart-Loan-Recovery-System-with-Machine-Learning-",
        demo: "https://smart-loan-recovery-6ou2.onrender.com/",
        docs: null,
        diagram: `flowchart LR
    Applicant[Loan Application Features] --> Preprocess[Scikit-learn Pipeline]
    Preprocess --> Stage1[Stage 1: Logistic Classifier]
    Stage1 --> RiskScore[Default Risk Score (F1: 88.73%)]
    RiskScore --> Decision{Risk Threshold}
    Decision -- High Risk --> Stage2[Stage 2: Recovery Regressor (R²: 0.6813)]
    Decision -- Low Risk --> Approve[Automated Approval]
    Stage2 --> Strategy[Optimal Asset Recovery Plan]`,
        highlights: [
            "Dual-Stage Predictive Pipeline: Stage 1 scores default probability; Stage 2 predicts expected distress recovery.",
            "Validated Accuracy Metrics: 88.73% F1-score for risk classification and 0.6813 R² for recovery forecasting.",
            "Interactive Dynamic Simulation: Live sliders enable risk officers to simulate interest rate shocks.",
            "Chart.js Visualizer: Real-time visualization of model probability distributions and feature importances."
        ],
        metrics: [
            { k: "Risk Model F1", v: "88.73% F1-Score" },
            { k: "Recovery Model R²", v: "0.6813 R²" },
            { k: "Frameworks", v: "Scikit-Learn, XGBoost, FastAPI" },
            { k: "Simulation", v: "Real-time Chart.js Metrics" }
        ]
    },
    "spec-fraud-detector": {
        title: "Real-Time Financial Fraud Detector",
        category: "Data Streaming & Fraud Analytics",
        github: "https://github.com/Charanloyal/Data-Science-Projects/tree/main/realtime-fraud-detector",
        demo: "/fraud-detector/",
        docs: null,
        diagram: `flowchart LR
    Transactions[Card Transaction Feed] --> Kafka[Kafka Streaming Topic]
    Kafka --> Spark[PySpark Structured Streaming]
    Spark --> Model[Random Forest Classifier]
    Model --> Score[Real-time Risk Classification]
    Score --> Alert[Instant Suspicious Transaction Alert]`,
        highlights: [
            "Embedded Interactive Simulator: Integrated right into this portfolio hub at /fraud-detector/.",
            "Kafka Streaming Ingestion: High-frequency simulation of credit card transaction velocity.",
            "Random Forest Classifier: Detects anomalous transaction locations and spending spikes in real-time."
        ],
        metrics: [
            { k: "Streaming", v: "Apache Kafka + PySpark" },
            { k: "Classifier", v: "Random Forest Ensemble" },
            { k: "Latency", v: "Real-Time Sub-Second" }
        ]
    },
    "spec-txn-pipeline": {
        title: "txn-pipeline: High-Throughput Transaction Engine",
        category: "Distributed Systems & Asynchronous Pipelines",
        github: "https://github.com/Charanloyal/txn-pipeline",
        demo: null,
        docs: null,
        diagram: `flowchart TD
    TxnFeed[Transaction Feed] --> API[FastAPI Ingestion Endpoint]
    API --> RedisQ[(Redis Message Broker)]
    RedisQ --> CeleryPool[Celery Distributed Workers]
    CeleryPool --> Validate[ACID Validation & Tagging]
    CeleryPool --> Gemini[Gemini LLM Classifier]
    Validate --> PG[(PostgreSQL 16 ACID Persistence)]`,
        highlights: [
            "Distributed Celery Worker Pool: Decouples ingestion from compute-intensive transaction validation.",
            "PostgreSQL 16 ACID Persistence: Complete Alembic migration history and relational integrity.",
            "Gemini 1.5 LLM Tagger: Asynchronously classifies complex merchant categories and transaction contexts."
        ],
        metrics: [
            { k: "Worker Architecture", v: "Celery Distributed Pools" },
            { k: "Broker", v: "Redis In-Memory Bus" },
            { k: "Database", v: "PostgreSQL 16 ACID" }
        ]
    },
    "spec-ab-testing": {
        title: "A/B Testing & Statistical Inference Engine",
        category: "Data Science & Statistical Decision-Making",
        github: "https://github.com/Charanloyal/Data-Science-Projects/tree/main/ab-testing-platform",
        demo: "/ab-testing/",
        docs: null,
        diagram: `flowchart TD
    Data[Experiment Cohort Data] --> Calc[Statistical Inference Engine]
    Calc --> ZScore[Z-Score & Chi-Square Calculation]
    Calc --> PVal[Two-Tailed P-Value Evaluation]
    PVal --> Decide{p < 0.05?}
    Decide -- Yes --> Significant[Reject Null Hypothesis: Roll Out Variant]
    Decide -- No --> Inconclusive[Retain Null Hypothesis]`,
        highlights: [
            "Embedded Interactive Suite: Runs directly inside this portfolio at /ab-testing/.",
            "Scientific Rigor: Computes exact Z-scores, p-values, standard errors, and 95%/99% confidence intervals.",
            "Curve Visualizer: Matplotlib & Pandas statistical curve generation for business stakeholders."
        ],
        metrics: [
            { k: "Inference Tests", v: "Two-Tailed Z-Test & Chi-Square" },
            { k: "Confidence Bounds", v: "95% and 99% Intervals" },
            { k: "Core Library", v: "SciPy + Pandas" }
        ]
    },
    "spec-jpmorgan": {
        title: "J.P. Morgan Workspace Task Board",
        category: "Full-Stack Enterprise Applications",
        github: "https://github.com/Charanloyal/Full-Stack-Integration",
        demo: "https://full-stack-integration-7m7z.onrender.com/",
        docs: null,
        diagram: `flowchart LR
    ClientA[Engineer Browser A] --> WS[Socket.io WebSocket Server]
    ClientB[Engineer Browser B] --> WS
    WS --> State[Zustand Sync State]
    WS --> DB[(PostgreSQL Database)]`,
        highlights: [
            "Instant Real-Time Sync: Socket.io bidirectional communication across multi-user Kanban swimlanes.",
            "Zustand State Store: Lightweight, flicker-free client state synchronization.",
            "React-Query Caching: Automated background cache invalidation and query deduplication."
        ],
        metrics: [
            { k: "Real-time Protocol", v: "Socket.io WebSockets" },
            { k: "Frontend", v: "React 18 + TypeScript" },
            { k: "Backend", v: "Node.js + Express" }
        ]
    }
};

// ==========================================================================
// 1. DYNAMIC BACKGROUND PARTICLE CANVAS (Interactive Constellation)
// ==========================================================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    const particleCount = window.innerWidth < 768 ? 40 : 85;
    const maxDistance = 140;

    let mouse = { x: null, y: null, radius: 160 };

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1;
            this.color = Math.random() > 0.4 ? 'rgba(212, 175, 55, ' : 'rgba(0, 229, 255, ';
            this.alpha = Math.random() * 0.5 + 0.2;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Mouse proximity interaction
            if (mouse.x !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    let force = (mouse.radius - dist) / mouse.radius;
                    this.x -= (dx / dist) * force * 2.5;
                    this.y -= (dy / dist) * force * 2.5;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            for (let j = i + 1; j < particles.length; j++) {
                let dx = particles[i].x - particles[j].x;
                let dy = particles[i].y - particles[j].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDistance) {
                    let alpha = (1 - dist / maxDistance) * 0.22;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ==========================================================================
// 2. HERO ROLE TYPEWRITER ANIMATION
// ==========================================================================
function initTypewriter() {
    const el = document.getElementById('hero-typewriter');
    if (!el) return;

    const words = [
        "Distributed Systems & Consensus Core",
        "Autonomous Multi-Agent AI Pipelines",
        "Sub-Second CDC Lakehouses & Iceberg",
        "High-Throughput 10K+ Req/Sec Microservices",
        "Quantitative ML Risk & Fraud Engines"
    ];

    let wordIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function type() {
        const currentWord = words[wordIdx];
        if (isDeleting) {
            el.textContent = currentWord.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 35;
        } else {
            el.textContent = currentWord.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 70;
        }

        if (!isDeleting && charIdx === currentWord.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            wordIdx = (wordIdx + 1) % words.length;
            typingSpeed = 400; // Pause before typing new word
        }

        setTimeout(type, typingSpeed);
    }
    type();
}

// ==========================================================================
// 3. INTERACTIVE CLI TERMINAL (CharanOS v2.4)
// ==========================================================================
const TERMINAL_COMMANDS = {
    help: () => `
Available CharanOS Commands:
  <span class="term-cyan">projects</span>      - List all 13 production systems & Git repositories
  <span class="term-cyan">status</span>        - Display real-time cluster health, telemetry & uptime
  <span class="term-cyan">skills</span>        - Show categorized tech stack proficiencies
  <span class="term-cyan">timeline</span>      - Print internship timeline & engineering achievements
  <span class="term-cyan">latest</span>        - Spotlight latest October 2026 Git projects (RaftKV, AOS, NeuralGateway)
  <span class="term-cyan">contact</span>       - Jump to contact section & show direct coordinates
  <span class="term-cyan">clear</span>         - Clear the console window
`,
    status: () => `
<span class="term-gold">CharanOS v2.4 Platform Telemetry</span>
------------------------------------------------------
  Status:           <span class="term-green">HEALTHY (100% Operational)</span>
  Active Cluster:   Render Cloud + Cloudflare Tunnels
  Core Runtime:     Python 3.11 - 3.14 / FastAPI / gRPC
  Consensus Engine: Raft Consensus Core (Ongaro & Ousterhout)
  Throughput Cap:   10,000+ Req/Sec (OctoScale)
  ML Quality:       276 Tests Passing (FeatureHub + DataGuard)
  LeetCode:         Top 5.83% Globally (charan_red, 550+ solved)
  Open for Roles:   Senior SDE / Distributed Systems / AI & MLOps
`,
    skills: () => `
<span class="term-gold">Core Engineering Skill Matrix</span>
------------------------------------------------------
  [Distributed Systems]  Raft, gRPC, Protobuf, SQLite WAL, Redis (Lua/ZSET), Kafka
  [Data & Lakehouses]    Apache Iceberg, Apache Spark, Debezium CDC, Trino, MinIO
  [AI & Autonomous]      LangGraph, Multi-Agent Loops, Multi-Hop RAG, BM25, Qdrant
  [Languages & Backend]  Python (95%), SQL (90%), TypeScript (85%), FastAPI, Node.js
  [Infrastructure]       Docker, Docker Compose, Prometheus, Grafana, OpenLineage
`,
    latest: () => `
<span class="term-gold">Latest GitHub Repositories (Oct 2026)</span>
------------------------------------------------------
  1. <span class="term-cyan">RaftKV</span>: Strongly consistent distributed key-value store using Raft over gRPC.
     URL: https://github.com/Charanloyal/raftkv
  2. <span class="term-cyan">Agent Orchestration System</span>: Evidence-backed multi-agent research with human gates.
     URL: https://github.com/Charanloyal/Agent-Orchestration-System-
  3. <span class="term-cyan">FeatureHub + DataGuard</span>: ML feature store (122 features) + automated CI contract guard.
     URL: https://github.com/Charanloyal/featurehub-dataguard
  4. <span class="term-cyan">NeuralGateway</span>: Multi-tenant LLM routing with Redis Lua rate limits & Kafka streaming.
     URL: https://github.com/Charanloyal/neural-gateway
`,
    projects: () => `
<span class="term-gold">Production Systems Showcase (13 Deployed & Open-Source Projects)</span>
-----------------------------------------------------------------------------
  [1]  RaftKV                Distributed Raft Consensus KV Store (Python/gRPC)
  [2]  Agent Orchestration   Planner/Researcher/Writer Typed System (FastAPI/React)
  [3]  FeatureHub+DataGuard  ML Feature Store & Contract Guard (276 Tests Passed)
  [4]  NeuralGateway         Multi-Tenant LLM Gateway (Redis Lua/Kafka/Render)
  [5]  AgentForge            Agentic RAG with Hybrid BM25+Qdrant & Cross-Encoder
  [6]  LakeFlow              Verifiable CDC Lakehouse (Postgres->Kafka->Spark->Iceberg)
  [7]  OctoScale             10K+ Req/Sec Distributed URL Shortener (Redis ZSET)
  [8]  AgentCodex            Multi-Agent Code Synthesizer (0.04s Cached SSE)
  [9]  SmartRecovery         Dual-Stage Loan Default & Recovery Rate Predictor
  [10] Real-Time Fraud Det   PySpark Streaming Credit Card Fraud Classifier
  [11] txn-pipeline          Celery Distributed High-Throughput Transaction Pipeline
  [12] A/B Testing Engine    SciPy Statistical Hypothesis Testing Suite
  [13] J.P. Morgan Board     Real-Time WebSocket Kanban Workspace Portal

  * Click any card below or run 'spec &lt;name&gt;' for architecture blueprints!
`,
    timeline: () => `
<span class="term-gold">Professional Experience Timeline</span>
------------------------------------------------------
  • Jun 2026 - Present:  Full Stack Developer Intern @ IIT Madras
  • Feb 2026 - May 2026: Software Engineering Intern @ Developers Arena (Bengaluru)
  • Jul 2025 - Nov 2025: AI/ML Engineering Intern @ Labmentex
  • Jul 2025 - Sep 2025: Machine Learning Intern @ IIT Varanasi (Technex)
  • May 2025 - Jun 2025: Data Analytics Intern @ Bluestock Fintech
`,
    contact: () => {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        return `Jumping to contact section... Drop a message directly to: <span class="term-gold">charan.workmaill@gmail.com</span>`;
    }
};

function runTerminalCmd(rawCmd) {
    const output = document.getElementById('terminal-output');
    const input = document.getElementById('terminal-input');
    if (!output) return;

    const cmd = rawCmd.trim().toLowerCase();
    output.innerHTML += `\n<span class="terminal-prompt">charan@systems:~$</span> ${rawCmd}\n`;

    if (cmd === 'clear') {
        output.innerHTML = `Welcome to CharanOS v2.4 (x86_64-systems-linux-gnu)\nType <span class="term-cyan">'help'</span> to see available commands or click quick actions above.\n`;
    } else if (TERMINAL_COMMANDS[cmd]) {
        output.innerHTML += TERMINAL_COMMANDS[cmd]();
    } else if (cmd === '') {
        // empty
    } else {
        output.innerHTML += `<span style="color:#ef4444;">Command not recognized: '${rawCmd}'. Type <span class="term-cyan">'help'</span> for available commands.</span>\n`;
    }

    const body = document.getElementById('terminal-body');
    if (body) body.scrollTop = body.scrollHeight;
    if (input) input.value = '';
}

function initTerminal() {
    const input = document.getElementById('terminal-input');
    if (!input) return;

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            runTerminalCmd(input.value);
        }
    });

    const quickBtns = document.querySelectorAll('.quick-cmd-btn');
    quickBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            runTerminalCmd(cmd);
        });
    });
}

// ==========================================================================
// 4. INSTANT SEARCH & FILTER GALLERY
// ==========================================================================
let currentCategory = 'all';

function filterProjects(category) {
    currentCategory = category;

    // Update filter button states
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-filter') === category);
    });

    applyFilters();
}

function applyFilters() {
    const query = (document.getElementById('project-search')?.value || '').toLowerCase().trim();
    const cards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category') || '';
        const cardTitle = card.querySelector('.project-title')?.innerText.toLowerCase() || '';
        const cardDesc = card.querySelector('.project-desc')?.innerText.toLowerCase() || '';
        const cardTags = card.getAttribute('data-tags')?.toLowerCase() || '';
        const cardHighlights = card.getAttribute('data-highlights')?.toLowerCase() || '';

        const matchesCategory = currentCategory === 'all' || cardCategory.includes(currentCategory);
        const matchesQuery = !query || 
            cardTitle.includes(query) || 
            cardDesc.includes(query) || 
            cardTags.includes(query) || 
            cardHighlights.includes(query);

        if (matchesCategory && matchesQuery) {
            card.style.display = 'flex';
            visibleCount++;
        } else {
            card.style.display = 'none';
        }
    });

    const noResults = document.getElementById('no-projects-found');
    if (noResults) {
        noResults.style.display = visibleCount === 0 ? 'block' : 'none';
    }
}

function initSearchAndFilters() {
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
}

// ==========================================================================
// 5. ARCHITECTURE SPEC MODAL
// ==========================================================================
function openSpecModal(specId) {
    const spec = ARCHITECTURE_SPECS[specId];
    if (!spec) return;

    const overlay = document.getElementById('spec-modal-overlay');
    if (!overlay) return;

    document.getElementById('modal-cat').innerText = spec.category;
    document.getElementById('modal-title').innerText = spec.title;
    document.getElementById('modal-diagram').innerText = spec.diagram;

    // Highlights list
    const highlightsContainer = document.getElementById('modal-highlights');
    highlightsContainer.innerHTML = '';
    spec.highlights.forEach(h => {
        const li = document.createElement('li');
        li.innerText = h;
        highlightsContainer.appendChild(li);
    });

    // Metrics grid
    const metricsContainer = document.getElementById('modal-metrics-grid');
    metricsContainer.innerHTML = '';
    spec.metrics.forEach(m => {
        const div = document.createElement('div');
        div.className = 'mini-metric-item';
        div.innerHTML = `<span class="mini-metric-k">${m.k}</span><span class="mini-metric-v">${m.v}</span>`;
        metricsContainer.appendChild(div);
    });

    // Action links
    const actionsBar = document.getElementById('modal-actions-bar');
    actionsBar.innerHTML = '';

    if (spec.demo) {
        const demoA = document.createElement('a');
        demoA.href = spec.demo;
        demoA.target = '_blank';
        demoA.className = 'btn btn-primary';
        demoA.innerHTML = `🟢 Launch Live Deployment`;
        actionsBar.appendChild(demoA);
    }

    if (spec.docs) {
        const docsA = document.createElement('a');
        docsA.href = spec.docs;
        docsA.target = '_blank';
        docsA.className = 'btn btn-cyan';
        docsA.innerHTML = `📖 API Swagger Docs`;
        actionsBar.appendChild(docsA);
    }

    const gitA = document.createElement('a');
    gitA.href = spec.github;
    gitA.target = '_blank';
    gitA.className = 'btn btn-outline';
    gitA.innerHTML = `📦 Inspect GitHub Source`;
    actionsBar.appendChild(gitA);

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeSpecModal() {
    const overlay = document.getElementById('spec-modal-overlay');
    if (!overlay) return;
    overlay.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on Escape or click outside
window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeSpecModal();
});

// ==========================================================================
// 6. GITHUB LIVE STATS LOADER
// ==========================================================================
async function fetchGitHubStats() {
    try {
        const resp = await fetch('https://api.github.com/users/Charanloyal');
        if (!resp.ok) return;
        const data = await resp.json();

        const reposEl = document.getElementById('git-public-repos');
        const followersEl = document.getElementById('git-followers');
        const followingEl = document.getElementById('git-following');

        if (reposEl) reposEl.innerText = data.public_repos || '33+';
        if (followersEl) followersEl.innerText = data.followers || '15+';
        if (followingEl) followingEl.innerText = data.following || '20+';
    } catch (e) {
        console.warn('Using cached GitHub telemetry:', e);
    }
}

// ==========================================================================
// 7. COPY EMAIL TO CLIPBOARD WITH TOAST
// ==========================================================================
function copyEmailToClipboard() {
    const email = 'charan.workmaill@gmail.com';
    navigator.clipboard.writeText(email).then(() => {
        showToast('✓ Email copied to clipboard: ' + email);
    }).catch(() => {
        showToast('charan.workmaill@gmail.com');
    });
}

function showToast(message) {
    let toast = document.getElementById('glass-toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'glass-toast';
        toast.style.position = 'fixed';
        toast.style.bottom = '2rem';
        toast.style.right = '2rem';
        toast.style.padding = '0.9rem 1.6rem';
        toast.style.background = 'rgba(10, 15, 26, 0.95)';
        toast.style.color = '#f3e5ab';
        toast.style.border = '1px solid #d4af37';
        toast.style.borderRadius = '9999px';
        toast.style.fontFamily = 'var(--font-mono)';
        toast.style.fontSize = '0.88rem';
        toast.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8), 0 0 20px rgba(212, 175, 55, 0.3)';
        toast.style.zIndex = '9999';
        toast.style.transition = 'all 0.3s ease';
        document.body.appendChild(toast);
    }
    toast.innerText = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateY(0)';

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(10px)';
    }, 3200);
}

// ==========================================================================
// 8. CONTACT FORM SUBMISSION
// ==========================================================================
async function handleContact(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;
    
    const successAlert = document.getElementById('contact-success');
    const errorAlert = document.getElementById('contact-error');
    const submitBtn = document.getElementById('submit-btn');
    
    successAlert.style.display = 'none';
    errorAlert.style.display = 'none';
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = `
        <svg class="spin" style="animation: spin 1s linear infinite;" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a10 10 0 0 1 10 10"></path></svg>
        Transmitting Message...
    `;
    
    try {
        const response = await fetch('/api/v1/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, message })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            successAlert.innerText = data.message;
            successAlert.style.display = 'block';
            document.getElementById('contact-form').reset();
            showToast('✓ Message transmitted successfully!');
        } else {
            let errorMsg = data.detail || 'Failed to dispatch contact request';
            if (Array.isArray(errorMsg)) errorMsg = errorMsg.map(err => err.msg).join(', ');
            throw new Error(errorMsg);
        }
    } catch (err) {
        errorAlert.innerText = err.message;
        errorAlert.style.display = 'block';
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
            Send High-Priority Message
        `;
    }
}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
    initParticleCanvas();
    initTypewriter();
    initTerminal();
    initSearchAndFilters();
    fetchGitHubStats();
});
