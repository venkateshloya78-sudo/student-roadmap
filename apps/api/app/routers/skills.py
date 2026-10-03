import json
import math
from pathlib import Path
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.skill import Skill, SkillDependency
from app.models.resource import Resource
from app.schemas.skill import PaginatedSkills, SkillOut, SkillDetailOut, SkillBase

router = APIRouter(prefix="/skills", tags=["skills"])

# Load curriculum topics once at startup
_TOPICS_FILE = Path(__file__).parent.parent.parent.parent.parent / "data" / "seeds" / "06-skill-topics.json"
try:
    _TOPICS: dict = json.loads(_TOPICS_FILE.read_text(encoding="utf-8")).get("topics", {})
except Exception:
    _TOPICS = {}




@router.get("", response_model=PaginatedSkills)
async def list_skills(
    page: int = Query(1, ge=1),
    size: int = Query(50, ge=1, le=200),
    category: Optional[str] = Query(None),
    difficulty: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db),
):
    q = select(Skill)
    if category:
        q = q.where(Skill.category == category)
    if difficulty:
        q = q.where(Skill.difficulty == difficulty)
    total = (await db.execute(select(func.count()).select_from(q.subquery()))).scalar_one()
    skills = (await db.execute(q.offset((page - 1) * size).limit(size))).scalars().all()
    return PaginatedSkills(
        items=[SkillOut.model_validate(s) for s in skills],
        total=total, page=page, size=size,
        pages=math.ceil(total / size) if total else 1,
    )


@router.get("/{slug}/topics")
async def get_skill_topics(slug: str, db: AsyncSession = Depends(get_db)):
    """Return the week-by-week curriculum for a skill."""
    result = await db.execute(select(Skill).where(Skill.slug == slug))
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    topic_data = _TOPICS.get(slug, {})
    return {
        "skill": {"name": skill.name, "slug": skill.slug, "difficulty": str(skill.difficulty.value if hasattr(skill.difficulty, "value") else skill.difficulty)},
        "description": topic_data.get("description", skill.description or f"Learn {skill.name} — a key skill for your career."),
        "curriculum": topic_data.get("curriculum", []),
        "has_full_curriculum": slug in _TOPICS,
    }


@router.get("/{slug}/resources")

async def get_skill_resources(slug: str, db: AsyncSession = Depends(get_db)):
    """Return all free learning resources for a skill (Wikipedia, courses, PDFs)."""
    skill_res = await db.execute(select(Skill).where(Skill.slug == slug))
    skill = skill_res.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    res = await db.execute(
        select(Resource).where(Resource.skill_id == str(skill.id)).order_by(Resource.type)
    )
    resources = res.scalars().all()

    type_icon = {
        "documentation": "📖",
        "video": "🎬",
        "course": "🎓",
        "book": "📚",
        "tutorial": "🛠️",
        "other": "🔗",
    }

    return {
        "skill": {"name": skill.name, "slug": skill.slug},
        "resources": [
            {
                "id": str(r.id),
                "title": r.title,
                "url": r.url,
                "type": r.type.value if hasattr(r.type, "value") else str(r.type),
                "icon": type_icon.get(
                    r.type.value if hasattr(r.type, "value") else str(r.type), "🔗"
                ),
                "is_free": bool(r.is_free),
            }
            for r in resources
        ],
    }


@router.get("/{slug}", response_model=SkillDetailOut)
async def get_skill(slug: str, db: AsyncSession = Depends(get_db)):
    """Single skill with prerequisite dependency graph."""
    result = await db.execute(select(Skill).where(Skill.slug == slug))
    skill = result.scalar_one_or_none()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    pre_q = (
        select(Skill)
        .join(SkillDependency, SkillDependency.prerequisite_skill_id == Skill.id)
        .where(SkillDependency.skill_id == skill.id)
    )
    prereqs = (await db.execute(pre_q)).scalars().all()

    for_q = (
        select(Skill)
        .join(SkillDependency, SkillDependency.skill_id == Skill.id)
        .where(SkillDependency.prerequisite_skill_id == skill.id)
    )
    prereq_for = (await db.execute(for_q)).scalars().all()

    detail = SkillDetailOut.model_validate(skill)
    detail.prerequisites = [SkillBase.model_validate(p) for p in prereqs]
    detail.prerequisite_for = [SkillBase.model_validate(p) for p in prereq_for]
    return detail
