from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel, field_validator


class SkillBase(BaseModel):
    name: str
    slug: str

    model_config = {"from_attributes": True}


class SkillOut(BaseModel):
    id: str          # UUIDString returns str on SQLite
    name: str
    slug: str
    category: str
    difficulty: str
    description: str | None = None

    model_config = {"from_attributes": True}


class SkillDetailOut(SkillOut):
    prerequisites: List[SkillBase] = []
    prerequisite_for: List[SkillBase] = []


class PaginatedSkills(BaseModel):
    items: List[SkillOut]
    total: int
    page: int
    size: int
    pages: int
