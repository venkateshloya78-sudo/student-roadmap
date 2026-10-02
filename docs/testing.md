# StudentRoadmap AI — Testing Strategy

> **Principle**: Every feature ships with tests. AI outputs are tested for schema validity, grounding, and absence of hallucination — not just for content.

---

## 1. Testing Layers

```
┌──────────────────────────────────────────┐
│         E2E Tests (Playwright)           │  ← Full user journey
├──────────────────────────────────────────┤
│      Integration Tests (pytest)          │  ← API + DB
├──────────────────────────────────────────┤
│        AI Output Tests (pytest)          │  ← Schema, grounding, safety
├──────────────────────────────────────────┤
│        Unit Tests (pytest/Jest)          │  ← Business logic
└──────────────────────────────────────────┘
```

---

## 2. Unit Tests

### Backend (pytest)

**Career scoring engine:**
```
test_skill_compatibility_no_overlap → score = 0.0
test_skill_compatibility_full_overlap → score = 1.0
test_skill_compatibility_partial → weighted by importance
test_interest_compatibility_matching_categories
test_goal_compatibility_explicit_vs_implicit
test_career_score_weighted_sum
test_career_score_with_market_evidence_boost
```

**Skill-gap engine:**
```
test_gap_no_skills → all required skills are gaps
test_gap_all_skills_at_required_level → no gaps
test_gap_partial_competency → fractional gap
test_gap_prerequisite_missing → prerequisite listed as additional gap
test_gap_priority_ordering → highest priority gap first
test_gap_multiple_career_dependencies
```

**Roadmap ordering engine:**
```
test_prerequisite_respected → A before B when B depends on A
test_no_duplicate_skills
test_weekly_workload_not_exceeded
test_project_after_skill_foundation
test_milestone_reachable
test_realistic_timeline_calculation
```

**Competency model:**
```
test_competency_self_only → 0.20 × (self/10)
test_competency_all_components → weighted formula
test_competency_missing_assessment → assessment weight goes to 0
test_competency_capped_at_1_0
```

**Progress calculation:**
```
test_phase_completion_zero → all items not started
test_phase_completion_partial
test_phase_completion_full → all items verified
test_roadmap_completion_across_phases
```

### Frontend (Jest + Testing Library)

```
test_onboarding_step_1_validation → required fields enforced
test_onboarding_progression → can advance when valid
test_roadmap_phase_expand_collapse
test_progress_bar_updates → optimistic UI
test_skill_gap_visualization → correct gaps shown
test_empty_states → no roadmap, no skills, etc.
test_loading_states → skeleton screens shown
test_error_states → API error handled gracefully
```

---

## 3. Integration Tests

### API + Database

```
POST /api/v1/auth/register → 201, user created
POST /api/v1/auth/login → 200, JWT returned
GET /api/v1/profile → 200 with profile data
PUT /api/v1/profile → profile updated in DB
GET /api/v1/careers → returns active careers only
GET /api/v1/careers/{id}/skills → returns role skills with evidence
POST /api/v1/career-analysis → returns scored career list
POST /api/v1/roadmaps/generate → 202, roadmap queued/created
GET /api/v1/roadmaps/current → returns active roadmap
POST /api/v1/progress → progress updated in DB
POST /api/v1/assessments/{id}/submit → score calculated and stored
```

### Authorization integration

```
test_student_cannot_access_other_student_data → 403
test_student_cannot_access_admin_routes → 403
test_admin_can_access_admin_routes → 200
test_unauthenticated_cannot_access_protected → 401
test_expired_token_rejected → 401
test_privilege_escalation_attempt → 403
```

---

## 4. AI Output Tests

These tests run against AI-generated outputs, **not against the LLM directly**. They validate that stored recommendations meet quality standards.

### Schema validation tests

```
test_roadmap_explanation_valid_json
test_roadmap_explanation_matches_pydantic_schema
test_no_extra_fields_in_output (extra="forbid")
test_phase_ids_exist_in_database
test_skill_ids_exist_in_database
test_no_fabricated_urls_in_output
```

### Grounding tests

```
test_market_claim_has_evidence_object
test_no_market_claim_without_source
test_confidence_matches_evidence_quality
test_disclaimer_present_when_evidence_missing
```

### Safety / hallucination tests

```
test_no_salary_predictions
test_no_demand_predictions_as_facts
test_no_guaranteed_outcomes
test_no_false_precision_scores (e.g., "93.7%")
test_exploration_mode_does_not_assign_single_career
test_undecided_student_gets_multiple_paths
```

### Persona-based evaluation tests

```python
# data/fixtures/ai_eval/persona_001.json
{
  "description": "CSE 2nd year, Python beginner, Data Science interest",
  "expected_skills_in_roadmap": ["python", "statistics", "linear-algebra"],
  "expected_skills_NOT_in_roadmap": ["react", "docker"],
  "expected_phase_count": {"min": 4, "max": 8},
  "must_not_contain_phrases": ["guaranteed", "highest paying in 2030", "definitely"]
}
```

Run all persona test cases against generated roadmaps.

---

## 5. Security Tests

### Authentication

