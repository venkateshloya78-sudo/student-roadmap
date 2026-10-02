# StudentRoadmap AI — AI System Design

> **Principle**: AI is the *explanation and personalization layer*, not the system of record. Facts → deterministic logic → AI explanation → validation → database.

---

## 1. What AI Does vs What Code Does

### Always deterministic (never delegate to LLM)

| Function | Reason |
|---|---|
| Career compatibility scoring | Must be auditable, reproducible |
| Skill-gap calculation | Simple arithmetic; LLM adds variance |
| Prerequisite resolution | Graph traversal — deterministic by nature |
| Roadmap phase ordering | Priority formula — deterministic |
| Progress percentage | Arithmetic on evidence counts |
| Competency score | Weighted formula |
| Eligibility checks | Business rules |
| Database operations | ACID compliance required |
| Authentication / Authorization | Security-critical |
| Market evidence timestamps | Immutable facts |

### AI-powered (with structured output + validation)

| Function | Reason |
|---|---|
| Interpreting free-text interests | NLP — AI excels here |
| Extracting skills from project descriptions | Unstructured text |
| Generating roadmap phase explanations | Natural language |
| Personalizing learning resource descriptions | Context-aware text |
| Generating project ideas within a skill set | Creative but bounded |
| Summarizing market evidence for the student | Language layer |
| Explaining career compatibility factors | Narrative synthesis |
| Adapting explanation to student level | Persona-aware text |
| Identifying alternative career paths | Soft reasoning |

---

## 2. AIService Interface

The `AIService` is the single entry point to all LLM providers. This gives model independence.

```python
# app/ai/service.py

class AIService:
    async def generate(
        self,
        prompt: str,
        system_prompt: str,
        model: str = settings.DEFAULT_AI_MODEL,
        temperature: float = 0.3,
        max_tokens: int = 2048,
    ) -> str: ...

    async def structured_generate(
        self,
        prompt: str,
        system_prompt: str,
        output_schema: type[BaseModel],
        model: str = settings.DEFAULT_AI_MODEL,
    ) -> BaseModel: ...

    async def embed(
        self,
        text: str,
        model: str = settings.EMBEDDING_MODEL,
    ) -> list[float]: ...

    async def classify(
        self,
        text: str,
        labels: list[str],
    ) -> str: ...

    async def summarize(
        self,
        text: str,
        max_words: int = 150,
    ) -> str: ...
```

To swap providers (Gemini → OpenAI → Anthropic → local), only the implementation changes — not any service that calls `AIService`.

---

## 3. Layered Prompt Architecture

Every AI call uses four layers, composed at runtime:

```
┌─────────────────────────────────────────────────────┐
│ LAYER 1 — System Prompt                             │
│ Role, safety rules, evidence rules, output rules    │
├─────────────────────────────────────────────────────┤
│ LAYER 2 — Developer Context                         │
│ Student schema, career schema, skill schema,        │
│ market evidence schema                              │
├─────────────────────────────────────────────────────┤
│ LAYER 3 — Retrieved Context (RAG)                   │
│ Career definition, skill requirements,              │
│ market evidence objects, resources, projects        │
├─────────────────────────────────────────────────────┤
│ LAYER 4 — User / Task                               │
│ "Generate roadmap explanation for this student."    │
└─────────────────────────────────────────────────────┘
```

---

## 4. System Prompt Template

```
You are the explanation component of StudentRoadmap AI, an evidence-grounded career planning platform.

Your job is ONLY to generate student-friendly explanations and personalizations.
You do NOT determine career recommendations, skill ordering, or resource selection — those are computed by deterministic software.

Rules:
1. Only make claims supported by the provided context.
2. Do not invent market statistics, job demands, salary figures, or trend predictions.
3. Do not invent URLs, resource names, or external references.
4. Do not assign fake precision (e.g., "93.7% match").
5. All output must conform exactly to the provided JSON schema.
6. If market evidence is insufficient, say so explicitly.
7. Do not use first person ("I think...") — speak as the platform.
8. Adapt language complexity to the student's academic year.

When market evidence is insufficient, use this disclaimer:
"This recommendation is based on the student's stated goals and curated career model; current market evidence was insufficient for this specific claim."
```

---

## 5. Roadmap Explanation Prompt

```
You are the roadmap generation component of StudentRoadmap AI.

Generate student-friendly explanations for the deterministically computed roadmap below.
Do NOT change: skill ordering, required skills, estimated hours, prerequisites, phase structure.

For each roadmap phase, provide:
- why_this_phase: Why this sequence makes sense
- why_now: Why this comes before the next phase
- what_to_expect: What the student will be able to do after this phase
- difficulty_note: Honest assessment of difficulty for this student's level
- confidence_statement: Based on evidence quality (low/medium/high)

Use ONLY the data injected below. Return only valid JSON matching the schema.

---
STUDENT CONTEXT:
{student_context_json}

CAREER ROLE:
{career_role_json}

DETERMINISTIC ROADMAP:
{roadmap_json}

MARKET EVIDENCE:
{market_evidence_json}
```

---

## 6. Output Schema (Pydantic)

```python
# app/ai/schemas.py

class PhaseExplanation(BaseModel):
    phase_id: UUID
    why_this_phase: str
    why_now: str
    what_to_expect: str
    difficulty_note: str
    confidence_statement: Literal["low", "medium", "high"]

class RoadmapExplanationOutput(BaseModel):
    career_path_id: UUID
    summary: str
    confidence: Literal["low", "medium", "high"]
    phase_explanations: list[PhaseExplanation]
    alternative_career_notes: str | None = None
    disclaimer: str | None = None

    model_config = ConfigDict(extra="forbid")
```

