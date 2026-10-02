from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


class ProgressOut(BaseModel):
    id: UUID
    student_id: UUID
    roadmap_item_id: UUID
    status: str
    completion_percentage: int
    started_at: datetime | None
    completed_at: datetime | None

    model_config = {"from_attributes": True}


class UpdateProgressRequest(BaseModel):
    """Body for PATCH /progress/{item_id}. completion_percentage is 0–100."""
    completion_percentage: int