```
test_login_invalid_password → 401
test_login_nonexistent_email → 401 (no user enumeration)
test_jwt_tampered → 401
test_jwt_expired → 401
test_jwt_wrong_secret → 401
```

### Authorization (IDOR)

```
test_access_another_student_roadmap → 403
test_access_another_student_profile → 403
test_access_another_student_progress → 403
test_modify_another_student_progress → 403
```

### Injection

```
test_sql_injection_in_search → sanitized
test_xss_in_profile_fields → escaped
test_json_injection_in_schemas → rejected by Pydantic
```

### Rate limiting

```
test_login_rate_limit → 429 after N attempts
test_roadmap_generation_rate_limit → 429
test_assessment_submission_rate_limit → 429
```

### Data leakage

```
test_error_responses_no_stack_traces
test_error_responses_no_internal_ids
test_list_endpoints_respect_ownership
test_deleted_user_data_inaccessible
```

---

## 6. End-to-End Tests (Playwright)

### Primary E2E flow — The most important automated test

```
1. Navigate to homepage
2. Click "Get Started"
3. Register with email
4. Verify email (mock in test env)
5. Complete onboarding wizard (8 steps with valid data)
6. Select "Data Analyst" career
7. View skill-gap analysis
8. Generate roadmap
9. View roadmap with phases
10. Open Phase 1
11. Mark first roadmap item as started
12. Mark first roadmap item as completed
13. Verify progress bar updates
14. Verify dashboard reflects progress
15. View "Why this recommendation?" explanation
```

### Viewport tests

Run primary flow at:
- Desktop: 1440×900
- Tablet: 768×1024
- Mobile: 375×812

### Edge case E2E flows

```
flow_undecided_student → exploration mode, multiple paths shown
flow_career_change → old path archived, new path created, shared skills preserved
flow_zero_skills → full roadmap from scratch
flow_advanced_student → roadmap skips known skills correctly
flow_weekly_hours_low → roadmap phases extended, not compressed unsafely
```

### State tests

```
test_loading_state_shown_during_roadmap_generation
test_error_state_shown_on_api_failure
test_empty_state_shown_before_roadmap_generated
test_invalid_form_data_blocked_with_messages
```

---

## 7. Performance Tests

```
GET /api/v1/roadmaps/current → < 200ms p95
POST /api/v1/career-analysis → < 500ms p95
POST /api/v1/roadmaps/generate → < 3000ms p95 (AI layer)
GET /api/v1/careers → < 100ms p95
Page load (roadmap page) → < 2s LCP
```

---

## 8. Antigravity Post-Feature Review Prompt

After each feature implementation, run:

```
Review the implementation just created. Do not add new functionality.

Run:
- unit tests: pytest apps/api/tests/unit/
- integration tests: pytest apps/api/tests/integration/
- frontend tests: cd apps/web && npm test
- lint: ruff check apps/api/ && cd apps/web && npm run lint
- type checking: mypy apps/api/ && cd apps/web && npm run type-check
- build: cd apps/web && npm run build

Inspect the Git diff.

Look specifically for:
- Security issues (auth, authorization, injection)
- Missing input validation
- Incorrect database queries or missing constraints
- Race conditions in async code
- Hard-coded values that should be config
- Secrets accidentally committed
- Missing error handling
- AI outputs written to DB without validation
- Market claims without evidence objects

Fix only issues introduced by this feature.

Produce an artifact containing:
1. Tests run and results
2. Files changed (with line counts)
3. Remaining risks
4. Suggested follow-up tasks
```

---

## 9. Antigravity Browser QA Prompt

After frontend milestones:

```
Act as a QA engineer. Open the application using the browser.

Test this complete flow:
1. Register new student account
2. Complete onboarding (all 8 steps)
3. Select Data Analyst career path
4. Generate roadmap
5. View roadmap phases
6. Mark one milestone complete
7. Verify dashboard progress updates

Test on:
- Desktop viewport (1440px)
- Mobile viewport (375px)

For each step, check:
- Loading state is visible
- Error states are handled gracefully
- Empty states have helpful copy
- Invalid input is blocked with clear messages
- No console errors

Do not modify code initially.
Create a browser testing artifact documenting:
- Steps passed / failed
- Screenshots of failures
- Reproduction steps for each issue found
```

---

## 10. Test Data Strategy

### Test personas (stored in `data/fixtures/personas/`)

| Persona | Degree | Year | Goal | Known Skills | Expected Gaps |
|---|---|---|---|---|---|
| CSE + Data Science | B.Tech CSE | 2nd | Data Scientist | Python (beginner), Math | Statistics, ML, Linear Algebra, Projects |
| Mechanical + Robotics | B.Tech Mech | 3rd | Robotics Engineer | CAD, basics | Python/C++, ROS, Control Systems |
| Commerce + Finance | B.Com | 3rd | Financial Analyst | Excel (intermediate) | SQL, Statistics, Power BI, Financial Modeling |
| Entrepreneur | B.Tech Any | 4th | Startup founder | Varies | Problem discovery, Customer interviews, MVP dev |
| Undecided | B.Sc | 1st | Exploring | None | Should trigger Exploration Mode |

All integration and AI tests should run against these five personas.
