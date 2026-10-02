import math
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.models.career import CareerRole, CareerRoleSkill
from app.schemas.career import CareerRoleOut, PaginatedCareerRoles

router = APIRouter(prefix="/careers", tags=["careers"])


@router.get("", response_model=PaginatedCareerRoles)
async def list_careers(
    page: int = Query(1, ge=1, description="Page number (1-indexed)"),
    size: int = Query(20, ge=1, le=100, description="Items per page"),
    search: Optional[str] = Query(None, description="Filter by title (case-insensitive)"),
    industry: Optional[str] = Query(None, description="Filter by industry slug"),
    db: AsyncSession = Depends(get_db),
):
    """List career roles with optional search and industry filter, paginated."""
    q = (
        select(CareerRole)
        .options(
            selectinload(CareerRole.industry),
            selectinload(CareerRole.required_skills).selectinload(CareerRoleSkill.skill),
        )
        .where(CareerRole.status == "active")
    )
    if search:
        q = q.where(CareerRole.title.ilike(f"%{search}%"))
    if industry:
        from app.models.career import Industry
        q = q.join(CareerRole.industry).where(Industry.slug == industry)

    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    roles = (await db.execute(q.offset((page - 1) * size).limit(size))).scalars().all()

    return PaginatedCareerRoles(
        items=[CareerRoleOut.model_validate(r) for r in roles],
        total=total,
        page=page,
        size=size,
        pages=math.ceil(total / size) if total else 1,
    )


@router.get("/{slug}", response_model=CareerRoleOut)
async def get_career(slug: str, db: AsyncSession = Depends(get_db)):
    """Get a single career role by slug including all required skills."""
    result = await db.execute(
        select(CareerRole)
        .options(
            selectinload(CareerRole.industry),
            selectinload(CareerRole.required_skills).selectinload(CareerRoleSkill.skill),
        )
        .where(CareerRole.slug == slug)
    )
    role = result.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Career role not found")
    return CareerRoleOut.model_validate(role)

from app.models.skill import StudentSkill
from app.models.profile import StudentProfile
from app.schemas.career import SkillGapOut
from app.dependencies import get_current_user
from app.models.user import User

@router.get("/{slug}/skill-gap", response_model=SkillGapOut)
async def skill_gap(
    slug: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Compute skill gap between the logged-in student and a target career role."""
    # 1. Get student profile id
    profile_res = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == str(current_user.id))
    )
    profile = profile_res.scalar_one_or_none()

    # 2. Get CareerRole
    role_res = await db.execute(
        select(CareerRole)
        .options(selectinload(CareerRole.required_skills).selectinload(CareerRoleSkill.skill))
        .where(CareerRole.slug == slug)
    )
    role = role_res.scalar_one_or_none()
    if not role:
        raise HTTPException(status_code=404, detail="Career role not found")

    # 3. Get student's declared skills (empty dict if no profile yet)
    student_skills: dict = {}
    if profile:
        ss_res = await db.execute(
            select(StudentSkill).where(StudentSkill.student_id == str(profile.id))
        )
        student_skills = {str(ss.skill_id): ss for ss in ss_res.scalars().all()}

    # 4. Compute gaps
    gaps = []
    total_importance = 0.0
    total_competency = 0.0

    for crs in role.required_skills:
        req_importance = float(crs.importance)
        total_importance += req_importance

        ss = student_skills.get(str(crs.skill_id))
        student_competency = ss.competency_score if ss else 0.0
        total_competency += student_competency * req_importance

        gap = max(0.0, req_importance - student_competency)
        priority_score = gap * req_importance

        gaps.append({
            "skill": crs.skill,
            "required_importance": req_importance,
            "student_competency": student_competency,
            "gap": gap,
            "priority_score": priority_score,
            "required_level": crs.required_level,
        })

    gaps.sort(key=lambda x: x["priority_score"], reverse=True)
    overall_readiness = total_competency / total_importance if total_importance > 0 else 0.0

    return {
        "career_role": {"title": role.title, "slug": role.slug},
        "overall_readiness": overall_readiness,
        "gaps": gaps,
    }
