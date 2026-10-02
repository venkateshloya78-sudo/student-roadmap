"""
Seed resources (learning materials) for all skills.
Run from apps/api/:
  python scripts/seed_resources.py
"""
import asyncio
import json
import sys
import uuid
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import text
from app.database import AsyncSessionLocal


SEEDS_DIR = Path(__file__).parent.parent.parent.parent / "data" / "seeds"


async def seed():
    data = json.loads((SEEDS_DIR / "05-resources.json").read_text())

    async with AsyncSessionLocal() as db:
        # Check if already seeded
        result = await db.execute(text("SELECT COUNT(*) FROM resources"))
        count = result.scalar()
        if count and count > 0:
            print(f"Resources already seeded ({count} rows). Skipping.")
            return

        seeded = 0
        skipped = 0

        for entry in data["resources"]:
            skill_slug = entry["skill_slug"]

            # Look up skill id
            row = await db.execute(
                text("SELECT id FROM skills WHERE slug = :slug"),
                {"slug": skill_slug}
            )
            skill_row = row.fetchone()
            if not skill_row:
                print(f"  WARN: skill '{skill_slug}' not found, skipping")
                skipped += 1
                continue

            skill_id = skill_row[0]

            for item in entry["items"]:
                # Determine type — map to valid enum values
                rtype_map = {
                    "video": "video",
                    "course": "course",
                    "documentation": "documentation",
                    "book": "book",
                    "practice": "tutorial",
                }
                rtype = rtype_map.get(item.get("type", "other"), "other")
                is_free = item.get("cost", "free") == "free"
                rid = str(uuid.uuid4())

                await db.execute(
                    text("""
                        INSERT INTO resources (id, title, url, type, provider, skill_id, is_free, language, created_at, updated_at)
                        VALUES (:id, :title, :url, :type, :provider, :skill_id, :is_free, 'en', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
                    """),
                    {
                        "id": rid,
                        "title": item["title"],
                        "url": item["url"],
                        "type": rtype,
                        "provider": None,  # skip enum, store in title
                        "skill_id": skill_id,
                        "is_free": 1 if is_free else 0,
                    }
                )
                seeded += 1

        await db.commit()
        print(f"✅ Seeded {seeded} resources for {len(data['resources'])} skills. Skipped {skipped}.")


if __name__ == "__main__":
    asyncio.run(seed())
