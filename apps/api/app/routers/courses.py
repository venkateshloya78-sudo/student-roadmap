import json
import uuid
from typing import List, Optional, Dict
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, status, Query
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy import select, and_, or_, func
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.database import get_db
from app.core.security import decode_token
from app.models.user import User
from app.models.course import Course, CourseModule, Lesson, QuizQuestion, LessonProgress, QuizAttempt, CourseEnrollment
from app.schemas.course import (
    CourseOut, CourseDetailOut, ModuleOut, LessonOut, QuizQuestionOut, 
    QuizSubmitRequest, QuizResultOut, ProgressOut
)
from app.dependencies import get_current_user

router = APIRouter(prefix="/courses", tags=["Courses"])

auth_scheme = HTTPBearer(auto_error=False)

async def get_optional_user(
    token: Optional[HTTPAuthorizationCredentials] = Depends(auth_scheme),
    db: AsyncSession = Depends(get_db)
) -> Optional[User]:
    if not token:
        return None
    user_id = decode_token(token.credentials)
    if not user_id:
        return None
    try:
        uid = uuid.UUID(user_id)
        result = await db.execute(select(User).where(User.id == uid, User.deleted_at.is_(None)))
        return result.scalar_one_or_none()
    except ValueError:
        return None


@router.get("/", response_model=List[CourseOut])
async def list_courses(
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    result = await db.execute(select(Course).where(Course.is_published == True))
    courses = result.scalars().all()

    out_courses = []
    for c in courses:
        c_out = CourseOut(
            id=c.id,
            slug=c.slug,
            title=c.title,
            description=c.description,
            difficulty=c.difficulty,
            duration_weeks=c.duration_weeks,
            num_modules=c.num_modules,
            num_lessons=c.num_lessons,
            prerequisites_text=c.prerequisites_text,
            skills_gained=json.loads(c.skills_gained_json) if c.skills_gained_json else [],
            category=c.category,
        )
        if user:
            enrollment_res = await db.execute(
                select(CourseEnrollment).where(CourseEnrollment.user_id == user.id, CourseEnrollment.course_id == c.id)
            )
            enrollment = enrollment_res.scalar_one_or_none()
            if enrollment:
                c_out.enrolled = True
                c_out.progress_pct = enrollment.overall_progress_pct
        out_courses.append(c_out)
    return out_courses


@router.get("/{slug}/search", response_model=List[LessonOut])
async def search_course(
    slug: str,
    q: str = Query(..., min_length=3),
    db: AsyncSession = Depends(get_db)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug, Course.is_published == True))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    # SQLite doesn't have great JSON search, so we'll do a LIKE on the text field or title
    lessons_res = await db.execute(
        select(Lesson)
        .where(
            Lesson.course_id == course.id,
            or_(
                Lesson.title.ilike(f"%{q}%"),
                Lesson.content_blocks_json.ilike(f"%{q}%")
            )
        )
    )
    lessons = lessons_res.scalars().all()
    
    out = []
    for l in lessons:
        l_out = LessonOut(
            id=l.id,
            module_id=l.module_id,
            course_id=l.course_id,
            lesson_number=l.lesson_number,
            title=l.title,
            content_blocks=json.loads(l.content_blocks_json) if l.content_blocks_json else [],
            estimated_minutes=l.estimated_minutes
        )
        out.append(l_out)
    return out


