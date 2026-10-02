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
