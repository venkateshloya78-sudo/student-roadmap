from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.dependencies import get_current_profile
from app.models.profile import StudentProfile
from app.models.skill import Skill, StudentSkill
from app.schemas.profile import ProfileOut, ProfileUpdate, StudentSkillIn, StudentSkillOut

router = APIRouter(prefix="/profile", tags=["profile"])

@router.get("", response_model=ProfileOut)
async def get_profile(profile: StudentProfile = Depends(get_current_profile)):
    return profile

@router.patch("", response_model=ProfileOut)
async def update_profile(
    body: ProfileUpdate,
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    update_data = body.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(profile, key, value)
    
    db.add(profile)
    await db.commit()
    await db.refresh(profile)
    return profile

@router.post("/skills")
async def declare_skills(
    skills_in: List[StudentSkillIn],
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    """Declare multiple student skills."""
    for s_in in skills_in:
        # get skill
        res = await db.execute(select(Skill).where(Skill.slug == s_in.skill_slug))
        skill = res.scalar_one_or_none()
        if not skill:
            raise HTTPException(status_code=404, detail=f"Skill {s_in.skill_slug} not found")
        
        # update or create
        ss_res = await db.execute(select(StudentSkill).where(StudentSkill.student_id == profile.id, StudentSkill.skill_id == skill.id))
        ss = ss_res.scalar_one_or_none()
        
        if ss:
            ss.self_rating = s_in.self_rating
            ss.confidence = s_in.confidence
        else:
            ss = StudentSkill(
                student_id=profile.id,
                skill_id=skill.id,
                self_rating=s_in.self_rating,
                confidence=s_in.confidence
            )
            db.add(ss)
            
    await db.commit()
    return {"message": "Skills declared successfully"}

@router.get("/skills")
async def list_student_skills(
    profile: StudentProfile = Depends(get_current_profile),
    db: AsyncSession = Depends(get_db)
):
    """List student's declared skills with competency_score."""
    result = await db.execute(
        select(StudentSkill)
        .options(selectinload(StudentSkill.skill))
        .where(StudentSkill.student_id == profile.id)
    )
    student_skills = result.scalars().all()
    
    out = []
    for ss in student_skills:
        out.append({
            "skill_slug": ss.skill.slug,
            "self_rating": ss.self_rating,
            "confidence": ss.confidence,
            "competency_score": ss.competency_score
        })
    return out
