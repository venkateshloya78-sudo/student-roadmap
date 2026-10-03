from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import decode_token
from app.database import get_db
from app.models.profile import StudentProfile
from app.models.roadmap import Roadmap, RoadmapPhase
from app.models.user import User
from app.schemas.assistant import (
    ChatRequest,
    ChatResponse,
    PersonaInfo,
    PromptSuggestion,
)
from app.services.assistant_service import assistant_service

router = APIRouter(prefix="/assistant", tags=["assistant"])
optional_bearer = HTTPBearer(auto_error=False)


async def get_optional_student_context(
    auth: Optional[HTTPAuthorizationCredentials] = Depends(optional_bearer),
    db: AsyncSession = Depends(get_db),
) -> Optional[dict]:
    """Extract student profile and roadmap context if auth token is present."""
    if not auth or not auth.credentials:
        return None

    user_id = decode_token(auth.credentials)
    if not user_id:
        return None

    try:
        # Load user and profile
        profile_res = await db.execute(
            select(StudentProfile)
            .options(
                selectinload(StudentProfile.target_career_role),
                selectinload(StudentProfile.student_skills),
            )
            .where(StudentProfile.user_id == user_id)
        )
        profile = profile_res.scalar_one_or_none()
        if not profile:
            return None

        # Load active roadmap
        roadmap_res = await db.execute(
            select(Roadmap)
            .options(selectinload(Roadmap.phases))
            .where(Roadmap.student_profile_id == profile.id)
            .order_by(Roadmap.created_at.desc())
        )
        roadmap = roadmap_res.scalars().first()

        context = {
            "name": profile.full_name or "Student",
            "target_career": (
                profile.target_career_role.title if profile.target_career_role else None
            ),
            "current_education": profile.current_education,
            "grad_year": profile.target_graduation_year,
            "skills": [s.skill.name for s in profile.student_skills if hasattr(s, "skill") and s.skill] if profile.student_skills else [],
            "roadmap_phases": [
                {"title": p.title, "status": p.status} for p in (roadmap.phases if roadmap else [])
            ],
        }
        return context
    except Exception:
        return None


@router.get("/personas", response_model=List[PersonaInfo])
async def list_personas():
    """List available AI Assistant personas and system specializations."""
    return await assistant_service.get_personas()


@router.get("/prompts", response_model=List[PromptSuggestion])
async def list_prompts():
    """List recommended prompt starters for students."""
    return await assistant_service.get_prompt_suggestions()


@router.post("/chat", response_model=ChatResponse)
async def chat(
    request: ChatRequest,
    student_ctx: Optional[dict] = Depends(get_optional_student_context),
):
    """Generate a standard (non-streaming) AI chat completion."""
    ctx = student_ctx if request.include_student_context else None
    content = await assistant_service.generate_chat(
        messages=request.messages,
        persona=request.persona or "mentor",
        model=request.model or "gemini-2.0-flash",
        student_context=ctx,
        api_key=request.api_key,
    )
    return ChatResponse(
        role="assistant",
        content=content,
        model=request.model or "gemini-2.0-flash",
        persona=request.persona or "mentor",
        created_at=datetime.now(timezone.utc).isoformat(),
    )


@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    student_ctx: Optional[dict] = Depends(get_optional_student_context),
):
    """
    Stream AI chat response word-by-word via Server-Sent Events (SSE).
    Works like ChatGPT and Google Gemini.
    """
    ctx = student_ctx if request.include_student_context else None
    generator = assistant_service.stream_chat(
        messages=request.messages,
        persona=request.persona or "mentor",
        model=request.model or "gemini-2.0-flash",
        student_context=ctx,
        api_key=request.api_key,
    )
    return StreamingResponse(
        generator,
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )
