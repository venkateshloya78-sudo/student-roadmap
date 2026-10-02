import uuid
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.dependencies import get_current_profile
from app.models.profile import StudentProfile
from app.models.roadmap import ItemStatus, RoadmapItem, RoadmapPhase, Roadmap, StudentProgress
from app.schemas.progress import ProgressOut, UpdateProgressRequest

router = APIRouter(prefix="/progress", tags=["progress"])


async def _verify_item_access(
    db: AsyncSession,
    item_id: uuid.UUID,
    profile: StudentProfile,
) -> RoadmapItem:
    """
    Ensure the roadmap item exists and belongs to one of this student's roadmaps.
    Raises 404 if not found or not owned by the student.
    """
    result = await db.execute(
        select(RoadmapItem)
        .join(RoadmapPhase, RoadmapItem.phase_id == RoadmapPhase.id)
        .join(Roadmap, RoadmapPhase.roadmap_id == Roadmap.id)
        .where(RoadmapItem.id == item_id, Roadmap.student_id == profile.id)
    )
    item = result.scalar_one_or_none()
    if not item:
        raise HTTPException(status_code=404, detail="Roadmap item not found or access denied")
    return item


@router.get("/{item_id}", response_model=ProgressOut)
async def get_progress(
    item_id: uuid.UUID,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """Get the progress record for a specific roadmap item."""
    await _verify_item_access(db, item_id, profile)

    result = await db.execute(
        select(StudentProgress).where(
            StudentProgress.roadmap_item_id == item_id,
            StudentProgress.student_id == profile.id,
        )
    )
    progress = result.scalar_one_or_none()
    if not progress:
        raise HTTPException(status_code=404, detail="No progress record found for this item")
    return ProgressOut.model_validate(progress)


@router.patch("/{item_id}", response_model=ProgressOut)
async def update_progress(
    item_id: uuid.UUID,
    body: UpdateProgressRequest,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db),
):
    """
    Upsert the completion percentage for a roadmap item.
    Automatically sets started_at on first update and completed_at when 100%.
    """
    await _verify_item_access(db, item_id, profile)

    if not (0 <= body.completion_percentage <= 100):
        raise HTTPException(status_code=400, detail="completion_percentage must be 0–100")

    result = await db.execute(
        select(StudentProgress).where(
            StudentProgress.roadmap_item_id == item_id,
            StudentProgress.student_id == profile.id,
        )
    )
    progress = result.scalar_one_or_none()

    now = datetime.now(timezone.utc)

    if progress:
        if progress.started_at is None:
            progress.started_at = now
        progress.completion_percentage = body.completion_percentage
        if body.completion_percentage == 100:
            progress.status = ItemStatus.completed
            progress.completed_at = now
        elif body.completion_percentage > 0:
            progress.status = ItemStatus.in_progress
    else:
        progress = StudentProgress(
            student_id=profile.id,
            roadmap_item_id=item_id,
            completion_percentage=body.completion_percentage,
            status=ItemStatus.completed if body.completion_percentage == 100 else (
                ItemStatus.in_progress if body.completion_percentage > 0 else ItemStatus.not_started
            ),
            started_at=now if body.completion_percentage > 0 else None,
            completed_at=now if body.completion_percentage == 100 else None,
        )
        db.add(progress)

    await db.commit()
    await db.refresh(progress)
    return ProgressOut.model_validate(progress)
