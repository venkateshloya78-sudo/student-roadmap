export interface ContentBlock {
  type:
    | 'heading'
    | 'text'
    | 'code'
    | 'tip'
    | 'warning'
    | 'list'
    | 'example'
    | 'practice'
    | 'output'
    | 'intro'
    | 'explanation'
    | 'concepts'
    | 'line_breakdown'
    | 'real_world'
    | 'prerequisites'
    | 'learning_path'
    | 'mini_project'
    | 'common_mistakes'
    | 'career_relevance'
    | 'next_steps'
    | 'objectives'
    | 'objective'
    | 'terminology'
    | 'task'
    | 'activity'
    | 'summary'
    | string;
  title?: string;
  content: any;
  language?: string;
  output?: string;
}
export interface LessonOut { id: string; module_id: string; course_id: string; lesson_number: number; title: string; content_blocks: ContentBlock[]; estimated_minutes: number; is_completed: boolean; prev_lesson_id?: string; next_lesson_id?: string; prev_lesson_title?: string; next_lesson_title?: string }
export interface ModuleOut { id: string; course_id: string; module_number: number; title: string; description: string; estimated_hours: number; lessons: LessonSummary[]; quiz_questions_count: number; is_completed: boolean; level?: 'beginner' | 'intermediate' | 'advanced' | string }
export interface LessonSummary { id: string; lesson_number: number; title: string; estimated_minutes: number; is_completed: boolean }
export interface CourseOut { id: string; slug: string; title: string; description: string; difficulty: string; duration_weeks: number; num_modules: number; num_lessons: number; prerequisites_text: string; skills_gained: string[]; category: string; enrolled: boolean; progress_pct: number }
export interface CourseDetailOut extends CourseOut { modules: ModuleOut[] }
export interface QuizQuestionOut { id: string; question: string; question_type: string; options: string[]; points: number }
export interface QuizResultOut { score: number; total_points: number; percentage: number; passed: boolean; question_results: {question_id: string; correct: boolean; explanation: string; correct_answer: string}[] }
export interface ProgressOut { course_id: string; lessons_completed: number; lessons_total: number; modules_completed: number; modules_total: number; progress_pct: number; last_lesson_id?: string }
