import uuid

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_profile
from app.models.career import CareerRole
from app.models.profile import StudentProfile
from app.models.roadmap import ItemStatus, Roadmap, RoadmapItem, RoadmapPhase, RoadmapStatus
from app.schemas.roadmap import GenerateRoadmapRequest, RoadmapOut, UpdateItemStatusRequest
from app.services.roadmap_generator import generate_roadmap as _generate

router = APIRouter(prefix="/roadmaps", tags=["roadmaps"])


async def _load_full_roadmap(db: AsyncSession, roadmap_id: uuid.UUID) -> Roadmap | None:
    """Helper: fetch a roadmap with all nested phases and items eagerly loaded."""
    result = await db.execute(
        select(Roadmap)
        .options(
            selectinload(Roadmap.career_role),
            selectinload(Roadmap.phases).selectinload(RoadmapPhase.items),
        )
        .where(Roadmap.id == roadmap_id)
    )
    return result.scalar_one_or_none()


@router.get("/active", response_model=RoadmapOut)
async def get_active_roadmap(
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Return the student's current active roadmap with all phases and items."""
    result = await db.execute(
        select(Roadmap)
        .where(Roadmap.student_id == profile.id, Roadmap.status == RoadmapStatus.active)
        .order_by(Roadmap.created_at.desc())
        .limit(1)
    )
    roadmap = result.scalar_one_or_none()
    if not roadmap:
        raise HTTPException(status_code=404, detail="No active roadmap found. Generate one first.")
    full = await _load_full_roadmap(db, roadmap.id)
    return RoadmapOut.model_validate(full)


@router.post("/generate", response_model=RoadmapOut, status_code=201)
async def generate(
    body: GenerateRoadmapRequest,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """
    Generate a new prerequisite-ordered roadmap for the given career role.
    Any existing active roadmap is automatically archived.
    """
    # Verify the career role exists
    role_check = await db.execute(select(CareerRole).where(CareerRole.id == body.career_role_id))
    if not role_check.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Career role not found")

    roadmap = await _generate(
        db=db,
        student=profile,
        career_role_id=body.career_role_id,
        weekly_hours=body.weekly_hours_committed,
    )
    full = await _load_full_roadmap(db, roadmap.id)
    return RoadmapOut.model_validate(full)


@router.get("/{roadmap_id}", response_model=RoadmapOut)
async def get_roadmap(
    roadmap_id: uuid.UUID,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Fetch a specific roadmap by ID (must belong to the authenticated student)."""
    full = await _load_full_roadmap(db, roadmap_id)
    if not full or full.student_id != profile.id:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    return RoadmapOut.model_validate(full)


@router.patch("/{roadmap_id}/items/{item_id}/status", response_model=dict)
async def update_item_status(
    roadmap_id: uuid.UUID,
    item_id: uuid.UUID,
    body: UpdateItemStatusRequest,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Update the completion status of a roadmap item."""
    # Verify the roadmap belongs to this student
    rm_result = await db.execute(
        select(Roadmap).where(Roadmap.id == roadmap_id, Roadmap.student_id == profile.id)
    )
    if not rm_result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Roadmap not found")

    # Fetch the item (verify it belongs to this roadmap via its phase)
    item_result = await db.execute(
        select(RoadmapItem)
        .join(RoadmapPhase, RoadmapItem.phase_id == RoadmapPhase.id)
        .where(RoadmapItem.id == item_id, RoadmapPhase.roadmap_id == roadmap_id)
    )
    item = item_result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found")

    try:
        item.status = ItemStatus(body.status)
    except ValueError:
        valid = [s.value for s in ItemStatus]
        raise HTTPException(status_code=400, detail=f"Invalid status '{body.status}'. Valid values: {valid}")

    await db.commit()
    return {"id": str(item.id), "status": item.status.value}
