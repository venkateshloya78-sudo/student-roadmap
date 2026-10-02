"""
Resource model — external learning resources (courses, articles, videos, books).
Linked to skills; surfaced in roadmap items.
"""
import uuid
from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Numeric, SmallInteger, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base, use_uuid_type
import enum


class ResourceType(str, enum.Enum):
    course = "course"
    article = "article"
    video = "video"
    book = "book"
    tutorial = "tutorial"
    documentation = "documentation"
    project = "project"
    other = "other"


class ResourceProvider(str, enum.Enum):
    coursera = "coursera"
    udemy = "udemy"
    nptel = "nptel"
    youtube = "youtube"
    swayam = "swayam"
    mit_ocw = "mit_ocw"
    geeksforgeeks = "geeksforgeeks"
    leetcode = "leetcode"
    other = "other"


class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[uuid.UUID] = mapped_column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    title: Mapped[str] = mapped_column(String, nullable=False)
    url: Mapped[str] = mapped_column(String, nullable=False)
    type: Mapped[ResourceType] = mapped_column(Enum(ResourceType, name="resource_type"))
    provider: Mapped[ResourceProvider | None] = mapped_column(
        Enum(ResourceProvider, name="resource_provider_type"), nullable=True
    )
    skill_id: Mapped[uuid.UUID | None] = mapped_column(
        use_uuid_type(), ForeignKey("skills.id", ondelete="SET NULL"), nullable=True, index=True
    )
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    duration_hours: Mapped[float | None] = mapped_column(Numeric(5, 1), nullable=True)
    difficulty_level: Mapped[str | None] = mapped_column(String, nullable=True)
    is_free: Mapped[bool] = mapped_column(default=True)
    language: Mapped[str] = mapped_column(String, default="en")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    skill: Mapped["Skill"] = relationship()  # noqa: F821


from app.models.skill import Skill  # noqa: E402, F811
