"""
StudentRoadmap AI — FastAPI application entry point.

Start with:
    uvicorn main:app --reload --host 0.0.0.0 --port 8000
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import create_all_tables
from app.routers import auth, careers, skills, roadmaps, progress, profile

@asynccontextmanager
async def lifespan(app: FastAPI):
    # On startup: auto-create tables in dev/sqlite mode
    if settings.database_url.startswith("sqlite") or settings.debug:
        await create_all_tables()
    yield

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description=(
        "REST API for StudentRoadmap AI — an evidence-grounded personalized "
        "career and skill-building roadmap platform for undergraduate students."
    ),
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
    lifespan=lifespan,
)

# ── CORS ────────────────────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────────────────────
API_PREFIX = "/api/v1"

app.include_router(auth.router, prefix=API_PREFIX)
app.include_router(careers.router, prefix=API_PREFIX)
app.include_router(skills.router, prefix=API_PREFIX)
app.include_router(roadmaps.router, prefix=API_PREFIX)
app.include_router(progress.router, prefix=API_PREFIX)
app.include_router(profile.router, prefix=API_PREFIX)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["health"])
async def health():
    return {
        "status": "ok",
        "app": settings.app_name,
        "db": "sqlite" if settings.database_url.startswith("sqlite") else "postgresql",
    }
