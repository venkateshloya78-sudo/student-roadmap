from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import create_access_token, create_refresh_token, hash_password, verify_password
from app.database import get_db
from app.dependencies import get_current_user
from app.models.profile import StudentProfile
from app.models.user import AuthProvider, User
from app.schemas.auth import MeResponse, ProfileOut, RegisterRequest, TokenResponse, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def register(data: RegisterRequest, db: AsyncSession = Depends(get_db)):
    """Create a new local user account and auto-create an empty student profile."""
    result = await db.execute(select(User).where(User.email == data.email.lower().strip()))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered.")
    if len(data.password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters.")

    user = User(
        email=data.email.lower().strip(),
        password_hash=hash_password(data.password),
        auth_provider=AuthProvider.local,
    )
    db.add(user)
    await db.flush()  # get user.id without committing

    profile = StudentProfile(user_id=user.id)
    db.add(profile)
    await db.commit()
    await db.refresh(user)
    return user


@router.post("/login", response_model=TokenResponse)
async def login(
    form: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db),
):
    """Authenticate with email+password, return JWT access + refresh tokens."""
    result = await db.execute(
        select(User).where(User.email == form.username.lower().strip())
    )
    user = result.scalar_one_or_none()
    if not user or not user.password_hash or not verify_password(form.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Account is inactive.")

    user.last_login_at = datetime.now(timezone.utc)
    await db.commit()

    return TokenResponse(
        access_token=create_access_token(str(user.id)),
        refresh_token=create_refresh_token(str(user.id)),
    )


@router.get("/me", response_model=MeResponse)
async def me(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Return the authenticated user along with their student profile (if it exists)."""
    result = await db.execute(
        select(StudentProfile).where(StudentProfile.user_id == current_user.id)
    )
    profile = result.scalar_one_or_none()
    return MeResponse(
        user=UserOut.model_validate(current_user),
        profile=ProfileOut.model_validate(profile) if profile else None,
    )


@router.post("/logout")
async def logout():
    """Client-side logout: instruct the client to discard tokens. JWTs are stateless."""
    return {"message": "Logged out successfully. Please discard your tokens."}
