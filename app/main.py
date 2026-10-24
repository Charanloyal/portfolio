import os
import time
from contextlib import asynccontextmanager
from typing import List, Optional
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

START_TIME = time.time()

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle events startup/shutdown."""
    print("Charan Kumar Reddy - Developer Portfolio Hub Live.")
    yield
    print("Charan Kumar Reddy - Developer Portfolio Hub Offline.")

app = FastAPI(
    title="Charan Kumar Reddy - Developer Portfolio Hub",
    description="Unified senior portfolio showcasing distributed systems, AI/ML engineering, and high-performance backend platforms.",
    version="2.0.0",
    lifespan=lifespan
)

# Mount static and templates folders
app.mount("/static", StaticFiles(directory="app/static"), name="static")
app.mount("/fraud-detector", StaticFiles(directory="app/static/realtime-fraud-detector", html=True), name="fraud-detector")
app.mount("/ab-testing", StaticFiles(directory="app/static/ab-testing-platform", html=True), name="ab-testing")
templates = Jinja2Templates(directory="app/templates")

# Contact Form Schema
class ContactMessage(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="Sender Name")
    email: str = Field(..., pattern=r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$", description="Sender Email Address")
    message: str = Field(..., min_length=10, max_length=1000, description="Message content")

# Detailed Project Data for API & Terminal
PROJECTS_DATA = [
    {
        "id": "raftkv",
        "title": "RaftKV — Distributed Consensus Key-Value Store",
        "tagline": "Ongaro & Ousterhout Raft Consensus over gRPC with SQLite WAL & Prometheus Metrics",
        "category": "distributed-systems",
        "category_label": "Distributed Systems",
        "highlight": "Strict Consensus Core • SQLite WAL • Dynamic Leader Election • gRPC Protobuf",
        "description": "Production-grade, strongly consistent distributed key-value store built from scratch in Python 3.11+ using the Raft Consensus Algorithm. Implements leader election, term validation, candidate log up-to-date verification, log compaction with snapshotting, and atomic Write-Ahead Logging (WAL) via SQLite.",
        "metrics": {"consensus": "Raft v1.0", "transport": "gRPC / Protobuf", "storage": "ACID SQLite WAL", "observability": "Prometheus /metrics"},
        "tags": ["Python 3.11+", "Raft Consensus", "gRPC", "Protobuf", "SQLite WAL", "Prometheus", "Distributed Systems"],
        "github_url": "https://github.com/Charanloyal/raftkv",
        "demo_url": None,
        "spec_id": "spec-raftkv",
        "status_badge": "Consensus Core Verified"
    },
    {
        "id": "agent-orchestration-system",
        "title": "Agent Orchestration System (AOS)",
        "tagline": "Evidence-Backed Multi-Agent Research with Human-in-the-Loop Governance",
        "category": "ai-agents",
        "category_label": "Autonomous AI & Agents",
        "highlight": "Planner/Researcher/Writer/Reviewer Pipeline • Typed Workflows • PostgreSQL 17",
        "description": "Controlled multi-agent orchestration platform coordinating planner, researcher, writer, and reviewer agents through strict typed state machines. Enforces human plan approval, bounded parallel research, cited evidence graphs, and double-gate version sign-offs.",
        "metrics": {"architecture": "4 Cooperative Agents", "database": "PostgreSQL 17 + Alembic", "frontend": "React + Vite + TS", "backend": "FastAPI Async"},
        "tags": ["Python 3.14", "FastAPI", "React", "TypeScript", "Vite", "PostgreSQL 17", "Multi-Agent Systems", "Docker"],
        "github_url": "https://github.com/Charanloyal/Agent-Orchestration-System-",
        "demo_url": None,
        "spec_id": "spec-aos",
        "status_badge": "Production Pilot"
    },
    {
        "id": "featurehub-dataguard",
        "title": "FeatureHub + DataGuard: Machine Learning Platform",
        "tagline": "Self-Defending Data Platform with Zero-Leak Point-in-Time Joins & CI Schema Diffing",
        "category": "data-engineering",
        "category_label": "Data Platform & MLOps",
        "highlight": "276 Passed Tests (100%) • 122 Features • 0% PIT Leak • Live Cloudflare Tunnel",
        "description": "Integrated enterprise ML data platform. FeatureHub provides offline storage and low-latency Redis online feature serving with leak-free Point-In-Time (PIT) joins. DataGuard enforces 25+ YAML contracts, automated schema diffing in CI/CD, Great Expectations test suites, and OpenLineage graphs.",
        "metrics": {"test_pass_rate": "100% (276/276)", "online_latency": "< 1ms Redis", "features_managed": "122 Features", "schema_guard": "100% Drift Blocked"},
        "tags": ["Python 3.12", "Redis", "PySpark", "FastAPI", "Great Expectations", "OpenLineage", "PostgreSQL", "Docker"],
        "github_url": "https://github.com/Charanloyal/featurehub-dataguard",
        "demo_url": "https://sympathy-mesh-microphone-oakland.trycloudflare.com",
        "gateway_url": "https://crafts-leaves-spring-beef.trycloudflare.com",
        "spec_id": "spec-featurehub",
        "status_badge": "🟢 Live Public Gateway"
    },
    {
        "id": "neural-gateway",
        "title": "NeuralGateway: Distributed LLM Inference Gateway",
        "tagline": "Multi-Tenant High-Throughput Routing with Redis Lua Token Buckets & Kafka Telemetry",
        "category": "distributed-systems",
        "category_label": "Distributed Systems",
        "highlight": "Live Interactive Control Center • Kafka Telemetry • 3-State Circuit Breakers",
        "description": "High-throughput multi-tenant distributed LLM inference gateway. Features intelligent tier-based rate limiting via atomic Redis Lua scripts, Kafka distributed streaming telemetry, 3-state circuit breaker protection against downstream LLM outages, and dynamic provider failover.",
        "metrics": {"throughput": "Multi-Tenant Async", "rate_limiter": "Redis Lua Token Bucket", "streaming": "Kafka 7.5.0", "telemetry": "Prometheus v2.51"},
        "tags": ["Python 3.11+", "FastAPI", "Redis Lua", "Apache Kafka", "Docker", "Prometheus", "LLM Routing"],
        "github_url": "https://github.com/Charanloyal/neural-gateway",
        "demo_url": "https://neural-gateway-core.onrender.com/",
        "docs_url": "https://neural-gateway-core.onrender.com/docs",
        "spec_id": "spec-neural-gateway",
        "status_badge": "🟢 Live Command Center"
    },
    {
        "id": "agent-forge",
        "title": "AgentForge: Enterprise Agentic RAG Platform",
        "tagline": "Multi-Hop Cyclic Reflection with Hybrid Sparse/Dense Retrieval & Cross-Encoder Reranking",
        "category": "ai-agents",
        "category_label": "Autonomous AI & Agents",
        "highlight": "LangGraph State Machine • BM25 + Qdrant RRF • Cross-Encoder Reranker • Evaluation Harness",
        "description": "Production-grade Agentic Retrieval-Augmented Generation (RAG) platform featuring automated multi-hop query reflection, Reciprocal Rank Fusion (RRF) combining sparse BM25 and dense Qdrant vector search, cross-encoder neural reranking, and deterministic programmatic evaluation harness.",
        "metrics": {"framework": "LangGraph 0.2.0", "vector_db": "Qdrant v1.9.7", "eval_harness": "Programmatic RAGTriad", "database": "PostgreSQL 16"},
        "tags": ["Python 3.11", "LangGraph", "FastAPI", "Qdrant", "PostgreSQL", "Cross-Encoder", "Hybrid Search", "Pytest"],
        "github_url": "https://github.com/Charanloyal/agent-forge",
        "demo_url": "https://agent-forge-to4e.onrender.com",
        "docs_url": "https://agent-forge-to4e.onrender.com/docs",
        "spec_id": "spec-agent-forge",
        "status_badge": "🟢 Live Web Dashboard"
    },
    {
        "id": "lakeflow",
        "title": "LakeFlow: CDC Lakehouse Engine",
        "tagline": "Verifiable Sub-Second CDC Streaming into Apache Iceberg with LSN-Guarded MERGE",
        "category": "data-engineering",
        "category_label": "Data Platform & MLOps",
        "highlight": "PostgreSQL WAL • Debezium • Kafka KRaft • Spark 3.5 Streaming • Iceberg on MinIO • Trino",
        "description": "Sub-second CDC lakehouse streaming change events from PostgreSQL WAL through Debezium into Kafka KRaft, Spark 3.5 Structured Streaming with LSN-guarded idempotent MERGE into Apache Iceberg bronze/silver tiers, automated DLQ recovery, and interactive Trino queries.",
        "metrics": {"latency": "Sub-Second Delivery", "semantics": "Exactly-Once Ingestion", "lakehouse": "Apache Iceberg", "query_engine": "Trino 476"},
        "tags": ["PostgreSQL WAL", "Debezium", "Apache Kafka", "Apache Spark", "Apache Iceberg", "Trino", "Airflow", "FastAPI", "Next.js"],
        "github_url": "https://github.com/Charanloyal/lakeflow",
        "demo_url": "https://lakeflow-demo.onrender.com/lakeflow/",
        "spec_id": "spec-lakeflow",
        "status_badge": "🟢 Live Lakehouse Demo"
    },
    {
        "id": "octoscale",
        "title": "OctoScale: Distributed URL Shortener",
        "tagline": "Ultra-High-Throughput Service Engineered to Sustain 10,000+ Requests Per Second",
        "category": "distributed-systems",
        "category_label": "Distributed Systems",
        "highlight": "10K+ Req/Sec • Redis ZSET Sliding Window • PostgreSQL Base62 Fallback • Structlog",
        "description": "Distributed URL shortening engine designed for extreme scale. Features atomic Redis counter generation, write-through caching, sliding-window rate limiters utilizing Redis Sorted Sets (ZSET), and live analytics with click tracking.",
        "metrics": {"throughput": "10,000+ Req/Sec", "rate_limiter": "Redis ZSET Sliding Window", "encoding": "Base62 Bijective", "test_cov": "86% Statement Cov"},
        "tags": ["FastAPI", "Redis ZSET", "PostgreSQL", "Docker Compose", "Pytest", "Structlog", "High-Scale"],
        "github_url": "https://github.com/Charanloyal/octoscale-url-shortener",
        "demo_url": "https://octoscale-web.onrender.com",
        "docs_url": "https://octoscale-web.onrender.com/docs",
        "spec_id": "spec-octoscale",
        "status_badge": "🟢 Live High-Scale App"
    },
    {
        "id": "agentcodex",
        "title": "AgentCodex: Multi-Agent LLM Code Synthesizer",
        "tagline": "Dual-Agent Loop (Synthesis + Critique) with Multi-Hop RAG & 0.04s Cached SSE Streaming",
        "category": "ai-agents",
        "category_label": "Autonomous AI & Agents",
        "highlight": "0.04s Query Cache Hit • Server-Sent Events (SSE) • Asyncio Task Queues",
        "description": "Production-grade code synthesis engine with cooperative dual-agent loop (synthesis + critique) and multi-hop retrieval. Streams live code generation step-by-step via Server-Sent Events (SSE) with query hash caching dropping response times to 0.04s.",
        "metrics": {"cache_latency": "0.04s Sub-Second", "streaming": "Server-Sent Events", "architecture": "Synthesis + Critique Loop", "runtime": "FastAPI Async"},
        "tags": ["FastAPI", "TF-IDF RAG", "SSE Stream", "Asyncio Queue", "LLM Agents", "Black & Gold UI"],
        "github_url": "https://github.com/Charanloyal/multi-agent-llm-code-generator",
        "demo_url": "https://multi-agent-llm-code-generator.onrender.com",
        "spec_id": "spec-agentcodex",
        "status_badge": "🟢 Live Synthesis IDE"
    },
    {
        "id": "smartrecovery",
        "title": "SmartRecovery: ML Credit Risk & Recovery Engine",
        "tagline": "Two-Stage Predictive Modeling for Loan Default Probability & Distress Recovery Rate",
        "category": "fintech",
        "category_label": "Fintech & Analytics",
        "highlight": "F1: 88.73% Default Risk • R²: 0.6813 Recovery Rate • Interactive Simulation Calculators",
        "description": "Dual-stage machine learning predictive scoring system evaluating applicant loan default probabilities and forecasting expected asset recovery rates upon credit distress using Scikit-Learn, XGBoost, and FastAPI with Chart.js real-time visualizers.",
        "metrics": {"classification_f1": "88.73% F1-Score", "regression_r2": "0.6813 R²", "models": "Logistic Regression + Ridge", "interface": "Chart.js Metrics"},
        "tags": ["FastAPI", "XGBoost", "Scikit-Learn", "Joblib", "Docker", "Fintech", "Predictive Modeling"],
        "github_url": "https://github.com/Charanloyal/Smart-Loan-Recovery-System-with-Machine-Learning-",
        "demo_url": "https://smart-loan-recovery-6ou2.onrender.com/",
        "spec_id": "spec-smartrecovery",
        "status_badge": "🟢 Live Fintech App"
    },
    {
        "id": "fraud-detector",
        "title": "Real-Time Financial Fraud Detector",
        "tagline": "Streaming Transaction Classification with Apache Kafka, PySpark & Random Forest",
        "category": "data-engineering",
        "category_label": "Data Platform & MLOps",
        "highlight": "Built-in Interactive Simulator • Kafka Stream Ingestion • PySpark Structured Streaming",
        "description": "Designed a real-time financial fraud detection pipeline ingesting transaction streams via Kafka, processing micro-batches with PySpark Structured Streaming, and applying Random Forest classifiers to predict fraudulent charges instantaneously.",
        "metrics": {"pipeline": "Kafka -> PySpark -> Model", "algorithm": "Random Forest Ensemble", "deployment": "Embedded Portfolio App", "latency": "Real-time"},
        "tags": ["Python", "Apache Kafka", "PySpark", "Scikit-Learn", "Docker", "Fraud Detection"],
        "github_url": "https://github.com/Charanloyal/Data-Science-Projects/tree/main/realtime-fraud-detector",
        "demo_url": "/fraud-detector/",
        "spec_id": "spec-fraud-detector",
        "status_badge": "🟢 Built-in Interactive App"
    },
    {
        "id": "txn-pipeline",
        "title": "txn-pipeline: High-Throughput Transaction Engine",
        "tagline": "Distributed Event-Driven Processing with Celery Pools, Redis Brokers & PostgreSQL 16",
        "category": "distributed-systems",
        "category_label": "Distributed Systems",
        "highlight": "Celery Distributed Workers • Redis Broker • PostgreSQL 16 • Gemini AI Classification",
        "description": "Distributed asynchronous transaction ingestion and validation engine built with Celery worker pools over Redis brokers, PostgreSQL 16 ACID persistence with Alembic migrations, Docker Compose orchestration, and Gemini LLM transaction classification.",
        "metrics": {"broker": "Redis In-Memory", "workers": "Celery Distributed Pool", "persistence": "PostgreSQL 16 ACID", "llm_tagger": "Gemini 1.5"},
        "tags": ["FastAPI", "Celery", "Redis Broker", "PostgreSQL 16", "Alembic", "Docker Compose", "Gemini AI"],
        "github_url": "https://github.com/Charanloyal/txn-pipeline",
        "demo_url": None,
        "spec_id": "spec-txn-pipeline",
        "status_badge": "High-Throughput Worker"
    },
    {
        "id": "ab-testing",
        "title": "A/B Testing & Statistical Inference Engine",
        "tagline": "Automated Hypothesis Testing Platform for Conversion Rate Optimization & Decision-Making",
        "category": "fintech",
        "category_label": "Fintech & Analytics",
        "highlight": "Built-in Interactive Suite • SciPy Hypothesis Testing • Z-Score & P-Value Visualizer",
        "description": "Built an interactive statistical platform for experiment evaluations. Calculates p-values, Z-scores, and confidence intervals across conversion rate splits, plotting statistical significance curves using Pandas and SciPy for automated business decision-making.",
        "metrics": {"inference": "Two-Tailed Z-Test & Chi-Square", "confidence_intervals": "95% / 99% CI", "engine": "SciPy + Pandas", "deployment": "Embedded Portfolio App"},
        "tags": ["Python", "SciPy", "Pandas", "Matplotlib", "Jupyter", "Hypothesis Testing"],
        "github_url": "https://github.com/Charanloyal/Data-Science-Projects/tree/main/ab-testing-platform",
        "demo_url": "/ab-testing/",
        "spec_id": "spec-ab-testing",
        "status_badge": "🟢 Built-in Interactive App"
    },
    {
        "id": "full-stack-integration",
        "title": "J.P. Morgan Workspace Task Board",
        "tagline": "Real-Time Corporate Kanban Board & Collaboration Suite with WebSockets & React",
        "category": "fintech",
        "category_label": "Fintech & Analytics",
        "highlight": "Socket.io WebSockets • Zustand State • React-Query Backend Sync • Express API",
        "description": "Designed a real-time Kanban board and team communication portal mimicking corporate SWE workspaces. Integrates Socket.io websockets for instant task updates, Zustand state stores, and React-Query backend synchronization caches.",
        "metrics": {"realtime": "Socket.io WebSockets", "state": "Zustand Stores", "cache": "React-Query", "stack": "React + TypeScript + Node"},
        "tags": ["React", "TypeScript", "Node.js", "Express", "Socket.io", "PostgreSQL", "Full-Stack"],
        "github_url": "https://github.com/Charanloyal/Full-Stack-Integration",
        "demo_url": "https://full-stack-integration-7m7z.onrender.com/",
        "spec_id": "spec-jpmorgan",
        "status_badge": "🟢 Live Workspace Demo"
    }
]

@app.get("/", response_class=HTMLResponse)
async def serve_portfolio(request: Request):
    """Renders the main developer portfolio hub with all latest projects."""
    return templates.TemplateResponse(
        request=request, 
        name="index.html", 
        context={"projects": PROJECTS_DATA}
    )

@app.get("/api/v1/projects")
async def get_projects(category: Optional[str] = None):
    """API endpoint returning all portfolio projects with optional filtering."""
    if category and category != "all":
        filtered = [p for p in PROJECTS_DATA if category in p["category"] or category in " ".join(p["tags"]).lower()]
        return {"total": len(filtered), "projects": filtered}
    return {"total": len(PROJECTS_DATA), "projects": PROJECTS_DATA}

@app.get("/api/v1/system-status")
async def get_system_status():
    """Health, latency, and uptime telemetry endpoint for the interactive terminal."""
    uptime_seconds = int(time.time() - START_TIME)
    return {
        "status": "HEALTHY",
        "version": "2.0.0",
        "developer": "Charan Kumar Reddy",
        "title": "Systems & AI/ML Engineer",
        "uptime": f"{uptime_seconds // 3600}h {(uptime_seconds % 3600) // 60}m {uptime_seconds % 60}s",
        "total_projects": len(PROJECTS_DATA),
        "active_live_deployments": sum(1 for p in PROJECTS_DATA if p.get("demo_url")),
        "github": "https://github.com/Charanloyal",
        "leetcode": "https://leetcode.com/u/charan_red/",
        "endpoints": {
            "root": "/",
            "projects": "/api/v1/projects",
            "contact": "/api/v1/contact",
            "fraud_detector": "/fraud-detector/",
            "ab_testing": "/ab-testing/"
        }
    }

@app.post("/api/v1/contact")
async def handle_contact_message(payload: ContactMessage):
    """
    Handles recruiter and collaborator contact requests.
    Validates payload and simulates email dispatching.
    """
    try:
        print(f"SENDING CONTACT EMAIL: From={payload.name} ({payload.email}) Message={payload.message}")
        return JSONResponse(
            content={
                "status": "success",
                "message": f"Thank you {payload.name}! Charan Kumar Reddy will get back to you shortly."
            },
            status_code=status.HTTP_200_OK
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to dispatch contact request: {str(e)}"
        )
