# StudentRoadmap AI — Database Specification

**Database Engine:** PostgreSQL 16  
**Schema Version:** 1.0.0 (MVP)  
**Document Status:** Authoritative  

---

## Table of Contents

1. [Extensions & Setup](#1-extensions--setup)  
2. [Global Conventions](#2-global-conventions)  
3. [PostgreSQL ENUMs](#3-postgresql-enums)  
4. [Core User Tables](#4-core-user-tables)  
5. [Skills Ontology](#5-skills-ontology)  
6. [Career Ontology](#6-career-ontology)  
7. [Resources](#7-resources)  
8. [Projects](#8-projects)  
9. [Roadmaps](#9-roadmaps)  
10. [Progress & Evidence](#10-progress--evidence)  
11. [Assessments](#11-assessments)  
12. [Recommendations & Market](#12-recommendations--market)  
13. [System Tables](#13-system-tables)  
14. [pgvector Setup](#14-pgvector-setup)  
15. [Row-Level Security (RLS)](#15-row-level-security-rls)  
16. [Alembic Migration Strategy](#16-alembic-migration-strategy)  
17. [Seed Data Strategy](#17-seed-data-strategy)  
18. [competency_score Formula](#18-competency_score-formula)  
19. [Entity Relationship Summary](#19-entity-relationship-summary)  

---

## 1. Extensions & Setup

```sql
-- Required extensions (run as superuser before any migrations)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";       -- gen_random_uuid()
CREATE EXTENSION IF NOT EXISTS "pg_trgm";        -- trigram indexes for full-text search
CREATE EXTENSION IF NOT EXISTS "btree_gin";      -- GIN indexes on scalar types
CREATE EXTENSION IF NOT EXISTS "vector";         -- pgvector for AI embeddings (see §14)
CREATE EXTENSION IF NOT EXISTS "citext";         -- case-insensitive text for email

-- Default schema
SET search_path TO public;

-- Useful helper: auto-update updated_at
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

> [!NOTE]
> The `trigger_set_timestamp()` function is referenced by `BEFORE UPDATE` triggers on every table that has an `updated_at` column. Each `CREATE TABLE` block below includes the trigger definition.

---

## 2. Global Conventions

| Convention | Rule |
|---|---|
| Primary keys | `UUID DEFAULT gen_random_uuid()` |
| Timestamps | `TIMESTAMPTZ DEFAULT NOW()` |
| Soft delete | `deleted_at TIMESTAMPTZ NULL` — `NULL` means active |
| Foreign keys | Always named `<target_table_singular>_id`, explicit `ON DELETE` action |
| Indexes on FKs | Every FK column has a corresponding `CREATE INDEX` |
| Enum columns | PostgreSQL native `ENUM` type (defined once, reused) |
| Decimal precision | `DECIMAL(3,2)` for 0–1 scores; `DECIMAL(5,4)` for high-precision percentages |
| Array columns | `UUID[]` for lightweight ID lists; prefer join tables for queryable relations |

---

## 3. PostgreSQL ENUMs

All ENUMs are defined once and referenced by multiple tables.

```sql
-- User / auth
CREATE TYPE auth_provider_type   AS ENUM ('local', 'google');
CREATE TYPE user_role_type       AS ENUM ('student', 'admin', 'content_editor', 'market_analyst');

-- Student profile
CREATE TYPE degree_type          AS ENUM ('btech', 'bsc', 'bcom', 'ba', 'mtech', 'msc', 'other');
CREATE TYPE learning_style_type  AS ENUM ('visual', 'reading', 'hands_on', 'video', 'mixed');
CREATE TYPE financial_type       AS ENUM ('none', 'some', 'significant');

-- Student preferences
CREATE TYPE work_mode_type       AS ENUM ('remote', 'hybrid', 'onsite', 'no_preference');
CREATE TYPE company_size_type    AS ENUM ('startup', 'mid', 'large', 'no_preference');

-- Student experience
CREATE TYPE experience_type      AS ENUM ('internship', 'project', 'certification', 'freelance', 'hackathon');

-- Skills
CREATE TYPE skill_category_type  AS ENUM ('technical', 'soft', 'domain', 'tool');
CREATE TYPE difficulty_type      AS ENUM ('beginner', 'intermediate', 'advanced', 'expert');
CREATE TYPE skill_status_type    AS ENUM ('active', 'deprecated');
CREATE TYPE dependency_type      AS ENUM ('required', 'recommended', 'optional');
CREATE TYPE confidence_type      AS ENUM ('low', 'medium', 'high');
CREATE TYPE skill_source_type    AS ENUM ('self_declared', 'assessment', 'ai_inferred', 'imported');

-- Career
CREATE TYPE entity_status_type   AS ENUM ('active', 'draft', 'deprecated');
CREATE TYPE seniority_type       AS ENUM ('entry', 'mid', 'senior');

-- Resources
CREATE TYPE resource_type        AS ENUM ('course', 'documentation', 'book', 'video', 'practice', 'project_tutorial', 'certification');
CREATE TYPE cost_type            AS ENUM ('free', 'freemium', 'paid');
CREATE TYPE verification_status  AS ENUM ('verified', 'needs_review', 'expired', 'broken');
CREATE TYPE coverage_level_type  AS ENUM ('intro', 'partial', 'comprehensive');

-- Projects / portfolio
CREATE TYPE portfolio_value_type AS ENUM ('low', 'medium', 'high');
CREATE TYPE project_skill_role   AS ENUM ('primary', 'secondary', 'supporting');

-- Roadmaps / progress
CREATE TYPE roadmap_status_type  AS ENUM ('draft', 'active', 'archived');
CREATE TYPE phase_status_type    AS ENUM ('not_started', 'in_progress', 'completed');
CREATE TYPE item_type            AS ENUM ('skill', 'resource', 'project', 'assessment', 'milestone');
CREATE TYPE item_status_type     AS ENUM ('not_started', 'in_progress', 'completed', 'verified');

-- Evidence
CREATE TYPE evidence_type        AS ENUM ('course_completion', 'exercise', 'assessment_pass', 'project_completion', 'certification');

-- Assessments
CREATE TYPE question_type        AS ENUM ('mcq', 'short_answer');
CREATE TYPE question_diff_type   AS ENUM ('easy', 'medium', 'hard');

-- Recommendations
CREATE TYPE recommendation_type  AS ENUM ('skill', 'resource', 'project', 'career', 'roadmap_action');
CREATE TYPE feedback_type        AS ENUM ('useful', 'not_useful');

-- Market
CREATE TYPE market_source_type   AS ENUM ('government', 'taxonomy', 'job_postings', 'survey');
CREATE TYPE refresh_freq_type    AS ENUM ('daily', 'weekly', 'monthly', 'quarterly');
CREATE TYPE source_status_type   AS ENUM ('active', 'inactive');
```

---

## 4. Core User Tables

### 4.1 `users`

Central identity record. Authentication providers may be local (email + password) or OAuth (Google).

```sql
CREATE TABLE users (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    email               CITEXT          NOT NULL,
    password_hash       TEXT,
    auth_provider       auth_provider_type NOT NULL DEFAULT 'local',
    auth_provider_id    TEXT,
    role                user_role_type  NOT NULL DEFAULT 'student',
    is_active           BOOLEAN         NOT NULL DEFAULT true,
    email_verified_at   TIMESTAMPTZ,
    last_login_at       TIMESTAMPTZ,
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    deleted_at          TIMESTAMPTZ,

    CONSTRAINT users_email_unique UNIQUE (email),
    CONSTRAINT users_oauth_unique UNIQUE (auth_provider, auth_provider_id),
    CONSTRAINT users_local_has_password CHECK (
        auth_provider <> 'local' OR password_hash IS NOT NULL
    )
);

CREATE INDEX idx_users_email         ON users (email);
CREATE INDEX idx_users_role          ON users (role);
CREATE INDEX idx_users_is_active     ON users (is_active) WHERE is_active = true;
CREATE INDEX idx_users_deleted_at    ON users (deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_auth_provider ON users (auth_provider, auth_provider_id)
    WHERE auth_provider_id IS NOT NULL;

CREATE TRIGGER set_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 4.2 `student_profiles`

One-to-one extension of `users` for student-specific academic and goal data.

```sql
CREATE TABLE student_profiles (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id                 UUID            NOT NULL,
    degree                  degree_type,
    branch                  TEXT,
    university              TEXT,
    year                    SMALLINT        CHECK (year BETWEEN 1 AND 4),
    semester                SMALLINT        CHECK (semester BETWEEN 1 AND 8),
    graduation_year         SMALLINT,
    location_city           TEXT,
    location_state          TEXT,
    location_country        TEXT            NOT NULL DEFAULT 'India',
    weekly_learning_hours   SMALLINT        CHECK (weekly_learning_hours > 0),
    career_goal_text        TEXT,
    learning_style          learning_style_type,
    remote_preference       BOOLEAN,
    financial_constraints   financial_type  NOT NULL DEFAULT 'none',
    higher_study_interest   BOOLEAN         NOT NULL DEFAULT false,
    entrepreneurship_interest BOOLEAN       NOT NULL DEFAULT false,
    profile_completed_at    TIMESTAMPTZ,
    last_reviewed_at        TIMESTAMPTZ,
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_profiles_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT student_profiles_user_unique UNIQUE (user_id)
);

CREATE INDEX idx_student_profiles_user_id        ON student_profiles (user_id);
CREATE INDEX idx_student_profiles_degree         ON student_profiles (degree);
CREATE INDEX idx_student_profiles_graduation_year ON student_profiles (graduation_year);
CREATE INDEX idx_student_profiles_location_state ON student_profiles (location_state);
CREATE INDEX idx_student_profiles_completed      ON student_profiles (profile_completed_at)
    WHERE profile_completed_at IS NOT NULL;

CREATE TRIGGER set_student_profiles_updated_at
    BEFORE UPDATE ON student_profiles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 4.3 `student_interests`

Free-form or AI-inferred interest tags attached to a student profile.

```sql
CREATE TABLE student_interests (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID            NOT NULL,
    interest_text       TEXT            NOT NULL,
    interest_category   TEXT,
    ai_inferred         BOOLEAN         NOT NULL DEFAULT false,
    confidence_score    DECIMAL(3,2)    CHECK (confidence_score BETWEEN 0 AND 1),
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_interests_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE
);

CREATE INDEX idx_student_interests_student_id ON student_interests (student_id);
CREATE INDEX idx_student_interests_category   ON student_interests (interest_category);
CREATE INDEX idx_student_interests_ai         ON student_interests (ai_inferred);

-- Trigram index for interest_text search
CREATE INDEX idx_student_interests_text_trgm
    ON student_interests USING GIN (interest_text gin_trgm_ops);
```

---

### 4.4 `student_preferences`

Structured job/career preferences per student (one-to-one).

```sql
CREATE TABLE student_preferences (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID                NOT NULL,
    preferred_industry_ids  UUID[]              NOT NULL DEFAULT '{}',
    preferred_work_mode     work_mode_type      NOT NULL DEFAULT 'no_preference',
    preferred_company_size  company_size_type   NOT NULL DEFAULT 'no_preference',
    preferred_role_types    TEXT[]              NOT NULL DEFAULT '{}',
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_preferences_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT student_preferences_student_unique UNIQUE (student_id)
);

CREATE INDEX idx_student_preferences_student_id  ON student_preferences (student_id);
CREATE INDEX idx_student_preferences_work_mode   ON student_preferences (preferred_work_mode);
CREATE INDEX idx_student_preferences_industries  ON student_preferences USING GIN (preferred_industry_ids);

CREATE TRIGGER set_student_preferences_updated_at
    BEFORE UPDATE ON student_preferences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 4.5 `student_experiences`

Work history, projects, hackathons, certifications, and freelance engagements.

```sql
CREATE TABLE student_experiences (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID            NOT NULL,
    type                    experience_type NOT NULL,
    title                   TEXT            NOT NULL,
    organization            TEXT,
    description             TEXT,
    start_date              DATE,
    end_date                DATE,
    is_current              BOOLEAN         NOT NULL DEFAULT false,
    ai_extracted_skills     JSONB           NOT NULL DEFAULT '[]',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_experiences_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT student_experiences_dates_check
        CHECK (end_date IS NULL OR end_date >= start_date),
    CONSTRAINT student_experiences_current_no_end
        CHECK (NOT is_current OR end_date IS NULL)
);

CREATE INDEX idx_student_experiences_student_id ON student_experiences (student_id);
CREATE INDEX idx_student_experiences_type       ON student_experiences (type);
CREATE INDEX idx_student_experiences_current    ON student_experiences (is_current)
    WHERE is_current = true;

CREATE TRIGGER set_student_experiences_updated_at
    BEFORE UPDATE ON student_experiences
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

## 5. Skills Ontology

### 5.1 `skills`

Master catalogue of skills, sourced from market data and curated by content editors.

```sql
CREATE TABLE skills (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT                NOT NULL,
    slug            TEXT                NOT NULL,
    category        skill_category_type NOT NULL,
    description     TEXT,
    difficulty      difficulty_type     NOT NULL DEFAULT 'beginner',
    canonical_source TEXT,
    external_id     TEXT,
    status          skill_status_type   NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT skills_slug_unique UNIQUE (slug),
    CONSTRAINT skills_external_unique UNIQUE (external_id) NULLS NOT DISTINCT
);

CREATE INDEX idx_skills_slug       ON skills (slug);
CREATE INDEX idx_skills_category   ON skills (category);
CREATE INDEX idx_skills_difficulty ON skills (difficulty);
CREATE INDEX idx_skills_status     ON skills (status) WHERE status = 'active';
CREATE INDEX idx_skills_name_trgm  ON skills USING GIN (name gin_trgm_ops);

CREATE TRIGGER set_skills_updated_at
    BEFORE UPDATE ON skills
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 5.2 `skill_dependencies`

Prerequisite graph between skills. Enables topological ordering in roadmap generation.

```sql
CREATE TABLE skill_dependencies (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id                UUID                NOT NULL,
    prerequisite_skill_id   UUID                NOT NULL,
    dependency_type         dependency_type     NOT NULL DEFAULT 'required',
    strength                DECIMAL(3,2)        CHECK (strength BETWEEN 0.00 AND 1.00),
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_skill_dependencies_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT fk_skill_dependencies_prerequisite
        FOREIGN KEY (prerequisite_skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT skill_dependencies_no_self_ref
        CHECK (skill_id <> prerequisite_skill_id),
    CONSTRAINT skill_dependencies_unique UNIQUE (skill_id, prerequisite_skill_id)
);

CREATE INDEX idx_skill_dependencies_skill_id          ON skill_dependencies (skill_id);
CREATE INDEX idx_skill_dependencies_prerequisite_id   ON skill_dependencies (prerequisite_skill_id);
CREATE INDEX idx_skill_dependencies_type              ON skill_dependencies (dependency_type);
```

---

### 5.3 `student_skills`

Per-student skill competency record, combining self-assessment, adaptive assessment, and evidence.

```sql
CREATE TABLE student_skills (
    id                  UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id          UUID                NOT NULL,
    skill_id            UUID                NOT NULL,
    self_rating         SMALLINT            CHECK (self_rating BETWEEN 0 AND 10),
    assessment_rating   DECIMAL(3,2)        CHECK (assessment_rating BETWEEN 0.00 AND 1.00),
    evidence_rating     DECIMAL(3,2)        CHECK (evidence_rating BETWEEN 0.00 AND 1.00),
    -- See §18 for formula explanation
    competency_score    DECIMAL(3,2) GENERATED ALWAYS AS (
        ROUND(
            (0.20 * COALESCE(self_rating, 0) / 10.0)
            + COALESCE(0.40 * assessment_rating, 0.0)
            + COALESCE(0.40 * evidence_rating, 0.0)
        , 2)
    ) STORED,
    confidence          confidence_type     NOT NULL DEFAULT 'low',
    source              skill_source_type   NOT NULL DEFAULT 'self_declared',
    last_verified_at    TIMESTAMPTZ,
    created_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_skills_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT student_skills_unique UNIQUE (student_id, skill_id)
);

CREATE INDEX idx_student_skills_student_id      ON student_skills (student_id);
CREATE INDEX idx_student_skills_skill_id        ON student_skills (skill_id);
CREATE INDEX idx_student_skills_competency      ON student_skills (competency_score DESC);
CREATE INDEX idx_student_skills_confidence      ON student_skills (confidence);
CREATE INDEX idx_student_skills_source          ON student_skills (source);
CREATE INDEX idx_student_skills_verified_at     ON student_skills (last_verified_at);

CREATE TRIGGER set_student_skills_updated_at
    BEFORE UPDATE ON student_skills
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

## 6. Career Ontology

### 6.1 `industries`

Top-level industry classification (e.g., FinTech, EdTech, Healthcare IT).

```sql
CREATE TABLE industries (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT        NOT NULL,
    slug        TEXT        NOT NULL,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT industries_name_unique UNIQUE (name),
    CONSTRAINT industries_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_industries_slug ON industries (slug);

CREATE TRIGGER set_industries_updated_at
    BEFORE UPDATE ON industries
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 6.2 `career_paths`

Hierarchical career trajectory (e.g., Software Engineering > Backend Engineering). Supports self-referential parent for sub-specialisations.

```sql
CREATE TABLE career_paths (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT                NOT NULL,
    slug            TEXT                NOT NULL,
    description     TEXT,
    industry_id     UUID                NOT NULL,
    parent_path_id  UUID,
    status          entity_status_type  NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_career_paths_industry
        FOREIGN KEY (industry_id) REFERENCES industries (id) ON DELETE RESTRICT,
    CONSTRAINT fk_career_paths_parent
        FOREIGN KEY (parent_path_id) REFERENCES career_paths (id) ON DELETE SET NULL,
    CONSTRAINT career_paths_slug_unique UNIQUE (slug),
    CONSTRAINT career_paths_no_self_parent CHECK (id <> parent_path_id)
);

CREATE INDEX idx_career_paths_slug          ON career_paths (slug);
CREATE INDEX idx_career_paths_industry_id   ON career_paths (industry_id);
CREATE INDEX idx_career_paths_parent_id     ON career_paths (parent_path_id);
CREATE INDEX idx_career_paths_status        ON career_paths (status);

CREATE TRIGGER set_career_paths_updated_at
    BEFORE UPDATE ON career_paths
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 6.3 `career_roles`

Specific job roles within a career path (e.g., Backend Engineer, Data Analyst).

```sql
CREATE TABLE career_roles (
    id                              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    title                           TEXT                NOT NULL,
    slug                            TEXT                NOT NULL,
    description                     TEXT,
    career_path_id                  UUID                NOT NULL,
    industry_id                     UUID                NOT NULL,
    education_requirements          JSONB               NOT NULL DEFAULT '{}',
    entry_level_experience_years    SMALLINT            NOT NULL DEFAULT 0
                                        CHECK (entry_level_experience_years >= 0),
    seniority_level                 seniority_type      NOT NULL DEFAULT 'entry',
    status                          entity_status_type  NOT NULL DEFAULT 'active',
    created_at                      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at                      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_career_roles_career_path
        FOREIGN KEY (career_path_id) REFERENCES career_paths (id) ON DELETE RESTRICT,
    CONSTRAINT fk_career_roles_industry
        FOREIGN KEY (industry_id) REFERENCES industries (id) ON DELETE RESTRICT,
    CONSTRAINT career_roles_slug_unique UNIQUE (slug)
);

CREATE INDEX idx_career_roles_slug           ON career_roles (slug);
CREATE INDEX idx_career_roles_career_path_id ON career_roles (career_path_id);
CREATE INDEX idx_career_roles_industry_id    ON career_roles (industry_id);
CREATE INDEX idx_career_roles_seniority      ON career_roles (seniority_level);
CREATE INDEX idx_career_roles_status         ON career_roles (status);

CREATE TRIGGER set_career_roles_updated_at
    BEFORE UPDATE ON career_roles
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 6.4 `career_role_skills`

Skills required for a given career role, with importance weighting and market evidence linkage.

```sql
CREATE TABLE career_role_skills (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    career_role_id  UUID                NOT NULL,
    skill_id        UUID                NOT NULL,
    importance      DECIMAL(3,2)        NOT NULL CHECK (importance BETWEEN 0.00 AND 1.00),
    required_level  difficulty_type     NOT NULL DEFAULT 'beginner',
    evidence_type   TEXT,
    source_id       UUID,                 -- references market_sources(id), soft FK (no ON DELETE)
    valid_from      DATE,
    valid_until     DATE,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_career_role_skills_role
        FOREIGN KEY (career_role_id) REFERENCES career_roles (id) ON DELETE CASCADE,
    CONSTRAINT fk_career_role_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT career_role_skills_unique UNIQUE (career_role_id, skill_id),
    CONSTRAINT career_role_skills_dates_check
        CHECK (valid_until IS NULL OR valid_until >= valid_from)
);

CREATE INDEX idx_career_role_skills_role_id   ON career_role_skills (career_role_id);
CREATE INDEX idx_career_role_skills_skill_id  ON career_role_skills (skill_id);
CREATE INDEX idx_career_role_skills_importance ON career_role_skills (importance DESC);
CREATE INDEX idx_career_role_skills_source_id ON career_role_skills (source_id)
    WHERE source_id IS NOT NULL;
CREATE INDEX idx_career_role_skills_validity  ON career_role_skills (valid_from, valid_until);
```

---

## 7. Resources

### 7.1 `resources`

External learning content (courses, books, videos, practice platforms, certifications).

```sql
CREATE TABLE resources (
    id                  UUID                    PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT                    NOT NULL,
    provider            TEXT,
    url                 TEXT,
    type                resource_type           NOT NULL,
    difficulty          difficulty_type         NOT NULL DEFAULT 'beginner',
    duration_hours      DECIMAL(5,1)            CHECK (duration_hours >= 0),
    cost                cost_type               NOT NULL DEFAULT 'free',
    language            TEXT                    NOT NULL DEFAULT 'English',
    rating              DECIMAL(3,2)            CHECK (rating BETWEEN 0.00 AND 5.00),
    last_verified_at    TIMESTAMPTZ,
    verification_status verification_status     NOT NULL DEFAULT 'needs_review',
    status              skill_status_type       NOT NULL DEFAULT 'active',
    created_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ             NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_resources_type                ON resources (type);
CREATE INDEX idx_resources_difficulty          ON resources (difficulty);
CREATE INDEX idx_resources_cost                ON resources (cost);
CREATE INDEX idx_resources_status              ON resources (status);
CREATE INDEX idx_resources_verification_status ON resources (verification_status);
CREATE INDEX idx_resources_rating              ON resources (rating DESC NULLS LAST);
CREATE INDEX idx_resources_provider_trgm       ON resources USING GIN (provider gin_trgm_ops);
CREATE INDEX idx_resources_title_trgm          ON resources USING GIN (title gin_trgm_ops);

CREATE TRIGGER set_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 7.2 `resource_skills`

Junction table mapping resources to the skills they teach.

```sql
CREATE TABLE resource_skills (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    resource_id     UUID                NOT NULL,
    skill_id        UUID                NOT NULL,
    coverage_level  coverage_level_type NOT NULL DEFAULT 'partial',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_resource_skills_resource
        FOREIGN KEY (resource_id) REFERENCES resources (id) ON DELETE CASCADE,
    CONSTRAINT fk_resource_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT resource_skills_unique UNIQUE (resource_id, skill_id)
);

CREATE INDEX idx_resource_skills_resource_id ON resource_skills (resource_id);
CREATE INDEX idx_resource_skills_skill_id    ON resource_skills (skill_id);
CREATE INDEX idx_resource_skills_coverage    ON resource_skills (coverage_level);
```

---

## 8. Projects

### 8.1 `projects`

Curated hands-on project templates that students can undertake to build portfolio evidence.

```sql
CREATE TABLE projects (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    title                   TEXT                NOT NULL,
    description             TEXT,
    difficulty              difficulty_type     NOT NULL DEFAULT 'beginner',
    estimated_hours         SMALLINT            CHECK (estimated_hours > 0),
    career_relevance_notes  TEXT,
    portfolio_value         portfolio_value_type NOT NULL DEFAULT 'medium',
    status                  skill_status_type   NOT NULL DEFAULT 'active',
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_projects_difficulty      ON projects (difficulty);
CREATE INDEX idx_projects_portfolio_value ON projects (portfolio_value);
CREATE INDEX idx_projects_status          ON projects (status);
CREATE INDEX idx_projects_title_trgm      ON projects USING GIN (title gin_trgm_ops);

CREATE TRIGGER set_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 8.2 `project_skills`

Skills practiced and demonstrated by completing a project.

```sql
CREATE TABLE project_skills (
    id          UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id  UUID                NOT NULL,
    skill_id    UUID                NOT NULL,
    role        project_skill_role  NOT NULL DEFAULT 'secondary',
    created_at  TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_project_skills_project
        FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE,
    CONSTRAINT fk_project_skills_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT project_skills_unique UNIQUE (project_id, skill_id)
);

CREATE INDEX idx_project_skills_project_id ON project_skills (project_id);
CREATE INDEX idx_project_skills_skill_id   ON project_skills (skill_id);
CREATE INDEX idx_project_skills_role       ON project_skills (role);
```

---

## 9. Roadmaps

### 9.1 `roadmaps`

Top-level AI-generated learning roadmap for a student targeting a specific career role.

```sql
CREATE TABLE roadmaps (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID                NOT NULL,
    career_role_id          UUID                NOT NULL,
    version                 SMALLINT            NOT NULL DEFAULT 1 CHECK (version > 0),
    status                  roadmap_status_type NOT NULL DEFAULT 'draft',
    trigger_event           TEXT,
    weekly_hours_committed  SMALLINT            CHECK (weekly_hours_committed > 0),
    target_completion_date  DATE,
    generated_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_roadmaps_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_roadmaps_career_role
        FOREIGN KEY (career_role_id) REFERENCES career_roles (id) ON DELETE RESTRICT
);

CREATE INDEX idx_roadmaps_student_id     ON roadmaps (student_id);
CREATE INDEX idx_roadmaps_career_role_id ON roadmaps (career_role_id);
CREATE INDEX idx_roadmaps_status         ON roadmaps (status);
CREATE INDEX idx_roadmaps_active         ON roadmaps (student_id, status)
    WHERE status = 'active';

CREATE TRIGGER set_roadmaps_updated_at
    BEFORE UPDATE ON roadmaps
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 9.2 `roadmap_phases`

Ordered phases (weeks/months) within a roadmap. Each phase groups related items.

```sql
CREATE TABLE roadmap_phases (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id      UUID                NOT NULL,
    phase_number    SMALLINT            NOT NULL CHECK (phase_number > 0),
    title           TEXT                NOT NULL,
    description     TEXT,
    estimated_hours SMALLINT            CHECK (estimated_hours > 0),
    status          phase_status_type   NOT NULL DEFAULT 'not_started',
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_roadmap_phases_roadmap
        FOREIGN KEY (roadmap_id) REFERENCES roadmaps (id) ON DELETE CASCADE,
    CONSTRAINT roadmap_phases_order_unique UNIQUE (roadmap_id, phase_number)
);

CREATE INDEX idx_roadmap_phases_roadmap_id    ON roadmap_phases (roadmap_id);
CREATE INDEX idx_roadmap_phases_status        ON roadmap_phases (status);
CREATE INDEX idx_roadmap_phases_phase_number  ON roadmap_phases (roadmap_id, phase_number);

CREATE TRIGGER set_roadmap_phases_updated_at
    BEFORE UPDATE ON roadmap_phases
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 9.3 `roadmap_items`

Individual actionable items within a phase (skill to learn, resource to complete, project to build, assessment to pass, or milestone to reach).

```sql
CREATE TABLE roadmap_items (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    phase_id                UUID                NOT NULL,
    type                    item_type           NOT NULL,
    reference_id            UUID,               -- polymorphic: points to skills/resources/projects/assessments
    title                   TEXT                NOT NULL,
    description             TEXT,
    estimated_hours         SMALLINT            CHECK (estimated_hours > 0),
    prerequisite_item_ids   UUID[]              NOT NULL DEFAULT '{}',
    order_index             SMALLINT            NOT NULL DEFAULT 0,
    status                  item_status_type    NOT NULL DEFAULT 'not_started',
    ai_explanation          TEXT,
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_roadmap_items_phase
        FOREIGN KEY (phase_id) REFERENCES roadmap_phases (id) ON DELETE CASCADE
);

CREATE INDEX idx_roadmap_items_phase_id        ON roadmap_items (phase_id);
CREATE INDEX idx_roadmap_items_type            ON roadmap_items (type);
CREATE INDEX idx_roadmap_items_status          ON roadmap_items (status);
CREATE INDEX idx_roadmap_items_order           ON roadmap_items (phase_id, order_index);
CREATE INDEX idx_roadmap_items_reference_id    ON roadmap_items (reference_id)
    WHERE reference_id IS NOT NULL;
CREATE INDEX idx_roadmap_items_prerequisites   ON roadmap_items USING GIN (prerequisite_item_ids);

CREATE TRIGGER set_roadmap_items_updated_at
    BEFORE UPDATE ON roadmap_items
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

## 10. Progress & Evidence

### 10.1 `student_progress`

Tracks per-item completion state for each student within their roadmap.

```sql
CREATE TABLE student_progress (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id              UUID                NOT NULL,
    roadmap_item_id         UUID                NOT NULL,
    status                  item_status_type    NOT NULL DEFAULT 'not_started',
    completion_percentage   SMALLINT            NOT NULL DEFAULT 0
                                CHECK (completion_percentage BETWEEN 0 AND 100),
    started_at              TIMESTAMPTZ,
    completed_at            TIMESTAMPTZ,
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_student_progress_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_progress_item
        FOREIGN KEY (roadmap_item_id) REFERENCES roadmap_items (id) ON DELETE CASCADE,
    CONSTRAINT student_progress_unique UNIQUE (student_id, roadmap_item_id),
    CONSTRAINT student_progress_dates_check
        CHECK (completed_at IS NULL OR completed_at >= started_at)
);

CREATE INDEX idx_student_progress_student_id      ON student_progress (student_id);
CREATE INDEX idx_student_progress_item_id         ON student_progress (roadmap_item_id);
CREATE INDEX idx_student_progress_status          ON student_progress (status);
CREATE INDEX idx_student_progress_in_progress     ON student_progress (student_id, status)
    WHERE status = 'in_progress';

CREATE TRIGGER set_student_progress_updated_at
    BEFORE UPDATE ON student_progress
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 10.2 `skill_evidence`

Verifiable proof artefacts supporting a student's claimed skill competency.

```sql
CREATE TABLE skill_evidence (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID            NOT NULL,
    skill_id        UUID            NOT NULL,
    evidence_type   evidence_type   NOT NULL,
    reference_id    UUID,           -- polymorphic: points to resources/projects/assessments
    notes           TEXT,
    verified_by     TEXT,
    verified_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_skill_evidence_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_skill_evidence_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE
);

CREATE INDEX idx_skill_evidence_student_id    ON skill_evidence (student_id);
CREATE INDEX idx_skill_evidence_skill_id      ON skill_evidence (skill_id);
CREATE INDEX idx_skill_evidence_type          ON skill_evidence (evidence_type);
CREATE INDEX idx_skill_evidence_reference_id  ON skill_evidence (reference_id)
    WHERE reference_id IS NOT NULL;
CREATE INDEX idx_skill_evidence_verified      ON skill_evidence (verified_at)
    WHERE verified_at IS NOT NULL;
```

---

## 11. Assessments

### 11.1 `assessments`

Adaptive skill assessments curated per skill and difficulty level.

```sql
CREATE TABLE assessments (
    id                  UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    skill_id            UUID            NOT NULL,
    title               TEXT            NOT NULL,
    description         TEXT,
    difficulty          difficulty_type NOT NULL DEFAULT 'beginner',
    estimated_minutes   SMALLINT        CHECK (estimated_minutes > 0),
    passing_score       DECIMAL(3,2)    NOT NULL DEFAULT 0.70
                            CHECK (passing_score BETWEEN 0.00 AND 1.00),
    status              skill_status_type NOT NULL DEFAULT 'active',
    created_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_assessments_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE RESTRICT
);

CREATE INDEX idx_assessments_skill_id   ON assessments (skill_id);
CREATE INDEX idx_assessments_difficulty ON assessments (difficulty);
CREATE INDEX idx_assessments_status     ON assessments (status);

CREATE TRIGGER set_assessments_updated_at
    BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 11.2 `assessment_questions`

Individual questions belonging to an assessment. Supports MCQ and short-answer formats.

```sql
CREATE TABLE assessment_questions (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id   UUID                NOT NULL,
    question_text   TEXT                NOT NULL,
    question_type   question_type       NOT NULL DEFAULT 'mcq',
    options         JSONB,              -- array of option strings for MCQ
    correct_answer  JSONB               NOT NULL,
    explanation     TEXT,
    difficulty      question_diff_type  NOT NULL DEFAULT 'medium',
    order_index     SMALLINT            NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_assessment_questions_assessment
        FOREIGN KEY (assessment_id) REFERENCES assessments (id) ON DELETE CASCADE,
    CONSTRAINT assessment_questions_mcq_has_options CHECK (
        question_type <> 'mcq' OR options IS NOT NULL
    )
);

CREATE INDEX idx_assessment_questions_assessment_id ON assessment_questions (assessment_id);
CREATE INDEX idx_assessment_questions_difficulty    ON assessment_questions (difficulty);
CREATE INDEX idx_assessment_questions_order         ON assessment_questions (assessment_id, order_index);
```

---

### 11.3 `assessment_attempts`

Student attempt records including score, pass/fail, and full answer payload.

```sql
CREATE TABLE assessment_attempts (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID        NOT NULL,
    assessment_id   UUID        NOT NULL,
    score           DECIMAL(3,2) CHECK (score BETWEEN 0.00 AND 1.00),
    passed          BOOLEAN,
    started_at      TIMESTAMPTZ,
    completed_at    TIMESTAMPTZ,
    answers         JSONB       NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_assessment_attempts_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT fk_assessment_attempts_assessment
        FOREIGN KEY (assessment_id) REFERENCES assessments (id) ON DELETE CASCADE,
    CONSTRAINT assessment_attempts_dates_check
        CHECK (completed_at IS NULL OR completed_at >= started_at)
);

CREATE INDEX idx_assessment_attempts_student_id    ON assessment_attempts (student_id);
CREATE INDEX idx_assessment_attempts_assessment_id ON assessment_attempts (assessment_id);
CREATE INDEX idx_assessment_attempts_passed        ON assessment_attempts (passed);
CREATE INDEX idx_assessment_attempts_completed_at  ON assessment_attempts (completed_at DESC NULLS LAST);
```

---

## 12. Recommendations & Market

### 12.1 `recommendations`

AI-generated recommendations surfaced to the student with evidence references and feedback tracking.

```sql
CREATE TABLE recommendations (
    id              UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID                NOT NULL,
    type            recommendation_type NOT NULL,
    reference_id    UUID,               -- polymorphic target
    reason_text     TEXT,
    evidence_ids    UUID[]              NOT NULL DEFAULT '{}',
    confidence      confidence_type     NOT NULL DEFAULT 'medium',
    student_feedback feedback_type,
    feedback_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ         NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_recommendations_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE,
    CONSTRAINT recommendations_feedback_has_timestamp CHECK (
        student_feedback IS NULL OR feedback_at IS NOT NULL
    )
);

CREATE INDEX idx_recommendations_student_id    ON recommendations (student_id);
CREATE INDEX idx_recommendations_type          ON recommendations (type);
CREATE INDEX idx_recommendations_confidence    ON recommendations (confidence);
CREATE INDEX idx_recommendations_reference_id  ON recommendations (reference_id)
    WHERE reference_id IS NOT NULL;
CREATE INDEX idx_recommendations_evidence_ids  ON recommendations USING GIN (evidence_ids);
CREATE INDEX idx_recommendations_feedback      ON recommendations (student_feedback)
    WHERE student_feedback IS NOT NULL;
```

---

### 12.2 `market_sources`

Registry of external data sources (NSDC, job boards, LinkedIn, surveys) used for skill market analysis.

```sql
CREATE TABLE market_sources (
    id                      UUID                PRIMARY KEY DEFAULT gen_random_uuid(),
    name                    TEXT                NOT NULL,
    type                    market_source_type  NOT NULL,
    url                     TEXT,
    geography               TEXT,
    license_type            TEXT,
    attribution_required    BOOLEAN             NOT NULL DEFAULT true,
    refresh_frequency       refresh_freq_type,
    last_ingested_at        TIMESTAMPTZ,
    status                  source_status_type  NOT NULL DEFAULT 'active',
    created_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW(),
    updated_at              TIMESTAMPTZ         NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_market_sources_type     ON market_sources (type);
CREATE INDEX idx_market_sources_status   ON market_sources (status);
CREATE INDEX idx_market_sources_geography ON market_sources (geography);

CREATE TRIGGER set_market_sources_updated_at
    BEFORE UPDATE ON market_sources
    FOR EACH ROW EXECUTE FUNCTION trigger_set_timestamp();
```

---

### 12.3 `market_snapshots`

A point-in-time snapshot of data ingested from a market source for a given geography and period.

```sql
CREATE TABLE market_snapshots (
    id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id               UUID        NOT NULL,
    geography               TEXT,
    observation_period_from DATE,
    observation_period_to   DATE,
    sample_size             INTEGER     CHECK (sample_size > 0),
    notes                   TEXT,
    created_at              TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_market_snapshots_source
        FOREIGN KEY (source_id) REFERENCES market_sources (id) ON DELETE RESTRICT,
    CONSTRAINT market_snapshots_period_check
        CHECK (
            observation_period_to IS NULL
            OR observation_period_to >= observation_period_from
        )
);

CREATE INDEX idx_market_snapshots_source_id   ON market_snapshots (source_id);
CREATE INDEX idx_market_snapshots_geography   ON market_snapshots (geography);
CREATE INDEX idx_market_snapshots_period      ON market_snapshots (observation_period_from, observation_period_to);
```

---

### 12.4 `market_skill_observations`

Skill frequency and co-occurrence data derived from a single market snapshot.

```sql
CREATE TABLE market_skill_observations (
    id                      UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    snapshot_id             UUID            NOT NULL,
    skill_id                UUID            NOT NULL,
    career_role_id          UUID,
    frequency_pct           DECIMAL(5,4)    CHECK (frequency_pct BETWEEN 0.0000 AND 1.0000),
    co_occurrence_skill_ids UUID[]          NOT NULL DEFAULT '{}',
    confidence              confidence_type NOT NULL DEFAULT 'medium',
    created_at              TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_market_skill_obs_snapshot
        FOREIGN KEY (snapshot_id) REFERENCES market_snapshots (id) ON DELETE CASCADE,
    CONSTRAINT fk_market_skill_obs_skill
        FOREIGN KEY (skill_id) REFERENCES skills (id) ON DELETE CASCADE,
    CONSTRAINT fk_market_skill_obs_role
        FOREIGN KEY (career_role_id) REFERENCES career_roles (id) ON DELETE SET NULL
);

CREATE INDEX idx_market_skill_obs_snapshot_id   ON market_skill_observations (snapshot_id);
CREATE INDEX idx_market_skill_obs_skill_id       ON market_skill_observations (skill_id);
CREATE INDEX idx_market_skill_obs_role_id        ON market_skill_observations (career_role_id)
    WHERE career_role_id IS NOT NULL;
CREATE INDEX idx_market_skill_obs_frequency      ON market_skill_observations (frequency_pct DESC);
CREATE INDEX idx_market_skill_obs_co_occurrence  ON market_skill_observations USING GIN (co_occurrence_skill_ids);
```

---

## 13. System Tables

### 13.1 `roadmap_versions`

Immutable audit log of every roadmap regeneration, storing the triggering event and a diff summary.

```sql
CREATE TABLE roadmap_versions (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    roadmap_id      UUID        NOT NULL,
    version         SMALLINT    NOT NULL CHECK (version > 0),
    trigger_event   TEXT,
    changes_summary JSONB       NOT NULL DEFAULT '{}',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_roadmap_versions_roadmap
        FOREIGN KEY (roadmap_id) REFERENCES roadmaps (id) ON DELETE CASCADE,
    CONSTRAINT roadmap_versions_unique UNIQUE (roadmap_id, version)
);

CREATE INDEX idx_roadmap_versions_roadmap_id ON roadmap_versions (roadmap_id);
CREATE INDEX idx_roadmap_versions_version    ON roadmap_versions (roadmap_id, version DESC);
```

---

### 13.2 `audit_logs`

Append-only table capturing all state-changing operations across the platform. Never updated or soft-deleted.

```sql
CREATE TABLE audit_logs (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID,       -- nullable: system actions have no user
    action          TEXT        NOT NULL,
    resource_type   TEXT,
    resource_id     UUID,
    old_value       JSONB,
    new_value       JSONB,
    ip_address      INET,
    user_agent      TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_audit_logs_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL
);

-- Partial index: most queries filter by user or resource
CREATE INDEX idx_audit_logs_user_id       ON audit_logs (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_resource      ON audit_logs (resource_type, resource_id);
CREATE INDEX idx_audit_logs_action        ON audit_logs (action);
CREATE INDEX idx_audit_logs_created_at    ON audit_logs (created_at DESC);

-- Partition suggestion for scale: PARTITION BY RANGE (created_at) monthly
```

> [!CAUTION]
> Do **not** add `updated_at` or `deleted_at` to `audit_logs`. It is an append-only ledger. Any modification would undermine its integrity.

---

### 13.3 `feedback`

General-purpose student feedback on any platform entity (recommendations, resources, roadmap items).

```sql
CREATE TABLE feedback (
    id              UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id      UUID        NOT NULL,
    type            TEXT        NOT NULL,   -- e.g. 'resource', 'roadmap_item', 'recommendation'
    reference_id    UUID,
    rating          SMALLINT    NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment         TEXT,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_feedback_student
        FOREIGN KEY (student_id) REFERENCES student_profiles (id) ON DELETE CASCADE
);

CREATE INDEX idx_feedback_student_id    ON feedback (student_id);
CREATE INDEX idx_feedback_type          ON feedback (type);
CREATE INDEX idx_feedback_reference_id  ON feedback (reference_id) WHERE reference_id IS NOT NULL;
CREATE INDEX idx_feedback_rating        ON feedback (rating);
```

---

## 14. pgvector Setup

pgvector enables semantic similarity search for skill recommendations, resource matching, and career path suggestions.

```sql
-- Extension already loaded in §1
-- CREATE EXTENSION IF NOT EXISTS "vector";

-- Embedding dimension: 1536 (OpenAI text-embedding-3-small)
-- or 768 (Google text-embedding-004). Choose one and be consistent.

-- Skill embeddings
ALTER TABLE skills
    ADD COLUMN embedding VECTOR(1536);

CREATE INDEX idx_skills_embedding ON skills
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);

-- Career role embeddings (for matching student profile to roles)
ALTER TABLE career_roles
    ADD COLUMN embedding VECTOR(1536);

CREATE INDEX idx_career_roles_embedding ON career_roles
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 50);

-- Student profile embeddings (computed from goals + interests + skills)
ALTER TABLE student_profiles
    ADD COLUMN profile_embedding VECTOR(1536);

CREATE INDEX idx_student_profiles_embedding ON student_profiles
    USING ivfflat (profile_embedding vector_cosine_ops)
    WITH (lists = 100);

-- Resource embeddings (title + description + tags)
ALTER TABLE resources
    ADD COLUMN embedding VECTOR(1536);

CREATE INDEX idx_resources_embedding ON resources
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
```

**Similarity query pattern:**

```sql
-- Top-10 skills most similar to a given skill
SELECT s.id, s.name, 1 - (s.embedding <=> target.embedding) AS cosine_similarity
FROM skills s,
     (SELECT embedding FROM skills WHERE id = $1) AS target
WHERE s.id <> $1
  AND s.status = 'active'
ORDER BY s.embedding <=> target.embedding
LIMIT 10;
```

> [!NOTE]
> Use `HNSW` indexes in production for recall quality:
> ```sql
> CREATE INDEX idx_skills_embedding_hnsw ON skills
>     USING hnsw (embedding vector_cosine_ops)
>     WITH (m = 16, ef_construction = 64);
> ```
> Requires pgvector ≥ 0.5.0.

---

## 15. Row-Level Security (RLS)

### Design Principles

RLS enforces **data isolation at the database layer** — the application cannot accidentally expose one student's data to another, even due to query bugs.

```sql
-- Enable RLS on all student-facing tables
ALTER TABLE student_profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_interests       ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_preferences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_experiences     ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skills          ENABLE ROW LEVEL SECURITY;
ALTER TABLE roadmaps                ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress        ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_evidence          ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessment_attempts     ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations         ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback                ENABLE ROW LEVEL SECURITY;
```

### Application Role Setup

```sql
-- Role used by the API application (least privilege)
CREATE ROLE app_user NOLOGIN;
GRANT CONNECT ON DATABASE studentroadmap TO app_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO app_user;

-- Role used by background workers (market ingestion, AI pipeline)
CREATE ROLE worker_user NOLOGIN;
GRANT CONNECT ON DATABASE studentroadmap TO worker_user;
GRANT USAGE ON SCHEMA public TO worker_user;
GRANT SELECT, INSERT ON market_sources, market_snapshots, market_skill_observations TO worker_user;
GRANT SELECT, UPDATE ON skills, career_roles, career_role_skills TO worker_user;
```

### RLS Policies

The application injects the authenticated student's profile UUID via a session variable.

```sql
-- Set session variable on connection (called by application on login)
-- SET app.current_student_id = '<uuid>';

-- Policy: students can only see their own profile
CREATE POLICY student_profiles_isolation ON student_profiles
    USING (id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own interests
CREATE POLICY student_interests_isolation ON student_interests
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own preferences
CREATE POLICY student_preferences_isolation ON student_preferences
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own experiences
CREATE POLICY student_experiences_isolation ON student_experiences
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own skills
CREATE POLICY student_skills_isolation ON student_skills
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own roadmaps
CREATE POLICY roadmaps_isolation ON roadmaps
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own progress
CREATE POLICY student_progress_isolation ON student_progress
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own skill evidence
CREATE POLICY skill_evidence_isolation ON skill_evidence
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own assessment attempts
CREATE POLICY assessment_attempts_isolation ON assessment_attempts
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own recommendations
CREATE POLICY recommendations_isolation ON recommendations
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Policy: students can only see their own feedback
CREATE POLICY feedback_isolation ON feedback
    USING (student_id = current_setting('app.current_student_id', true)::UUID);

-- Admin bypass: admins and internal workers bypass all RLS
CREATE POLICY admin_bypass ON student_profiles TO app_user
    USING (current_setting('app.role', true) = 'admin');
-- (repeat for all tables or use a role-level BYPASSRLS privilege)
```

> [!IMPORTANT]
> Admins and `worker_user` should be granted `BYPASSRLS` to avoid policy overhead on bulk operations:
> ```sql
> ALTER ROLE worker_user BYPASSRLS;
> ```

---

## 16. Alembic Migration Strategy

### Directory Structure

```
alembic/
├── env.py
├── script.py.mako
└── versions/
    ├── 0001_extensions_and_enums.py
    ├── 0002_core_users.py
    ├── 0003_skills_ontology.py
    ├── 0004_career_ontology.py
    ├── 0005_resources_and_projects.py
    ├── 0006_roadmaps.py
    ništo0007_progress_and_evidence.py
    ├── 0008_assessments.py
    ├── 0009_recommendations_and_market.py
    ├── 0010_system_tables.py
    ├── 0011_pgvector_embeddings.py
    ├── 0012_rls_policies.py
    └── 0013_seed_data.py
```

### Migration Rules

| Rule | Detail |
|---|---|
| **Never auto-generate ENUM changes** | Use `op.execute("ALTER TYPE ... ADD VALUE ...")` manually; ENUMs cannot be rolled back once a value is added. |
| **Always use `--autogenerate` for columns** | Let Alembic detect column additions; review diffs before applying. |
| **One concern per migration** | Never mix schema changes with data migrations in the same file. |
| **Downgrade must be safe** | Every `upgrade()` must have a matching `downgrade()` that cleanly reverses the change. |
| **RLS in a dedicated migration** | Policy DDL goes in `0012_rls_policies.py` after all tables exist. |
| **Seed data last** | `0013_seed_data.py` runs after all schema and RLS migrations. |
| **Zero-downtime deployments** | Use the expand-contract pattern: add nullable columns first, backfill, then add constraints. |

### Example Migration Skeleton

```python
"""0002 core users

Revision ID: abc123
Revises: 0001_extensions_and_enums
Create Date: 2024-01-01 00:00:00
"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision = 'abc123'
down_revision = 'def456'
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True),
                  server_default=sa.text('gen_random_uuid()'), primary_key=True),
        sa.Column('email', sa.Text(), nullable=False),
        # ... other columns
    )
    op.create_index('idx_users_email', 'users', ['email'])


def downgrade() -> None:
    op.drop_index('idx_users_email', table_name='users')
    op.drop_table('users')
```

---

## 17. Seed Data Strategy

### Seeding Order

Dependencies must be respected. Seed tables in this exact order:

```
1.  extensions & enums           (migration 0001)
2.  market_sources               — needed by career_role_skills.source_id
3.  industries
4.  skills
5.  skill_dependencies
6.  career_paths
7.  career_roles
8.  career_role_skills
9.  resources
10. resource_skills
11. projects
12. project_skills
13. assessments
14. assessment_questions
```

> [!NOTE]
> Tables `users`, `student_profiles`, and all `student_*` tables are **not** seeded — they are populated by registration and onboarding flows.

### Seed Data Sources

| Table | Source |
|---|---|
| `industries` | Manual curation (12–15 top Indian tech industries) |
| `skills` | NSDC QP/NOS taxonomy + O\*NET export + manual curation |
| `skill_dependencies` | Expert-curated graph, AI-assisted bootstrap |
| `career_paths` | NSDC sector skill council classifications |
| `career_roles` | Common Indian job titles from NSDC + LinkedIn India |
| `career_role_skills` | Market observations from `market_skill_observations` |
| `resources` | Curated list of free/freemium Coursera, NPTEL, YouTube courses |
| `assessments` | Content editors create; minimum 1 per core skill at each difficulty |

### Seed File Pattern

```sql
-- seeds/01_industries.sql
INSERT INTO industries (id, name, slug, description) VALUES
    (gen_random_uuid(), 'Information Technology', 'information-technology', 'Software, cloud, and IT services'),
    (gen_random_uuid(), 'FinTech',                'fintech',                'Financial technology services'),
    (gen_random_uuid(), 'EdTech',                 'edtech',                 'Education technology platforms'),
    (gen_random_uuid(), 'HealthTech',             'healthtech',             'Digital health and medical technology'),
    (gen_random_uuid(), 'E-Commerce',             'e-commerce',             'Online retail and logistics tech')
ON CONFLICT (slug) DO NOTHING;
```

> [!TIP]
> Wrap all seed files in a transaction. Use `ON CONFLICT DO NOTHING` (or `DO UPDATE`) to make seeds idempotent so they can be re-run safely.

---

## 18. `competency_score` Formula

The `competency_score` computed column in `student_skills` combines three independent signals into a single 0–1 score representing a student's demonstrated competency in a skill.

### Formula

$$
\text{competency\_score} = \frac{0.20 \times \text{self\_rating}}{10} + 0.40 \times \text{assessment\_rating} + 0.40 \times \text{evidence\_rating}
$$

Where each missing component defaults to `0` (via `COALESCE`), preserving the invariant that the score is always in `[0.00, 1.00]`.

### Weight Rationale

| Component | Weight | Rationale |
|---|---|---|
| `self_rating / 10` | 20% | Self-assessment is the least reliable signal — useful for cold-start but easily overstated |
| `assessment_rating` | 40% | Objective, platform-administered test score; high signal quality |
| `evidence_rating` | 40% | Demonstrated output (completed project, certification, course completion); high signal quality |

### PostgreSQL Implementation

```sql
-- GENERATED ALWAYS AS (STORED) — computed at write time, indexed like any column
competency_score DECIMAL(3,2) GENERATED ALWAYS AS (
    ROUND(
        (0.20 * COALESCE(self_rating, 0) / 10.0)
        + COALESCE(0.40 * assessment_rating, 0.0)
        + COALESCE(0.40 * evidence_rating, 0.0)
    , 2)
) STORED
```

### Example Scores

| self_rating | assessment_rating | evidence_rating | competency_score |
|---|---|---|---|
| 8 | NULL | NULL | 0.16 |
| 8 | 0.75 | NULL | 0.46 |
| 8 | 0.75 | 0.90 | 0.82 |
| NULL | 1.00 | 1.00 | 0.80 |
| 0 | 0 | 0 | 0.00 |

---

## 19. Entity Relationship Summary

### Top-Level Relationships

```
users (1) ──────────── (1) student_profiles
                              │
          ┌───────────────────┼──────────────────────┐
          │                   │                      │
    student_interests  student_preferences    student_experiences
    student_skills             │
          │            student_preferences
          │
    skills ◄────── skill_dependencies (self-join)
          │
     ┌────┴────────────────────┐
     │                         │
resource_skills          career_role_skills ──► career_roles ──► career_paths ──► industries
     │                                                 │
  resources                                        assessments
  resource_skills                                  assessment_questions

student_profiles (1) ──── (N) roadmaps ──── (N) roadmap_phases ──── (N) roadmap_items
                                  │
                          roadmap_versions

student_profiles (1) ──── (N) student_progress ──► roadmap_items
student_profiles (1) ──── (N) skill_evidence ──► skills
student_profiles (1) ──── (N) assessment_attempts ──► assessments
student_profiles (1) ──── (N) recommendations
student_profiles (1) ──── (N) feedback

market_sources (1) ──── (N) market_snapshots ──── (N) market_skill_observations ──► skills
                                                                                  ──► career_roles

users (1) ──── (N) audit_logs
```

### Table Count Summary

| Domain | Tables |
|---|---|
| Core Users | 5 (`users`, `student_profiles`, `student_interests`, `student_preferences`, `student_experiences`) |
| Skills Ontology | 3 (`skills`, `skill_dependencies`, `student_skills`) |
| Career Ontology | 4 (`industries`, `career_paths`, `career_roles`, `career_role_skills`) |
| Resources | 2 (`resources`, `resource_skills`) |
| Projects | 2 (`projects`, `project_skills`) |
| Roadmaps | 3 (`roadmaps`, `roadmap_phases`, `roadmap_items`) |
| Progress & Evidence | 2 (`student_progress`, `skill_evidence`) |
| Assessments | 3 (`assessments`, `assessment_questions`, `assessment_attempts`) |
| Recommendations & Market | 4 (`recommendations`, `market_sources`, `market_snapshots`, `market_skill_observations`) |
| System | 3 (`roadmap_versions`, `audit_logs`, `feedback`) |
| **Total** | **31** |

---

*Document maintained by: Platform Engineering*  
*Last updated: 2024 Q4*  
*Next review: Before Beta launch*
