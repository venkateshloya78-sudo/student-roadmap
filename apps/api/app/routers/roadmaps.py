from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List
import uuid

from app.database import get_db
from app.dependencies import get_current_profile
from app.models.profile import StudentProfile
from app.models.career import CareerRole, CareerRoleSkill
from app.models.skill import StudentSkill, Skill, SkillDependency
from app.models.roadmap import Roadmap, RoadmapPhase, RoadmapItem, ItemStatus
from app.schemas.roadmap import RoadmapGenerateIn, RoadmapOut

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


def skill_hours(difficulty: str) -> int:
    return {"beginner": 8, "intermediate": 15, "advanced": 25, "expert": 35}.get(difficulty, 15)


@router.post("/generate", response_model=RoadmapOut)
async def generate_roadmap(
    body: RoadmapGenerateIn,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    # 1. Career role + required skills
    role_res = await db.execute(
        select(CareerRole)
        .options(selectinload(CareerRole.required_skills).selectinload(CareerRoleSkill.skill))
        .where(CareerRole.slug == body.career_role_slug)
    )
    role = role_res.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Career role not found")

    # 2. Student's existing skills
    ss_res = await db.execute(select(StudentSkill).where(StudentSkill.student_id == str(profile.id)))
    student_skills = {str(ss.skill_id): ss.competency_score for ss in ss_res.scalars().all()}

    # 3. Compute gaps
    gaps = []
    gap_skills: dict = {}
    for crs in role.required_skills:
        req_importance = float(crs.importance)
        student_comp = student_skills.get(str(crs.skill_id), 0.0)
        if student_comp < req_importance:
            score = req_importance * (1.0 - student_comp)
            gaps.append((score, crs.skill))
            gap_skills[str(crs.skill_id)] = crs.skill

    gaps.sort(key=lambda x: x[0], reverse=True)
    sorted_gap_skills = [g[1] for g in gaps]

    # 4. Topological sort (prerequisite ordering)
    deps_res = await db.execute(select(SkillDependency))
    deps = deps_res.scalars().all()

    adj: dict = {str(s.id): [] for s in sorted_gap_skills}
    for d in deps:
        if str(d.skill_id) in gap_skills and str(d.prerequisite_skill_id) in gap_skills:
            adj[str(d.skill_id)].append(str(d.prerequisite_skill_id))

    visited: set = set()
    temp: set = set()
    topo_order: list = []

    def visit(node_id: str):
        if node_id in temp:
            return
        if node_id not in visited:
            temp.add(node_id)
            for neighbor in adj.get(node_id, []):
                visit(neighbor)
            temp.discard(node_id)
            visited.add(node_id)
            topo_order.append(gap_skills[node_id])

    for skill in sorted_gap_skills:
        if str(skill.id) not in visited:
            visit(str(skill.id))

    # 5. Create roadmap
    roadmap = Roadmap(
        id=str(uuid.uuid4()),
        student_id=str(profile.id),
        career_role_id=str(role.id),
        status="active",
        version=1,
        weekly_hours_committed=body.weekly_hours,
    )
    db.add(roadmap)
    await db.flush([roadmap])

    # 6. Group into phases
    phase_idx = 1
    current_skills: list = []
    current_hours = 0
    target_phase_hours = body.weekly_hours * 2  # ~2 weeks per phase

    def flush_phase():
        nonlocal phase_idx, current_skills, current_hours
        return current_skills, current_hours, phase_idx

    for skill in (topo_order if topo_order else sorted_gap_skills):
        hrs = skill_hours(str(skill.difficulty))
        if current_skills and (current_hours + hrs > target_phase_hours or len(current_skills) >= 3):
            phase = RoadmapPhase(
                id=str(uuid.uuid4()),
                roadmap_id=str(roadmap.id),
                phase_number=phase_idx,
                title=f"Phase {phase_idx}",
                estimated_hours=current_hours,
                status="not_started",
            )
            db.add(phase)
            await db.flush([phase])
            for i, s in enumerate(current_skills):
                item = RoadmapItem(
                    id=str(uuid.uuid4()),
                    phase_id=str(phase.id),
                    type="skill",
                    reference_id=str(s.id),
                    title=f"Learn {s.name}",
                    estimated_hours=skill_hours(str(s.difficulty)),
                    order_index=i,
                    status="not_started",
                )
                db.add(item)
                await db.flush([item])
            phase_idx += 1
            current_skills = []
            current_hours = 0
        current_skills.append(skill)
        current_hours += hrs

    if current_skills:
        phase = RoadmapPhase(
            id=str(uuid.uuid4()),
            roadmap_id=str(roadmap.id),
            phase_number=phase_idx,
            title=f"Phase {phase_idx}",
            estimated_hours=current_hours,
            status="not_started",
        )
        db.add(phase)
        await db.flush([phase])
        for i, s in enumerate(current_skills):
            item = RoadmapItem(
                id=str(uuid.uuid4()),
                phase_id=str(phase.id),
                type="skill",
                reference_id=str(s.id),
                title=f"Learn {s.name}",
                estimated_hours=skill_hours(str(s.difficulty)),
                order_index=i,
                status="not_started",
            )
            db.add(item)
            await db.flush([item])



    await db.commit()

    result = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.phases).selectinload(RoadmapPhase.items))
        .where(Roadmap.id == str(roadmap.id))
    )
    return result.scalar_one()


@router.get("/", response_model=dict)
async def list_roadmaps(
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.phases).selectinload(RoadmapPhase.items))
        .where(Roadmap.student_id == str(profile.id))
        .order_by(Roadmap.created_at.desc())
    )
    items = res.scalars().all()
    return {"items": [RoadmapOut.model_validate(r) for r in items], "total": len(items)}


@router.get("/{id}", response_model=RoadmapOut)
async def get_roadmap(
    id: str,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    res = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.phases).selectinload(RoadmapPhase.items))
        .where(Roadmap.id == id, Roadmap.student_id == str(profile.id))
    )
    rm = res.scalar_one_or_none()
    if not rm:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return rm


class ItemStatusUpdate(BaseModel):
    status: str


@router.patch("/items/{item_id}")
async def update_item_status(
    item_id: str,
    body: ItemStatusUpdate,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Toggle a roadmap item between not_started and completed."""
    res = await db.execute(select(RoadmapItem).where(RoadmapItem.id == item_id))
    item = res.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    try:
        item.status = ItemStatus(body.status)
    except ValueError:
        raise HTTPException(status_code=422, detail=f"Invalid status '{body.status}'")
    await db.commit()
    return {"id": str(item.id), "status": item.status.value if hasattr(item.status, 'value') else str(item.status)}
