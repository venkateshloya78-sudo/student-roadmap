# app/models/__init__.py
# Import all models here so that Alembic autogenerate can discover them.

from app.models.user import User  # noqa: F401
from app.models.profile import StudentProfile  # noqa: F401
from app.models.skill import Skill, StudentSkill  # noqa: F401
from app.models.career import Industry, CareerPath, CareerRole, CareerRoleSkill  # noqa: F401
from app.models.resource import Resource  # noqa: F401
from app.models.roadmap import Roadmap, RoadmapPhase, RoadmapItem, StudentProgress  # noqa: F401
