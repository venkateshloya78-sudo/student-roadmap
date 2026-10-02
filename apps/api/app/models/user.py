import uuid
from datetime import datetime

from sqlalchemy import Boolean, DateTime, Enum as PgEnum, String, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base
import enum


class AuthProvider(str, enum.Enum):
    local = "local"
    google = "google"


class UserRole(str, enum.Enum):
    student = "student"
    admin = "admin"
    content_editor = "content_editor"
    market_analyst = "market_analyst"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    password_hash: Mapped[str | None] = mapped_column(String, nullable=True)
    auth_provider: Mapped[AuthProvider] = mapped_column(
        PgEnum(AuthProvider, name="auth_provider_type"), default=AuthProvider.local
    )
    auth_provider_id: Mapped[str | None] = mapped_column(String, nullable=True)
    role: Mapped[UserRole] = mapped_column(
        PgEnum(UserRole, name="user_role_type"), default=UserRole.student
    )
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    email_verified_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    last_login_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)

    # Lazy-loaded via back_populates; StudentProfile is declared in profile.py
    profile: Mapped["StudentProfile"] = relationship(back_populates="user", uselist=False)  # noqa: F821
