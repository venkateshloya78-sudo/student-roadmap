import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as PgEnum, ForeignKey, SmallInteger, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
import enum


class Degree(str, enum.Enum):
    btech = "btech"
    bsc = "bsc"
    bcom = "bcom"
    ba = "ba"
    mtech = "mtech"
    msc = "msc"
    other = "other"


class LearningStyle(str, enum.Enum):
    visual = "visual"
    reading = "reading"
    hands_on = "hands_on"
    video = "video"
    mixed = "mixed"


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True
    )
    degree: Mapped[Degree | None] = mapped_column(
        PgEnum(Degree, name="degree_type"), nullable=True
    )
    branch: Mapped[str | None] = mapped_column(String, nullable=True)
    university: Mapped[str | None] = mapped_column(String, nullable=True)
    year: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    semester: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    graduation_year: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    location_city: Mapped[str | None] = mapped_column(String, nullable=True)
    location_state: Mapped[str | None] = mapped_column(String, nullable=True)
    location_country: Mapped[str] = mapped_column(String, default="India")
    weekly_learning_hours: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    career_goal_text: Mapped[str | None] = mapped_column(Text, nullable=True)
    learning_style: Mapped[LearningStyle | None] = mapped_column(
        PgEnum(LearningStyle, name="learning_style_type"), nullable=True
    )
    profile_completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user: Mapped["User"] = relationship(back_populates="profile")  # noqa: F821
    roadmaps: Mapped[list["Roadmap"]] = relationship(back_populates="student")  # noqa: F821
