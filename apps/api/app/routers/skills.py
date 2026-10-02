import math
import uuid
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_profile
from app.models.profile import StudentProfile
from app.models.skill import Skill, StudentSkill
from app.schemas.skill import PaginatedSkills, SkillOut, StudentSkillOut, UpsertSkillRequest

router = APIRouter(prefix="/skills", tags=["skills"])


@router.get("", response_model=PaginatedSkills)
async def list_skills(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    category: Optional[str] = Query(None, description="Filter by category (technical|soft|domain|tool)"),
    search: Optional[str] = Query(None, description="Search by name"),
    db: AsyncSession = Depends(get_db),
):
    """List all active skills with optional category + name filters, paginated."""
    q = select(Skill).where(Skill.status == "active")
    if category:
        q = q.where(Skill.category == category)
    if search:
        q = q.where(Skill.name.ilike(f"%{search}%"))

    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    skills = (await db.execute(q.offset((page - 1) * size).limit(size))).scalars().all()

    return PaginatedSkills(
        items=[SkillOut.model_validate(s) for s in skills],
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 1,
    )


@router.get("/mine", response_model=list[StudentSkillOut])
async def my_skills(
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Return all skills the authenticated student has self-declared."""
    result = await db.execute(
        select(StudentSkill)
        .options(selectinload(StudentSkill.skill))
        .where(StudentSkill.student_id == profile.id)
    )
    return [StudentSkillOut.model_validate(ss) for ss in result.scalars().all()]


@router.put("/mine/{skill_id}", response_model=StudentSkillOut)
async def upsert_my_skill(
    skill_id: uuid.UUID,
    body: UpsertSkillRequest,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Create or update a student's self-declared skill rating (0–10 scale)."""
    # Verify the skill exists
    skill_check = await db.execute(select(Skill).where(Skill.id == skill_id))
    if not skill_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Skill not found")

    if not (0 <= body.self_rating <= 10):
        raise HTTPException(status_code=400, detail="self_rating must be between 0 and 10")

    result = await db.execute(
        select(StudentSkill).where(
            StudentSkill.student_id == profile.id,
            StudentSkill.skill_id == skill_id,
        )
    )
    ss = result.scalar_one_or_none()
    if ss:
        ss.self_rating = body.self_rating
    else:
        ss = StudentSkill(
            student_id=profile.id,
            skill_id=skill_id,
            self_rating=body.self_rating,
        )
        db.add(ss)

    await db.commit()
    await db.refresh(ss)

    # Re-fetch with eager-loaded skill for the response
    result2 = await db.execute(
        select(StudentSkill)
        .options(selectinload(StudentSkill.skill))
        .where(StudentSkill.id == ss.id)
    )
    return StudentSkillOut.model_validate(result2.scalar_one())


@router.delete("/mine/{skill_id}", status_code=204)
async def delete_my_skill(
    skill_id: uuid.UUID,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Remove a student skill self-declaration."""
    result = await db.execute(
        select(StudentSkill).where(
            StudentSkill.student_id == profile.id,
            StudentSkill.skill_id == skill_id,
        )
    )
    ss = result.scalar_one_or_none()
    if not ss:
        raise HTTPException(status_code=404, detail="Student skill not found")
    await db.delete(ss)
    await db.commit()
