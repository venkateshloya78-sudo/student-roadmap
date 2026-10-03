"""
Resources API — fetch individual resources by ID with navigation context.
"""
import re
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.resource import Resource
from app.models.skill import Skill

router = APIRouter(prefix="/resources", tags=["resources"])


def extract_youtube_id(url: str) -> str | None:
    """Extract YouTube video ID or playlist ID from URL."""
    if not url:
        return None
    for pat in [
        r'youtube\.com/watch\?v=([a-zA-Z0-9_-]{11})',
        r'youtu\.be/([a-zA-Z0-9_-]{11})',
        r'youtube\.com/embed/([a-zA-Z0-9_-]{11})',
    ]:
        m = re.search(pat, url)
        if m:
            return m.group(1)
    # Playlist
    m = re.search(r'[?&]list=([a-zA-Z0-9_-]+)', url)
    if m and 'youtube' in url:
        return f"playlist:{m.group(1)}"
    return None


def to_content_key(title: str) -> str:
    """Convert resource title to deterministic content lookup key (ASCII slug)."""
    # Strip non-ASCII first so em-dashes/special chars don't corrupt the key
    s = title.encode('ascii', errors='ignore').decode('ascii')
    s = s.lower()
    s = re.sub(r'[^\w\s]', '', s)
    s = re.sub(r'\s+', '-', s.strip())
    s = re.sub(r'-+', '-', s)
    return s[:80].rstrip('-')


@router.get("/{resource_id}")
async def get_resource(resource_id: str, db: AsyncSession = Depends(get_db)):
    """
    Return a single resource with:
    - youtube_id extracted from URL (for in-app video embedding)
    - content_key for in-built content lookup in frontend
    - prev/next navigation within the same skill's resources
    """
    res = await db.execute(
        select(Resource, Skill)
        .join(Skill, Resource.skill_id == Skill.id, isouter=True)
        .where(Resource.id == resource_id)
    )
    row = res.first()
    if not row:
        raise HTTPException(status_code=404, detail="Resource not found")

    resource, skill = row

    # Sibling resources for prev/next navigation
    siblings_res = await db.execute(
        select(Resource)
        .where(Resource.skill_id == resource.skill_id)
        .order_by(Resource.created_at)
    )
    siblings = siblings_res.scalars().all()
    sibling_ids = [str(s.id) for s in siblings]

    try:
        idx = sibling_ids.index(str(resource.id))
    except ValueError:
        idx = 0

    yt = extract_youtube_id(resource.url)
    rtype = resource.type.value if hasattr(resource.type, "value") else str(resource.type)

    return {
        "id": str(resource.id),
        "title": resource.title,
        "url": resource.url,
        "type": rtype,
        "is_free": bool(resource.is_free),
        "youtube_id": yt,
        "content_key": to_content_key(resource.title),
        "skill": {
            "name": skill.name,
            "slug": skill.slug,
        } if skill else None,
        "navigation": {
            "prev_id": sibling_ids[idx - 1] if idx > 0 else None,
            "next_id": sibling_ids[idx + 1] if idx < len(sibling_ids) - 1 else None,
            "current": idx + 1,
            "total": len(sibling_ids),
        },
    }
