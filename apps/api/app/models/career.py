import uuid
from datetime import datetime
from decimal import Decimal

from sqlalchemy import (
    DateTime, Enum as PgEnum, ForeignKey, JSON,
    Numeric, SmallInteger, String, Text, UniqueConstraint, func,
)
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
from app.models.skill import Difficulty, SkillStatus  # noqa: F401 — re-exported for convenience
import enum


class EntityStatus(str, enum.Enum):
    active = "active"
    draft = "draft"
    deprecated = "deprecated"


class SeniorityLevel(str, enum.Enum):
    entry = "entry"
    mid = "mid"
    senior = "senior"


class Industry(Base):
    __tablename__ = "industries"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    career_paths: Mapped[list["CareerPath"]] = relationship(back_populates="industry")
    career_roles: Mapped[list["CareerRole"]] = relationship(back_populates="industry")


class CareerPath(Base):
    __tablename__ = "career_paths"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    industry_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("industries.id", ondelete="RESTRICT"), index=True
    )
    parent_path_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("career_paths.id", ondelete="SET NULL"), nullable=True
    )
    status: Mapped[EntityStatus] = mapped_column(
        PgEnum(EntityStatus, name="entity_status_type"), default=EntityStatus.active
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    industry: Mapped[Industry] = relationship(back_populates="career_paths")
    roles: Mapped[list["CareerRole"]] = relationship(back_populates="career_path")


class CareerRole(Base):
    __tablename__ = "career_roles"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, nullable=False)
    slug: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    career_path_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("career_paths.id", ondelete="RESTRICT"), index=True
    )
    industry_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("industries.id", ondelete="RESTRICT"), index=True
    )
    education_requirements: Mapped[dict] = mapped_column(JSON, default=dict)
    entry_level_experience_years: Mapped[int] = mapped_column(SmallInteger, default=0)
    seniority_level: Mapped[SeniorityLevel] = mapped_column(
        PgEnum(SeniorityLevel, name="seniority_type"), default=SeniorityLevel.entry
    )
    status: Mapped[EntityStatus] = mapped_column(
        PgEnum(EntityStatus, name="entity_status_type2"), default=EntityStatus.active
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    career_path: Mapped[CareerPath] = relationship(back_populates="roles")
    industry: Mapped[Industry] = relationship(back_populates="career_roles")
    required_skills: Mapped[list["CareerRoleSkill"]] = relationship(back_populates="career_role")
    roadmaps: Mapped[list["Roadmap"]] = relationship(back_populates="career_role")  # noqa: F821


class CareerRoleSkill(Base):
    __tablename__ = "career_role_skills"
    __table_args__ = (UniqueConstraint("career_role_id", "skill_id"),)

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    career_role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("career_roles.id", ondelete="CASCADE"), index=True
    )
    skill_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("skills.id", ondelete="CASCADE"), index=True
    )
    importance: Mapped[Decimal] = mapped_column(Numeric(3, 2), nullable=False)
    required_level: Mapped[Difficulty] = mapped_column(
        PgEnum(Difficulty, name="difficulty_type2"), default=Difficulty.beginner
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    career_role: Mapped[CareerRole] = relationship(back_populates="required_skills")
    skill: Mapped["Skill"] = relationship()  # noqa: F821


# Late imports to avoid circular reference — only needed for type checking in ORM
from app.models.skill import Skill  # noqa: E402, F811
from app.models.roadmap import Roadmap  # noqa: E402, F811
