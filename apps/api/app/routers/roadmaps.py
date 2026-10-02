from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from typing import List, Dict, Set
import uuid

from app.database import get_db
from app.dependencies import get_current_profile
from app.models.profile import StudentProfile
from app.models.career import CareerRole, CareerRoleSkill
from app.models.skill import StudentSkill, Skill, SkillDependency
from app.models.roadmap import Roadmap, RoadmapPhase, RoadmapItem
from app.schemas.roadmap import RoadmapGenerateIn, RoadmapOut

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])

@router.post("/generate", response_model=RoadmapOut)
async def generate_roadmap(
    body: RoadmapGenerateIn,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    # 1. Get career role + required skills
    role_res = await db.execute(
        select(CareerRole)
        .options(selectinload(CareerRole.required_skills).selectinload(CareerRoleSkill.skill))
        .where(CareerRole.slug == body.career_role_slug)
    )
    role = role_res.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Career role not found")

    # 2. Get student's existing skills
    ss_res = await db.execute(select(StudentSkill).where(StudentSkill.student_id == profile.id))
    student_skills = {ss.skill_id: ss.competency_score for ss in ss_res.scalars().all()}

    # 3. Compute gaps
    gaps = []
    gap_skills = {}
    for crs in role.required_skills:
        req_importance = float(crs.importance)
        student_competency = student_skills.get(crs.skill_id, 0.0)
        
        if student_competency < req_importance:
            score = req_importance * (1.0 - student_competency)
            gaps.append((score, crs.skill))
            gap_skills[crs.skill_id] = crs.skill

    # 4. Sort gaps by importance * (1 - student_competency) DESC
    gaps.sort(key=lambda x: x[0], reverse=True)
    sorted_gap_skills = [g[1] for g in gaps]
    
    if not sorted_gap_skills:
        # No gaps
        roadmap = Roadmap(student_id=profile.id, career_role_id=role.id, status="active", weekly_hours_committed=body.weekly_hours)
        db.add(roadmap)
        await db.commit()
        await db.refresh(roadmap)
        return roadmap

    # 5. Resolve prerequisites
    # simple topological sort
    deps_res = await db.execute(select(SkillDependency))
    deps = deps_res.scalars().all()
    
    adj = {s.id: [] for s in sorted_gap_skills}
    for d in deps:
        if d.skill_id in gap_skills and d.prerequisite_skill_id in gap_skills:
            adj[d.skill_id].append(d.prerequisite_skill_id)

    visited = set()
    temp = set()
    topo_order = []

    def visit(node_id):
        if node_id in temp:
            return # cycle detected
        if node_id not in visited:
            temp.add(node_id)
            for neighbor in adj.get(node_id, []):
                visit(neighbor)
            temp.remove(node_id)
            visited.add(node_id)
            topo_order.append(gap_skills[node_id])

    for skill in sorted_gap_skills:
        if skill.id not in visited:
            visit(skill.id)

    # 6. Group into phases (2-3 skills per phase, targeting ~weekly_hours)
    roadmap = Roadmap(student_id=profile.id, career_role_id=role.id, status="active", weekly_hours_committed=body.weekly_hours)
    db.add(roadmap)
    await db.flush([roadmap])

    phase_idx = 1
    current_phase_skills = []
    current_phase_hours = 0
    
    def skill_hours(diff):
        if diff == "beginner": return 8
        if diff == "intermediate": return 15
        return 25

    for skill in topo_order:
        hrs = skill_hours(skill.difficulty)
        
        # If adding this skill exceeds ~weekly_hours and we already have skills, or if we have 3 skills
        if current_phase_skills and (current_phase_hours + hrs > body.weekly_hours * 2 or len(current_phase_skills) >= 3):
            # save phase
            phase = RoadmapPhase(roadmap_id=roadmap.id, phase_number=phase_idx, title=f"Phase {phase_idx}", estimated_hours=current_phase_hours)
            db.add(phase)
            await db.flush([phase])
            
            for i, s in enumerate(current_phase_skills):
                item = RoadmapItem(phase_id=phase.id, type="skill", reference_id=s.id, title=f"Learn {s.name}", estimated_hours=skill_hours(s.difficulty), order_index=i)
                db.add(item)
            
            phase_idx += 1
            current_phase_skills = []
            current_phase_hours = 0
            
        current_phase_skills.append(skill)
        current_phase_hours += hrs

    if current_phase_skills:
        phase = RoadmapPhase(roadmap_id=roadmap.id, phase_number=phase_idx, title=f"Phase {phase_idx}", estimated_hours=current_phase_hours)
        db.add(phase)
        await db.flush([phase])
        for i, s in enumerate(current_phase_skills):
            item = RoadmapItem(phase_id=phase.id, type="skill", reference_id=s.id, title=f"Learn {s.name}", estimated_hours=skill_hours(s.difficulty), order_index=i)
            db.add(item)

    await db.commit()
    
    res = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.phases).selectinload(RoadmapPhase.items))
        .where(Roadmap.id == roadmap.id)
    )
    return res.scalar_one()

@router.get("/", response_model=List[RoadmapOut])
async def list_roadmaps(
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.phases).selectinload(RoadmapPhase.items))
        .where(Roadmap.student_id == profile.id)
    )
    return res.scalars().all()

@router.get("/{id}", response_model=RoadmapOut)
async def get_roadmap(
    id: uuid.UUID,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    res = await db.execute(
        select(Roadmap)
        .options(selectinload(Roadmap.phases).selectinload(RoadmapPhase.items))
        .where(Roadmap.id == id, Roadmap.student_id == profile.id)
    )
    rm = res.scalar_one_or_none()
    if not rm:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return rm
