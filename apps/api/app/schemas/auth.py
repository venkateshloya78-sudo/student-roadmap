from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, EmailStr


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class UserOut(BaseModel):
    id: UUID
    email: str
    role: str
    is_active: bool
    email_verified_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


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
    location_country: str
    weekly_learning_hours: int | None
    career_goal_text: str | None
    learning_style: str | None
    profile_completed_at: datetime | None
    created_at: datetime

    model_config = {"from_attributes": True}


class MeResponse(BaseModel):
    user: UserOut
    profile: ProfileOut | None
