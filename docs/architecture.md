# StudentRoadmap AI — Technical Architecture

> **Version:** 1.0.0  
> **Status:** MVP Design  
> **Last Updated:** 2026-10-02  
> **Audience:** Engineering team, technical reviewers

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Frontend Architecture](#2-frontend-architecture-nextjs-14--typescript)
3. [Backend Architecture](#3-backend-architecture-fastapi--python-312)
4. [Core Service Descriptions](#4-core-service-descriptions)
5. [Career Matching Algorithm](#5-career-matching-algorithm-fully-deterministic)
6. [Roadmap Generation Algorithm](#6-roadmap-generation-algorithm-fully-deterministic)
7. [Competency Model](#7-competency-model)
8. [AI Architecture](#8-ai-architecture)
9. [Database Architecture](#9-database-architecture)
10. [Authentication & Authorization](#10-authentication--authorization)
11. [Background Jobs](#11-background-jobs)
12. [Roadmap Versioning & Event Model](#12-roadmap-versioning--event-model)
13. [Market Data Architecture](#13-market-data-architecture)
14. [Observability](#14-observability)
15. [MVP Deployment](#15-mvp-deployment)
16. [Security Architecture](#16-security-architecture)
17. [Scalability (Deferred to Phase 4)](#17-scalability-deferred-to-phase-4)

---

## 1. Architecture Overview

StudentRoadmap AI is a monolithic-but-modular web application that generates personalised career roadmaps for students. The system is intentionally simple at MVP stage — a single deployable backend, a single deployable frontend, and a single managed database — while the internal module boundaries are kept clean so that individual components can be extracted to separate services in later phases.

### High-Level Data Flow

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             STUDENT CLIENT LAYER                                 │
│                                                                                  │
│   Browser  ─────────────────────────────────────────────────────────────────>   │
│   (React/Next.js 14 App Router, TanStack Query, shadcn/ui, Tailwind CSS)         │
│                                                                                  │
│   Pages: Onboarding │ Dashboard │ Roadmap │ Skills │ Projects │ Market Insights   │
└──────────────────────────────┬───────────────────────────────────────────────────┘
                               │  HTTPS REST (JSON)  /api/v1/*
                               │  Bearer JWT (Supabase Auth)
                               ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              BACKEND LAYER (FastAPI)                             │
│                                                                                  │
│  ┌─────────────────────────────────────────────────────────────────────────┐     │
│  │  API Layer  app/api/v1/                                                  │     │
│  │  auth · profiles · careers · roadmaps · skills · resources · market     │     │
│  └────────────────┬───────────────────────────────────────────────────────┘     │
│                   │                                                              │
│  ┌────────────────▼───────────────────────────────────────────────────────┐     │
│  │  Service Layer  app/services/ + app/recommendations/ + app/ai/          │     │
│  │                                                                         │     │
│  │  ┌──────────────────────┐  ┌─────────────────────┐  ┌───────────────┐  │     │
│  │  │    Skill Engine       │  │   Roadmap Engine    │  │  AI Service   │  │     │
│  │  │  SkillGapService      │  │  RoadmapGeneration  │  │  (Provider-   │  │     │
│  │  │  CompetencyModel      │  │  ProjectRecommend.  │  │  Independent) │  │     │
│  │  │  ProgressAnalysis     │  │  ResourceRecommend. │  └───────┬───────┘  │     │
│  │  └──────────────────────┘  └─────────────────────┘          │          │     │
│  │                                                               │ LLM API  │     │
│  │  ┌──────────────────────────────────────────────────────┐    │          │     │
│  │  │  Market Intelligence  app/market/                     │    │          │     │
│  │  │  MarketIntelligenceService · Connectors · Ingestion   │    │          │     │
│  │  └──────────────────────────────────────────────────────┘    │          │     │
│  └───────────────────────────────────────────────────────────────┘          │     │
│                   │                                              ▲           │     │
│  ┌────────────────▼───────────────────────────────────────────┐ │  Gemini/  │     │
│  │  Repository Layer  app/repositories/                        │ │  OpenAI/  │     │
│  │  Async SQLAlchemy ORM, unit-of-work, query builders         │ │  Anthropic│     │
│  └────────────────┬───────────────────────────────────────────┘ │           │     │
└───────────────────┼──────────────────────────────────────────────────────────────┘
                    │ asyncpg + pgvector
                    ▼
┌──────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                          │
│                                                                                  │
│  ┌────────────────────────────┐      ┌──────────────────────────────────────┐   │
│  │  PostgreSQL 16 (Supabase)   │      │  Curated Reference Data              │   │
│  │  + pgvector extension       │      │  • Career definitions (ESCO/O*NET)   │   │
│  │  • All domain tables        │      │  • Skill taxonomy                    │   │
│  │  • Embedding columns        │      │  • Learning resources (curated)      │   │
│  │  • RLS policies             │      └──────────────────────────────────────┘   │
│  │  • Audit log table          │      ┌──────────────────────────────────────┐   │
│  └────────────────────────────┘      │  Market Evidence Data                │   │
│                                       │  • Govt statistics (Tier 1)          │   │
│  ┌────────────────────────────┐      │  • ESCO/O*NET/NCS (Tier 2)           │   │
│  │  Redis (job queue / cache)  │      └──────────────────────────────────────┘   │
│  │  Celery / RQ workers        │                                                  │
│  └────────────────────────────┘                                                  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

### Design Principles

| Principle | Rationale |
|-----------|-----------|
| **Deterministic-first** | Career matching and roadmap generation are fully deterministic algorithms. AI is only used for natural-language explanation and enrichment, not for scoring decisions. |
| **Provider-independent AI** | All LLM calls go through a single `AIService` interface. Switching from Gemini to OpenAI or Anthropic requires changing one configuration value. |
| **Structured output validation** | Every LLM response is parsed against a Pydantic schema before being stored or returned. Invalid AI output is rejected and retried — it never reaches the database. |
| **Soft deletes everywhere** | No user-visible data is permanently deleted. All tables have a `deleted_at` column. Hard deletion is a separate, privileged administrative action. |
| **Immutable roadmap versions** | A roadmap is never mutated in place. Each meaningful change produces a new version record, enabling full history, diff, and rollback. |

---

## 2. Frontend Architecture (Next.js 14 + TypeScript)

### Technology Choices

| Concern | Technology | Reason |
|---------|-----------|--------|
| Framework | Next.js 14 App Router | Server Components reduce JS bundle; layouts simplify auth-gated routes |
| Language | TypeScript (strict mode) | End-to-end type safety; API response shapes generated from OpenAPI spec |
| UI Library | shadcn/ui + Tailwind CSS | Accessible, unstyled primitives with full design-system control |
| Server state | TanStack Query v5 | Cache-first data fetching, background re-fetching, optimistic updates |
| Form handling | React Hook Form + Zod | Performant uncontrolled forms; schema shared with backend validation |
| API client | Custom typed fetch wrapper | Thin layer over `fetch` that attaches the JWT, handles 401 refresh, and maps responses to typed DTOs |

### App Router Structure

```
src/
├── app/
│   ├── (auth)/                  # Route group — no shared layout
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── callback/page.tsx    # OAuth callback handler
│   │
│   ├── (dashboard)/             # Route group — authenticated layout
│   │   ├── layout.tsx           # Auth guard, nav shell, TanStack Query provider
│   │   ├── page.tsx             # Dashboard overview
│   │   ├── onboarding/
│   │   │   ├── page.tsx         # Multi-step onboarding wizard (profile creation)
│   │   │   └── components/      # Step components: interests, skills, goals, prefs
│   │   ├── careers/
│   │   │   ├── page.tsx         # Ranked career match list
│   │   │   └── [slug]/page.tsx  # Career detail + evidence panel
│   │   ├── roadmap/
│   │   │   ├── page.tsx         # Active roadmap — phase/skill timeline
│   │   │   └── history/page.tsx # Roadmap version history
│   │   ├── skills/
│   │   │   └── [id]/page.tsx    # Skill detail: resources, assessment, projects
│   │   ├── projects/
│   │   │   └── page.tsx         # Recommended practice projects
│   │   └── market/
│   │       └── page.tsx         # Market intelligence dashboard
│   │
│   ├── api/                     # Next.js Route Handlers (thin proxies only)
│   │   └── auth/[...supabase]/  # Supabase auth cookie helpers
│   │
│   └── layout.tsx               # Root layout: font, metadata, analytics
│
├── components/
│   ├── ui/                      # shadcn/ui primitives (Button, Card, Dialog, …)
│   ├── roadmap/                 # RoadmapTimeline, PhaseCard, SkillNode, …
│   ├── skills/                  # SkillRatingInput, CompetencyBar, …
│   ├── careers/                 # CareerCard, MatchScoreRadar, EvidencePanel, …
│   └── shared/                  # PageHeader, LoadingState, EmptyState, …
│
├── lib/
│   ├── api-client.ts            # Typed fetch wrapper; endpoint registry
│   ├── auth.ts                  # Supabase client; session helpers
│   ├── query-keys.ts            # Centralised TanStack Query key factory
│   └── utils.ts                 # cn(), formatDate(), formatScore(), …
│
├── hooks/
│   ├── use-roadmap.ts           # useQuery wrappers for roadmap endpoints
│   ├── use-careers.ts
│   └── use-profile.ts
│
├── schemas/                     # Zod schemas (mirroring backend Pydantic schemas)
│   ├── profile.ts
│   ├── roadmap.ts
│   └── career.ts
│
└── types/                       # TypeScript interface types generated from OpenAPI
```

### State Management Strategy

```
┌──────────────────────────────────────────────────────────┐
│  Server State (remote, async)    → TanStack Query         │
│  • Career matches, roadmap data, skills, resources        │
│  • Background re-fetch on focus/interval                  │
│  • Optimistic mutation for skill self-ratings             │
├──────────────────────────────────────────────────────────┤
│  Form State (ephemeral, local)   → React Hook Form        │
│  • Onboarding wizard steps                                │
│  • Profile edit forms                                     │
│  • Zod resolvers for client-side validation               │
├──────────────────────────────────────────────────────────┤
│  UI State (transient, local)     → React useState/Context │
│  • Modal open/close, selected tab, sidebar collapsed      │
│  No global client-side state store (Redux, Zustand, etc.) │
│  is needed at MVP scale.                                  │
└──────────────────────────────────────────────────────────┘
```

### API Communication

- All requests target `/api/v1/*` on the backend.
- The API client reads the Supabase session token from the browser cookie and attaches it as `Authorization: Bearer <jwt>`.
- HTTP `401` responses trigger a silent token refresh; if refresh fails, the user is redirected to `/login`.
- All response bodies are validated against Zod schemas before being passed to components, catching backend schema drift at the boundary.
- Versioned API endpoints (`/api/v1/`) allow non-breaking frontend and backend releases independently.

---

## 3. Backend Architecture (FastAPI + Python 3.12)

### Technology Choices

| Concern | Technology | Reason |
|---------|-----------|--------|
| Framework | FastAPI 0.111+ | Async-native, OpenAPI generation, Pydantic integration |
| Language | Python 3.12 | `asyncio` improvements, type system, dataclasses |
| ORM | SQLAlchemy 2.0 (async) | Typed queries, unit-of-work pattern, Alembic migrations |
| Validation | Pydantic v2 | Fast, strict validation; schema = source of truth |
| HTTP Server | Uvicorn + Gunicorn | Production-grade ASGI server |
| Task Queue | Celery + Redis | Reliable background job execution |

### Module Structure

```
app/
├── main.py                      # FastAPI app factory; middleware; router registration
├── config.py                    # Pydantic Settings from environment variables
│
├── api/
│   └── v1/
│       ├── router.py            # Aggregates all v1 sub-routers
│       ├── auth.py              # POST /auth/token/refresh, POST /auth/logout
│       ├── profiles.py          # GET/PUT /profiles/me
│       ├── careers.py           # GET /careers/matches, GET /careers/{id}
│       ├── roadmaps.py          # GET/POST /roadmaps, GET /roadmaps/{id}/versions
│       ├── skills.py            # GET /skills/{id}, PUT /skills/{id}/rating
│       ├── assessments.py       # POST /skills/{id}/assessment
│       ├── resources.py         # GET /resources?skill_id=…
│       ├── projects.py          # GET /projects/recommended
│       ├── market.py            # GET /market/careers/{id}
│       └── health.py            # GET /health (liveness + readiness)
│
├── core/
│   ├── database.py              # Async engine, session factory, get_db dependency
│   ├── security.py              # JWT decode, get_current_user dependency
│   ├── exceptions.py            # Custom HTTPException subclasses
│   ├── middleware.py            # CORS, request ID, structured logging middleware
│   └── dependencies.py          # Common FastAPI Depends() factories
│
├── models/                      # SQLAlchemy ORM models (mapped to DB tables)
│   ├── base.py                  # Base declarative; audit mixin; soft-delete mixin
│   ├── user.py
│   ├── profile.py
│   ├── career.py
│   ├── skill.py
│   ├── roadmap.py               # RoadmapVersion, RoadmapPhase, RoadmapSkill
│   ├── resource.py
│   ├── project.py
│   ├── assessment.py
│   ├── market.py                # MarketEvidence, MarketSignal
│   └── audit.py                 # AuditLog, AIUsageLog
│
├── schemas/                     # Pydantic v2 request/response schemas
│   ├── profile.py
│   ├── career.py
│   ├── roadmap.py
│   ├── skill.py
│   ├── resource.py
│   ├── project.py
│   ├── market.py
│   └── common.py                # PaginatedResponse, ErrorDetail, etc.
│
├── repositories/                # Data access layer (async SQLAlchemy)
│   ├── base.py                  # BaseRepository: get, list, create, update, soft_delete
│   ├── profile_repository.py
│   ├── career_repository.py
│   ├── skill_repository.py
│   ├── roadmap_repository.py
│   ├── resource_repository.py
│   ├── project_repository.py
│   └── market_repository.py
│
├── services/                    # Domain logic — orchestrates repositories + algorithms
│   ├── career_analysis_service.py
│   ├── skill_gap_service.py
│   ├── progress_analysis_service.py
│   └── profile_service.py
│
├── recommendations/             # Recommendation engines
│   ├── roadmap_generation_service.py
│   ├── resource_recommendation_service.py
│   └── project_recommendation_service.py
│
├── ai/
│   ├── ai_service.py            # Provider-independent AIService interface + factory
│   ├── providers/
│   │   ├── gemini_provider.py
│   │   ├── openai_provider.py
│   │   └── anthropic_provider.py
│   ├── prompts/                 # Versioned prompt templates
│   │   ├── career_explanation_v1.py
│   │   ├── roadmap_explanation_v1.py
│   │   └── skill_summary_v1.py
│   └── output_validators.py    # Pydantic schemas for structured LLM outputs
│
├── market/
│   ├── market_intelligence_service.py
│   ├── connectors/
│   │   ├── base_connector.py    # Abstract connector interface
│   │   ├── esco_connector.py
│   │   ├── onet_connector.py
│   │   └── ncs_connector.py
│   └── ingestion_pipeline.py
│
└── workers/
    ├── celery_app.py            # Celery app configuration
    ├── roadmap_refresh_task.py  # Scheduled: weekly adaptive recalculation
    ├── resource_refresh_task.py # Scheduled: monthly freshness verification
    └── market_ingestion_task.py # Scheduled: daily/weekly market data pull
```

### Request Lifecycle

```
HTTP Request
     │
     ▼
┌─────────────────┐     ┌──────────────────┐     ┌──────────────────────┐
│  ASGI Middleware │────▶│  FastAPI Router   │────▶│  Dependency Injection │
│  • Request ID    │     │  Path matching    │     │  • get_db()           │
│  • Logging       │     │  OpenAPI docs     │     │  • get_current_user() │
│  • CORS          │     └──────────────────┘     │  • get_service()      │
└─────────────────┘                               └──────────┬───────────┘
                                                             │
     ┌───────────────────────────────────────────────────────▼──────────┐
     │                      Route Handler                                │
     │  1. Validate request body (Pydantic)                             │
     │  2. Call service method(s)                                       │
     │  3. Validate response schema                                     │
     │  4. Return HTTP response                                         │
     └───────────────────────────────────────────────────────────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │        Service Layer        │
                    │  Business logic, algorithms │
                    │  AI calls (if needed)       │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │      Repository Layer       │
                    │  Async SQLAlchemy queries   │
                    │  Unit-of-work, transactions │
                    └─────────────┬───────────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │    PostgreSQL (asyncpg)     │
                    └────────────────────────────┘
```

---

## 4. Core Service Descriptions

### 4.1 CareerAnalysisService

**Location:** `app/services/career_analysis_service.py`  
**Nature:** Fully deterministic (scoring) + AI (natural-language explanation only)

**Responsibility:** Given a student profile, retrieve candidate career records from the database, score each career against the profile using the weighted formula (§5), rank them, and return the top N matches with explanations.

| | Detail |
|--|--------|
| **Inputs** | `StudentProfile` (interests, skills, goals, education level, preferences, availability) |
| **Outputs** | `List[CareerMatch]` (career_id, career_name, total_score, component_scores, explanation, evidence) |
| **Dependencies** | `CareerRepository`, `SkillRepository`, `MarketRepository`, `AIService` |
| **AI involvement** | One LLM call per top-N career to produce the human-readable explanation paragraph. The numeric scores are never AI-generated. |

**Key Methods:**

```python
async def get_career_matches(profile: StudentProfile, top_n: int = 10) -> List[CareerMatch]:
    """Retrieve candidates, score, rank, explain top-N."""

async def score_career(profile: StudentProfile, career: Career) -> CareerScore:
    """Compute weighted component scores deterministically."""

async def explain_career_match(profile: StudentProfile, career: Career, score: CareerScore) -> str:
    """AI-generated explanation — never influences the numeric score."""
```

---

### 4.2 SkillGapService

**Location:** `app/services/skill_gap_service.py`  
**Nature:** Fully deterministic

**Responsibility:** Compare the student's current competency scores against the required competency levels for a target career, producing a ranked list of skill gaps.

| | Detail |
|--|--------|
| **Inputs** | `StudentProfile.competencies`, `Career.required_skills` (each with `required_level`, `importance`, `market_weight`) |
| **Outputs** | `List[SkillGap]` (skill_id, current_level, required_level, gap_size, importance, priority_score) |
| **Dependencies** | `SkillRepository`, `ProfileRepository` |
| **AI involvement** | None |

**Gap Calculation:**

```
gap_size = required_level - current_competency_score   # 0.0 if already met
priority_score = importance × gap_size × market_evidence_weight
```

---

### 4.3 RoadmapGenerationService

**Location:** `app/recommendations/roadmap_generation_service.py`  
**Nature:** Fully deterministic (algorithm) + AI (explanation only)

**Responsibility:** Orchestrate the 11-step roadmap generation pipeline (§6) to produce a structured, phased learning roadmap for a student targeting a specific career.

| | Detail |
|--|--------|
| **Inputs** | `StudentProfile`, `Career`, `List[SkillGap]`, `StudentPreferences` (weekly_hours, preferred_modalities) |
| **Outputs** | `RoadmapVersion` (phases, skills, resources, projects, milestones, evidence, reasoning_text) |
| **Dependencies** | `SkillGapService`, `ResourceRecommendationService`, `ProjectRecommendationService`, `MarketRepository`, `AIService` |
| **AI involvement** | One LLM call to produce the roadmap reasoning text. The structure, phases, and timelines are entirely deterministic. |

---

### 4.4 ResourceRecommendationService

**Location:** `app/recommendations/resource_recommendation_service.py`  
**Nature:** Fully deterministic

**Responsibility:** For each skill in the roadmap, retrieve and rank curated learning resources from the database, filtered by the student's preferred modalities, available time, and cost preferences.

| | Detail |
|--|--------|
| **Inputs** | `skill_id`, `StudentPreferences` (modality, cost_limit, language) |
| **Outputs** | `List[Resource]` ordered by a relevance score |
| **Dependencies** | `ResourceRepository` |
| **AI involvement** | None. All resources are curated data. AI is not used to discover or generate resource content. |

**Ranking formula:**

```
resource_score = (quality_rating × 0.40) + (modality_match × 0.30)
              + (recency_score × 0.20) + (cost_score × 0.10)
```

---

### 4.5 ProjectRecommendationService

**Location:** `app/recommendations/project_recommendation_service.py`  
**Nature:** Fully deterministic

**Responsibility:** Match practice projects from the curated project database to skills the student is currently learning, ordered by complexity appropriateness and skill coverage.

| | Detail |
|--|--------|
| **Inputs** | `List[skill_id]` (skills in current roadmap phase), `StudentProfile.experience_level` |
| **Outputs** | `List[Project]` (title, description, skills_covered, complexity, estimated_hours, evidence_value) |
| **Dependencies** | `ProjectRepository` |
| **AI involvement** | None. Projects are curated. Future phases may add AI-generated project briefs as an optional enhancement. |

---

### 4.6 ProgressAnalysisService

**Location:** `app/services/progress_analysis_service.py`  
**Nature:** Fully deterministic

**Responsibility:** Consume the student's event stream (skill completions, assessment results, project completions) and compute up-to-date competency scores, phase completion percentages, and overall roadmap progress metrics.

| | Detail |
|--|--------|
| **Inputs** | `student_id`, `roadmap_id`, `List[RoadmapEvent]` |
| **Outputs** | `ProgressReport` (phase_completion, overall_completion, updated_competencies, milestones_achieved, pace_analysis) |
| **Dependencies** | `RoadmapRepository`, `AssessmentRepository` |
| **AI involvement** | None. Pace and progress are derived purely from timestamps and scores. |

---

### 4.7 MarketIntelligenceService

**Location:** `app/market/market_intelligence_service.py`  
**Nature:** Fully deterministic

**Responsibility:** Provide structured market evidence objects for careers and skills — salary ranges, job posting volumes, growth forecasts, and in-demand technology signals — sourced from the tiered data pipeline.

| | Detail |
|--|--------|
| **Inputs** | `career_id` or `skill_id`, optional `geography` |
| **Outputs** | `MarketIntelligence` (salary_range, job_volume, growth_rate, in_demand_skills, evidence_list) |
| **Dependencies** | `MarketRepository`, cached via Redis for frequently queried careers |
| **AI involvement** | None. Market data is ingested from authoritative sources — not generated. |

---

### 4.8 AIService

**Location:** `app/ai/ai_service.py`  
**Nature:** Provider abstraction layer — all AI interactions pass through this interface

**Responsibility:** Expose a stable set of methods for AI-powered enrichment while hiding provider details (model names, SDK calls, retry logic, cost tracking) from the rest of the codebase.

| Method | Inputs | Outputs | Usage |
|--------|--------|---------|-------|
| `generate(prompt, system, context)` | String prompt, optional context | `str` | Free-form text generation |
| `structured_generate(prompt, schema, system)` | Prompt + Pydantic schema | `T` (schema instance) | Structured JSON extraction with schema enforcement |
| `embed(text)` | `str` | `List[float]` (1536-dim) | Skill/career embedding for pgvector similarity search |
| `classify(text, labels)` | Text + label list | `str` (label) | Skill extraction from free-text input during onboarding |
| `summarize(text, max_tokens)` | Long text | `str` | Resource description summarisation |

**Error Handling:** Every method has a configurable `max_retries` with exponential backoff. If a `structured_generate` call returns output that fails Pydantic validation, the service retries up to 3 times with an appended correction prompt before raising `AIServiceError`. Callers never receive unvalidated AI output.

---

## 5. Career Matching Algorithm (Fully Deterministic)

The career matching pipeline converts a student profile into a ranked list of career recommendations without any AI involvement in the scoring. LLM is only invoked after scores are finalized, to produce human-readable explanations.

### Pipeline

```
┌─────────────────────┐
│   Student Profile    │
│  (interests, skills, │
│   goals, education,  │
│   preferences)       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 1: Candidate Career Retrieval                          │
│  • Query careers whose required skill set overlaps ≥ 20%    │
│    with student's declared or assessed skills               │
│  • Also include careers matching declared interests          │
│  • Cap at 50 candidates to bound computation               │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 2: Hard Constraint Filtering                           │
│  • Exclude careers with education_required > student level  │
│    AND student has not indicated willingness to study further│
│  • Exclude careers student has explicitly blocked           │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 3–7: Component Score Calculation (per career)          │
│                                                              │
│  SkillCompatibility    = Σ(skill_match_i × importance_i)    │
│                          ─────────────────────────────────  │
│                          Σ(importance_i)                     │
│                                                              │
│  InterestCompatibility = cosine_sim(                         │
│                            student_interest_embedding,       │
│                            career_domain_embedding           │
│                          ) mapped to [0, 1]                  │
│                                                              │
│  GoalCompatibility     = weighted overlap of student goals   │
│                          with career goal tags               │
│                                                              │
│  EducationCompatibility= 1.0 if education met, else scaled   │
│                          by gap magnitude                    │
│                                                              │
│  PreferenceCompatibility= match on work_style, remote_ok,   │
│                           salary_expectations               │
│                                                              │
│  MarketAlignment       = normalised(                         │
│                            demand_score × growth_score       │
│                          )                                   │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 8: Composite Score Calculation                         │
│                                                              │
│  CareerScore =                                               │
│    0.30 × SkillCompatibility                                 │
│  + 0.25 × InterestCompatibility                             │
│  + 0.15 × GoalCompatibility                                  │
│  + 0.10 × EducationCompatibility                            │
│  + 0.10 × PreferenceCompatibility                           │
│  + 0.10 × MarketAlignment                                    │
│                                                              │
│  All components and the final score are in [0.0, 1.0]       │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 9: Rank and Select Top N                               │
│  • Sort by CareerScore descending                            │
│  • Return top 10 by default (configurable)                  │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 10: Attach Market Evidence                             │
│  • Fetch MarketIntelligence for each top-N career           │
│  • Attach salary ranges, demand signals, growth forecasts   │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│  Step 11: LLM Explanation (AI — enrichment only)            │
│  • Prompt includes: profile summary, career facts,          │
│    component scores, evidence objects                       │
│  • Returns a 2–3 sentence plain-language explanation        │
│  • NEVER modifies the numeric scores                        │
└──────────┬──────────────────────────────────────────────────┘
           │
           ▼
┌─────────────────────┐
│   CareerMatch List   │
│  (scored, ranked,    │
│   explained)         │
└─────────────────────┘
```

### Weight Rationale

| Component | Weight | Rationale |
|-----------|--------|-----------|
| SkillCompatibility | 0.30 | Strongest signal of near-term viability |
| InterestCompatibility | 0.25 | Critical for long-term engagement and retention |
| GoalCompatibility | 0.15 | Ensures the recommendation aligns with student intent |
| EducationCompatibility | 0.10 | Soft constraint — not a hard block at this stage |
| PreferenceCompatibility | 0.10 | Work style, remote, salary — lifestyle fit |
| MarketAlignment | 0.10 | Useful signal but should not dominate personal fit |

---

## 6. Roadmap Generation Algorithm (Fully Deterministic)

The roadmap generation pipeline converts a `(StudentProfile, Career, SkillGapList)` tuple into a structured multi-phase learning plan. The entire algorithm is deterministic. LLM is called once at the end only to produce a reasoning summary.

### Priority Formula

```
              Importance × Gap × MarketEvidence × GoalAlignment
Priority  =  ─────────────────────────────────────────────────
                              EstimatedEffort
```

- **Importance:** How critical the skill is for the career (from curated career data, 0.0–1.0)
- **Gap:** How far below the required level the student currently is (0.0–1.0)
- **MarketEvidence:** How strongly the market signals demand for this skill (0.0–1.0)
- **GoalAlignment:** How closely this skill aligns with the student's stated goals (0.0–1.0)
- **EstimatedEffort:** Estimated hours to bridge the gap (normalised to avoid domination)

Higher priority = addressed in earlier phases.

### Pipeline Steps

```
Step 1: Identify Required Skills
│  • Load the full skill tree for the target career
│  • Include mandatory skills and optional enhancement skills
│  • Tag each with importance, category, and prerequisites
│
Step 2: Calculate Gaps
│  • Call SkillGapService for each required skill
│  • Result: List[SkillGap] with gap_size and current_competency
│
Step 3: Resolve Prerequisites
│  • Topological sort of the skill dependency graph
│  • Skills with unmet prerequisites cannot enter a phase
│    before their prerequisites are addressed
│  • Detect and report circular dependency errors (data quality issue)
│
Step 4: Prioritise Gaps
│  • Apply Priority formula to each skill gap
│  • Sort descending by Priority score
│  • Skip skills where gap_size ≈ 0 (already competent)
│
Step 5: Estimate Workload
│  • hours_to_close_gap = gap_size × skill.hours_per_unit
│  • Adjusted for student's self-reported learning pace (slow/medium/fast)
│
Step 6: Create Phases
│  • Phase capacity = student.weekly_hours × phase_duration_weeks
│  • Greedily assign prioritised skills to phases respecting:
│    – Phase capacity constraint
│    – Prerequisite ordering from Step 3
│  • Typical MVP: 3–5 phases of 4–8 weeks each
│
Step 7: Attach Resources
│  • For each skill in each phase, call ResourceRecommendationService
│  • Attach top 3–5 resources per skill
│
Step 8: Attach Projects
│  • For each phase, call ProjectRecommendationService
│  • Attach 1–2 practice projects that cover multiple phase skills
│
Step 9: Define Milestones
│  • Phase completion milestones derived from phase structure
│  • Milestone = all mandatory skills in a phase assessed at required level
│  • Each milestone produces a MILESTONE_ACHIEVED event when triggered
│
Step 10: Attach Evidence
│  • Fetch MarketIntelligence for the target career
│  • Attach relevant demand signals and salary data to the roadmap header
│
Step 11: Generate Explanation (AI — enrichment only)
   • Prompt: profile summary + skill priorities + phase overview + evidence
   • Returns: 3–5 sentence plain-language rationale for the roadmap structure
   • Stored as roadmap.reasoning_text; does NOT alter any structure
```

---

## 7. Competency Model

A student's competency in a skill is not a single self-reported number. It is a weighted composite of three evidence sources designed to balance self-perception, objective measurement, and demonstrated practice.

### Formula

```
competency_score = (self_rating   × 0.20)
                 + (assessment_rating × 0.40)
                 + (evidence_rating   × 0.40)
```

All inputs and the output are normalised to [0.0, 1.0].

### Component Definitions

| Component | Weight | Source | Description |
|-----------|--------|--------|-------------|
| `self_rating` | 0.20 | Student | User-provided skill rating (1–5 scale, normalised). Low weight because self-assessment has known optimism bias. |
| `assessment_rating` | 0.40 | System | Score from the in-app adaptive assessment for this skill. Highest individual weight because it is objective and standardised. |
| `evidence_rating` | 0.40 | System | Derived from completed projects, portfolio links, or third-party certifications associated with this skill. Equally high weight because practical evidence is a strong signal. |

### Update Triggers

The competency score is recalculated whenever:
- The student updates their self-rating
- An assessment result is recorded (`ASSESSMENT_PASSED` or `ASSESSMENT_FAILED` event)
- A project linked to this skill is marked complete (`PROJECT_COMPLETED` event)

Updated competency scores are propagated to the `SkillGapService`, which may trigger an adaptive roadmap recalculation via the background job.

---

## 8. AI Architecture

### 8.1 Provider-Independent AIService Interface

All AI calls in the system go through a single interface. No service outside `app/ai/` may import an LLM SDK directly.

```python
class AIServiceInterface(ABC):
    async def generate(
        self,
        prompt: str,
        system_prompt: str | None = None,
        context: str | None = None,
        max_tokens: int = 1000,
        temperature: float = 0.3,
    ) -> str: ...

    async def structured_generate(
        self,
        prompt: str,
        output_schema: type[BaseModel],
        system_prompt: str | None = None,
        context: str | None = None,
    ) -> BaseModel: ...

    async def embed(self, text: str) -> list[float]: ...

    async def classify(self, text: str, labels: list[str]) -> str: ...

    async def summarize(self, text: str, max_tokens: int = 200) -> str: ...
```

The active provider is selected at startup via `AI_PROVIDER=gemini|openai|anthropic` in the environment. The factory pattern in `ai_service.py` returns the appropriate concrete class.

### 8.2 Layered Prompt Architecture

Every prompt sent to the LLM is constructed in four ordered layers:

```
┌────────────────────────────────────────────────┐
│  Layer 1: SYSTEM PROMPT                         │
│  Role definition, output format constraints,    │
│  safety guardrails, language/tone instructions  │
│  (static per prompt template version)           │
├────────────────────────────────────────────────┤
│  Layer 2: DEVELOPER CONTEXT                     │
│  Relevant domain facts from curated data:       │
│  career definition, required skills list,       │
│  skill descriptions, resource metadata          │
│  (deterministic — pulled from database)         │
├────────────────────────────────────────────────┤
│  Layer 3: RETRIEVED CONTEXT (RAG)               │
│  Semantically similar examples from the         │
│  vector store: past roadmap explanations,       │
│  similar career profiles (anonymised)           │
│  (retrieved via pgvector similarity search)     │
├────────────────────────────────────────────────┤
│  Layer 4: USER / TASK PROMPT                    │
│  The specific student profile data,             │
│  computed scores, gaps, phase structure         │
│  (personalised per request)                     │
└────────────────────────────────────────────────┘
```

This layering prevents prompt injection from student-supplied data (Layers 1–3 are system-controlled) and keeps the user-facing Layer 4 as narrow as possible.

### 8.3 RAG Pipeline for Roadmap Explanation

```
Student Profile + CareerScore + RoadmapStructure
                    │
                    ▼
         ┌──────────────────┐
         │  Embed query      │
         │  AIService.embed()│
         └────────┬─────────┘
                  │  query vector
                  ▼
         ┌──────────────────┐
         │  pgvector search  │  SELECT ... ORDER BY embedding <=> $1 LIMIT 5
         │  roadmap_examples │
         └────────┬─────────┘
                  │  top-5 similar roadmap explanations
                  ▼
         ┌──────────────────────────────────────────┐
         │  Construct layered prompt (§8.2)          │
         │  Layer 3 = retrieved roadmap examples     │
         └────────┬─────────────────────────────────┘
                  │
                  ▼
         ┌──────────────────┐
         │  LLM API call     │
         │  structured_gen   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────────────────────────────┐
         │  Output Validation (§8.4)                 │
         └──────────────────────────────────────────┘
```

### 8.4 Output Validation Flow

```
LLM raw text response
         │
         ▼
┌─────────────────────────────┐
│  JSON parse                  │
│  (reject if malformed JSON)  │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Pydantic schema parse       │  RoadmapExplanationOutput, CareerExplanationOutput, …
│  (reject if fields missing)  │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Business rule validation    │
│  • Explanation length bounds │
│  • No contradictions with    │
│    deterministic scores      │
└────────────┬────────────────┘
             │
             ▼
┌─────────────────────────────┐
│  Database ID/URL validation  │
│  • Any IDs in output must    │
│    exist in the database     │
│  • Any URLs must resolve     │
└────────────┬────────────────┘
             │
             ▼
        Store to DB
```

If any validation stage fails, the request is retried with a corrective prompt appended (up to 3 attempts). If all retries fail, `AIServiceError` is raised and the caller falls back to a template-based explanation.

### 8.5 Prompt Versioning Strategy

- Each prompt template is a Python module in `app/ai/prompts/` with a `VERSION` constant (e.g., `"career_explanation_v1"`).
- The `prompt_version` is logged with every AI usage record (§8.6).
- Changing a prompt template requires incrementing the version (new file, old file preserved).
- This enables A/B analysis: compare output quality between `v1` and `v2` using the cost log.
- Prompt templates are never stored in the database — they are code, versioned in git.

### 8.6 AI Cost Logging Schema

Every LLM API call logs a record to the `ai_usage_log` table:

```sql
CREATE TABLE ai_usage_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id         UUID REFERENCES users(id),          -- nullable for system jobs
    request_type    TEXT NOT NULL,                      -- 'roadmap_explanation', 'career_explanation', …
    prompt_version  TEXT NOT NULL,                      -- 'career_explanation_v1'
    model           TEXT NOT NULL,                      -- 'gemini-1.5-pro', 'gpt-4o', …
    input_tokens    INTEGER NOT NULL,
    output_tokens   INTEGER NOT NULL,
    latency_ms      INTEGER NOT NULL,
    estimated_cost  NUMERIC(10, 6) NOT NULL,            -- USD
    success         BOOLEAN NOT NULL,
    error_code      TEXT                                -- null on success
);
```

This table drives the cost dashboard, enables per-user cost attribution, and supports prompt version analysis.

---

## 9. Database Architecture

### 9.1 Primary Database

- **PostgreSQL 16** hosted on Supabase managed infrastructure.
- **pgvector extension** installed for embedding storage and similarity search. No separate vector database is used in MVP — all embeddings live in columns of type `vector(1536)` in the relevant tables.

### 9.2 Core Table Groups

```
┌─────────────────────────────────────────────────────────────────┐
│  IDENTITY & PROFILE                                              │
│  users · profiles · user_interests · user_goals · user_prefs    │
├─────────────────────────────────────────────────────────────────┤
│  SKILL CATALOGUE                                                 │
│  skills · skill_prerequisites · skill_categories                │
│  student_competencies (self_rating, assessment_score, evidence) │
├─────────────────────────────────────────────────────────────────┤
│  CAREER CATALOGUE                                                │
│  careers · career_skills · career_categories                    │
│  careers.embedding  vector(1536)  -- for similarity search       │
├─────────────────────────────────────────────────────────────────┤
│  ROADMAP & PROGRESS                                              │
│  roadmaps · roadmap_versions · roadmap_phases · roadmap_skills  │
│  roadmap_events · milestones                                     │
├─────────────────────────────────────────────────────────────────┤
│  RESOURCES & PROJECTS                                            │
│  resources · resource_skills · projects · project_skills        │
├─────────────────────────────────────────────────────────────────┤
│  MARKET INTELLIGENCE                                             │
│  market_data · market_evidence · market_signals                 │
├─────────────────────────────────────────────────────────────────┤
│  OBSERVABILITY                                                   │
│  audit_log · ai_usage_log                                        │
└─────────────────────────────────────────────────────────────────┘
```

### 9.3 Migrations

- **Alembic** manages all schema changes.
- Every migration is a numbered, forward-only script. Downgrade scripts are written but not used in production without an explicit incident procedure.
- Schema changes are reviewed in pull requests before merging — migrations run automatically in CI before tests.

### 9.4 Soft Deletion

All user-visible entities include:

```sql
deleted_at TIMESTAMPTZ DEFAULT NULL,
deleted_by UUID REFERENCES users(id) DEFAULT NULL
```

Application queries always include `WHERE deleted_at IS NULL`. A row is only visible after deletion via an explicit admin `hard_delete` endpoint that requires elevated privilege. This provides a 30-day recovery window for accidental deletions.

### 9.5 Row-Level Security (RLS)

Supabase RLS policies enforce data isolation at the database level — a compromised application token cannot read another user's data even if application-level checks are bypassed.

```sql
-- Example: students can only read their own roadmaps
CREATE POLICY student_roadmaps_isolation ON roadmaps
    FOR ALL USING (user_id = auth.uid());

-- Content editors can read all, write curated tables only
CREATE POLICY content_editor_read ON careers
    FOR SELECT USING (auth.jwt() ->> 'role' IN ('content_editor', 'admin'));
```

### 9.6 Audit Logging

All writes to sensitive tables (`profiles`, `roadmaps`, `careers`, `market_data`) emit a record to `audit_log`:

```sql
CREATE TABLE audit_log (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    user_id     UUID,
    action      TEXT NOT NULL,    -- 'INSERT', 'UPDATE', 'DELETE'
    table_name  TEXT NOT NULL,
    record_id   UUID NOT NULL,
    old_data    JSONB,
    new_data    JSONB,
    ip_address  INET,
    request_id  TEXT             -- correlates with application log
);
```

Audit logs are append-only (no `UPDATE` or `DELETE` on this table; enforced by RLS).

---

## 10. Authentication & Authorization

### 10.1 Authentication

- **Provider:** Supabase Auth
- **Methods:** Email/password (with email verification) and Google OAuth 2.0
- **Tokens:** Supabase issues JWTs (access token TTL: 1 hour, refresh token TTL: 7 days)
- **Storage:** Tokens stored in `httpOnly` cookies on the frontend (not `localStorage`) to mitigate XSS

### 10.2 JWT Validation

The FastAPI backend validates every request via the `get_current_user` dependency:

```python
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    payload = jwt.decode(token, SUPABASE_JWT_SECRET, algorithms=["HS256"])
    user_id = payload.get("sub")
    # Verify user exists and is active; return User object
```

The `SUPABASE_JWT_SECRET` is an environment variable — never hardcoded.

### 10.3 RBAC Roles

| Role | Permissions |
|------|------------|
| `student` | Read/write own profile, roadmap, competencies; read curated career/skill/resource data |
| `content_editor` | Read all; write career definitions, skill catalogue, resource catalogue, projects |
| `market_analyst` | Read all; write market_data, market_evidence tables |
| `admin` | Full access including hard delete, user management, cost log visibility |

Roles are stored as a custom claim in the Supabase JWT and enforced both in FastAPI middleware and in PostgreSQL RLS policies, providing defence in depth.

### 10.4 Row-Level Security for Multi-Tenant Data

Every table that contains user-specific data has an RLS policy ensuring `user_id = auth.uid()`. Curated/shared tables (careers, skills, resources, market_data) are readable by all authenticated users but writeable only by privileged roles.

---

## 11. Background Jobs

Background jobs handle operations that are too slow or too low-priority for the request/response cycle.

### Infrastructure

- **Broker:** Redis (hosted on Railway or Upstash)
- **Worker:** Celery with the `gevent` or `asyncio` pool, or Redis Queue (RQ) as a lighter alternative
- **Beat scheduler:** Celery Beat for cron-style periodic tasks
- **Monitoring:** Flower (Celery) or RQ Dashboard for job visibility

### Job Inventory

| Job | Trigger | Frequency | Description |
|-----|---------|-----------|-------------|
| `roadmap_refresh` | Schedule + event | Weekly (or on significant progress event) | Recalculate roadmap phases for students whose competency scores have changed materially since last generation. Emits `ROADMAP_UPDATED` event if phases change. |
| `resource_freshness_check` | Schedule | Monthly | Verify that resource URLs still resolve, check for updated versions, flag stale resources for content editor review. |
| `market_data_ingestion` | Schedule | Daily (Tier 1 signals) / Weekly (Tier 2 full sync) | Pull fresh market data through connectors, normalise into `market_evidence` table, update `market_signals`. |
| `embedding_backfill` | On demand | As needed | Re-embed careers or skills when the embedding model is updated. |
| `ai_cost_report` | Schedule | Weekly | Aggregate `ai_usage_log` and send summary to admin dashboard. |

### Job Failure Handling

- All jobs have configurable `max_retries` (default: 3) with exponential backoff.
- Failed jobs are moved to a dead-letter queue after exhausting retries.
- Sentry captures job exceptions with full stack traces.
- Critical jobs (`market_data_ingestion`) send an alert to the ops channel on repeated failure.

---

## 12. Roadmap Versioning & Event Model

### Immutable Versioning

A roadmap is never mutated in place. Every meaningful change creates a new `roadmap_version` record linked to the same parent `roadmap` object. The student always sees the latest version. Previous versions are stored permanently and queryable via `GET /roadmaps/{id}/versions`.

```
roadmaps
├── id (UUID)
├── student_id
├── target_career_id
├── created_at
└── current_version_id ──────────────────────────────────────────┐
                                                                  │
roadmap_versions                                                  │
├── id (UUID) ◄───────────────────────────────────────────────────┘
├── roadmap_id
├── version_number       -- auto-incremented per roadmap
├── created_at
├── trigger_event        -- which event caused this version
├── trigger_description  -- human-readable reason
├── phases  (JSONB snapshot)
├── reasoning_text
└── diff_from_previous   (JSONB)  -- what changed vs prior version
```

### Event Model

The following events are produced by student actions or system processes. Each event is stored in `roadmap_events` and may trigger a new roadmap version.

| Event | Producer | Triggers New Version? | Effect |
|-------|---------|----------------------|--------|
| `ROADMAP_CREATED` | System | N/A (is the v1 creation) | First roadmap version created |
| `SKILL_STARTED` | Student | No | Updates `roadmap_skill.started_at` |
| `SKILL_COMPLETED` | Student | No | Updates competency, may trigger weekly job |
| `ASSESSMENT_FAILED` | System | No | Lowers assessment_rating; noted for next recalc |
| `ASSESSMENT_PASSED` | System | No | Raises assessment_rating; noted for next recalc |
| `PROJECT_COMPLETED` | Student | No | Raises evidence_rating; noted for next recalc |
| `GOAL_CHANGED` | Student | Yes | New roadmap version with reprioritised phases |
| `AVAILABILITY_CHANGED` | Student | Yes | New version with recalculated phase durations |
| `MARKET_UPDATE` | System | Yes (if material) | New version if skill priorities change significantly |
| `RESOURCE_EXPIRED` | System | No | Resource flagged; replacement attached |

**"Material" change threshold for `MARKET_UPDATE`:** A new version is only created if the change causes at least one skill's phase assignment to differ. Minor evidence updates that do not alter the structure are absorbed silently.

### Version Comparison

The `diff_from_previous` JSONB column stores a structured diff:

```json
{
  "phases_added": [],
  "phases_removed": [],
  "skills_moved": [
    {"skill_id": "...", "from_phase": 1, "to_phase": 2, "reason": "prerequisite gap detected"}
  ],
  "resources_changed": [],
  "duration_changed": {"from_weeks": 24, "to_weeks": 20}
}
```

This diff is used by the frontend to surface a "What changed?" notice when a student's roadmap updates.

---

## 13. Market Data Architecture

### 13.1 Source Hierarchy

Market data is sourced from authoritative external providers, tiered by reliability and coverage:

```
Tier 1 — Primary (highest trust)
├── Government statistical offices
│   ├── UK: ONS Labour Market Statistics
│   ├── US: BLS Occupational Outlook Handbook
│   └── EU: Eurostat Labour Market data
└── Official national skills frameworks (NCS)

Tier 2 — Secondary (structured taxonomies)
├── ESCO (European Skills, Competences, Qualifications)
├── O*NET (US Occupational Information Network)
└── National Careers Service (UK)

Tier 3 — Tertiary (supplementary signals, future phases)
├── Job posting aggregators (LinkedIn, Indeed APIs)
└── Professional salary surveys
```

In MVP, only Tier 1 and Tier 2 are ingested. Tier 3 sources require additional licensing and rate-limit management and are deferred to Phase 3.

### 13.2 Market Evidence Object Schema

Every claim stored in the system carries provenance metadata:

```json
{
  "claim": "Median salary for Software Developers in the UK is £52,000/year",
  "source": "ONS Annual Survey of Hours and Earnings 2024",
  "source_type": "government_statistics",
  "geography": "GB",
  "observed_period": "2024-04",
  "sample_size": 48000,
  "confidence": 0.95,
  "last_updated": "2024-10-01T00:00:00Z",
  "source_url": "https://www.ons.gov.uk/...",
  "license": "OGL v3"
}
```

This schema is enforced by the Pydantic `MarketEvidence` model and stored as JSONB in the `market_evidence` table.

### 13.3 Ingestion Pipeline

```
External Source API / File
         │
         ▼
┌────────────────────┐
│  Connector Layer    │  Fetches raw data (HTTP, file download, API key auth)
│  (source-specific)  │
└────────┬───────────┘
         │  raw response (JSON, CSV, XML)
         ▼
┌────────────────────┐
│  Normalisation      │  Maps source fields → internal MarketEvidence schema
│                     │  Validates required fields, geographic codes, date formats
└────────┬───────────┘
         │  List[MarketEvidence]
         ▼
┌────────────────────┐
│  Deduplication      │  Upsert by (career_id, source, geography, observed_period)
│  & Upsert           │  Mark superseded evidence as archived
└────────┬───────────┘
         │
         ▼
┌────────────────────┐
│  Quality Gate       │  Reject evidence with confidence < 0.50
│                     │  Flag for human review if sample_size < threshold
└────────┬───────────┘
         │
         ▼
   market_evidence table
```

### 13.4 Connector Interface

All market data connectors implement the same interface, ensuring provider independence:

```python
class MarketDataConnector(ABC):
    source_name: str
    source_tier: int  # 1 or 2

    @abstractmethod
    async def fetch_raw(self, **kwargs) -> Any:
        """Fetch raw data from the external source."""

    @abstractmethod
    async def normalise(self, raw: Any) -> list[MarketEvidence]:
        """Map raw data to MarketEvidence objects."""

    async def ingest(self, **kwargs) -> IngestResult:
        """Orchestrate fetch → normalise → return. Called by the pipeline."""
        raw = await self.fetch_raw(**kwargs)
        evidence_list = await self.normalise(raw)
        return IngestResult(source=self.source_name, count=len(evidence_list), items=evidence_list)
```

Adding a new market data source requires implementing `MarketDataConnector` — no other code changes are needed.

### 13.5 Data Licensing

| Source | License | Constraints |
|--------|---------|------------|
| ONS (UK) | Open Government Licence v3 | Attribution required; no redistribution restriction |
| BLS (US) | Public domain | No restrictions |
| ESCO | CC BY 4.0 | Attribution required |
| O*NET | Public domain (US government) | No restrictions |
| NCS | OGL v3 | Attribution required |

All stored evidence records include a `license` field. The frontend must display attribution for Tier 1 and Tier 2 data shown to users.

---

## 14. Observability

### 14.1 Structured Logging

All application logs are emitted as structured JSON (using Python's `structlog` or `python-json-logger`). Every log line includes:

```json
{
  "timestamp": "2026-10-02T06:45:00Z",
  "level": "info",
  "service": "studentroadmap-api",
  "request_id": "req_01J9ABCDEF",
  "user_id": "usr_01J9...",
  "event": "roadmap.generated",
  "roadmap_id": "rdm_01J9...",
  "career_id": "car_01J9...",
  "duration_ms": 342,
  "ai_calls": 1
}
```

Logs are shipped to the deployment platform's log aggregation (Railway/Fly.io logs → external drain if needed). No PII is logged in plain text.

### 14.2 Error Tracking

- **Sentry** is integrated in both the Next.js frontend and the FastAPI backend.
- Source maps are uploaded to Sentry on every production deploy.
- Errors are grouped by fingerprint; alerts fire to Slack on new issue discovery.
- User context (user_id, not email) is attached to Sentry events for reproducibility.

### 14.3 AI Cost Logging

All LLM calls log to `ai_usage_log` (schema in §8.6). A simple admin dashboard (or SQL query) provides:

- Total cost per day/week
- Cost per request_type (roadmap vs. career vs. skill)
- Average latency per model
- Prompt version comparison (v1 vs. v2 cost and quality)

### 14.4 Health Endpoint

`GET /health` returns:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "checks": {
    "database": "ok",
    "redis": "ok",
    "ai_provider": "ok"
  },
  "timestamp": "2026-10-02T06:45:00Z"
}
```

- `database`: Tests that a lightweight query returns within 200ms.
- `redis`: Tests that a `PING` returns `PONG`.
- `ai_provider`: Tests that the LLM API returns a response to a minimal prompt (cached for 60 seconds to avoid cost inflation).

This endpoint is used by deployment platforms (Railway, Fly.io) for liveness and readiness probes.

---

## 15. MVP Deployment

### Infrastructure Map

```
┌──────────────────────────────────────────────────────────────────┐
│  FRONTEND                                                         │
│  Vercel                                                           │
│  • Next.js 14 App Router                                         │
│  • Edge Network CDN for static assets                            │
│  • Automatic preview deployments per PR                          │
└──────────────┬───────────────────────────────────────────────────┘
               │  HTTPS
               ▼
┌──────────────────────────────────────────────────────────────────┐
│  BACKEND                                                          │
│  Railway (primary) or Fly.io (alternative)                       │
│  • FastAPI + Uvicorn + Gunicorn                                   │
│  • Docker container, single region (eu-west-1 / London)          │
│  • Environment variables managed via Railway/Fly secrets          │
└──────────┬────────────────┬──────────────────────────────────────┘
           │                │
           ▼                ▼
┌──────────────────┐  ┌────────────────────────────────────────────┐
│  DATABASE         │  │  JOB INFRASTRUCTURE                        │
│  Supabase         │  │  Redis (Railway managed or Upstash)        │
│  • PostgreSQL 16  │  │  Celery Worker (same Docker image,         │
│  • pgvector       │  │    different start command)                │
│  • Auth service   │  │  Celery Beat (scheduler, single instance)  │
│  • RLS enabled    │  └────────────────────────────────────────────┘
│  • Supabase       │
│    Storage for    │  ┌────────────────────────────────────────────┐
│    file uploads   │  │  MONITORING & ANALYTICS                    │
└──────────────────┘  │  Sentry (errors, frontend + backend)        │
                       │  PostHog (product analytics, event capture) │
                       └────────────────────────────────────────────┘
```

### Deployment Pipeline

```
Developer pushes to main branch
         │
         ▼
GitHub Actions CI
├── Lint (ruff, mypy, eslint)
├── Unit tests (pytest, vitest)
├── Integration tests (pytest + test DB)
├── Alembic migration dry-run
└── Build Docker image → push to registry
         │
         ├──▶ Vercel (auto-deploy frontend)
         │
         └──▶ Railway/Fly.io (auto-deploy backend)
                  │
                  ▼
              Run Alembic migrations
                  │
                  ▼
              Swap traffic to new deployment
```

### Environment Variables

All secrets are managed via the deployment platform's secret store (Railway Secrets, Fly.io Secrets). No secrets in git. Key variables:

```
DATABASE_URL            # Supabase PostgreSQL connection string
SUPABASE_JWT_SECRET     # For JWT validation
AI_PROVIDER             # gemini | openai | anthropic
AI_API_KEY              # Provider API key
REDIS_URL               # Redis connection string
SENTRY_DSN              # Sentry project DSN
POSTHOG_API_KEY         # PostHog analytics key
```

---

## 16. Security Architecture

### 16.1 Transport Security

- All traffic is TLS 1.3+. HTTP is redirected to HTTPS at the CDN/load balancer level.
- HSTS with a minimum `max-age` of 31536000 seconds is set on all responses.
- API requests from the frontend include `SameSite=Strict` cookies.

### 16.2 Encryption at Rest

- Supabase encrypts all data at rest using AES-256.
- Backups are encrypted with a separate key managed by Supabase.
- File uploads in Supabase Storage are encrypted at rest.

### 16.3 RBAC and RLS (Defence in Depth)

Application-level RBAC (§10.3) is the first line of defence. Database-level RLS (§9.5) is the second. Even if a bug in application code incorrectly evaluates a role check, the database policy blocks the unauthorized read/write.

### 16.4 Input Validation

- All API request bodies are validated by Pydantic v2 before any business logic executes.
- String fields have `max_length` constraints to prevent payload bloat.
- File upload endpoints validate MIME type and file size server-side (client-side checks are UX only).
- SQL injection is prevented by SQLAlchemy's parameterised queries — no raw SQL with interpolated user input.

### 16.5 Rate Limiting

- FastAPI middleware applies per-IP and per-user rate limits using a sliding window algorithm backed by Redis.
- AI-generating endpoints (roadmap creation, career matching) have a stricter rate limit (e.g., 10 requests/hour per user) to control LLM costs.
- Rate limit responses return `429 Too Many Requests` with a `Retry-After` header.

### 16.6 Audit Logs

All write operations are logged to `audit_log` (§9.6). Admin actions (role changes, hard deletes, data exports) emit an additional alert to the ops notification channel.

### 16.7 Secrets Management

- No secrets in environment files committed to git. `.env.example` contains only placeholder values.
- Production secrets are set via deployment platform UI/CLI and injected as environment variables at runtime.
- Secret rotation is documented in the runbook; the `AI_API_KEY` can be rotated without downtime via a rolling restart.

### 16.8 Data Deletion (Right to Erasure)

- Soft delete (§9.4) is the primary deletion mechanism.
- A `DELETE /profiles/me` request triggers soft deletion of the student's profile and all associated data.
- A background job performs hard deletion of soft-deleted data after a 30-day retention window.
- pgvector embedding columns containing user-derived data are zeroed on hard deletion.

---

## 17. Scalability (Deferred to Phase 4)

The MVP architecture is intentionally simple: one backend process, one database, one job worker. This is the correct choice at this stage — it minimises operational complexity and cost while the product finds market fit. The following capabilities are explicitly deferred.

### Why These Are Deferred

| Capability | Why Deferred | When to Add |
|-----------|-------------|-------------|
| **Event-driven architecture** (message bus) | Adds operational complexity (Kafka, Pub/Sub) with no benefit at < 10k users. Current synchronous in-process calls are simpler to reason about. | Phase 4: when services need to communicate across process boundaries without tight coupling |
| **Read replicas** | Supabase provides read replicas as an add-on. Not needed until query latency degrades under load. | Phase 4: when dashboard queries begin to slow primary-write operations |
| **Redis caching layer** | Currently Redis is used only for the job queue. Application-level caching (TanStack Query on the client, short-lived server-side cache) is sufficient at MVP scale. | Phase 3: when market data and career data queries show measurable latency |
| **Data warehouse / analytics DB** | `ai_usage_log` and `audit_log` queries run on the primary database. At MVP volume this is fine. | Phase 4: when log tables exceed 10M rows and impact primary DB performance |
| **Horizontal backend scaling** | A single Railway/Fly.io instance is sufficient for MVP. Fly.io supports `fly scale count N` with minimal config change when needed. | Phase 3: when p99 API latency exceeds 1 second under normal load |
| **CDN for API responses** | Static assets are already CDN-served via Vercel. API responses are user-specific and generally not cacheable. | Future: if market intelligence endpoints serving identical geography data can be edge-cached |
| **Microservices extraction** | The internal module boundaries (services, repositories, market, ai, workers) are designed to be extractable. The interfaces are clean, but the operational overhead of separate deployments is not justified yet. | Phase 4: extract Market Intelligence and AI Service as separate deployable units if they need independent scaling |

The guiding principle for deferral: **add complexity only when the pain of not having it is measurable**. The architecture is structured to make each of these additions incremental rather than requiring a re-architecture.

---

*End of Technical Architecture Document — StudentRoadmap AI v1.0.0*
