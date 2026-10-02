from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel

class ProfileUpdate(BaseModel):
    degree: Optional[str] = None
    branch: Optional[str] = None
    university: Optional[str] = None
    year: Optional[int] = None
    semester: Optional[int] = None
    graduation_year: Optional[int] = None
    location_city: Optional[str] = None
    location_state: Optional[str] = None
    weekly_learning_hours: Optional[int] = None
    career_goal_text: Optional[str] = None
    learning_style: Optional[str] = None

class ProfileOut(BaseModel):
    id: UUID
    user_id: UUID
    degree: str | None
    branch: str | None
    university: str | None
    year: int | None
    semester: int | None
    graduation_year: int | None
    location_city: str | None
    location_state: str | None
    weekly_learning_hours: int | None
    career_goal_text: str | None
    learning_style: str | None

    model_config = {"from_attributes": True}

class StudentSkillIn(BaseModel):
    skill_slug: str
    self_rating: int
    confidence: str

class StudentSkillOut(BaseModel):
    skill_slug: str
    self_rating: int | None
    confidence: str | None
    competency_score: float | None

    model_config = {"from_attributes": True}
