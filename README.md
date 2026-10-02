# StudentRoadmap AI

> **Working name.** An evidence-grounded, personalized career and skill-building roadmap platform for undergraduate students.

## Core Product Statement

> *"AI converts a student's current profile and chosen career direction into an evidence-grounded, measurable skill-building plan, and continuously updates that plan as the student progresses."*

---

## Repository Structure

```
student-roadmap/
├── apps/
│   ├── web/            # Next.js + TypeScript frontend
│   └── api/            # FastAPI Python backend
├── packages/
│   ├── shared-types/   # Shared TypeScript types
│   └── prompts/        # Versioned AI prompt templates
├── data/
│   ├── seeds/          # Curated seed data (careers, skills, resources)
│   └── schemas/        # JSON schemas for data contracts
├── docs/               # Product & technical documentation
├── infra/
│   ├── docker/         # Docker Compose configs
│   └── migrations/     # Alembic database migrations
├── .agents/agents/     # Antigravity subagent definitions
└── .github/workflows/  # CI/CD pipelines
```

---

## Documentation

| Document | Purpose |
|---|---|
| [Product Spec](docs/product-spec.md) | Problem, users, MVP scope, requirements |
| [Architecture](docs/architecture.md) | Technical design decisions |
| [Database](docs/database.md) | Schema, migrations, seed strategy |
| [AI System](docs/ai-system.md) | Prompt architecture, guardrails, evaluation |
| [Market Data](docs/market-data.md) | Data sources, ingestion pipeline |
| [Testing](docs/testing.md) | Testing strategy across all layers |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS, shadcn/ui |
| Backend | Python 3.12, FastAPI, Pydantic v2, SQLAlchemy 2 |
| Database | PostgreSQL 16 + pgvector |
| AI | Gemini API (provider-independent `AIService` abstraction) |
| Auth | Supabase Auth (email + Google OAuth) |
| Infra | Vercel (frontend), Railway/Fly.io (backend), Supabase (DB) |
| CI/CD | GitHub Actions |
| Monitoring | Sentry + structured application logs |

---

## Engineering Principles

1. **Small, independently testable milestones** — no big-bang implementations.
2. **Deterministic logic before AI** — skill gaps, prerequisites, and roadmap ordering are computed in code; AI only explains.
3. **Structured outputs only** — all LLM responses are validated against Pydantic schemas before they touch the database.
4. **Market claims require evidence objects** — no fabricated statistics.
5. **Roadmap versioning** — roadmaps are never overwritten; every change creates a new version with a reason.
6. **AI outputs must be validated against database records** — no AI-generated IDs or URLs.
7. **Security first** — TLS, encryption at rest, RBAC, RLS, rate limiting, audit logs.

---

## MVP Definition of Done

A new student can:

1. Register and complete their profile
2. Browse and select a target career path
3. See a structured skill-gap analysis
4. Generate a prerequisite-ordered roadmap
5. See curated learning resources and projects per phase
6. Mark milestones complete and track progress
7. Understand *why* each recommendation was made

And the system passes: unit tests · integration tests · E2E tests · security tests · AI schema tests.

---

## Phase Roadmap

| Phase | Focus |
|---|---|
| **0 — Validation** | User interviews, problem validation, competitor research |
| **1 — MVP** | Auth, onboarding, career catalog, skill-gap engine, roadmap engine, dashboard |
| **2 — Beta** | Assessments, adaptive roadmap, AI explanations, feedback loops |
| **3 — Advanced** | Market intelligence, job matching, portfolio analysis |
| **4 — Scale** | Event-driven architecture, data warehouse, A/B testing |

---

## Getting Started

> Prerequisites: Git, Node.js 20+, Python 3.12+, Docker, PostgreSQL

```bash
# Clone
git clone <repo-url>
cd student-roadmap

# Copy environment template
cp .env.example .env
# Edit .env with your credentials

# Start services (Docker)
docker compose up -d

# Frontend
cd apps/web && npm install && npm run dev

# Backend
cd apps/api
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
```

---

## Antigravity Workflow

Use the agent definitions in [`.agents/agents/`](.agents/agents/) for specialized review tasks.  
Always: **Spec → Plan artifact → Review → Implement → Test → Review diff → Commit**.  
Never ask an agent to "build the entire product."
