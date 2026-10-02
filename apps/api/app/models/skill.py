import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    Boolean, DateTime, Enum as PgEnum, ForeignKey, Numeric,
    SmallInteger, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
import enum


class SkillCategory(str, enum.Enum):
    technical = "technical"
    soft = "soft"
    domain = "domain"
    tool = "tool"


class Difficulty(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"
    expert = "expert"


class SkillStatus(str, enum.Enum):
    active = "active"
    deprecated = "deprecated"


class SkillSource(str, enum.Enum):
    self_declared = "self_declared"
    assessment = "assessment"
    ai_inferred = "ai_inferred"
    imported = "imported"


class SkillConfidence(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


class Skill(Base):
    __tablename__ = "skills"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    category: Mapped[SkillCategory] = mapped_column(PgEnum(SkillCategory, name="skill_category_type"))
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    difficulty: Mapped[Difficulty] = mapped_column(
        PgEnum(Difficulty, name="difficulty_type"), default=Difficulty.beginner
    )
    status: Mapped[SkillStatus] = mapped_column(
        PgEnum(SkillStatus, name="skill_status_type"), default=SkillStatus.active
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    student_skills: Mapped[list["StudentSkill"]] = relationship(back_populates="skill")


class StudentSkill(Base):
    __tablename__ = "student_skills"
    __table_args__ = (UniqueConstraint("student_id", "skill_id"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), index=True
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), index=True
    )
    self_rating: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    assessment_rating: Mapped[Decimal | None] = mapped_column(Numeric(3, 2), nullable=True)
    evidence_rating: Mapped[Decimal | None] = mapped_column(Numeric(3, 2), nullable=True)
    confidence: Mapped[SkillConfidence] = mapped_column(
        PgEnum(SkillConfidence, name="confidence_type"), default=SkillConfidence.low
    )
    source: Mapped[SkillSource] = mapped_column(
        PgEnum(SkillSource, name="skill_source_type"), default=SkillSource.self_declared
    )
    last_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    skill: Mapped[Skill] = relationship(back_populates="student_skills")

    @property
    def competency_score(self) -> float:
        """
        Weighted competency:
          self-rating  (0–10)  → 20%
          assessment   (0–1)   → 40%
          evidence     (0–1)   → 40%
        """
        self_comp = (0.20 * (self.self_rating or 0)) / 10.0
        assess_comp = 0.40 * float(self.assessment_rating or 0)
        evidence_comp = 0.40 * float(self.evidence_rating or 0)
        return round(self_comp + assess_comp + evidence_comp, 2)
