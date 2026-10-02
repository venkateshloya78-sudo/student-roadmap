# StudentRoadmap AI — Product Specification

**Version:** 1.0.0  
**Status:** Draft — Pending Review  
**Last Updated:** 2026-10-02  
**Author:** Product Team  

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Target Users](#2-target-users)
3. [User Stories](#3-user-stories)
4. [MVP Scope](#4-mvp-scope)
5. [Explicit Non-MVP Features](#5-explicit-non-mvp-features)
6. [Core User Journey](#6-core-user-journey)
7. [Functional Requirements](#7-functional-requirements)
8. [Non-Functional Requirements](#8-non-functional-requirements)
9. [Data Requirements](#9-data-requirements)
10. [AI Requirements](#10-ai-requirements)
11. [Security Requirements](#11-security-requirements)
12. [Success Metrics](#12-success-metrics)
13. [Definition of Done](#13-definition-of-done)

---

## 1. Problem Statement

### 1.1 Context

Indian undergraduate students navigating career decisions face a structurally fragmented information landscape. Career guidance is scattered across YouTube tutorials, online course platforms (Coursera, Udemy, NPTEL), LinkedIn influencer posts, job descriptions on Naukri and LinkedIn, college curricula, and peer advice — each source using different terminology, different skill taxonomies, and different assumptions about the learner's baseline.

### 1.2 Core Problem

> **No system converts a student's specific profile and chosen career direction into an evidence-grounded, measurable, prerequisite-ordered skill-building plan that adapts as they progress.**

This single-sentence problem statement captures five distinct failure modes in the current ecosystem:

| Failure Mode | Description |
|---|---|
| **Not profile-specific** | Generic advice ignores the student's year of study, existing skills, branch of education, and available time. |
| **Not evidence-grounded** | Recommendations are based on influencer opinion or ad-driven course promotion, not verified industry requirements. |
| **Not measurable** | Students cannot quantify how "ready" they are for a target role; progress is subjective. |
| **Not prerequisite-ordered** | Resources are recommended without respecting learning dependencies (e.g., recommending system design before data structures). |
| **Not adaptive** | Plans do not update as the student completes tasks, gains experience, or changes direction. |

### 1.3 Downstream Consequences

- Students spend 6–18 months on skills irrelevant to their chosen career path.
- Students underestimate skill gaps until the internship or placement season, when the timeline to correct them has closed.
- Students waste money on courses they cannot apply because prerequisite knowledge is absent.
- First-generation college students are disproportionately harmed: they lack peer networks and mentors to compensate for the absence of structured guidance.

### 1.4 Opportunity

A deterministic, curated, prerequisite-aware skill-gap engine — augmented by AI-generated explanations — can replace the fragmented landscape with a single, trustworthy source of personalized direction. The MVP targets Indian undergraduates because:

- The Indian undergraduate population is large (~40 million enrolled), digitally active, and highly motivated by placement outcomes.
- Career paths relevant to this cohort (software engineering, data science, product management, finance, etc.) are well-documented enough to curate skill requirements manually and verifiably.
- The gap between student preparation and employer expectations is acute and widely acknowledged.

---

## 2. Target Users

### 2.1 Primary Users — Indian Undergraduate Students (Years 1–4)

**Demographic Profile:**
- Age: 17–22 years
- Enrolled in a 3- or 4-year undergraduate programme at an Indian university or autonomous college
- Disciplines: Engineering (B.Tech/B.E.), Commerce (B.Com/BBA), and Science (B.Sc) — covering the majority of STEM and non-STEM students seeking knowledge-economy careers
- Internet access: Mobile-first; most have smartphone access and intermittent laptop access
- Language: English-medium instruction; comfortable reading professional English content

**Behavioural Characteristics:**
- Highly placement-outcome-driven; internship/job offers are the primary measure of success
- Susceptible to peer influence and social proof; likely to adopt a tool if peers at the same college use it
- Low willingness to pay in Year 1–2; higher in Year 3–4 as urgency increases
- Attention fragmented across WhatsApp, Instagram, YouTube, and college LMS

**Sub-segments by Year of Study:**

| Year | Primary Need | Expected Behaviour |
|---|---|---|
| Year 1 | Career orientation; understanding what paths exist | Exploratory; may switch career directions multiple times |
| Year 2 | Skill foundation building; picking a specialisation | Beginning structured learning; first projects |
| Year 3 | Internship readiness; portfolio building | High urgency; willing to spend time on structured plans |
| Year 4 | Placement/full-time job readiness | Highest urgency; completion-focused |

### 2.2 Secondary Users — Recent Graduates (0–1 Year Out)

**Profile:**
- Completed their undergraduate degree within the last 12 months
- Either unemployed, underemployed, or seeking to transition into a new career path
- May have some professional experience (internships, entry-level roles) that should be factored into skill-gap analysis

**Behavioural Characteristics:**
- Higher time availability than current students
- More specific about the role they want (less exploratory)
- More likely to pay for a service that demonstrably closes the gap to a job offer

### 2.3 Admin Users (Internal — Content Management)

- Platform administrators responsible for maintaining the career path catalog, skill taxonomy, resource library, and project recommendations
- Non-technical users who need a dashboard-based interface to add, edit, and retire content without engineering involvement
- Small team (2–5 individuals) during MVP phase

---

## 3. User Stories

### 3.1 Onboarding

**US-01 — Email Registration**
> As a first-time visitor, I want to register with my email address and a password, so that I can create an account and begin building my career roadmap.

**US-02 — Google OAuth Sign-In**
> As a student already using Google services, I want to sign in with my Google account in one click, so that I do not have to remember a separate password.

**US-03 — Multi-Step Profile Wizard**
> As a new registered user, I want to be guided through a structured, multi-step onboarding wizard, so that the platform can gather enough information about me to generate a meaningful and personalised roadmap.

**US-04 — Onboarding Progress Save**
> As a student who starts the onboarding wizard but cannot finish it in one session, I want my progress to be automatically saved at each step, so that I can continue from where I left off when I return.

**US-05 — Skill Self-Assessment**
> As a student during onboarding, I want to declare which skills I already have and rate my confidence level in each, so that the roadmap reflects my actual starting point rather than a generic beginner baseline.

### 3.2 Career Exploration

**US-06 — Career Path Browsing**
> As a student who is unsure about my career direction, I want to browse a curated list of 10–15 career paths with plain-language descriptions, so that I can understand what each path involves before committing to one.

**US-07 — Career Path Detail View**
> As a student considering a specific career path, I want to see the required skills, typical timeline, and example job titles for that path, so that I can make an informed decision about whether to pursue it.

**US-08 — Career Path Selection**
> As a student who has decided on a direction, I want to select a target career path from the catalog, so that the system can compute my skill gap and generate a personalised roadmap for that path.

### 3.3 Skill-Gap Visibility

**US-09 — Skill Gap Summary**
> As a student who has completed onboarding and selected a career path, I want to see a clear summary of which required skills I already have, which I am partially proficient in, and which I am missing entirely, so that I understand the magnitude and nature of the work ahead.

**US-10 — Skill Prerequisite Explanation**
> As a student viewing my skill gap, I want to understand why certain skills must be learned before others, so that I do not waste time attempting advanced topics without the required foundation.

### 3.4 Roadmap Generation and Use

**US-11 — Roadmap Generation**
> As a student who has completed onboarding and selected a career path, I want the system to automatically generate a prerequisite-ordered, milestone-based learning roadmap for me, so that I have a clear, actionable plan without having to design it myself.

**US-12 — Roadmap Explanation**
> As a student viewing my generated roadmap, I want each milestone and recommended resource to include a plain-language explanation of why it was included and how it contributes to my goal, so that I trust the recommendations and remain motivated to follow them.

**US-13 — Resource Details**
> As a student reviewing a learning resource recommendation on my roadmap, I want to see the resource title, type (video/course/article/book), estimated time commitment, and a brief description, so that I can decide whether to use it.

**US-14 — Project Recommendation Context**
> As a student who has completed a set of foundational skills, I want to see recommended project ideas with difficulty levels and a description of what skills they demonstrate, so that I can build portfolio evidence relevant to my target career path.

### 3.5 Progress Tracking

**US-15 — Marking Skills Complete**
> As a student who has finished learning a skill, I want to mark it as complete and record how I demonstrated it (self-study, assessment, project evidence), so that my roadmap updates to reflect my current state and suggests the next appropriate steps.

**US-16 — Competency Score Visibility**
> As a student tracking my progress, I want to see my current competency score for each skill in a three-component breakdown (self-assessment, assessment score, evidence submitted), so that I know exactly what is contributing to my readiness score and what I can do to improve it.

**US-17 — Dashboard Next-Action Focus**
> As a student returning to the platform after some time, I want to see a clear "what to do next" recommendation on my dashboard, so that I do not have to re-read the entire roadmap to determine where to continue.

### 3.6 Adaptive Updates

**US-18 — Roadmap Re-generation After Profile Update**
> As a student who has gained new skills or changed my target career path, I want to update my profile and trigger a roadmap refresh, so that my plan reflects my current state and goals rather than an outdated snapshot.

**US-19 — Progress-Based Roadmap Adaptation**
> As a student who has completed several milestones, I want the roadmap to automatically unlock the next set of milestones appropriate to my current competency level, so that I always have relevant and achievable next steps.

### 3.7 Admin Management

**US-20 — Career Path Creation**
> As a platform administrator, I want to create a new career path with its required skill set, descriptions, and recommended resources through a dashboard interface, so that the new path is immediately available to students without requiring an engineering deployment.

**US-21 — Resource Management**
> As a platform administrator, I want to add, edit, or retire learning resources in the curated library, so that students always see up-to-date, verified resources rather than outdated or broken links.

**US-22 — Content Audit View**
> As a platform administrator, I want to see which resources and career paths are most frequently used and rated by students, so that I can prioritise curation effort on high-impact content.

---

## 4. MVP Scope

The MVP is defined as the minimum set of features that delivers the core value proposition — a personalised, prerequisite-ordered career roadmap — to a student, end-to-end, with sufficient quality to generate meaningful user feedback.

### 4.1 Authentication

- **Email + password registration** with email verification flow.
- **Google OAuth 2.0** sign-in (one-click, no separate password required).
- **Session management** with JWT-based access tokens and refresh token rotation.
- **Password reset** via email link (time-limited, single-use token).
- **Account deletion** self-service flow (GDPR/DPDP compliance).

### 4.2 Multi-Step Onboarding Wizard (8 Steps)

The onboarding wizard collects the minimum data required to generate a meaningful skill gap analysis. Each step is saved on completion so progress persists across sessions.

| Step | Name | Data Collected |
|---|---|---|
| 1 | Welcome & Orientation | Consent, language confirmation |
| 2 | Academic Background | Degree, branch/stream, institution tier, current year |
| 3 | Career Direction | Primary target career path selection from catalog |
| 4 | Current Skills — Technical | Self-declared technical skills with confidence ratings (1–5) |
| 5 | Current Skills — Non-Technical | Communication, analytical thinking, domain knowledge self-ratings |
| 6 | Learning Context | Hours per week available for skill-building; preferred learning formats |
| 7 | Timeline & Urgency | Target date (internship/placement/self-improvement); nearest placement cycle |
| 8 | Profile Review & Confirm | Summary of all collected data; editable before submission |

### 4.3 Career Path Catalog (10–15 Paths)

A curated set of career paths covering the most common destinations for Indian undergraduate students. Each path includes:

- Plain-language title and description
- Required skill taxonomy (skills with required proficiency levels)
- Prerequisite ordering of skills
- Example job titles and representative companies
- Typical preparation timeline by student year

**Initial career paths (indicative, subject to curation review):**

1. Software Development Engineer (SDE) — Product Companies
2. Data Analyst
3. Data Scientist / ML Engineer
4. DevOps / Site Reliability Engineer
5. Product Manager (Tech)
6. Business Analyst
7. Investment Banking Analyst
8. Quantitative Analyst / Quant Finance
9. UI/UX Designer
10. Cybersecurity Analyst
11. Cloud Solutions Architect
12. Digital Marketing Analyst
13. Financial Analyst (Corporate Finance / FP&A)
14. Consultant (Strategy / Management Consulting)
15. Full-Stack Web Developer (Startup / Agency)

### 4.4 Deterministic Skill-Gap Analysis Engine

- Compares the student's declared skill set (collected during onboarding) against the required skill set for the selected career path.
- Produces a structured gap report: **Present** / **Partial** / **Missing** for each required skill.
- No AI/ML inference in the gap calculation; output is fully deterministic given the same inputs.
- Prerequisite graph is applied to gap output to produce a topologically sorted skill acquisition order.
- Competency scores for already-known skills are initialised from self-assessment inputs.

### 4.5 Prerequisite-Ordered Roadmap Generation (Deterministic)

- Roadmap is a directed sequence of milestones, each containing:
  - One or more skills to acquire
  - Curated learning resources for each skill (from the verified library)
  - A recommended project (from the curated project list) to evidence the skill cluster
- Milestone ordering is derived from the prerequisite graph; no milestone unlocks until all prerequisite milestones are complete or waived.
- Generation is deterministic: given the same student profile and career path, the same roadmap is always produced.
- Roadmap is re-generated on profile updates or career path changes.

### 4.6 Curated Learning Resource Library (50+ Verified Resources)

- Minimum 50 manually verified learning resources at MVP launch.
- Each resource is tagged with: skill(s) covered, career path(s) applicable, resource type (video series / course / article / book / documentation), platform, estimated time commitment, cost (free/paid), difficulty level.
- Resources are verified by an admin for accuracy, accessibility, and relevance before being made live.
- Dead-link checking is an admin workflow, not an automated system (MVP constraint).

### 4.7 Project Recommendations (30+ Curated)

- Minimum 30 curated project descriptions at MVP launch.
- Each project is tagged with: required skill prerequisites, career paths served, estimated build time, difficulty level, and a description of what skills it demonstrates to a recruiter.
- Projects are linked to milestones in the roadmap automatically based on skill tags.
- Projects are described; the platform does not host or evaluate project code (MVP constraint).

### 4.8 Progress Tracking — Three-Component Competency Model

Each skill on the roadmap has a competency score computed from three components:

| Component | Weight | How it is measured |
|---|---|---|
| Self-Assessment | 20% | Student's self-rated confidence (1–5 scale) at onboarding or on update |
| Assessment Score | 40% | Score from an in-platform quiz or linked external assessment result (manually entered) |
| Evidence Submission | 40% | Student submits a link (GitHub, portfolio, article, certificate URL) as evidence of skill |

- The combined competency score (0–100) is displayed per skill and aggregated to a per-milestone and overall career-readiness score.
- A skill is considered "milestone-complete" when its competency score crosses a defined threshold (configurable per career path; default: 70).

### 4.9 Recommendation Explainability

- Every milestone, resource, and project recommendation includes an AI-generated plain-language explanation of why it was recommended for this specific student.
- Explanations are generated at roadmap creation time using a versioned prompt template and stored; they are not re-generated on every page load.
- Explanations reference the student's profile attributes (e.g., "Because you are in Year 2 of a B.Tech in Computer Science and have rated yourself 3/5 in Python, we recommend starting with…") and the career path requirements.

### 4.10 Student Dashboard

- **Next Action Card:** The single highest-priority action the student should take today (derived from roadmap state).
- **Roadmap Progress Bar:** Overall percentage completion of the roadmap.
- **Current Milestone Panel:** Skills in the active milestone, their competency scores, linked resources, and projects.
- **Career-Readiness Score:** Aggregate score (0–100) reflecting overall progress toward the target career path.
- **Recent Activity Feed:** Chronological log of the student's actions (skills marked, assessments taken, evidence submitted).

### 4.11 Admin Dashboard (Content Management)

- Create, read, update, and soft-delete career paths, skills, resources, and projects.
- View usage statistics: which career paths are most selected, which resources are most accessed, which projects are most submitted.
- Manage user accounts: view registration date, roadmap status, and manually flag accounts if needed.
- Role-based access: Admin-only; no student-facing routes accessible from this dashboard.

---

## 5. Explicit Non-MVP Features

The following features are explicitly **excluded** from the MVP. They are not deferred due to lack of importance but because they add complexity that would jeopardise the MVP timeline or require capabilities (data, infrastructure, regulatory compliance) not yet available.

| # | Feature | Reason for Exclusion |
|---|---|---|
| 1 | **Full labour-market demand prediction** | Requires live job posting data ingestion, trend modelling, and labour-market econometrics. Not feasible for MVP. |
| 2 | **Salary forecasting by role and geography** | Requires verified, longitudinal compensation data across Indian markets. Not available for MVP. |
| 3 | **Psychometric diagnosis (MBTI, Big Five, Holland Codes)** | Psychometric testing requires validated instruments and ethical oversight. Risk of misleading outputs without clinical calibration. |
| 4 | **Automatic LinkedIn profile modification** | Requires OAuth integration with LinkedIn write APIs and significant trust-and-safety review. |
| 5 | **Automatic job application submission** | Requires deep integrations with multiple ATS platforms and raises significant legal and reputational risk. |
| 6 | **Hundreds of career paths (>15 at launch)** | Content quality degrades with volume. MVP prioritises depth of curation over breadth of coverage. |
| 7 | **Complex knowledge graph / semantic skill ontology** | Knowledge graph tooling (Neo4j, RDF, etc.) adds significant infrastructure and maintenance complexity. MVP uses a flat, curated prerequisite list. |
| 8 | **Autonomous multi-agent AI architecture** | Multi-agent orchestration (LangGraph, AutoGen, etc.) adds unpredictable latency, cost, and debugging complexity. MVP uses single-pass AI calls for explanations only. |
| 9 | **Native mobile applications (iOS / Android)** | Native apps require separate development tracks and app store review cycles. MVP is a responsive web application only. |
| 10 | **Social networking features (peer connections, forums)** | Adds content moderation complexity and trust-and-safety requirements. Out of scope for MVP. |
| 11 | **Recruiter marketplace / job board** | Requires recruiter onboarding, legal agreements, and a separate product surface. Not an MVP priority. |
| 12 | **University / institution management portal** | Multi-tenant institutional accounts require custom pricing, SLA management, and data segregation. Post-MVP. |
| 13 | **AI interview avatar / mock interview** | Requires real-time audio/video processing and complex feedback generation. Significant infrastructure cost. |
| 14 | **Resume auto-submission to employers** | Legal, consent, and data security concerns. Excluded entirely until legal review is complete. |
| 15 | **Real-time job posting scraping** | Web scraping at scale is legally ambiguous and technically fragile. Post-MVP, replace with curated job description analysis. |
| 16 | **Proprietary recommendation model (trained ML)** | Insufficient training data at MVP stage. Deterministic curation is more trustworthy at this scale. |
| 17 | **XP points / badges / gamification systems** | Risk of optimising for engagement metrics over genuine skill development. Revisit after core loop is validated. |
| 18 | **GitHub portfolio auto-integration** | Requires GitHub OAuth, repository analysis, and automated project evaluation. Post-MVP. |
| 19 | **Automated resume parsing and analysis** | NLP resume parsing adds an AI subsystem with significant error rates. Out of scope for MVP. |
| 20 | **Standardised psychometric / aptitude tests** | Requires validated test instruments, proctoring infrastructure, and expert review of results. Post-MVP. |
| 21 | **Peer mentorship matching** | Requires mentor vetting, scheduling, and trust-and-safety infrastructure. Post-MVP. |
| 22 | **Certification issuing / blockchain credentials** | Requires partnerships with certifying bodies and legal review. Post-MVP. |
| 23 | **WhatsApp / Telegram notification bots** | Bot registration, message template approval, and carrier compliance. Deferred to post-MVP growth phase. |

---

## 6. Core User Journey

The following journey describes the end-to-end experience of a new student from first visit through active roadmap use.

```
FIRST VISIT
    │
    ▼
[Landing Page]
    • Value proposition: "Get a personalised, step-by-step plan for your target career."
    • CTAs: "Get Started Free" / "Sign In"
    │
    ▼
[Registration]
    • Option A: Email + password → email verification link → verified
    • Option B: Google OAuth → one-click → account created
    │
    ▼
[ONBOARDING WIZARD — 8 Steps]
    │
    ├── Step 1: Welcome & Consent
    │       • Confirm language; accept Terms of Service and Privacy Policy
    │
    ├── Step 2: Academic Background
    │       • Degree type, branch/stream, institution tier, current year of study
    │
    ├── Step 3: Career Direction
    │       • Browse career path catalog; select primary target career path
    │       • Optional: view career path details before selecting
    │
    ├── Step 4: Technical Skills Self-Assessment
    │       • For each skill in the selected career path's taxonomy:
    │         rate current confidence (0 = Never heard of it → 5 = Can teach it)
    │
    ├── Step 5: Non-Technical Skills Self-Assessment
    │       • Communication, analytical thinking, domain knowledge ratings
    │
    ├── Step 6: Learning Context
    │       • Hours per week available; preferred formats (video / reading / hands-on)
    │
    ├── Step 7: Timeline & Urgency
    │       • Target date (internship season / placement / personal goal)
    │
    └── Step 8: Profile Review & Confirm
            • Summary of all inputs; student can edit any step before submitting
            • On submit → triggers skill-gap analysis and roadmap generation
    │
    ▼
[SKILL-GAP VIEW]
    • Visual breakdown: skills Present / Partial / Missing
    • Prerequisite dependency diagram (simplified visual)
    • Total skills required: X | Already have: Y | Gap: Z
    │
    ▼
[ROADMAP GENERATION]
    • System generates prerequisite-ordered milestone sequence
    • AI generates plain-language explanation for each milestone
    • Student sees full roadmap with milestones, resources, and projects
    │
    ▼
[STUDENT DASHBOARD]
    • Next Action Card (first milestone, first resource)
    • Career-Readiness Score (initialised from self-assessment)
    • Roadmap progress bar (0% at start)
    │
    ▼
[WEEKLY ACTIONS — ACTIVE USE LOOP]
    │
    ├── Student works through recommended resources (external, self-paced)
    │
    ├── Student completes in-platform skill assessment (or enters external score)
    │
    ├── Student submits evidence link (GitHub, certificate, article, etc.)
    │
    └── Student marks skill as complete → competency score updates
    │
    ▼
[MILESTONE COMPLETION]
    • All skills in a milestone reach threshold competency score (default: 70/100)
    • Milestone marked complete; next milestone unlocked
    • AI generates a completion acknowledgement note with next milestone preview
    │
    ▼
[PROGRESS UPDATE & ROADMAP ADAPTATION]
    • Student can update profile (new skills, changed timeline)
    • Roadmap re-generates with updated inputs
    • Historical competency scores are preserved; previously completed milestones
      are not reset unless the student explicitly requests a full reset
    │
    ▼
[CAREER-READINESS SCORE REACHES TARGET THRESHOLD]
    • Student is prompted to apply for internships/jobs with confidence
    • Platform offers curated list of job descriptions aligned to career path
      (static, curated — not live-scraped)
```

---

## 7. Functional Requirements

### 7.1 Authentication (FR-AUTH)

**FR-AUTH-01:** The system shall allow a new user to register using a unique email address and a password that meets minimum complexity requirements (minimum 8 characters, at least one uppercase letter, one number, one special character).

**FR-AUTH-02:** Upon email registration, the system shall send a verification email containing a time-limited (24-hour), single-use verification link before granting access to the onboarding wizard.

**FR-AUTH-03:** The system shall allow a user to authenticate using Google OAuth 2.0 with the "Sign in with Google" button. A Google-authenticated user shall not be required to set a separate password.

**FR-AUTH-04:** The system shall issue a JWT access token (15-minute TTL) and a refresh token (7-day TTL, HTTP-only cookie) upon successful authentication.

**FR-AUTH-05:** The system shall invalidate all active sessions for a user upon password reset or explicit sign-out from all devices.

**FR-AUTH-06:** The system shall provide a password reset flow: user requests reset → system sends time-limited (1-hour), single-use reset link to registered email → user sets new password → all existing sessions invalidated.

**FR-AUTH-07:** The system shall lock an account for 15 minutes after 5 consecutive failed login attempts from the same IP address.

**FR-AUTH-08:** The system shall allow an authenticated user to delete their account. Account deletion shall remove all personally identifiable information within 30 days, retaining only anonymised aggregate data.

### 7.2 Profile & Onboarding (FR-PROF)

**FR-PROF-01:** The system shall present new authenticated users with an 8-step onboarding wizard before providing access to the student dashboard.

**FR-PROF-02:** The system shall save the student's onboarding progress at the completion of each step, such that a student who abandons the wizard can resume from the last completed step in a subsequent session.

**FR-PROF-03:** Step 2 of the onboarding wizard shall collect: degree type (B.Tech / B.E. / B.Sc / B.Com / BBA / Other), branch or stream (freetext with autocomplete suggestions), institution tier (Tier 1 / Tier 2 / Tier 3 / Other, self-reported), and current year of study (Year 1 / Year 2 / Year 3 / Year 4 / Graduate).

**FR-PROF-04:** Step 4 of the onboarding wizard shall present the student with the full skill taxonomy for their selected career path and collect a confidence rating (0–5 integer scale) for each skill. Skills not rated shall default to 0.

**FR-PROF-05:** Step 6 of the onboarding wizard shall collect the student's self-reported weekly hours available for skill-building (1–5 / 6–10 / 11–20 / 20+) and preferred learning formats (video / reading / hands-on / mixed).

**FR-PROF-06:** Step 8 of the onboarding wizard shall display a read-only summary of all data collected in steps 1–7. The student shall be able to navigate back to any step to edit their responses before final submission.

**FR-PROF-07:** The system shall allow an authenticated student who has completed onboarding to update any field of their profile from a profile settings page. Updates to fields that affect skill-gap analysis shall trigger a prompt offering to re-generate the roadmap.

**FR-PROF-08:** The system shall allow a student to change their target career path after onboarding. Changing the career path shall trigger a full roadmap re-generation and shall not retain any milestone completion state from the previous roadmap.

### 7.3 Career Path Catalog (FR-CAR)

**FR-CAR-01:** The system shall maintain a catalog of between 10 and 15 career paths at MVP launch, each with a unique identifier, title, plain-language description (200–400 words), and list of required skills with required proficiency levels.

**FR-CAR-02:** The system shall present the career path catalog as a browsable list with filtering by broad domain (Technology / Finance / Design / Business).

**FR-CAR-03:** Each career path detail page shall display: title, description, required skill list with proficiency levels, prerequisite graph (visual or ordered list), example job titles (minimum 3), representative companies hiring for this path (minimum 5), and typical preparation timeline by student year.

**FR-CAR-04:** A career path shall only be visible to students if it has been marked as "published" by an admin. Unpublished career paths shall be visible only in the admin dashboard.

**FR-CAR-05:** The system shall prevent a student from selecting a career path that has been "archived" (retired) by an admin. Existing students who had selected an archived path shall see a notification prompting them to select a replacement.

### 7.4 Skill-Gap Analysis Engine (FR-SGA)

**FR-SGA-01:** Upon completion of the onboarding wizard, the system shall deterministically compute a skill gap report by comparing the student's declared competency ratings against the required proficiency levels for each skill in the selected career path.

**FR-SGA-02:** The skill gap report shall classify each required skill into one of three states: **Present** (student's self-rating meets or exceeds required level), **Partial** (student's self-rating is 1–2 points below required level), or **Missing** (student has not declared this skill or rated it 0).

**FR-SGA-03:** The skill gap report shall apply the career path's prerequisite graph to produce a topologically sorted skill acquisition sequence, such that no skill appears before a skill it depends upon.

**FR-SGA-04:** The skill gap engine shall be a pure function: the same student profile and career path shall always produce the same skill gap report. No stochastic elements shall be introduced.

**FR-SGA-05:** The system shall display the skill gap report as a structured visual summary showing counts and lists of Present / Partial / Missing skills before presenting the generated roadmap.

**FR-SGA-06:** The system shall recalculate the skill gap report whenever a student's profile or career path selection changes.

### 7.5 Roadmap Generation (FR-RG)

**FR-RG-01:** The system shall generate a prerequisite-ordered roadmap for a student immediately after the skill gap analysis completes (triggered by onboarding completion or profile update).

**FR-RG-02:** The roadmap shall be composed of a sequence of milestones. Each milestone shall contain: a title, a set of target skills, a list of curated learning resources (minimum 1, maximum 5 per milestone), and a list of recommended projects (minimum 0, maximum 2 per milestone).

**FR-RG-03:** The roadmap shall include only milestones for skills classified as "Partial" or "Missing" in the skill gap report. Skills classified as "Present" shall be shown as already-complete milestones for context but shall not be assigned learning resources.

**FR-RG-04:** The ordering of milestones shall strictly respect the prerequisite graph: a milestone shall not appear before any milestone containing a prerequisite skill.

**FR-RG-05:** The roadmap generation algorithm shall be deterministic: the same student profile and career path shall always produce the same milestone sequence and resource assignments. Random tie-breaking is not permitted.

**FR-RG-06:** The system shall generate and store AI-generated plain-language explanations for each milestone at the time of roadmap generation. These explanations shall be stored and served statically; they shall not be re-generated on each page load.

**FR-RG-07:** The system shall display an estimated time-to-completion for each milestone, derived from the sum of estimated time commitments for all resources in the milestone.

**FR-RG-08:** The system shall mark a milestone as "locked" until all prerequisite milestones are marked complete. Locked milestones shall be visible but not interactable.

**FR-RG-09:** When a student completes a milestone (all skills meet the competency threshold), the system shall automatically unlock the next milestone(s) in the roadmap and display a confirmation notification.

### 7.6 Learning Resources (FR-RES)

**FR-RES-01:** The resource library shall contain a minimum of 50 manually verified learning resources at MVP launch.

**FR-RES-02:** Each resource record shall include: title, URL, resource type (Video Series / Online Course / Article / Book / Official Documentation / Tutorial), platform/source, estimated time commitment (in hours), cost (Free / Paid), difficulty level (Beginner / Intermediate / Advanced), and a list of skill tags.

**FR-RES-03:** Resources shall only appear in student roadmaps if they are marked as "active" by an admin. "Inactive" resources shall be hidden from students without affecting existing roadmaps until the next roadmap re-generation.

**FR-RES-04:** The system shall prevent the same resource from being recommended in more than one milestone within the same roadmap.

**FR-RES-05:** Each resource displayed to a student shall include a clear external link that opens in a new browser tab. The platform shall not proxy or embed external resource content.

### 7.7 Projects (FR-PROJ)

**FR-PROJ-01:** The project library shall contain a minimum of 30 curated project descriptions at MVP launch.

**FR-PROJ-02:** Each project record shall include: title, description (what the student builds and what problem it solves), required skill prerequisites (list of skill tags), career paths served, estimated build time (in hours), difficulty level, and a description of the skills and qualities it demonstrates to a recruiter.

**FR-PROJ-03:** Projects shall be automatically assigned to roadmap milestones based on skill tag matching: a project is eligible for a milestone if all its prerequisite skills are covered by the current or prior milestones.

**FR-PROJ-04:** A student shall be able to submit a project evidence link (URL string, maximum 500 characters) for each project recommended in their roadmap. Submission of a project evidence link shall contribute to the Evidence component of the competency score for the milestone's skills.

**FR-PROJ-05:** The system shall not evaluate, grade, or parse the content of submitted project evidence links at MVP. The act of submission is treated as binary evidence (submitted / not submitted).

### 7.8 Progress Tracking (FR-PT)

**FR-PT-01:** The system shall compute a competency score (0–100 integer) for each skill on the student's roadmap using the three-component model: Self-Assessment (20%) + Assessment Score (40%) + Evidence Score (40%).

**FR-PT-02:** The Self-Assessment component shall be computed as: `(self_rating / 5) × 100 × 0.20`. Self-rating is the student's confidence rating (0–5 integer).

**FR-PT-03:** The Assessment Score component shall be computed as: `(assessment_score / 100) × 100 × 0.40`. Assessment score is a 0–100 value entered by the student from an in-platform quiz or a self-reported external assessment result.

**FR-PT-04:** The Evidence Score component shall be computed as: `(evidence_submitted ? 100 : 0) × 0.40`. Evidence is binary at MVP: submitted (1) or not submitted (0).

**FR-PT-05:** A skill shall be classified as "Milestone-Complete" when its competency score reaches or exceeds the completion threshold. The default threshold is 70; this value shall be configurable per career path by an admin.

**FR-PT-06:** A milestone shall be classified as complete when all skills within it are Milestone-Complete.

**FR-PT-07:** The system shall compute and display an aggregate Career-Readiness Score (0–100) as the weighted average of competency scores across all required skills in the roadmap, weighted equally.

**FR-PT-08:** The system shall maintain an immutable log of all progress events (skill rating updates, assessment score entries, evidence submissions, milestone completions) with timestamps, so that a student can view a history of their progress.

**FR-PT-09:** The system shall allow a student to update their self-assessment rating for any skill at any time. Updating a self-assessment rating shall immediately recalculate the competency score for that skill.

### 7.9 AI Explanation Layer (FR-AI)

**FR-AI-01:** The system shall use a language model (via API) to generate plain-language explanations for each roadmap milestone at the time of roadmap generation.

**FR-AI-02:** The explanation for each milestone shall reference at least two attributes from the student's profile (e.g., year of study, declared skills, timeline) to demonstrate personalisation.

**FR-AI-03:** AI-generated explanations shall be stored in the database at generation time and served from storage on subsequent page loads. The AI API shall not be called on each page load.

**FR-AI-04:** All AI calls shall use a versioned prompt template. The prompt version identifier shall be stored alongside the generated explanation text so that explanations can be identified as generated by a specific prompt version.

**FR-AI-05:** The system shall implement a guardrail: if the AI API call fails (timeout, error response, or content policy rejection), the system shall fall back to a deterministic template-based explanation generated from structured data, and shall log the failure with the prompt version and error details.

**FR-AI-06:** AI-generated content shall not be used in the skill-gap calculation or roadmap ordering logic. These processes are fully deterministic.

**FR-AI-07:** The system shall not expose raw AI API responses or internal prompt text to students.

### 7.10 Student Dashboard (FR-DASH)

**FR-DASH-01:** The student dashboard shall be the default landing page for an authenticated student who has completed onboarding.

**FR-DASH-02:** The dashboard shall display a "Next Action" card showing the single highest-priority action for the student: the next incomplete resource in the current milestone, or the next milestone to begin if all resources are consumed.

**FR-DASH-03:** The dashboard shall display the student's current Career-Readiness Score as a prominent numeric value (0–100) with a visual progress indicator.

**FR-DASH-04:** The dashboard shall display the student's current active milestone with the list of skills, their individual competency scores, and status indicators (Not Started / In Progress / Complete).

**FR-DASH-05:** The dashboard shall display a roadmap-level progress bar showing the percentage of milestones completed out of total milestones.

**FR-DASH-06:** The dashboard shall display a recent activity feed showing the last 10 progress events (skill updates, evidence submissions, milestone completions) in reverse chronological order.

**FR-DASH-07:** The dashboard shall load all widgets within 3 seconds on a standard broadband connection (defined as ≥10 Mbps). Dashboard data shall be served from a cache where possible, with a cache TTL of 5 minutes.

### 7.11 Admin Dashboard (FR-ADMIN)

**FR-ADMIN-01:** The admin dashboard shall be accessible only to users with the "admin" role. Any attempt by a non-admin user to access an admin route shall result in an HTTP 403 response.

**FR-ADMIN-02:** The admin dashboard shall provide CRUD operations (Create, Read, Update, soft-Delete) for: Career Paths, Skills, Learning Resources, and Projects.

**FR-ADMIN-03:** Soft-deletion shall set a `deleted_at` timestamp on the record without removing it from the database. Soft-deleted records shall be invisible to students but auditable by admins.

**FR-ADMIN-04:** The admin dashboard shall display a content overview table for each entity type showing: record count, published/unpublished/archived counts, and last-modified timestamp.

**FR-ADMIN-05:** The admin dashboard shall display a usage analytics summary: top 5 most-selected career paths, top 10 most-accessed resources, total registered students, and total roadmaps generated (counts only; no personally identifiable information).

**FR-ADMIN-06:** The admin dashboard shall provide a student account search by email address, displaying: registration date, onboarding completion status, selected career path, and current career-readiness score. No roadmap content or progress details shall be exposed without explicit data access justification (access to this view shall be logged).

---

## 8. Non-Functional Requirements

### 8.1 Performance

**NFR-PERF-01:** The student dashboard shall achieve a Time to First Contentful Paint (FCP) of less than 2 seconds on a 10 Mbps connection as measured by Lighthouse in a CI pipeline.

**NFR-PERF-02:** The roadmap generation pipeline (skill-gap analysis + roadmap assembly + AI explanation generation) shall complete within 10 seconds for 95% of requests. If the AI explanation step exceeds 8 seconds, the system shall return the deterministic roadmap immediately and populate explanations asynchronously within 60 seconds.

**NFR-PERF-03:** API endpoints shall respond within 500ms for 95th percentile requests (P95) under a load of 100 concurrent users, as measured in load tests run in a staging environment before each production deployment.

**NFR-PERF-04:** Database queries used in the critical path (dashboard load, roadmap display) shall be covered by appropriate indexes. Query execution plans shall be reviewed before any new query is deployed to production.

### 8.2 Reliability

**NFR-REL-01:** The platform shall maintain a monthly uptime of ≥99.5% (excluding scheduled maintenance windows, which shall be announced at least 48 hours in advance and shall not exceed 2 hours per month).

**NFR-REL-02:** The platform shall implement health check endpoints (`/health` and `/ready`) that monitoring infrastructure can poll every 60 seconds.

**NFR-REL-03:** The platform shall implement automated daily database backups with a retention period of 30 days. Backup restoration shall be tested at minimum once per quarter.

**NFR-REL-04:** The AI explanation generation step shall degrade gracefully: if the AI API is unavailable, roadmap generation shall complete using the deterministic fallback explanation, and an alert shall be sent to the on-call engineer.

### 8.3 Security

See Section 11 for detailed security requirements.

### 8.4 Data Integrity

**NFR-DI-01:** All competency score calculations shall be performed server-side. Client-submitted values shall be validated against defined ranges before being accepted. Out-of-range values shall be rejected with an HTTP 422 response.

**NFR-DI-02:** Roadmap milestone ordering shall be validated against the prerequisite graph on every roadmap generation. A generation that produces a topologically invalid ordering shall fail with an error rather than returning a malformed roadmap.

**NFR-DI-03:** All database writes to the progress event log shall be append-only. No update or delete operation shall be permitted on the event log table.

**NFR-DI-04:** Foreign key constraints and NOT NULL constraints shall be enforced at the database level for all entities in the data model.

### 8.5 Observability

**NFR-OBS-01:** The application shall emit structured JSON logs for every API request, including: timestamp, request ID (UUID), HTTP method, path, response status, response time (ms), and authenticated user ID (hashed).

**NFR-OBS-02:** The application shall emit application-level metrics to a monitoring system: request count, error rate, P50/P95/P99 response times, roadmap generation count, AI API call count, and AI API failure count.

**NFR-OBS-03:** Error events (unhandled exceptions, AI API failures, database connection failures) shall trigger an alert to the on-call channel within 2 minutes of occurrence.

**NFR-OBS-04:** Distributed trace IDs shall be propagated through all service calls (API → database → AI API) so that a complete request trace can be reconstructed from logs.

### 8.6 Scalability

**NFR-SCALE-01:** The platform shall be designed to support horizontal scaling of the API tier. No application-level state shall be stored in-process; all session state shall be stored in the database or a shared cache.

**NFR-SCALE-02:** The platform shall support a minimum of 500 concurrent authenticated users at MVP without degradation in P95 response time beyond the thresholds in NFR-PERF-03.

**NFR-SCALE-03:** The database schema shall be designed to avoid table-level locks on write-heavy tables (progress events, roadmap state) by using row-level locking and partitioning strategies where appropriate.

### 8.7 Accessibility

**NFR-ACC-01:** All student-facing pages shall conform to WCAG 2.1 Level AA accessibility guidelines.

**NFR-ACC-02:** All interactive elements (buttons, form inputs, links) shall have accessible labels readable by screen readers.

**NFR-ACC-03:** The platform shall not rely on colour alone to convey status information (e.g., skill gap status indicators shall use both colour and a text label or icon).

**NFR-ACC-04:** The onboarding wizard shall be fully navigable by keyboard alone, without requiring mouse interaction.

---

## 9. Data Requirements

### 9.1 Entity: User

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | System-generated |
| `email` | VARCHAR(320) | UNIQUE, NOT NULL | RFC 5321 compliant |
| `email_verified` | BOOLEAN | NOT NULL, DEFAULT FALSE | |
| `password_hash` | TEXT | NULL | NULL for OAuth-only users |
| `google_oauth_id` | VARCHAR(255) | UNIQUE, NULL | NULL for email-only users |
| `role` | ENUM('student', 'admin') | NOT NULL, DEFAULT 'student' | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |
| `last_login_at` | TIMESTAMP WITH TIME ZONE | NULL | |
| `deleted_at` | TIMESTAMP WITH TIME ZONE | NULL | Soft-delete; NULL = active |

### 9.2 Entity: StudentProfile

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | FK → User, UNIQUE, NOT NULL | One profile per user |
| `degree_type` | ENUM | NOT NULL | B.Tech / B.E. / B.Sc / B.Com / BBA / Other |
| `branch` | VARCHAR(255) | NOT NULL | Student's field of study |
| `institution_tier` | ENUM | NOT NULL | Tier 1 / Tier 2 / Tier 3 / Other |
| `year_of_study` | ENUM | NOT NULL | Year 1–4 / Graduate |
| `weekly_hours` | ENUM | NOT NULL | 1–5 / 6–10 / 11–20 / 20+ |
| `preferred_formats` | TEXT[] | NOT NULL | Array of format preferences |
| `target_date` | DATE | NULL | Student's target placement/internship date |
| `onboarding_step` | INTEGER | NOT NULL, DEFAULT 0 | Last completed step (0–8) |
| `onboarding_completed_at` | TIMESTAMP WITH TIME ZONE | NULL | NULL until wizard complete |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 9.3 Entity: CareerPath

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `slug` | VARCHAR(100) | UNIQUE, NOT NULL | URL-safe identifier |
| `title` | VARCHAR(255) | NOT NULL | |
| `description` | TEXT | NOT NULL | 200–400 words |
| `domain` | ENUM | NOT NULL | Technology / Finance / Design / Business |
| `status` | ENUM | NOT NULL, DEFAULT 'draft' | draft / published / archived |
| `completion_threshold` | INTEGER | NOT NULL, DEFAULT 70 | Competency score threshold for skill completion |
| `example_job_titles` | TEXT[] | NOT NULL | |
| `representative_companies` | TEXT[] | NOT NULL | |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 9.4 Entity: Skill

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `name` | VARCHAR(255) | NOT NULL | |
| `description` | TEXT | NOT NULL | |
| `category` | ENUM | NOT NULL | Technical / Non-Technical |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 9.5 Entity: CareerPathSkill (Join Table)

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `career_path_id` | UUID | FK → CareerPath, NOT NULL | |
| `skill_id` | UUID | FK → Skill, NOT NULL | |
| `required_proficiency` | INTEGER | NOT NULL, CHECK 1–5 | |
| `display_order` | INTEGER | NOT NULL | Topological ordering within path |
| PK | — | (career_path_id, skill_id) | Composite PK |

### 9.6 Entity: SkillPrerequisite

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `career_path_id` | UUID | FK → CareerPath, NOT NULL | Prerequisite is scoped to a path |
| `skill_id` | UUID | FK → Skill, NOT NULL | The skill that has a prerequisite |
| `prerequisite_skill_id` | UUID | FK → Skill, NOT NULL | The prerequisite skill |
| PK | — | (career_path_id, skill_id, prerequisite_skill_id) | |

### 9.7 Entity: LearningResource

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `title` | VARCHAR(500) | NOT NULL | |
| `url` | TEXT | NOT NULL | |
| `resource_type` | ENUM | NOT NULL | Video Series / Online Course / Article / Book / Documentation / Tutorial |
| `platform` | VARCHAR(255) | NOT NULL | e.g., Coursera, YouTube, MIT OCW |
| `estimated_hours` | DECIMAL(5,1) | NOT NULL | |
| `is_free` | BOOLEAN | NOT NULL | |
| `difficulty` | ENUM | NOT NULL | Beginner / Intermediate / Advanced |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | active / inactive |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 9.8 Entity: ResourceSkillTag (Join Table)

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `resource_id` | UUID | FK → LearningResource, NOT NULL | |
| `skill_id` | UUID | FK → Skill, NOT NULL | |
| PK | — | (resource_id, skill_id) | |

### 9.9 Entity: Project

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `title` | VARCHAR(500) | NOT NULL | |
| `description` | TEXT | NOT NULL | What the student builds |
| `recruiter_value` | TEXT | NOT NULL | What skills/qualities it demonstrates |
| `estimated_hours` | DECIMAL(5,1) | NOT NULL | |
| `difficulty` | ENUM | NOT NULL | Beginner / Intermediate / Advanced |
| `status` | ENUM | NOT NULL, DEFAULT 'active' | active / inactive |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 9.10 Entity: Roadmap

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | FK → User, NOT NULL | |
| `career_path_id` | UUID | FK → CareerPath, NOT NULL | |
| `version` | INTEGER | NOT NULL, DEFAULT 1 | Increments on re-generation |
| `generated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |
| `is_active` | BOOLEAN | NOT NULL, DEFAULT TRUE | Only one active roadmap per user |
| `prompt_version` | VARCHAR(50) | NOT NULL | Version of AI prompt used |

### 9.11 Entity: RoadmapMilestone

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `roadmap_id` | UUID | FK → Roadmap, NOT NULL | |
| `title` | VARCHAR(500) | NOT NULL | |
| `display_order` | INTEGER | NOT NULL | 1-indexed; lower = earlier |
| `status` | ENUM | NOT NULL, DEFAULT 'locked' | locked / active / complete |
| `ai_explanation` | TEXT | NULL | NULL until generated |
| `ai_explanation_prompt_version` | VARCHAR(50) | NULL | |
| `unlocked_at` | TIMESTAMP WITH TIME ZONE | NULL | |
| `completed_at` | TIMESTAMP WITH TIME ZONE | NULL | |

### 9.12 Entity: SkillCompetency

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | FK → User, NOT NULL | |
| `roadmap_id` | UUID | FK → Roadmap, NOT NULL | |
| `skill_id` | UUID | FK → Skill, NOT NULL | |
| `self_rating` | INTEGER | NOT NULL, DEFAULT 0, CHECK 0–5 | |
| `assessment_score` | DECIMAL(5,2) | NULL, CHECK 0–100 | NULL = not yet assessed |
| `evidence_url` | TEXT | NULL | NULL = not yet submitted |
| `competency_score` | DECIMAL(5,2) | NOT NULL, DEFAULT 0 | Computed; stored for query performance |
| `is_complete` | BOOLEAN | NOT NULL, DEFAULT FALSE | True when score ≥ threshold |
| `updated_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | |

### 9.13 Entity: ProgressEvent

| Attribute | Type | Constraints | Notes |
|---|---|---|---|
| `id` | UUID | PK, NOT NULL | |
| `user_id` | UUID | FK → User, NOT NULL | |
| `event_type` | ENUM | NOT NULL | skill_rated / assessment_entered / evidence_submitted / milestone_completed / roadmap_generated / career_path_changed |
| `payload` | JSONB | NOT NULL | Event-specific structured data |
| `created_at` | TIMESTAMP WITH TIME ZONE | NOT NULL | Immutable; no update/delete allowed |

---

## 10. AI Requirements

### 10.1 What AI Does vs. What Is Deterministic

The following table is the authoritative boundary between AI-driven and deterministic behaviour in the system:

| Function | Approach | Rationale |
|---|---|---|
| Skill-gap analysis | **Deterministic** | Requires perfect consistency; must be auditable |
| Roadmap milestone ordering | **Deterministic** | Prerequisite graph traversal; must be reproducible |
| Resource assignment to milestones | **Deterministic** | Rule-based tag matching; no randomness permitted |
| Project assignment to milestones | **Deterministic** | Rule-based tag matching |
| Competency score calculation | **Deterministic** | Arithmetic formula; must be consistent |
| Milestone unlock logic | **Deterministic** | Threshold comparison; must be consistent |
| Roadmap milestone explanations | **AI-generated** | Personalised plain-language summaries are a high-leverage use of LLM capability |
| Milestone completion acknowledgements | **AI-generated** | Motivational, contextualised narrative; low risk if imperfect |
| Fallback explanations (AI failure) | **Deterministic template** | Guaranteed availability; no AI dependency |

### 10.2 AI Output Format Requirements

**AI-REQ-01:** AI-generated milestone explanations shall be plain prose, 80–200 words in length. Bullet points and headers shall not appear in AI output.

**AI-REQ-02:** AI-generated explanations shall be written in second person ("you", "your") and address the student directly.

**AI-REQ-03:** AI-generated explanations shall not include: specific claims about job market statistics, salary numbers, company-specific hiring criteria, guarantees of employment outcomes, or content that could be construed as professional career counselling advice.

**AI-REQ-04:** AI-generated explanations shall not reproduce the full text of any prompt template. The student-facing output shall contain only the generated explanation text.

**AI-REQ-05:** The maximum output token length for a single milestone explanation shall be set in the prompt template. Explanations that exceed 200 words shall be truncated server-side before storage.

### 10.3 Guardrail Requirements

**AI-GUARD-01:** If the AI API returns an error (HTTP 4xx/5xx), a timeout (configurable; default 8 seconds), or a content-policy rejection, the system shall fall back to the deterministic template-based explanation without surfacing the error to the student.

**AI-GUARD-02:** AI API call failures shall be logged with: timestamp, prompt version, career path ID, milestone ID, error type, and error message. Logs shall not contain student PII.

**AI-GUARD-03:** AI-generated content shall be validated server-side for minimum length (20 words). Content below the minimum length shall trigger the fallback template.

**AI-GUARD-04:** AI-generated content shall pass through a profanity and harmful content filter before being stored. Content that fails the filter shall trigger the fallback template and shall be logged for admin review.

**AI-GUARD-05:** No student PII (name, email, institution name, exact location) shall be included in any AI API prompt. Prompts shall reference only anonymised profile attributes (year of study, career path title, skill names, rating values).

### 10.4 Prompt Versioning

**AI-PROMPT-01:** All AI prompts shall be version-controlled. Each prompt version shall have a unique string identifier (e.g., `milestone-explanation-v1.2`).

**AI-PROMPT-02:** The prompt version identifier shall be stored alongside every AI-generated output in the database.

**AI-PROMPT-03:** When a prompt template is updated, the new version shall be deployed as a new version identifier. Existing stored explanations shall not be overwritten unless an admin triggers an explicit bulk re-generation.

**AI-PROMPT-04:** Prompt templates shall be stored in the application codebase (not in the database) and shall be deployed via the standard code deployment pipeline.

---

## 11. Security Requirements

**SEC-01 — TLS Enforcement:** All HTTP traffic shall be served over TLS 1.2 or higher. HTTP requests shall be redirected to HTTPS with a permanent (301) redirect. HSTS headers shall be set with a minimum `max-age` of 31,536,000 seconds (one year).

**SEC-02 — Password Hashing:** User passwords shall be hashed using bcrypt with a work factor of minimum 12, or an equivalent adaptive hashing algorithm (Argon2id). Plaintext passwords shall never be logged or stored.

**SEC-03 — JWT Security:** JWT access tokens shall be signed with RS256 (asymmetric). The private signing key shall be stored in a secrets manager (not in environment variables). Tokens shall include `iss`, `sub`, `exp`, `iat`, and `jti` claims. The `jti` claim shall be used to support token revocation via a denylist.

**SEC-04 — Role-Based Access Control (RBAC):** The system shall enforce two roles: `student` and `admin`. Every API endpoint shall declare the minimum required role. Requests with insufficient role shall receive HTTP 403. Role checks shall be enforced in middleware, not in individual route handlers.

**SEC-05 — Row-Level Security (RLS):** Student data (profiles, roadmaps, competency scores, progress events) shall be protected by row-level security policies enforced at the database level. A student's session shall only be able to read and write rows owned by that student's user ID.

**SEC-06 — IDOR Prevention:** All resource identifiers exposed to the client shall be UUIDs (not sequential integers). Every data-access request shall verify that the authenticated user has permission to access the requested resource. Access to another user's data shall result in HTTP 404 (not 403, to avoid leaking existence information).

**SEC-07 — Input Validation:** All API endpoints shall validate and sanitise all inputs server-side. Input validation shall occur before any business logic or database operation. Invalid inputs shall return HTTP 422 with a structured error body. No HTML shall be rendered in error messages.

**SEC-08 — Rate Limiting:** The following rate limits shall be enforced per IP address:
- Authentication endpoints (login, register, password reset): 10 requests per minute
- Roadmap generation endpoint: 5 requests per hour per authenticated user
- All other authenticated API endpoints: 100 requests per minute per user

**SEC-09 — Audit Logging:** The following security-sensitive actions shall be recorded in an immutable audit log: user registration, login (success and failure), password reset, account deletion, admin data access of student records, admin content modifications, role changes. Audit log entries shall include: timestamp, user ID, action type, IP address (hashed), and result (success/failure).

**SEC-10 — Data Deletion:** Upon account deletion request, all personally identifiable information shall be purged within 30 days. The deletion pipeline shall produce a deletion receipt (timestamp and confirmation) stored against the hashed user ID. Anonymised aggregate data (competency score distributions, career path selection counts) may be retained.

**SEC-11 — Dependency Vulnerability Scanning:** All third-party dependencies shall be scanned for known vulnerabilities as part of the CI pipeline on every pull request. Pull requests that introduce dependencies with CVSS score ≥ 7.0 shall fail CI automatically.

**SEC-12 — Secrets Management:** No secrets (API keys, database credentials, JWT private keys) shall be committed to source control. All secrets shall be stored in a managed secrets service (e.g., AWS Secrets Manager, GCP Secret Manager, or HashiCorp Vault) and injected at runtime.

**SEC-13 — Content Security Policy:** All student-facing pages shall set a strict Content Security Policy header restricting script sources to the application's own origin and explicitly approved CDN domains. `unsafe-inline` and `unsafe-eval` shall not be permitted in the CSP.

---

## 12. Success Metrics

### 12.1 North-Star Metric

> **Verified career-readiness progress per active student:** The average increase in Career-Readiness Score (0–100) per student who has logged at least one progress event in the last 30 days.

This metric is chosen because it directly measures the product's core promise — measurable skill development — rather than a proxy engagement metric.

### 12.2 Activation Metrics

| Metric | Definition | MVP Target |
|---|---|---|
| **Registration-to-Onboarding Start Rate** | % of registered users who begin the onboarding wizard | ≥ 70% within 24 hours of registration |
| **Onboarding Completion Rate** | % of users who start the wizard and complete all 8 steps | ≥ 60% |
| **Roadmap Generation Rate** | % of registered users who have a generated roadmap | ≥ 50% within 7 days of registration |

### 12.3 Engagement Metrics

| Metric | Definition | MVP Target |
|---|---|---|
| **Roadmap Usefulness Rating** | Average student rating of "How useful is this roadmap for your career goal?" (1–5 Likert scale, collected 48 hours after roadmap generation) | ≥ 3.8 / 5.0 |
| **Action Completion Rate** | % of students with an active roadmap who complete at least one milestone action (resource accessed, assessment entered, or evidence submitted) within 7 days | ≥ 35% |
| **7-Day Retention** | % of students who return to the platform at least once in the 7 days following their first session | ≥ 30% |
| **30-Day Retention** | % of students who return to the platform at least once in the 30 days following their first session | ≥ 20% |

### 12.4 Outcome Metrics

| Metric | Definition | MVP Target |
|---|---|---|
| **Milestones Completed** | Average number of milestones completed per student with an active roadmap, measured at 30 days | ≥ 1.5 milestones |
| **Competency Score Gain** | Average increase in Career-Readiness Score between roadmap generation and 30-day mark | ≥ +10 points |
| **Evidence Submission Rate** | % of students who have submitted at least one evidence link (project URL, certificate, etc.) | ≥ 25% at 30 days |

### 12.5 Content Quality Metrics

| Metric | Definition | Target |
|---|---|---|
| **Resource Dead-Link Rate** | % of resource URLs that return a non-200 response in monthly admin audit | < 5% |
| **Admin Content Freshness** | % of career paths updated (resource additions or skill adjustments) in the last 90 days | 100% |

### 12.6 Measurement Infrastructure

- All metrics shall be computable from the existing data model (ProgressEvent log + User + Roadmap tables) without additional instrumentation.
- A weekly metrics report shall be automatically generated from the database and sent to the product team's internal dashboard.
- User-facing rating prompts shall be surfaced in-app (dashboard notification) 48 hours after roadmap generation and shall not interrupt the primary workflow.

---

## 13. Definition of Done

The MVP is complete when **all** of the following conditions are satisfied. Each item is independently verifiable.

### 13.1 Functional Completeness

- [ ] **AUTH-DONE-01:** A new user can register with email + password, receive a verification email, verify, and access the platform.
- [ ] **AUTH-DONE-02:** A new user can sign in with Google OAuth and access the platform without setting a password.
- [ ] **AUTH-DONE-03:** A user can reset their password via an emailed link and all existing sessions are invalidated.
- [ ] **AUTH-DONE-04:** Account deletion removes all PII from the database within the defined window; a deletion receipt is stored.
- [ ] **ONBOARD-DONE-01:** A new user is presented with the 8-step onboarding wizard after authentication and cannot access the dashboard until it is complete.
- [ ] **ONBOARD-DONE-02:** A user who abandons the wizard at any step can return and resume from the last completed step.
- [ ] **CAREER-DONE-01:** The career path catalog contains a minimum of 10 published career paths, each with all required attributes populated and verified by an admin.
- [ ] **SGA-DONE-01:** The skill-gap analysis runs automatically on onboarding completion and produces a classified (Present / Partial / Missing) output for every required skill in the selected career path.
- [ ] **RG-DONE-01:** A prerequisite-ordered roadmap is generated for every student who completes onboarding. The roadmap contains milestones in topologically valid order.
- [ ] **RES-DONE-01:** The learning resource library contains a minimum of 50 active, verified resources. Each resource has all required attributes populated.
- [ ] **PROJ-DONE-01:** The project library contains a minimum of 30 active, curated projects. Each project has all required attributes populated.
- [ ] **PT-DONE-01:** A student can update their self-assessment rating, enter an assessment score, and submit an evidence link. The competency score recalculates correctly for all three components after each update.
- [ ] **PT-DONE-02:** Milestone completion is triggered automatically when all skills in the milestone reach the threshold. The next milestone unlocks automatically.
- [ ] **AI-DONE-01:** AI-generated explanations are stored for all milestones at roadmap generation time. The fallback template activates correctly when the AI API is unavailable.
- [ ] **DASH-DONE-01:** The student dashboard displays the Next Action card, Career-Readiness Score, active milestone, roadmap progress bar, and recent activity feed.
- [ ] **ADMIN-DONE-01:** Admins can create, edit, publish, and soft-delete career paths, skills, resources, and projects via the admin dashboard.

### 13.2 Non-Functional Completeness

- [ ] **NFR-DONE-01:** Dashboard FCP is verified at < 2 seconds in a Lighthouse CI run on the staging environment.
- [ ] **NFR-DONE-02:** P95 API response time is verified at < 500ms under a 100-concurrent-user load test in staging.
- [ ] **NFR-DONE-03:** All database queries in the critical path are covered by indexes, verified by EXPLAIN ANALYZE output attached to the release notes.
- [ ] **NFR-DONE-04:** Automated daily database backup is running in production, and a restoration test has been completed successfully.
- [ ] **NFR-DONE-05:** All student-facing pages pass WCAG 2.1 Level AA checks in an automated accessibility audit (axe-core or equivalent).

### 13.3 Security Completeness

- [ ] **SEC-DONE-01:** All API endpoints have RBAC role declarations verified by an automated test that calls each endpoint with an unauthenticated and an insufficient-role request and confirms HTTP 401 / 403 responses.
- [ ] **SEC-DONE-02:** OWASP ZAP (or equivalent) automated scan has been run against the staging environment. All findings with CVSS ≥ 7.0 have been remediated.
- [ ] **SEC-DONE-03:** A dependency vulnerability scan has been run. No dependencies with CVSS ≥ 7.0 are present.
- [ ] **SEC-DONE-04:** Rate limiting is verified by an automated test for all specified endpoints.
- [ ] **SEC-DONE-05:** No secrets, API keys, or credentials appear in the source code repository (verified by a secrets-scanning tool such as `trufflehog` or `gitleaks` in CI).

### 13.4 Content Completeness

- [ ] **CONTENT-DONE-01:** All 10+ career paths have been reviewed and approved by at least one domain expert before publishing.
- [ ] **CONTENT-DONE-02:** All 50+ learning resources have been manually verified (link checked, content reviewed) by a platform admin.
- [ ] **CONTENT-DONE-03:** All 30+ projects have descriptions that have been reviewed for clarity and relevance to each tagged career path.

### 13.5 Observability and Operations

- [ ] **OPS-DONE-01:** Structured JSON logging is active in production. A sample log query confirming the presence of all required fields (timestamp, request ID, method, path, status, latency, hashed user ID) has been verified.
- [ ] **OPS-DONE-02:** Application metrics are being collected and displayed in a monitoring dashboard (roadmap generation count, AI call count, AI failure count, error rate).
- [ ] **OPS-DONE-03:** Alerts for error rate > 1% over a 5-minute window and for AI API failure are configured and have been tested by manually triggering the failure condition in staging.

### 13.6 Product and Stakeholder Sign-Off

- [ ] **SIGN-OFF-01:** A usability test has been conducted with a minimum of 5 Indian undergraduate students (target users). All critical path flows (registration → onboarding → roadmap view → progress update) have been completed without facilitator assistance.
- [ ] **SIGN-OFF-02:** The product owner has reviewed and approved the roadmap generation output for all 10+ career paths using representative student profiles.
- [ ] **SIGN-OFF-03:** The privacy policy and terms of service have been reviewed by a qualified legal reviewer and are live on the platform.
- [ ] **SIGN-OFF-04:** A data processing agreement (or equivalent documentation) is in place for the AI API provider covering the data sent in prompts.

---

*End of Document — StudentRoadmap AI Product Specification v1.0.0*
