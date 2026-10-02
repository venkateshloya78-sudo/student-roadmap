import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.skill import Skill, SkillDependency
from app.schemas.skill import PaginatedSkills, SkillOut, SkillDetailOut, SkillBase

router = APIRouter(prefix="/skills", tags=["skills"])

@router.get("", response_model=PaginatedSkills)
async def list_skills(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    category: Optional[str] = Query(None, description="Filter by category (technical|soft|domain|tool)"),
    difficulty: Optional[str] = Query(None, description="Filter by difficulty (beginner|intermediate|advanced)"),
    db: AsyncSession = Depends(get_db),
):
    """List all skills, filterable by category and difficulty."""
    q = select(Skill)
    if category:
        q = q.where(Skill.category == category)
    if difficulty:
        q = q.where(Skill.difficulty == difficulty)

    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    skills = (await db.execute(q.offset((page - 1) * size).limit(size))).scalars().all()

    return PaginatedSkills(
        items=[SkillOut.model_validate(s) for s in skills],
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 1,
    )

@router.get("/{slug}", response_model=SkillDetailOut)
async def get_skill(slug: str, db: AsyncSession = Depends(get_db)):
    """Single skill with dependency info."""
    q = select(Skill).where(Skill.slug == slug)
    result = await db.execute(q)
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")
    
    # get prerequisites
    pre_q = select(Skill).join(SkillDependency, SkillDependency.prerequisite_skill_id == Skill.id).where(SkillDependency.skill_id == skill.id)
    prereqs = (await db.execute(pre_q)).scalars().all()

    # get prerequisite_for
    for_q = select(Skill).join(SkillDependency, SkillDependency.skill_id == Skill.id).where(SkillDependency.prerequisite_skill_id == skill.id)
    prereq_for = (await db.execute(for_q)).scalars().all()

    skill_detail = SkillDetailOut.model_validate(skill)
    skill_detail.prerequisites = [SkillBase.model_validate(p) for p in prereqs]
    skill_detail.prerequisite_for = [SkillBase.model_validate(p) for p in prereq_for]
    
    return skill_detail
