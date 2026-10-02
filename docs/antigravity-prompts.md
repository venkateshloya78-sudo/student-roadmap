# StudentRoadmap AI — Antigravity Master Prompt

Copy this prompt at the start of every Antigravity session working on this repository.

---

## Master Context Prompt

```
You are the principal software architect for the StudentRoadmap AI repository.

We are building StudentRoadmap AI: an evidence-grounded, personalized career and skill-building roadmap platform for undergraduate students.

Core product principle:
"AI converts a student's current profile and chosen career direction into an evidence-grounded, measurable skill-building plan, and continuously updates that plan as the student progresses."

Architecture principle:
FACTS → DETERMINISTIC LOGIC → AI EXPLANATION → VALIDATION → DATABASE
Never: User → LLM → Database

Engineering rules:
1. Do not implement the entire product at once. Work in small, independently testable milestones.
2. Before modifying files, inspect the relevant files.
3. Before major implementation, create an implementation plan artifact for review.
4. Do not invent external APIs or data.
5. Do not invent labor-market statistics or fabricate evidence.
6. Never hard-code secrets. All secrets via environment variables.
7. Use typed schemas (Pydantic for backend, Zod for frontend).
8. Add tests with each feature.
9. Preserve existing functionality when adding new features.
10. Prefer deterministic logic over AI for business rules.
11. AI outputs must use structured schemas and Pydantic validation before any DB write.
12. Market claims must reference stored MarketEvidenceObjects with source, period, geography, confidence.
13. All database changes must use Alembic migrations.
14. Explain architectural tradeoffs before introducing new infrastructure.
15. Never add a dependency without explaining why it is needed.

What is AI:
- Generating roadmap phase explanations
- Interpreting free-text interests
- Extracting skills from project descriptions
- Explaining career compatibility factors
- Generating project ideas
- Summarizing market evidence for students

What is NOT AI:
- Career compatibility scoring (deterministic formula)
- Skill-gap calculation (arithmetic)
- Roadmap ordering (prerequisite graph traversal)
- Progress percentage calculation
- Competency score (weighted formula)
- Any database operation
- Authentication / authorization

For every task:
1. Inspect relevant files first
2. Explain intended changes and architectural tradeoffs
3. Create or update an implementation plan artifact
4. Wait for review before implementing (unless instructed to proceed)
5. Implement the change
6. Run tests, lint, type checks
7. Review the diff
8. Summarize files changed and remaining risks

Do not proceed to unrelated features.
```

---

## Stage Prompts

### Stage 1 — Product Specification (already done)
See: `docs/product-spec.md`

### Stage 2 — Architecture (already done)
See: `docs/architecture.md`

### Stage 3 — Database (already done)
See: `docs/database.md`

### Stage 4 — Backend Foundation

```
Implement the FastAPI backend foundation.

Requirements:
- Python 3.12
- FastAPI with lifespan events
- Pydantic v2
- SQLAlchemy 2 (async)
- Alembic for migrations
- PostgreSQL (asyncpg driver)
- Structured JSON logging (structlog)
- Configuration via environment variables (pydantic-settings)
- Health endpoint: GET /api/v1/health
- API versioning (/api/v1/)
- CORS configuration

Create:
apps/api/
  app/
    main.py         ← FastAPI app + lifespan
    api/
      v1/
        router.py   ← aggregates all v1 routes
        health.py   ← health endpoint
    core/
      config.py     ← pydantic-settings
      database.py   ← async engine + session
      logging.py    ← structlog setup
      security.py   ← password hashing, JWT utils
    models/         ← SQLAlchemy ORM models
    schemas/        ← Pydantic request/response schemas
    services/       ← business logic
    repositories/   ← database access
  tests/
    unit/
    integration/
  requirements.txt
  requirements-dev.txt
  alembic.ini
  alembic/

Add unit tests for: config loading, health endpoint.
Add integration test: GET /api/v1/health → 200.
Do not implement authentication or business logic yet.
```

### Stage 5 — Authentication

