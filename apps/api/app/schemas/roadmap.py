from typing import List, Optional
from uuid import UUID
from datetime import datetime
from pydantic import BaseModel

class RoadmapGenerateIn(BaseModel):
    career_role_slug: str
    weekly_hours: int = 10

class RoadmapItemOut(BaseModel):
    id: UUID
    type: str
    reference_id: UUID | None
    title: str
    description: str | None
    estimated_hours: int | None
    order_index: int
    status: str

    model_config = {"from_attributes": True}

class RoadmapPhaseOut(BaseModel):
    id: UUID
    phase_number: int
    title: str
    description: str | None
    estimated_hours: int | None
    status: str
    items: List[RoadmapItemOut] = []

    model_config = {"from_attributes": True}

class RoadmapOut(BaseModel):
    id: UUID
    student_id: UUID
    career_role_id: UUID
    version: int
    status: str
    weekly_hours_committed: int | None
    phases: List[RoadmapPhaseOut] = []

    model_config = {"from_attributes": True}
