from typing import Optional, List, Union, Dict, Any
import uuid
from pydantic import BaseModel, Field

class ContentBlock(BaseModel):
    type: str
    title: Optional[str] = None
    content: Union[str, List[str], List[Dict[str, Any]], Dict[str, Any]]
    language: Optional[str] = None
    output: Optional[str] = None

class LessonOut(BaseModel):
    id: uuid.UUID
    module_id: uuid.UUID
    course_id: uuid.UUID
    lesson_number: int
    title: str
    content_blocks: List[ContentBlock]
    estimated_minutes: int
    is_completed: bool = False
    prev_lesson_id: Optional[uuid.UUID] = None
    next_lesson_id: Optional[uuid.UUID] = None
    prev_lesson_title: Optional[str] = None
    next_lesson_title: Optional[str] = None

    class Config:
        from_attributes = True


class ModuleOut(BaseModel):
    id: uuid.UUID
    course_id: uuid.UUID
    module_number: int
    title: str
    description: Optional[str] = None
    estimated_hours: float
    lessons: List[LessonOut] = []
    quiz_questions_count: int = 0
    is_completed: bool = False
    level: Optional[str] = "beginner"

    class Config:
        from_attributes = True

class CourseOut(BaseModel):
    id: uuid.UUID
    slug: str
    title: str
    description: str
    difficulty: str
    duration_weeks: int
    num_modules: int
    num_lessons: int
    prerequisites_text: Optional[str] = None
    skills_gained: List[str]
    category: str
    enrolled: bool = False
    progress_pct: float = 0.0

    class Config:
        from_attributes = True

class CourseDetailOut(CourseOut):
    modules: List[ModuleOut] = []

class QuizQuestionOut(BaseModel):
    id: uuid.UUID
    question: str
    question_type: str
    options: List[str] = []
    points: int

    class Config:
        from_attributes = True

class QuizSubmitRequest(BaseModel):
    answers: Dict[str, str]

class QuestionResult(BaseModel):
    question_id: str
    correct: bool
    explanation: Optional[str] = None
    correct_answer: str

class QuizResultOut(BaseModel):
    score: int
    total_points: int
    percentage: float
    passed: bool
    question_results: List[QuestionResult]

class ProgressOut(BaseModel):
    course_id: uuid.UUID
    lessons_completed: int
    lessons_total: int
    modules_completed: int
    modules_total: int
    progress_pct: float
    last_lesson_id: Optional[uuid.UUID] = None