```
Implement authentication and authorization for StudentRoadmap AI.

Requirements:
- Email/password registration and login
- Google OAuth callback handler (stub for now)
- JWT access tokens (30 min) + refresh tokens (30 days)
- RBAC roles: student, admin, content_editor, market_analyst
- get_current_user dependency for protected routes
- require_admin dependency for admin routes
- require_student_ownership(resource_student_id) check
- Secure password hashing (bcrypt)

Endpoints:
POST /api/v1/auth/register
POST /api/v1/auth/login
POST /api/v1/auth/refresh
POST /api/v1/auth/logout
GET  /api/v1/auth/me

Add tests for:
- Successful registration
- Duplicate email registration → 409
- Login with correct password → 200 + tokens
- Login with wrong password → 401
- Accessing protected route without token → 401
- Accessing protected route with expired token → 401
- Student accessing another student's data → 403
- Admin accessing any route → 200
- Privilege escalation attempt (student sets role=admin) → rejected

Do not modify modules unrelated to auth.
```

### Stage 6 — Onboarding

```
Implement the StudentRoadmap AI student onboarding flow.

Backend:
- POST /api/v1/profile (create/update student profile)
- GET /api/v1/profile (get current student's profile)
- POST /api/v1/profile/interests (add interests)
- POST /api/v1/profile/skills (add self-rated skills)
- POST /api/v1/profile/experiences (add projects/internships)

Frontend (Next.js):
- 8-step onboarding wizard
  Step 1: Education (degree, branch, university, year, semester)
  Step 2: Interests (free text + categories)
  Step 3: Current Skills (skill list + self-rating 1-10 slider)
  Step 4: Experience (projects, internships, certifications)
  Step 5: Career Preferences (preferred industries, work mode)
  Step 6: Constraints (weekly hours, financial, remote preference)
  Step 7: Goals (career goal text, higher study, entrepreneurship)
  Step 8: Review + Submit → generate roadmap
- Progress indicator showing steps 1/8 through 8/8
- Validation with React Hook Form + Zod
- Can navigate back and forward between steps
- Required fields enforced before advancing

Add validation tests for each step's required fields.
Do not add AI inference yet.
```

### Stage 7 — Career Matching (Deterministic)

```
Implement the deterministic career compatibility engine.

Input: student profile + student skills → all career roles
Output: ranked list of career roles with scores and gaps

Algorithm:
CareerScore = 0.30 × SkillCompatibility
            + 0.25 × InterestCompatibility
            + 0.15 × GoalCompatibility
            + 0.10 × EducationCompatibility
            + 0.10 × PreferenceCompatibility
            + 0.10 × MarketAlignment

Do NOT use an LLM in this engine.

Return per career:
  career_id
  internal_score (0.0-1.0, DO NOT expose to UI)
  alignment_label ("strong" / "moderate" / "developing")
  skill_gaps (list of missing/underdeveloped skills)
  matching_factors (what drove the score up)
  confidence (low/medium/high)

Endpoints:
POST /api/v1/career-analysis
GET  /api/v1/careers
GET  /api/v1/careers/{career_id}

Unit tests with 5 personas:
1. CSE 2nd year, Python beginner, Data Science interest
2. Mechanical 3rd year, no coding, Robotics interest
3. Commerce 3rd year, Excel intermediate, Finance interest
4. B.Tech 4th year, varied skills, Entrepreneurship interest
5. B.Sc 1st year, no skills, Exploring (must trigger exploration mode)

Do not display numerical scores to users.
Do not use an LLM.
```

### Stage 8 — Skill-Gap Engine

```
Implement the skill-gap analysis engine.

For a given student + target career role:
1. Retrieve required skills (from career_role_skills)
2. Retrieve student competency per skill (from student_skills)
3. Calculate gap = required_level_score - student_competency_score
4. Resolve prerequisites (from skill_dependencies)
5. Assign priority: Priority = importance × gap × market_evidence × goal_alignment ÷ estimated_effort
6. Flag prerequisite gaps separately

Return:
  skill_id
  skill_name
  required_level
  current_competency (from three-component model)
  gap_score
  priority_score
  prerequisites_missing (list)
  evidence_type

Endpoint:
GET /api/v1/careers/{career_id}/skill-gaps

Unit tests:
- No student skills → all required skills are gaps
- Student has all skills at required level → no gaps
- Student has partial competency → fractional gaps
- Prerequisite missing → prerequisite added as additional gap
- Multiple skills with different importance → correct priority ordering

Do not use an LLM.
```

