import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum as PgEnum, ForeignKey, SmallInteger, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
import enum


class RoadmapStatus(str, enum.Enum):
    draft = "draft"
    active = "active"
    archived = "archived"


class PhaseStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"


class ItemType(str, enum.Enum):
    skill = "skill"
    resource = "resource"
    project = "project"
    assessment = "assessment"
    milestone = "milestone"


class ItemStatus(str, enum.Enum):
    not_started = "not_started"
    in_progress = "in_progress"
    completed = "completed"
    verified = "verified"


class Roadmap(Base):
    __tablename__ = "roadmaps"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), index=True
    )
    career_role_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("career_roles.id", ondelete="RESTRICT"), index=True
    )
    version: Mapped[int] = mapped_column(SmallInteger, default=1)
    status: Mapped[RoadmapStatus] = mapped_column(
        PgEnum(RoadmapStatus, name="roadmap_status_type"), default=RoadmapStatus.draft
    )
    trigger_event: Mapped[str | None] = mapped_column(String, nullable=True)
    weekly_hours_committed: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    target_completion_date: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    generated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    student: Mapped["StudentProfile"] = relationship(back_populates="roadmaps")  # noqa: F821
    career_role: Mapped["CareerRole"] = relationship(back_populates="roadmaps")  # noqa: F821
    phases: Mapped[list["RoadmapPhase"]] = relationship(
        back_populates="roadmap", order_by="RoadmapPhase.phase_number"
    )


class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    roadmap_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roadmaps.id", ondelete="CASCADE"), index=True
    )
    phase_number: Mapped[int] = mapped_column(SmallInteger, nullable=False)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    estimated_hours: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    status: Mapped[PhaseStatus] = mapped_column(
        PgEnum(PhaseStatus, name="phase_status_type"), default=PhaseStatus.not_started
    )
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    roadmap: Mapped[Roadmap] = relationship(back_populates="phases")
    items: Mapped[list["RoadmapItem"]] = relationship(
        back_populates="phase", order_by="RoadmapItem.order_index"
    )


class RoadmapItem(Base):
    __tablename__ = "roadmap_items"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    phase_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roadmap_phases.id", ondelete="CASCADE"), index=True
    )
    type: Mapped[ItemType] = mapped_column(PgEnum(ItemType, name="item_type"), nullable=False)
    reference_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), nullable=True)
    title: Mapped[str] = mapped_column(String, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    estimated_hours: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    order_index: Mapped[int] = mapped_column(SmallInteger, default=0)
    status: Mapped[ItemStatus] = mapped_column(
        PgEnum(ItemStatus, name="item_status_type"), default=ItemStatus.not_started
    )
    ai_explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    phase: Mapped[RoadmapPhase] = relationship(back_populates="items")
    progress: Mapped[list["StudentProgress"]] = relationship(back_populates="roadmap_item")


class StudentProgress(Base):
    __tablename__ = "student_progress"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("student_profiles.id", ondelete="CASCADE"), index=True
    )
    roadmap_item_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("roadmap_items.id", ondelete="CASCADE"), index=True
    )
    status: Mapped[ItemStatus] = mapped_column(
        PgEnum(ItemStatus, name="item_status_type2"), default=ItemStatus.not_started
    )
    completion_percentage: Mapped[int] = mapped_column(SmallInteger, default=0)
    started_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    roadmap_item: Mapped[RoadmapItem] = relationship(back_populates="progress")


# Late imports to close circular references
from app.models.profile import StudentProfile  # noqa: E402, F811
from app.models.career import CareerRole  # noqa: E402, F811