@router.post("/{slug}/enroll", response_model=Dict[str, str])
async def enroll_in_course(
    slug: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    enroll_res = await db.execute(
        select(CourseEnrollment).where(CourseEnrollment.user_id == user.id, CourseEnrollment.course_id == course.id)
    )
    if enroll_res.scalar_one_or_none():
        return {"status": "already_enrolled"}
        
    new_enrollment = CourseEnrollment(
        user_id=user.id,
        course_id=course.id
    )
    db.add(new_enrollment)
    await db.commit()
    return {"status": "enrolled"}


@router.get("/{slug}", response_model=CourseDetailOut)
async def get_course_detail(
    slug: str,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    result = await db.execute(
        select(Course)
        .options(
            selectinload(Course.modules).selectinload(CourseModule.lessons),
            selectinload(Course.modules).selectinload(CourseModule.quizzes)
        )
        .where(Course.slug == slug)
    )
    c = result.scalar_one_or_none()
    if not c:
        raise HTTPException(status_code=404, detail="Course not found")

    user_completed_lesson_ids = set()
    enrolled = False
    progress_pct = 0.0

    if user:
        enroll_res = await db.execute(
            select(CourseEnrollment).where(CourseEnrollment.user_id == user.id, CourseEnrollment.course_id == c.id)
        )
        enrollment = enroll_res.scalar_one_or_none()
        if enrollment:
            enrolled = True
            progress_pct = enrollment.overall_progress_pct
            
        progress_res = await db.execute(
            select(LessonProgress.lesson_id)
            .where(LessonProgress.user_id == user.id, LessonProgress.course_id == c.id, LessonProgress.status == "completed")
        )
        user_completed_lesson_ids = {row[0] for row in progress_res.all()}

    modules_out = []
    for m in c.modules:
        lessons_out = []
        module_completed = True
        for l in m.lessons:
            is_comp = l.id in user_completed_lesson_ids
            if not is_comp:
                module_completed = False
            lessons_out.append(LessonOut(
                id=l.id,
                module_id=l.module_id,
                course_id=l.course_id,
                lesson_number=l.lesson_number,
                title=l.title,
                content_blocks=[], # Don't load full content in course detail
                estimated_minutes=l.estimated_minutes,
                is_completed=is_comp
            ))
        
        modules_out.append(ModuleOut(
            id=m.id,
            course_id=m.course_id,
            module_number=m.module_number,
            title=m.title,
            description=m.description,
            estimated_hours=m.estimated_hours,
            lessons=lessons_out,
            quiz_questions_count=len(m.quizzes),
            is_completed=module_completed if lessons_out else False,
            level=getattr(m, "level", "beginner") or "beginner"
        ))

    c_out = CourseDetailOut(
        id=c.id,
        slug=c.slug,
        title=c.title,
        description=c.description,
        difficulty=c.difficulty,
        duration_weeks=c.duration_weeks,
        num_modules=c.num_modules,
        num_lessons=c.num_lessons,
        prerequisites_text=c.prerequisites_text,
        skills_gained=json.loads(c.skills_gained_json) if c.skills_gained_json else [],
        category=c.category,
        enrolled=enrolled,
        progress_pct=progress_pct,
        modules=modules_out
    )
    return c_out


@router.get("/{slug}/modules/{module_num}", response_model=ModuleOut)
async def get_module(
    slug: str,
    module_num: int,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    mod_res = await db.execute(
        select(CourseModule)
        .options(
            selectinload(CourseModule.lessons),
            selectinload(CourseModule.quizzes)
        )
        .where(CourseModule.course_id == course.id, CourseModule.module_number == module_num)
    )
    m = mod_res.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
        
    user_completed_lesson_ids = set()
    if user:
        progress_res = await db.execute(
            select(LessonProgress.lesson_id)
            .where(
                LessonProgress.user_id == user.id, 
                LessonProgress.course_id == course.id,
                LessonProgress.lesson_id.in_([l.id for l in m.lessons]),
                LessonProgress.status == "completed"
            )
        )
        user_completed_lesson_ids = {row[0] for row in progress_res.all()}

    lessons_out = []
    module_completed = True
    for l in m.lessons:
        is_comp = l.id in user_completed_lesson_ids
        if not is_comp:
            module_completed = False
        lessons_out.append(LessonOut(
            id=l.id,
            module_id=l.module_id,
            course_id=l.course_id,
            lesson_number=l.lesson_number,
            title=l.title,
            content_blocks=json.loads(l.content_blocks_json) if l.content_blocks_json else [],
            estimated_minutes=l.estimated_minutes,
            is_completed=is_comp
        ))

    return ModuleOut(
        id=m.id,
        course_id=m.course_id,
        module_number=m.module_number,
        title=m.title,
        description=m.description,
        estimated_hours=m.estimated_hours,
        lessons=lessons_out,
        quiz_questions_count=len(m.quizzes),
        is_completed=module_completed if lessons_out else False,
        level=getattr(m, "level", "beginner") or "beginner"
    )


@router.get("/{slug}/modules/{module_num}/lessons/{lesson_num}")
async def get_lesson(
    slug: str,
    module_num: int,
    lesson_num: int,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    mod_res = await db.execute(
        select(CourseModule)
        .where(CourseModule.course_id == course.id, CourseModule.module_number == module_num)
    )
    m = mod_res.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")
        
    lesson_res = await db.execute(
        select(Lesson)
        .where(Lesson.module_id == m.id, Lesson.lesson_number == lesson_num)
    )
    l = lesson_res.scalar_one_or_none()
    if not l:
        raise HTTPException(status_code=404, detail="Lesson not found")

    is_comp = False
    if user:
        prog_res = await db.execute(
            select(LessonProgress)
            .where(LessonProgress.user_id == user.id, LessonProgress.lesson_id == l.id)
        )
        prog = prog_res.scalar_one_or_none()
        if prog and prog.status == "completed":
            is_comp = True
            
    # Find prev/next lesson ids
    # A bit naive but works
    all_lessons_res = await db.execute(
        select(Lesson.id, Lesson.lesson_number, CourseModule.module_number)
        .join(CourseModule, Lesson.module_id == CourseModule.id)
        .where(Lesson.course_id == course.id)
        .order_by(CourseModule.module_number, Lesson.lesson_number)
    )
    all_lessons = all_lessons_res.all()
    
    prev_id = None
    next_id = None
    for i, row in enumerate(all_lessons):
        if row[0] == l.id:
            if i > 0:
                prev_id = all_lessons[i-1][0]
            if i < len(all_lessons) - 1:
                next_id = all_lessons[i+1][0]
            break

    return {
        "lesson": LessonOut(
            id=l.id,
            module_id=l.module_id,
            course_id=l.course_id,
            lesson_number=l.lesson_number,
            title=l.title,
            content_blocks=json.loads(l.content_blocks_json) if l.content_blocks_json else [],
            estimated_minutes=l.estimated_minutes,
            is_completed=is_comp
        ),
        "prev_lesson_id": prev_id,
        "next_lesson_id": next_id
    }


@router.get("/{slug}/lessons/{lesson_id}", response_model=LessonOut)
async def get_lesson_by_id(
    slug: str,
    lesson_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user)
):
    """Fetch a full lesson by its UUID — returns content blocks + prev/next navigation."""
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")

    lesson_res = await db.execute(select(Lesson).where(Lesson.id == lesson_id, Lesson.course_id == course.id))
    l = lesson_res.scalar_one_or_none()
    if not l:
        raise HTTPException(status_code=404, detail="Lesson not found")

    is_comp = False
    if user:
        prog_res = await db.execute(
            select(LessonProgress).where(LessonProgress.user_id == user.id, LessonProgress.lesson_id == l.id)
        )
        prog = prog_res.scalar_one_or_none()
        if prog and prog.status == "completed":
            is_comp = True

    # Ordered list of all lessons in the course for prev/next
    all_lessons_res = await db.execute(
        select(Lesson.id, Lesson.title, Lesson.lesson_number, CourseModule.module_number)
        .join(CourseModule, Lesson.module_id == CourseModule.id)
        .where(Lesson.course_id == course.id)
        .order_by(CourseModule.module_number, Lesson.lesson_number)
    )
    all_lessons = all_lessons_res.all()

    prev_id = None
    prev_title = None
    next_id = None
    next_title = None
    for i, row in enumerate(all_lessons):
        if row[0] == l.id:
            if i > 0:
                prev_id = all_lessons[i - 1][0]
                prev_title = all_lessons[i - 1][1]
            if i < len(all_lessons) - 1:
                next_id = all_lessons[i + 1][0]
                next_title = all_lessons[i + 1][1]
            break

    return LessonOut(
        id=l.id,
        module_id=l.module_id,
        course_id=l.course_id,
        lesson_number=l.lesson_number,
        title=l.title,
        content_blocks=json.loads(l.content_blocks_json) if l.content_blocks_json else [],
        estimated_minutes=l.estimated_minutes,
        is_completed=is_comp,
        prev_lesson_id=prev_id,
        prev_lesson_title=prev_title,
        next_lesson_id=next_id,
        next_lesson_title=next_title,
    )


@router.post("/{slug}/lessons/{lesson_id}/complete")
async def complete_lesson(
    slug: str,
    lesson_id: uuid.UUID,

    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    lesson_res = await db.execute(select(Lesson).where(Lesson.id == lesson_id))
    lesson = lesson_res.scalar_one_or_none()
    if not lesson or lesson.course_id != course.id:
        raise HTTPException(status_code=404, detail="Lesson not found")

    prog_res = await db.execute(
        select(LessonProgress)
        .where(LessonProgress.user_id == user.id, LessonProgress.lesson_id == lesson_id)
    )
    prog = prog_res.scalar_one_or_none()
    
    if prog:
        if prog.status != "completed":
            prog.status = "completed"
            prog.completed_at = datetime.now(timezone.utc)
    else:
        prog = LessonProgress(
            user_id=user.id,
            lesson_id=lesson_id,
            course_id=course.id,
            status="completed",
            completed_at=datetime.now(timezone.utc)
        )
        db.add(prog)
        
    await db.flush()

    # recalculate overall progress
    total_lessons_res = await db.execute(select(func.count(Lesson.id)).where(Lesson.course_id == course.id))
    total_lessons = total_lessons_res.scalar() or 1
    
    completed_res = await db.execute(
        select(func.count(LessonProgress.id))
        .where(LessonProgress.user_id == user.id, LessonProgress.course_id == course.id, LessonProgress.status == "completed")
    )
    completed_count = completed_res.scalar() or 0
    
    pct = (completed_count / total_lessons) * 100.0

    enroll_res = await db.execute(
        select(CourseEnrollment).where(CourseEnrollment.user_id == user.id, CourseEnrollment.course_id == course.id)
    )
    enrollment = enroll_res.scalar_one_or_none()
    if not enrollment:
        enrollment = CourseEnrollment(
            user_id=user.id,
            course_id=course.id,
            last_lesson_id=lesson_id,
            overall_progress_pct=pct
        )
        db.add(enrollment)
    else:
        enrollment.last_lesson_id = lesson_id
        enrollment.overall_progress_pct = pct
        if pct >= 100.0 and not enrollment.completed_at:
            enrollment.completed_at = datetime.now(timezone.utc)

    await db.commit()
    return {"status": "success", "progress_pct": pct}


@router.get("/{slug}/modules/{module_num}/quiz", response_model=List[QuizQuestionOut])
async def get_quiz(
    slug: str,
    module_num: int,
    db: AsyncSession = Depends(get_db)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    mod_res = await db.execute(
        select(CourseModule)
        .where(CourseModule.course_id == course.id, CourseModule.module_number == module_num)
    )
    m = mod_res.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")

    questions_res = await db.execute(
        select(QuizQuestion).where(QuizQuestion.module_id == m.id)
    )
    questions = questions_res.scalars().all()
    
    out = []
    for q in questions:
        out.append(QuizQuestionOut(
            id=q.id,
            question=q.question,
            question_type=q.question_type,
            options=json.loads(q.options_json) if q.options_json else [],
            points=q.points
        ))
    return out


@router.post("/{slug}/modules/{module_num}/quiz", response_model=QuizResultOut)
async def submit_quiz(
    slug: str,
    module_num: int,
    payload: QuizSubmitRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    mod_res = await db.execute(
        select(CourseModule)
        .where(CourseModule.course_id == course.id, CourseModule.module_number == module_num)
    )
    m = mod_res.scalar_one_or_none()
    if not m:
        raise HTTPException(status_code=404, detail="Module not found")

    questions_res = await db.execute(
        select(QuizQuestion).where(QuizQuestion.module_id == m.id)
    )
    questions = questions_res.scalars().all()
    if not questions:
        raise HTTPException(status_code=400, detail="No quiz questions found for module")

    score = 0
    total_points = 0
    results = []
    
    for q in questions:
        total_points += q.points
        q_id_str = str(q.id)
        user_answer = payload.answers.get(q_id_str)
        
        correct = False
        if user_answer and user_answer.strip().lower() == q.correct_answer.strip().lower():
            correct = True
            score += q.points
            
        results.append({
            "question_id": q_id_str,
            "correct": correct,
            "explanation": q.explanation,
            "correct_answer": q.correct_answer
        })

    pct = (score / total_points) * 100.0 if total_points > 0 else 0
    passed = pct >= 70.0
    
    attempt = QuizAttempt(
        user_id=user.id,
        module_id=m.id,
        score=score,
        total_points=total_points,
        answers_json=json.dumps(payload.answers)
    )
    db.add(attempt)
    await db.commit()
    
    return QuizResultOut(
        score=score,
        total_points=total_points,
        percentage=pct,
        passed=passed,
        question_results=results
    )


@router.get("/{slug}/progress", response_model=ProgressOut)
async def get_progress(
    slug: str,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user)
):
    course_res = await db.execute(select(Course).where(Course.slug == slug))
    course = course_res.scalar_one_or_none()
    if not course:
        raise HTTPException(status_code=404, detail="Course not found")
        
    enroll_res = await db.execute(
        select(CourseEnrollment).where(CourseEnrollment.user_id == user.id, CourseEnrollment.course_id == course.id)
    )
    enrollment = enroll_res.scalar_one_or_none()
    if not enrollment:
        return ProgressOut(
            course_id=course.id,
            lessons_completed=0,
            lessons_total=course.num_lessons,
            modules_completed=0,
            modules_total=course.num_modules,
            progress_pct=0.0,
            last_lesson_id=None
        )

    completed_res = await db.execute(
        select(LessonProgress.lesson_id)
        .where(LessonProgress.user_id == user.id, LessonProgress.course_id == course.id, LessonProgress.status == "completed")
    )
    completed_lesson_ids = {row[0] for row in completed_res.all()}
    
    mods_res = await db.execute(
        select(CourseModule).options(selectinload(CourseModule.lessons)).where(CourseModule.course_id == course.id)
    )
    modules = mods_res.scalars().all()
    
    modules_completed = 0
    for m in modules:
        if not m.lessons:
            continue
        all_completed = all(l.id in completed_lesson_ids for l in m.lessons)
        if all_completed:
            modules_completed += 1

    return ProgressOut(
        course_id=course.id,
        lessons_completed=len(completed_lesson_ids),
        lessons_total=course.num_lessons,
        modules_completed=modules_completed,
        modules_total=course.num_modules,
        progress_pct=enrollment.overall_progress_pct,
        last_lesson_id=enrollment.last_lesson_id
    )
