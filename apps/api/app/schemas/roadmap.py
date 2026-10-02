from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class RoadmapItemOut(BaseModel):
    id: UUID
    phase_id: UUID
    type: str
    reference_id: UUID | None
    title: str
    description: str | None
    estimated_hours: int | None
    order_index: int
    status: str
    ai_explanation: str | None
    prerequisite_item_ids: List[UUID] = []

    model_config = {"from_attributes": True}


class RoadmapPhaseOut(BaseModel):
    id: UUID
    roadmap_id: UUID
    phase_number: int
    title: str
    description: str | None
    estimated_hours: int | None
    status: str
    items: List[RoadmapItemOut] = []

    model_config = {"from_attributes": True}


class CareerRoleMinimal(BaseModel):
    id: UUID
    title: str
    slug: str

    model_config = {"from_attributes": True}


class RoadmapOut(BaseModel):
    id: UUID
    student_id: UUID
    career_role_id: UUID
    career_role: CareerRoleMinimal | None
    version: int
    status: str
    weekly_hours_committed: int | None
    target_completion_date: datetime | None
    generated_at: datetime | None
    phases: List[RoadmapPhaseOut] = []
    created_at: datetime

    model_config = {"from_attributes": True}


class GenerateRoadmapRequest(BaseModel):
    career_role_id: UUID
    weekly_hours_committed: int = 10


class UpdateItemStatusRequest(BaseModel):
    status: str
