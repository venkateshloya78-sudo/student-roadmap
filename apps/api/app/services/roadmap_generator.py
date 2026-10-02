"""
Deterministic roadmap generation service.

Algorithm:
1. Load the target career role + required skills (with importance weights).
2. Load the student's existing StudentSkill records.
3. Identify skill gaps: skills where competency_score < 0.70 threshold.
4. Sort gaps by (difficulty_tier ASC, importance DESC) — prerequisites first.
5. Group into up to 4 phases by difficulty tier (beginner→intermediate→advanced→expert).
6. Persist Roadmap, RoadmapPhase, and RoadmapItem rows within a single transaction.
7. Add a capstone milestone item to the last phase.
"""
import uuid
from datetime import datetime, timezone

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.models.career import CareerRole, CareerRoleSkill
from app.models.profile import StudentProfile
from app.models.roadmap import (
    ItemStatus, ItemType, PhaseStatus,
    Roadmap, RoadmapItem, RoadmapPhase, RoadmapStatus,
)
from app.models.skill import StudentSkill

# Competency readiness threshold (70%)
READINESS_THRESHOLD = 0.70

# Maps difficulty enum value → sort order
DIFFICULTY_ORDER: dict[str, int] = {
    "beginner": 0,
    "intermediate": 1,
    "advanced": 2,
    "expert": 3,
}

# Estimated learning hours per difficulty tier
HOURS_PER_ITEM: dict[int, int] = {0: 15, 1: 25, 2: 40, 3: 60}

PHASE_TITLES: dict[int, str] = {
    1: "Phase 1 — Foundation & Core Concepts",
    2: "Phase 2 — Core Skills Development",
    3: "Phase 3 — Advanced Topics",
    4: "Phase 4 — Expert & Portfolio",
}

PHASE_DESCRIPTIONS: dict[int, str] = {
    1: "Build foundational knowledge and beginner-level skills required for the role.",
    2: "Develop core intermediate skills that form the backbone of your career path.",
    3: "Master advanced topics that differentiate senior practitioners.",
    4: "Attain expert-level proficiency and build portfolio evidence.",
}