### Stage 9 — Roadmap Engine

```
Implement the deterministic roadmap generation engine.

This is the heart of the MVP.

Input:
- student profile (weekly_hours, graduation_year, location)
- target career role
- skill gaps (from Stage 8)
- skill dependency graph
- curated resources (matched to skills)
- curated projects (matched to skills)

Output:
- Ordered phases (no skill before its prerequisite)
- Per phase: skills, resources, projects, milestones, estimated hours
- Total roadmap fits within realistic timeline
- No duplicate skills across phases
- Measurable milestones (not vague "learn Python")
- Project scheduled after relevant skill foundations

Endpoint:
POST /api/v1/roadmaps/generate (async, returns 202)
GET  /api/v1/roadmaps/current
GET  /api/v1/roadmaps/{roadmap_id}

Requirements:
- Prerequisite ordering enforced
- Weekly workload respects weekly_learning_hours
- Roadmap versioned (version 1, never overwrites)
- trigger_event stored ("initial_generation")

Tests:
- Prerequisites respected in all 5 personas
- No skill appears before its prerequisite
- Total hours ≤ weekly_hours × estimated_weeks
- No duplicate skills
- Project added only after prerequisite skills are in plan
- Milestone is measurable

Do not use an LLM.
```

### Stage 10 — AI Explanation Layer

```
Add the AI explanation layer on top of the deterministic roadmap.

Rules:
- Deterministic engine generates: skills, ordering, hours, prerequisites, milestones
- AI ONLY generates: explanations, reasoning, why-now statements
- AI does NOT change skill ordering, required skills, or hours

Implement:
app/ai/
  service.py      ← AIService with structured_generate, generate, embed, classify
  schemas.py      ← Pydantic output schemas for all AI calls
  validators.py   ← Post-generation validation (IDs exist in DB, no fake URLs)
  prompts/
    v1/
      roadmap_explanation.txt
      career_analysis.txt

Endpoints (update):
GET /api/v1/roadmaps/{roadmap_id}/explanation
  → returns AI-generated explanation for each phase

Validation required:
- All phase_ids in AI output exist in database
- No AI-generated URLs (must come from resources table)
- No AI-generated skill IDs (must come from skills table)
- Pydantic schema validated with extra="forbid"
- Prompt version logged
- Token usage and estimated cost logged to ai_usage_logs

AI tests:
- Schema validity (100% required)
- No fabricated IDs
- No fabricated URLs
- No market claims without evidence object
- Disclaimer present when evidence insufficient
- Persona 5 (undecided) does not get single-career assignment
```

---

## Antigravity Agent Commands

### Run full test suite
```
Run all tests and report results:
- pytest apps/api/tests/ -v --cov=app
- cd apps/web && npm test
- mypy apps/api/app/
- ruff check apps/api/
- cd apps/web && npm run type-check
Do not modify code. Report failures only.
```

### Post-feature security review
```
Act as a security reviewer. Review the last implemented feature.
Check specifically:
1. Authentication on all new endpoints?
2. Student ownership verified before every data query?
3. Admin routes protected by role check?
4. AI outputs validated before DB writes?
5. No secrets in code?
6. Rate limiting on expensive endpoints?
7. Input validation on all request bodies?
Report: Critical issues, High issues, Medium issues, Informational.
```

### Browser E2E test
```
Act as a QA engineer. Open the application.
Test the complete flow:
1. Register new account
2. Complete onboarding (all 8 steps)
3. Select Data Analyst
4. Generate roadmap
5. View roadmap
6. Mark one milestone complete
7. Verify dashboard updates

Test on desktop (1440px) and mobile (375px).
Document failures with screenshots.
Create a test report artifact.
```
