"""
Database setup — supports both SQLite (local dev, no install needed) and
PostgreSQL (staging / production).

Switch by setting DATABASE_URL in .env:
  SQLite  → sqlite+aiosqlite:///./dev.db
  PgSQL   → postgresql+asyncpg://user:pass@host/db
"""
import uuid as _uuid
from sqlalchemy import String, types
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import DeclarativeBase
from app.config import settings


class UUIDString(types.TypeDecorator):
    """
    Cross-database UUID column:
      - PostgreSQL: stores as native UUID
      - SQLite: stores as VARCHAR(36) string, auto-converts to/from uuid.UUID
    """
    impl = String(36)
    cache_ok = True

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, _uuid.UUID):
            return str(value)
        return str(value)

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        if isinstance(value, _uuid.UUID):
            return value
        try:
            return _uuid.UUID(value)
        except (ValueError, AttributeError):
            return value


def use_uuid_type():
    """
    Return the right column type for UUIDs.
    Always returns UUIDString — works on both SQLite and PostgreSQL.
    """
    return UUIDString()


# Engine — pool args differ for SQLite (no pool_size / max_overflow)
_sqlite = settings.database_url.startswith("sqlite")
_engine_kwargs: dict = dict(echo=settings.debug)
if not _sqlite:
    _engine_kwargs.update(pool_pre_ping=True, pool_size=10, max_overflow=20)
else:
    _engine_kwargs["connect_args"] = {"check_same_thread": False}

engine = create_async_engine(settings.database_url, **_engine_kwargs)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()


async def create_all_tables():
    """Create all tables — used in dev/test only. Production uses Alembic."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
