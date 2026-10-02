from datetime import datetime
from typing import List, Optional
from uuid import UUID

from pydantic import BaseModel


class IndustryOut(BaseModel):
    id: UUID
    name: str
    slug: str
    description: str | None

    model_config = {"from_attributes": True}


class SkillOut(BaseModel):
    id: UUID
    name: str
    slug: str
    category: str
    description: str | None
    difficulty: str

    model_config = {"from_attributes": True}


class CareerRoleSkillOut(BaseModel):
    id: UUID
    skill: SkillOut
    importance: float
    required_level: str

    model_config = {"from_attributes": True}


class CareerRoleOut(BaseModel):
    id: UUID
    title: str
    slug: str
    description: str | None
    career_path_id: UUID
    industry_id: UUID
    industry: IndustryOut | None
    entry_level_experience_years: int
    seniority_level: str
    education_requirements: dict
    status: str
    required_skills: List[CareerRoleSkillOut] = []

    model_config = {"from_attributes": True}


class PaginatedCareerRoles(BaseModel):
    items: List[CareerRoleOut]
    total: int
    page: int
    size: int
    pages: int

class CareerRoleBase(BaseModel):
    title: str
    slug: str

class SkillGapItemOut(BaseModel):
    skill: SkillOut
    required_importance: float
    student_competency: float
    gap: float
    priority_score: float
    required_level: str

class SkillGapOut(BaseModel):
    career_role: CareerRoleBase
    overall_readiness: float
    gaps: List[SkillGapItemOut]

