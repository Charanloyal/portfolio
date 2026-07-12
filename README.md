# Premium Developer Portfolio Hub

This repository contains the premium Developer Portfolio Hub website for **Charan Kumar Reddy** (AI/ML Engineer & Systems Developer). 

The application utilizes a **luxury Black & Gold glassmorphic design system** and serves as a unified showcase hub displaying professional internships and three core deployed engineering projects:
- ⚡ **OctoScale**: High-Scale Distributed URL Shortener (FastAPI, Redis ZSET, PostgreSQL).
- 🤖 **SmartRecovery**: Credit Risk & Asset Recovery Engine (FastAPI, XGBoost/Scikit-learn).
- 💻 **AgentCodex**: Multi-Agent LLM Code Synthesizer (FastAPI, TF-IDF RAG, Asyncio SSE).

---

## 🛠️ Tech Stack & Features
- **Backend Server**: FastAPI (serving static routes and validating contact submissions using Pydantic).
- **Frontend Design**: Vanilla HTML5 and CSS3 (custom CSS variables, glowing backdrops, alternating timeline grids, and responsive flexboxes).
- **Interactivity**: Dynamic project filtering and tab management using lightweight Vanilla JS.
- **Infrastructure**: Standardized Dockerfile, Docker Compose, and Render Blueprints.

---

## ⚙️ Running Locally

Initialize the application stack in one command:
```bash
docker-compose up --build
```
Open `http://localhost:8000` in your web browser.

---

## 🧪 Testing and Coverage
Verify the API endpoints using pytest:
```bash
pytest --cov=app --cov-report=term-missing tests/
```
The test suite maintains **93% test coverage**.
