from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class SkillOut(BaseModel):
    id: UUID
    name: str
    slug: str
    category: str
    description: str | None
    difficulty: str
    status: str

    model_config = {"from_attributes": True}


class PaginatedSkills(BaseModel):
    items: List[SkillOut]
    total: int
    page: int
    size: int
    pages: int


class StudentSkillOut(BaseModel):
    id: UUID
    skill_id: UUID
    skill: SkillOut
    self_rating: int | None
    assessment_rating: float | None
    evidence_rating: float | None
    competency_score: float | None
    confidence: str
    source: str
    last_verified_at: datetime | None

    model_config = {"from_attributes": True}


class UpsertSkillRequest(BaseModel):
    """Body for PUT /skills/mine/{skill_id}. self_rating is 0–10."""
    self_rating: int
