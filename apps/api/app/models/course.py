import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, Integer, Boolean, Text, ForeignKey, Enum, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database import Base, use_uuid_type

class Course(Base):
    __tablename__ = "courses"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    slug = Column(String, unique=True, index=True, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    difficulty = Column(String, nullable=False)
    duration_weeks = Column(Integer, nullable=False)
    num_modules = Column(Integer, nullable=False)
    num_lessons = Column(Integer, nullable=False)
    prerequisites_text = Column(String, nullable=True)
    skills_gained_json = Column(Text, nullable=False)  # list of strings in json
    category = Column(String, nullable=False)
    is_published = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    modules = relationship("CourseModule", back_populates="course", cascade="all, delete-orphan", order_by="CourseModule.module_number")
    enrollments = relationship("CourseEnrollment", back_populates="course", cascade="all, delete-orphan")


class CourseModule(Base):
    __tablename__ = "course_modules"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    course_id = Column(use_uuid_type(), ForeignKey("courses.id"), nullable=False)
    module_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    estimated_hours = Column(Float, nullable=False)
    level = Column(String, default="beginner")  # beginner, intermediate, advanced
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    course = relationship("Course", back_populates="modules")
    lessons = relationship("Lesson", back_populates="module", cascade="all, delete-orphan", order_by="Lesson.lesson_number")
    quizzes = relationship("QuizQuestion", back_populates="module", cascade="all, delete-orphan")
    projects = relationship("Project", back_populates="module", cascade="all, delete-orphan")


class Lesson(Base):
    __tablename__ = "lessons"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    module_id = Column(use_uuid_type(), ForeignKey("course_modules.id"), nullable=False)
    course_id = Column(use_uuid_type(), ForeignKey("courses.id"), nullable=False)
    lesson_number = Column(Integer, nullable=False)
    title = Column(String, nullable=False)
    content_blocks_json = Column(Text, nullable=False)
    estimated_minutes = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    module = relationship("CourseModule", back_populates="lessons")


class QuizQuestion(Base):
    __tablename__ = "quiz_questions"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    module_id = Column(use_uuid_type(), ForeignKey("course_modules.id"), nullable=False)
    lesson_id = Column(use_uuid_type(), ForeignKey("lessons.id"), nullable=True)
    question = Column(String, nullable=False)
    question_type = Column(String, nullable=False)  # mcq, true_false, short
    options_json = Column(Text, nullable=True)
    correct_answer = Column(String, nullable=False)
    explanation = Column(Text, nullable=True)
    points = Column(Integer, default=1)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    module = relationship("CourseModule", back_populates="quizzes")


class Project(Base):
    __tablename__ = "projects"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    course_id = Column(use_uuid_type(), ForeignKey("courses.id"), nullable=False)
    module_id = Column(use_uuid_type(), ForeignKey("course_modules.id"), nullable=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    objective = Column(String, nullable=False)
    requirements_json = Column(Text, nullable=False)
    steps_json = Column(Text, nullable=False)
    expected_output = Column(Text, nullable=False)
    difficulty = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    module = relationship("CourseModule", back_populates="projects")


class LessonProgress(Base):
    __tablename__ = "lesson_progress"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    user_id = Column(use_uuid_type(), ForeignKey("users.id"), nullable=False)
    lesson_id = Column(use_uuid_type(), ForeignKey("lessons.id"), nullable=False)
    course_id = Column(use_uuid_type(), ForeignKey("courses.id"), nullable=False)
    status = Column(String, nullable=False, default="not_started") # not_started, in_progress, completed
    completed_at = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    __table_args__ = (
        UniqueConstraint('user_id', 'lesson_id', name='uq_user_lesson'),
    )


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    user_id = Column(use_uuid_type(), ForeignKey("users.id"), nullable=False)
    module_id = Column(use_uuid_type(), ForeignKey("course_modules.id"), nullable=False)
    score = Column(Integer, nullable=False)
    total_points = Column(Integer, nullable=False)
    answers_json = Column(Text, nullable=False)
    attempted_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class CourseEnrollment(Base):
    __tablename__ = "course_enrollments"

    id = Column(use_uuid_type(), primary_key=True, default=uuid.uuid4)
    user_id = Column(use_uuid_type(), ForeignKey("users.id"), nullable=False)
    course_id = Column(use_uuid_type(), ForeignKey("courses.id"), nullable=False)
    enrolled_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_lesson_id = Column(use_uuid_type(), ForeignKey("lessons.id"), nullable=True)
    overall_progress_pct = Column(Float, default=0.0)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    __table_args__ = (
        UniqueConstraint('user_id', 'course_id', name='uq_user_course'),
    )

    course = relationship("Course", back_populates="enrollments")