All AI outputs are validated through Pydantic before any database write.

---

## 7. Output Validation Pipeline

```
LLM output (raw text)
        │
        ▼
JSON parse (json.loads)
        │
        ▼ ← fails → log + return error to caller
Pydantic schema validation
        │
        ▼ ← fails → log + return error to caller
Business rule validation
  - phase_id exists in DB
  - career_path_id matches request
  - no fabricated skill IDs
        │
        ▼ ← fails → log + return error to caller
Database write
        │
        ▼
Return to student UI
```

**No AI output ever writes to the database without passing all three validation stages.**

---

## 8. Market Evidence Object

The AI may only make market claims if a corresponding `MarketEvidenceObject` is provided in the retrieved context:

```json
{
  "claim": "SQL is commonly required for entry-level data analyst roles",
  "source_id": "uuid-of-market-source",
  "source_name": "O*NET 31.0",
  "source_type": "taxonomy",
  "geography": "Global",
  "observed_period": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  },
  "sample_size": null,
  "confidence": "high",
  "last_updated": "2025-12-15"
}
```

If no such object exists, the AI must use the disclaimer template. **Never fabricate evidence.**

---

## 9. RAG Pipeline

```
Student profile + Target career
        │
        ▼
Embed student skills vector
        │
        ▼
Retrieve from pgvector:
  - Career skill requirements
  - Relevant market evidence objects
  - Relevant resources (by skill match)
  - Relevant projects (by skill match)
        │
        ▼
Compose retrieval context
        │
        ▼
Inject into prompt (Layer 3)
        │
        ▼
LLM → structured JSON
        │
        ▼
Validate → store
```

---

## 10. Prompt Versioning

All prompts are stored in `packages/prompts/` as versioned files:

```
packages/prompts/
├── v1/
│   ├── roadmap_explanation.txt
│   ├── career_analysis.txt
│   ├── skill_extraction.txt
│   └── interest_classification.txt
└── v2/                   ← future
```

Every AI call logs the `prompt_version` used. This enables:
- A/B testing prompt versions
- Rollback if quality degrades
- Audit of which prompt generated each recommendation

---

## 11. Cost Logging

Every AI call records to an `ai_usage_logs` table:

```sql
CREATE TABLE ai_usage_logs (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID REFERENCES users(id),
    request_type    TEXT NOT NULL,          -- 'roadmap_explanation', 'skill_extraction', etc.
    prompt_version  TEXT NOT NULL,
    model           TEXT NOT NULL,
    input_tokens    INTEGER,
    output_tokens   INTEGER,
    latency_ms      INTEGER,
    estimated_cost  DECIMAL(10, 6),
    success         BOOLEAN DEFAULT true,
    error_message   TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

This answers: *"How much does one roadmap generation cost us?"*

---

## 12. AI Guardrails Summary

| Guardrail | Implementation |
|---|---|
| No fabricated market stats | Market claims require evidence object in context |
| No fabricated URLs | Resource URLs validated against resources table |
| No fabricated skill IDs | All skill IDs validated against skills table |
| No unconstrained hallucination | Pydantic schema with `extra="forbid"` |
| No LLM roadmap ordering | Deterministic algorithm generates structure; AI only explains |
| No false precision | Confidence shown as low/medium/high only |
| No permanent career assignment | AI says "alignment" not "your career is X" |
| Exploration mode | Undecided students get mini-experiments, not a single path |

---

## 13. AI Evaluation Benchmark

Maintain a test dataset in `data/fixtures/ai_eval/`:

```json
{
  "test_case_id": "tc_001",
  "description": "CSE 2nd year, Python beginner, interested in Data Science",
  "student_profile": { ... },
  "target_career": "data-scientist",
  "expected_skills_in_roadmap": ["python", "statistics", "linear-algebra", "pandas"],
  "expected_skills_NOT_in_roadmap": ["react", "docker", "kubernetes"],
  "expected_phase_count_range": [4, 8],
  "must_not_contain": ["AI will be highest paying in 2030", "guaranteed"]
}
```

**Evaluation metrics:**
- Schema validity rate (target: 100%)
- Skill relevance score (expected skills present)
- Prerequisite correctness (no skill before its dependency)
- Hallucination rate (fabricated claims, fake URLs, fake IDs)
- Roadmap feasibility (hours fit within weekly_learning_hours × weeks)
- Personalization score (roadmap differs meaningfully between different profiles)
- Disclaimer usage rate when evidence is insufficient

---

## 14. What NOT to Do

```
❌ User → LLM → Database
✓  User → Backend → Rules → Retrieval → LLM → Validation → Backend → Database

❌ "What career suits this student?" (LLM decides)
✓  CareerAnalysisService.score_compatibility() (deterministic) → LLM explains top matches

❌ "Here is your 5-year roadmap" (LLM invents everything)
✓  RoadmapGenerationService.generate() (deterministic structure) → LLM adds explanations

❌ "SQL demand will grow 40% by 2030" (fabricated prediction)
✓  "SQL appears in X% of sampled entry-level data analyst postings (Source: O*NET, observed Jan-Dec 2025)"
```