async def generate_roadmap(
    db: AsyncSession,
    student: StudentProfile,
    career_role_id: uuid.UUID,
    weekly_hours: int = 10,
) -> Roadmap:
    """
    Generate (or regenerate) a roadmap for the given student and career role.
    Any previously active roadmap is archived before the new one is created.
    """
    # ── 1. Archive old active roadmaps ──────────────────────────────────────
    old_result = await db.execute(
        select(Roadmap).where(
            Roadmap.student_id == student.id,
            Roadmap.status == RoadmapStatus.active,
        )
    )
    for old in old_result.scalars().all():
        old.status = RoadmapStatus.archived

    # ── 2. Load career role + required skills ─────────────────────────────
    role_result = await db.execute(
        select(CareerRole)
        .options(selectinload(CareerRole.required_skills).selectinload(CareerRoleSkill.skill))
        .where(CareerRole.id == career_role_id)
    )
    role = role_result.scalar_one_or_none()
    if not role:
        raise ValueError(f"Career role {career_role_id} not found")

    # ── 3. Load student's existing skills ────────────────────────────────
    skill_result = await db.execute(
        select(StudentSkill).where(StudentSkill.student_id == student.id)
    )
    student_skill_map: dict[uuid.UUID, StudentSkill] = {
        ss.skill_id: ss for ss in skill_result.scalars().all()
    }

    # ── 4. Identify gaps ─────────────────────────────────────────────────
    gaps: list[dict] = []
    for role_skill in role.required_skills:
        ss = student_skill_map.get(role_skill.skill_id)
        current_score = ss.competency_score if ss else 0.0
        if current_score < READINESS_THRESHOLD:
            diff_val = (
                role_skill.required_level.value
                if hasattr(role_skill.required_level, "value")
                else role_skill.required_level
            )
            gaps.append(
                {
                    "role_skill": role_skill,
                    "skill": role_skill.skill,
                    "current_score": current_score,
                    "gap": READINESS_THRESHOLD - current_score,
                    "importance": float(role_skill.importance),
                    "diff_value": diff_val,
                    "diff_order": DIFFICULTY_ORDER.get(diff_val, 0),
                }
            )

    # Sort: easiest prerequisites first, then highest importance within tier
    gaps.sort(key=lambda g: (g["diff_order"], -g["importance"]))

    # ── 5. Group into phase tiers ─────────────────────────────────────────
    # tier 1 = beginner, 2 = intermediate, 3 = advanced, 4 = expert
    phase_groups: dict[int, list[dict]] = {1: [], 2: [], 3: [], 4: []}
    for gap in gaps:
        tier = min(gap["diff_order"] + 1, 4)
        phase_groups[tier].append(gap)

    # ── 6. Create Roadmap header ──────────────────────────────────────────
    roadmap = Roadmap(
        student_id=student.id,
        career_role_id=career_role_id,
        status=RoadmapStatus.active,
        weekly_hours_committed=weekly_hours,
        generated_at=datetime.now(timezone.utc),
        trigger_event="initial_generation",
    )
    db.add(roadmap)
    await db.flush()  # populate roadmap.id

    # ── 7. Build phases and items ─────────────────────────────────────────
    phase_num = 0
    last_phase: RoadmapPhase | None = None

    for tier in range(1, 5):
        tier_gaps = phase_groups[tier]
        if not tier_gaps:
            continue

        phase_num += 1
        phase = RoadmapPhase(
            roadmap_id=roadmap.id,
            phase_number=phase_num,
            title=PHASE_TITLES[tier],
            description=PHASE_DESCRIPTIONS[tier] + f" Required for: {role.title}.",
            estimated_hours=sum(HOURS_PER_ITEM.get(gap["diff_order"], 25) for gap in tier_gaps),
            # First phase starts immediately; the rest are locked until prior phase completes
            status=PhaseStatus.in_progress if phase_num == 1 else PhaseStatus.not_started,
        )
        db.add(phase)
        await db.flush()  # populate phase.id

        for idx, gap in enumerate(tier_gaps):
            skill = gap["skill"]
            skill_diff = gap["diff_value"]
            item = RoadmapItem(
                phase_id=phase.id,
                type=ItemType.skill,
                reference_id=skill.id,
                title=f"Learn {skill.name}",
                description=skill.description,
                estimated_hours=HOURS_PER_ITEM.get(gap["diff_order"], 25),
                order_index=idx,
                status=ItemStatus.not_started,
                ai_explanation=(
                    f"Your current {skill.name} competency is "
                    f"{int(gap['current_score'] * 100)}% "
                    f"(required ≥70%). This skill has an importance weight of "
                    f"{int(gap['importance'] * 100)}% for the {role.title} role and "
                    f"should be learned at the {skill_diff} level."
                ),
            )
            db.add(item)

        last_phase = phase

    # ── 8. Capstone milestone ─────────────────────────────────────────────
    if last_phase is not None:
        milestone_idx = len(phase_groups.get(min(phase_num, 4), []))
        milestone = RoadmapItem(
            phase_id=last_phase.id,
            type=ItemType.milestone,
            title=f"🎯 Career Readiness — {role.title}",
            description=(
                f"Congratulations! You have addressed all skill gaps required for the "
                f"{role.title} role. Update your resume and LinkedIn profile, and begin applying."
            ),
            estimated_hours=0,
            order_index=milestone_idx,
            status=ItemStatus.not_started,
            ai_explanation=(
                f"Reaching this milestone means your competency scores meet the "
                f"{int(READINESS_THRESHOLD * 100)}% threshold for all skills required "
                f"to be a {role.title}."
            ),
        )
        db.add(milestone)

    await db.commit()
    await db.refresh(roadmap)
    return roadmap
