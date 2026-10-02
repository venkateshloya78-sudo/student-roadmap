# StudentRoadmap AI — Market Data Strategy

> **Principle**: AI may only make market-related claims when a corresponding `MarketEvidenceObject` exists in the database. No fabricated statistics. No predictions stated as facts.

---

## 1. Why Market Data Matters

A generic roadmap says: *"Learn SQL."*

An evidence-grounded roadmap says: *"SQL appears in 89% of sampled entry-level Data Analyst job postings (Source: O*NET 31.0, observed 2025). It is rated importance 0.95 in the Data Analyst role model."*

That distinction determines whether students trust the platform.

---

## 2. Source Hierarchy

### Tier 1 — Authoritative (use first)

| Source | Type | Geography | Notes |
|---|---|---|---|
| Government labor statistics | Official | Country-specific | NSSO (India), BLS (US) |
| ESCO v1.2.1 | Occupation taxonomy | EU/Global | Free API + downloadable dataset |
| O*NET 31.0 | Occupation taxonomy | US-centric | Free API (services.onetcenter.org) |
| National Career Service (NCS) | Government employment | India | India.gov.in |
| Official industry reports | Reports | Varies | NASSCOM, RBI, etc. |

### Tier 2 — Structured Labor-Market Datasets

| Source | Access | Notes |
|---|---|---|
| ESCO API | Free (attribution required) | Occupation/skill relationships |
| O*NET Web Services | Free (API key required) | Occupational data, skill requirements |
| India NCS | Government portal | Career guidance, job data |
| LinkedIn Economic Graph | Restricted | Check terms before use |

### Tier 3 — Commercial / Licensed Sources (Phase 3+)

- Naukri, Indeed, Glassdoor — **check API terms, redistribution rights, storage rights before ingesting**
- Build connector interface so each provider is replaceable

---

## 3. What NOT to Do

```
❌ Scrape LinkedIn/Naukri/Indeed without verifying API terms
❌ State predictions as facts: "AI will be highest paying in 2030"
❌ Generate market statistics from LLM imagination
❌ Store derived data without checking redistribution rights
❌ Present stale data (>90 days old) without a freshness warning
```

---

## 4. Market Evidence Object Schema

Every market-backed claim must be traceable to a stored evidence object:

```json
{
  "id": "uuid",
  "claim": "SQL is commonly required for entry-level Data Analyst roles",
  "source_id": "uuid-of-market_sources-row",
  "source_name": "O*NET 31.0",
  "source_type": "taxonomy",
  "geography": "India",
  "observed_period": {
    "from": "2025-01-01",
    "to": "2025-12-31"
  },
  "sample_size": 1240,
  "confidence": "high",
  "last_updated": "2025-12-15"
}
```

**Confidence levels:**
- `high` — Authoritative source, large sample, recent
- `medium` — Structured source, moderate sample, <6 months old
- `low` — Small sample, older data, or inferred

---

## 5. Market Language Guidelines

| ❌ Do NOT say | ✓ Say instead |
|---|---|
| "AI will be the highest-paying career in 2030" | "AI/ML skills show increasing mention in sampled postings during the observed period" |
| "SQL is always required" | "SQL appears in X% of sampled entry-level Data Analyst postings (O*NET, 2025)" |
| "Cloud is booming" | "Cloud-related skills showed a Y% increase in mention frequency between Q1 and Q3 2025 in sampled data" |
| "Recruiters prefer Python over Java" | "Python appeared more frequently than Java in sampled Data Analyst postings for this geography" |

---

## 6. Ingestion Pipeline

```
Source (ESCO / O*NET / NCS / future job feeds)
        │
        ▼
Raw Ingestion (connector fetch)
        │
        ▼
Validation (schema check, format check)
        │
        ▼
Normalization (canonical field mapping)
        │
        ▼
Occupation Mapping (to career_roles table via slug matching)
        │
        ▼
Skill Extraction (map to skills table by name/external_id)
        │
        ▼
Deduplication (by source + period + geography)
        │
        ▼
Aggregation (frequency, co-occurrence)
        │
        ▼
Market Snapshot (market_snapshots row)
        │
        ▼
market_skill_observations rows
        │
        ▼
Recommendation Engine reads these
```

