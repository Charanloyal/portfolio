# Charan Kumar Reddy — Developer Portfolio Hub v2.0

[![Test Suite](https://img.shields.io/badge/pytest-5%20passed%20(100%25)-brightgreen.svg)](tests/)
[![Python](https://img.shields.io/badge/Python-3.11%20--%203.14-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.110%2B-009688.svg)](https://fastapi.tiangolo.com/)
[![Design System](https://img.shields.io/badge/UI-Obsidian%20Gold%20Glassmorphic-gold.svg)](#)
[![Live Site](https://img.shields.io/badge/Live%20Portfolio-personal--portfolio--hub-blue.svg)](https://personal-portfolio-hub-3z4y.onrender.com/)

High-performance Developer Portfolio Hub website for **Charan Kumar Reddy** (Distributed Systems & AI/ML Engineer), showcasing production-grade distributed consensus engines, autonomous multi-agent state machines, verifiable CDC data lakehouses and high-throughput backend microservices.

---

## 🏛️ Featured Production Systems & Git Projects

| # | System / Repository | Primary Architecture & Stack | Key Highlights / Live Demos |
|---|---------------------|------------------------------|-----------------------------|
| **1** | [**RaftKV**](https://github.com/Charanloyal/raftkv) | Python 3.11+, Raft Algorithm, gRPC, Protobuf, SQLite WAL | Production-grade distributed consensus KV store with snapshotting and Prometheus `/metrics`. |
| **2** | [**Agent Orchestration System (AOS)**](https://github.com/Charanloyal/Agent-Orchestration-System-) | FastAPI, React, TS, Vite, PostgreSQL 17, Alembic | Evidence-backed research with human gatekeeper approval and 4 typed agents. |
| **3** | [**FeatureHub + DataGuard**](https://github.com/Charanloyal/featurehub-dataguard) | Redis, PySpark, FastAPI, Great Expectations, OpenLineage | Self-defending ML feature store with zero PIT leak & automated CI schema diffing. **276 passed tests (100%)**. |
| **4** | [**NeuralGateway**](https://github.com/Charanloyal/neural-gateway) | FastAPI, Redis Lua Token Buckets, Kafka 7.5, Prometheus | Multi-tenant LLM routing with circuit breakers & live command center. |
| **5** | [**AgentForge**](https://github.com/Charanloyal/agent-forge) | LangGraph, Qdrant Vector DB, BM25, Cross-Encoder | Agentic RAG with cyclic multi-hop reflection and deterministic scoring harness. |
| **6** | [**LakeFlow**](https://github.com/Charanloyal/lakeflow) | PostgreSQL WAL, Debezium, Kafka KRaft, Spark 3.5, Iceberg, Trino | Sub-second CDC lakehouse with LSN-guarded idempotent MERGE. |
| **7** | [**OctoScale**](https://github.com/Charanloyal/octoscale-url-shortener) | FastAPI, Redis ZSET Sliding Window, PostgreSQL, Structlog | Sustains **10,000+ Req/Sec** with atomic Base62 counter generation. |
| **8** | [**AgentCodex**](https://github.com/Charanloyal/multi-agent-llm-code-generator) | FastAPI, TF-IDF RAG, SSE Streaming, Asyncio Queue | Cooperative Synthesis + Critique loop with **0.04s query cache**. |
| **9** | [**SmartRecovery**](https://github.com/Charanloyal/Smart-Loan-Recovery-System-with-Machine-Learning-) | FastAPI, Scikit-Learn, XGBoost, Chart.js Metrics | Dual-stage scoring: **F1: 88.73%** default risk & **R²: 0.6813** recovery forecast. |
| **10** | [**Real-Time Fraud Detector**](https://github.com/Charanloyal/Data-Science-Projects/tree/main/realtime-fraud-detector) | PySpark Structured Streaming, Apache Kafka, Random Forest | Built-in interactive simulator classifying anomalous card transactions. |
| **11** | [**txn-pipeline**](https://github.com/Charanloyal/txn-pipeline) | FastAPI, Celery Distributed Workers, Redis, PostgreSQL 16 | Distributed asynchronous event pipeline with Gemini AI classification. |
| **12** | [**A/B Testing Platform**](https://github.com/Charanloyal/Data-Science-Projects/tree/main/ab-testing-platform) | SciPy, Pandas, Hypothesis Testing Suite | Built-in interactive statistical platform calculating Z-scores & confidence intervals. |
| **13** | [**J.P. Morgan Workspace Task Board**](https://github.com/Charanloyal/Full-Stack-Integration) | React 18, TypeScript, Socket.io, Zustand, Express, PostgreSQL | Real-time corporate Kanban board with instant WebSocket sync. |

---

## 🎨 UI/UX & Glassmorphic Design System
- **Obsidian Dark & Champagne Gold Theme**: Curated dark palette (`#05070d`) with radial color nebulae (Gold, Electric Cyan, Amethyst, Emerald).
- **Interactive Particle Constellation**: Pure HTML5 Canvas particle field connecting nodes with gold/cyan threads and reacting to cursor proximity.
- **CharanOS v2.4 Interactive Terminal**: Mac-style glass CLI console supporting commands (`projects`, `status`, `skills`, `timeline`, `latest`, `contact`).
- **Instant Search & Category Filters**: Real-time filtering across titles, technologies, and architecture keywords.
- **Deep-Dive Architecture Spec Modal**: Displays system data flows, design decisions, and benchmark specifications.
- **Live GitHub Sync**: Real-time GitHub profile stats (`@Charanloyal`) with language distribution breakdown.

---

## ⚙️ Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Charanloyal/portfolio.git
   cd portfolio
   ```

2. **Run with Python venv:**
   ```bash
   python -m venv .venv
   .venv\Scripts\activate      # On Windows
   # source .venv/bin/activate  # On macOS/Linux
   pip install -r requirements.txt
   uvicorn app.main:app --reload --port 8000
   ```

3. **Or run with Docker Compose:**
   ```bash
   docker-compose up --build
   ```

4. **Access the application:**
   Open [http://localhost:8000](http://localhost:8000) in your web browser.

---

## 🧪 Testing & Verification

Run the full automated test suite:
```bash
pytest
```
*Current test suite: 5 passed in 0.07s (100% pass rate).*

---

## 📬 Contact & Coordinates
- **Email**: [charan.workmaill@gmail.com](mailto:charan.workmaill@gmail.com)
- **LinkedIn**: [b-charan-kumar-reddy](https://www.linkedin.com/in/b-charan-kumar-reddy-132a36292/)
- **GitHub**: [@Charanloyal](https://github.com/Charanloyal)
  
