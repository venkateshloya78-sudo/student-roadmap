"""
Seed the local SQLite (or PostgreSQL) database with curated career, skill,
and dependency data from data/seeds/*.json.

Run from apps/api/:
    python scripts/seed_db.py
"""
import asyncio
import json
import sys
import uuid
from pathlib import Path
from decimal import Decimal

sys.path.insert(0, str(Path(__file__).parent.parent))

from sqlalchemy import select, text
from app.database import AsyncSessionLocal, create_all_tables
from app.models.career import Industry, CareerPath, CareerRole, CareerRoleSkill
from app.models.skill import Skill, SkillDependency

SEEDS = Path(__file__).parent.parent.parent.parent / "data" / "seeds"


def _id() -> str:
    return str(uuid.uuid4())


async def add(db, obj):
    """Add a single object, flush, and return it — avoids bulk-insert sentinel mismatch."""
    db.add(obj)
    await db.flush([obj])
    return obj


async def seed():
    await create_all_tables()

    async with AsyncSessionLocal() as db:
        # ── Already seeded? ───────────────────────────────────────────────────
        existing = (await db.execute(select(Skill))).scalars().all()
        if existing:
            print(f"Already seeded ({len(existing)} skills). Skipping.")
            return

        print("Seeding database...")

        # ── 1. Industry ───────────────────────────────────────────────────────
        ind = await add(db, Industry(
            id=_id(), name="Technology", slug="technology",
            description="Software, data, AI/ML, cloud, and digital roles",
        ))
        print(f"  [OK] Industry: {ind.name}")

        # ── 2. Career Paths (one per unique career_path slug in seed) ─────────
        careers_raw = json.loads((SEEDS / "01-careers.json").read_text())["careers"]
        path_slugs = {c.get("career_path", "technology-careers") for c in careers_raw}
        path_map: dict[str, str] = {}

        for slug in path_slugs:
            title = " ".join(w.capitalize() for w in slug.split("-"))
            cp = await add(db, CareerPath(
                id=_id(), name=title, slug=slug,
                description=f"{title} career cluster",
                industry_id=str(ind.id), status="active",
            ))
            path_map[slug] = str(cp.id)
        print(f"  [OK] Career paths: {len(path_map)}")

        # ── 3. Skills ─────────────────────────────────────────────────────────
        skills_raw = json.loads((SEEDS / "02-skills.json").read_text())["skills"]
        skill_map: dict[str, str] = {}

        for s in skills_raw:
            obj = await add(db, Skill(
                id=_id(), name=s["name"], slug=s["slug"],
                category=s["category"],
                description=s.get("description"),
                difficulty=s["difficulty"],
                status="active",
            ))
            skill_map[s["slug"]] = str(obj.id)
        print(f"  [OK] Skills: {len(skill_map)}")

        # ── 4. Skill Dependencies ─────────────────────────────────────────────
        deps_raw = json.loads((SEEDS / "03-skill-dependencies.json").read_text())["dependencies"]
        loaded, skipped = 0, 0
        for d in deps_raw:
            sid = skill_map.get(d["skill_slug"])
            pid = skill_map.get(d["prerequisite_slug"])
            if not sid or not pid:
                skipped += 1
                continue
            await add(db, SkillDependency(
                id=_id(), skill_id=sid, prerequisite_skill_id=pid,
                dependency_type=d.get("dependency_type", "required"),
                strength=Decimal(str(d.get("strength", 0.9))),
            ))
            loaded += 1
        print(f"  [OK] Skill dependencies: {loaded}/{len(deps_raw)}"
              + (f"  ({skipped} skipped - slug mismatch)" if skipped else ""))

        # ── 5. Career Roles ───────────────────────────────────────────────────
        role_map: dict[str, str] = {}
        fallback_path = list(path_map.values())[0]
        for c in careers_raw:
            path_id = path_map.get(c.get("career_path", ""), fallback_path)
            obj = await add(db, CareerRole(
                id=_id(), title=c["title"], slug=c["slug"],
                description=c.get("description"),
                career_path_id=path_id, industry_id=str(ind.id),
                education_requirements=c.get("education_requirements", {}),
                entry_level_experience_years=c.get("entry_level_experience_years", 0),
                seniority_level=c.get("seniority_level", "entry"),
                status=c.get("status", "active"),
            ))
            role_map[c["slug"]] = str(obj.id)
        print(f"  [OK] Career roles: {len(role_map)}")

        # ── 6. Career Role Skills ─────────────────────────────────────────────
        crs_raw = json.loads((SEEDS / "04-career-role-skills.json").read_text())["career_role_skills"]
        loaded_crs, skipped_crs = 0, 0
        for entry in crs_raw:
            role_id = role_map.get(entry["career_role_slug"])
            if not role_id:
                skipped_crs += 1
                continue
            for rs in entry.get("skills", []):
                sid = skill_map.get(rs["skill_slug"])
                if not sid:
                    skipped_crs += 1
                    continue
                await add(db, CareerRoleSkill(
                    id=_id(), career_role_id=role_id, skill_id=sid,
                    importance=Decimal(str(rs["importance"])),
                    required_level=rs.get("required_level", "beginner"),
                ))
                loaded_crs += 1

        await db.commit()
        print(f"  [OK] Career-role-skills: {loaded_crs}"
              + (f"  ({skipped_crs} skipped)" if skipped_crs else ""))
        print("\n[DONE] Seed complete!")


if __name__ == "__main__":
    asyncio.run(seed())