---

## 7. Connector Interface

Each data provider is a replaceable connector:

```python
# app/market/connectors/base.py

class JobMarketConnector(ABC):
    @abstractmethod
    async def fetch_occupations(self) -> list[RawOccupation]: ...
    
    @abstractmethod
    async def fetch_skills_for_occupation(
        self, occupation_id: str
    ) -> list[RawSkill]: ...
    
    @abstractmethod
    async def normalize(self, raw: RawOccupation) -> NormalizedOccupation: ...
    
    @abstractmethod
    async def validate(self, normalized: NormalizedOccupation) -> bool: ...
```

Implementations:
```
app/market/connectors/
├── onet.py          # O*NET Web Services
├── esco.py          # ESCO API
├── ncs_india.py     # India NCS
└── base.py          # Abstract interface
```

---

## 8. Occupation Normalization

Multiple job titles map to one canonical career role:

```
"Data Analyst"           ─┐
"Data Analytics Analyst"  ├─→ career_roles.slug = "data-analyst"
"Business Data Analyst"   │
"BI Analyst"             ─┘
```

ESCO provides ISCO occupation codes that assist in this normalization. O*NET provides SOC codes. Store both `external_id` and `canonical_source` on each `career_roles` row.

---

## 9. MVP Data Strategy — Seed First, Ingest Later

**Do NOT wait for a perfect ingestion pipeline before building MVP.**

For MVP, create manually curated seed data with source attribution:

```json
{
  "career_role_skill": {
    "career_role_slug": "data-analyst",
    "skill_slug": "sql",
    "importance": 0.95,
    "required_level": "intermediate",
    "evidence_type": "taxonomy",
    "source": "O*NET 31.0",
    "source_date": "2025-12-01",
    "reviewed_by": "content_team",
    "review_status": "approved"
  }
}
```

Each seed record has: `source`, `source_date`, `reviewed_by`, `review_status`.

Build the automated ingestion pipeline in Phase 3.

---

## 10. Freshness Policy

| Data Type | Freshness Threshold | Action When Stale |
|---|---|---|
| Market snapshots | 90 days | Mark as stale, trigger re-ingestion |
| Career role skills (seed) | 180 days | Flag for content team review |
| Learning resources | 60 days | Verify URL, update verification_status |
| Skill definitions | 365 days | Review for deprecated skills |
| Student profile | 30 days | Prompt student to review |
| Student roadmap | 7 days (adaptive) | Recalculate if events occurred |

---

## 11. India-Specific Strategy

Because the primary audience is Indian undergraduates, eventually make market data geography-aware:

```
India
├── Bengaluru       (tech hub — highest demand for tech roles)
├── Hyderabad       (tech hub — strong IT/analytics)
├── Chennai         (manufacturing + IT)
├── Pune            (IT + automotive)
├── Mumbai          (finance + media + tech)
├── Delhi NCR       (enterprise + government + tech)
└── Remote          (geography-agnostic)
```

**Rule**: Location is a *preference signal*, not a hard filter. Students not in tier-1 cities should still see relevant roles with remote options surfaced.

---

## 12. Data Licensing Checklist

Before ingesting any new data source, verify:

- [ ] API available (not screen scraping)?
- [ ] Commercial use permitted?
- [ ] Storage of raw data permitted?
- [ ] Storage of derived/aggregated data permitted?
- [ ] Attribution required? (if yes, store in `market_sources.attribution_required`)
- [ ] Redistribution of derived data permitted?
- [ ] Rate limits documented?
- [ ] Data currency / update frequency documented?

ESCO: Free for any use with attribution (Creative Commons).
O*NET: Free API, no redistribution of raw data, derived work is fine with attribution.
NCS India: Government data, check specific portal terms.

---

## 13. Phase Rollout

| Phase | Market Data Action |
|---|---|
| **Phase 1 (MVP)** | Manually curated seed data for 10–15 roles; O*NET as reference |
| **Phase 2 (Beta)** | ESCO connector; O*NET connector; market snapshots; freshness scheduler |
| **Phase 3 (Advanced)** | India NCS connector; job posting analysis (licensed source); geographic demand data |
| **Phase 4 (Scale)** | Real-time ingestion; data warehouse; trend dashboards |
