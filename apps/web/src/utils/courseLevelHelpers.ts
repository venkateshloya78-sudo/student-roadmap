import { ModuleOut, CourseDetailOut } from '../types/course';

export type CourseLevelKey = 'beginner' | 'intermediate' | 'advanced';

export interface LevelConfig {
  key: CourseLevelKey;
  label: string;
  badge: string;
  icon: string;
  tagline: string;
  description: string;
  idealFor: string;
  color: {
    theme: string;
    badgeBg: string;
    badgeText: string;
    border: string;
    activeBorder: string;
    bgLight: string;
    accent: string;
    button: string;
  };
}

export const COURSE_LEVELS_CONFIG: Record<CourseLevelKey, LevelConfig> = {
  beginner: {
    key: 'beginner',
    label: 'Beginner Level',
    badge: 'Level 1: Foundations',
    icon: '🌱',
    tagline: 'Start from absolute scratch with crystal-clear fundamentals',
    description: 'Perfect for beginners with zero prior knowledge. Covers core concepts, terminology, syntax, mental models, basic hands-on examples, and foundational quizzes.',
    idealFor: 'Students & newcomers with no background in this subject',
    color: {
      theme: 'emerald',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      border: 'border-emerald-200',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      bgLight: 'bg-emerald-50/50',
      accent: 'text-emerald-600',
      button: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200',
    },
  },
  intermediate: {
    key: 'intermediate',
    label: 'Intermediate Level',
    badge: 'Level 2: Practical Mastery',
    icon: '🌿',
    tagline: 'Deepen your knowledge with practical implementations and problem-solving',
    description: 'For learners who understand the basics. Focuses on intermediate concepts, real-world patterns, error handling, performance optimization, and industry assignments.',
    idealFor: 'Learners with basic syntax knowledge ready to build real features',
    color: {
      theme: 'indigo',
      badgeBg: 'bg-indigo-100',
      badgeText: 'text-indigo-800',
      border: 'border-indigo-200',
      activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20',
      bgLight: 'bg-indigo-50/50',
      accent: 'text-indigo-600',
      button: 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200',
    },
  },
  advanced: {
    key: 'advanced',
    label: 'Advanced Level',
    badge: 'Level 3: Job-Ready / Expert',
    icon: '🚀',
    tagline: 'Professional architectural depth, advanced problem-solving & interview readiness',
    description: 'Master advanced systems, high-scale engineering, security, edge cases, distributed architecture, interview-level questions, and full capstone projects.',
    idealFor: 'Developers preparing for technical interviews and production systems',
    color: {
      theme: 'purple',
      badgeBg: 'bg-purple-100',
      badgeText: 'text-purple-800',
      border: 'border-purple-200',
      activeBorder: 'border-purple-500 ring-2 ring-purple-500/20',
      bgLight: 'bg-purple-50/50',
      accent: 'text-purple-600',
      button: 'bg-purple-600 hover:bg-purple-700 text-white shadow-purple-200',
    },
  },
};

export interface LevelData {
  config: LevelConfig;
  modules: ModuleOut[];
  totalLessons: number;
  completedLessons: number;
  remainingLessons: number;
  progressPct: number;
  quizCount: number;
  isCompleted: boolean;
  isUnlocked: boolean;
  firstLessonId?: string;
  nextIncompleteLessonId?: string;
  firstModuleQuizNumber?: number;
  practiceTasks: Array<{ title: string; objective: string; difficulty: string }>;
}

export function partitionCourseModules(modules: ModuleOut[]): Record<CourseLevelKey, ModuleOut[]> {
  const result: Record<CourseLevelKey, ModuleOut[]> = {
    beginner: [],
    intermediate: [],
    advanced: [],
  };

  if (!modules || modules.length === 0) {
    return result;
  }

  // Check if modules have explicit level tags
  const hasExplicitLevels = modules.some(m => m.level && ['beginner', 'intermediate', 'advanced'].includes(m.level.toLowerCase()));

  if (hasExplicitLevels) {
    modules.forEach(m => {
      const lvl = (m.level || 'beginner').toLowerCase() as CourseLevelKey;
      if (result[lvl]) {
        result[lvl].push(m);
      } else {
        result.beginner.push(m);
      }
    });
  } else {
    // Graceful fallback for any future courses without explicit level tags
    const n = modules.length;
    if (n === 1) {
      result.beginner = modules;
    } else if (n === 2) {
      result.beginner = [modules[0]];
      result.intermediate = [modules[1]];
    } else if (n === 3) {
      result.beginner = [modules[0]];
      result.intermediate = [modules[1]];
      result.advanced = [modules[2]];
    } else {
      const bCount = Math.ceil(n / 3);
      const iCount = Math.round((n - bCount) / 2);
      result.beginner = modules.slice(0, bCount);
      result.intermediate = modules.slice(bCount, bCount + iCount);
      result.advanced = modules.slice(bCount + iCount);
    }
  }

  return result;
}

export function getCourseLevelsData(course: CourseDetailOut): Record<CourseLevelKey, LevelData> {
  const partitioned = partitionCourseModules(course.modules || []);
  const keys: CourseLevelKey[] = ['beginner', 'intermediate', 'advanced'];

  let previousLevelCompleted = true;

  const res = {} as Record<CourseLevelKey, LevelData>;

  keys.forEach((key, index) => {
    const config = COURSE_LEVELS_CONFIG[key];
    const mods = partitioned[key] || [];

    let totalLessons = 0;
    let completedLessons = 0;
    let firstLessonId: string | undefined = undefined;
    let nextIncompleteLessonId: string | undefined = undefined;
    let quizCount = 0;
    let firstModuleQuizNumber: number | undefined = undefined;

    mods.forEach(m => {
      quizCount += m.quiz_questions_count || 0;
      if (firstModuleQuizNumber === undefined && (m.quiz_questions_count || 0) > 0) {
        firstModuleQuizNumber = m.module_number;
      }
      (m.lessons || []).forEach(l => {
        totalLessons++;
        if (!firstLessonId) firstLessonId = l.id;
        if (l.is_completed) {
          completedLessons++;
        } else if (!nextIncompleteLessonId) {
          nextIncompleteLessonId = l.id;
        }
      });
    });

    const remainingLessons = Math.max(0, totalLessons - completedLessons);
    const progressPct = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    const isCompleted = totalLessons > 0 && completedLessons === totalLessons;

    // Beginner is always unlocked; Intermediate is unlocked by default for open exploration or after beginner
    const isUnlocked = index === 0 ? true : true; // Keep open so students can choose their entry level as requested

    // Contextual practice tasks for each level
    const practiceTasks = getContextualPracticeTasks(key, course.title);

    res[key] = {
      config,
      modules: mods,
      totalLessons,
      completedLessons,
      remainingLessons,
      progressPct,
      quizCount,
      isCompleted,
      isUnlocked,
      firstLessonId,
      nextIncompleteLessonId: nextIncompleteLessonId || firstLessonId,
      firstModuleQuizNumber,
      practiceTasks,
    };

    previousLevelCompleted = isCompleted;
  });

  return res;
}

function getContextualPracticeTasks(level: CourseLevelKey, courseTitle: string) {
  if (level === 'beginner') {
    return [
      {
        title: 'Core Concept & Syntax Drill',
        objective: `Identify key terminology, write foundational examples, and verify output for basic ${courseTitle} building blocks.`,
        difficulty: 'Easy (15-20 min)',
      },
      {
        title: 'Guided Hands-on Exercise',
        objective: 'Step-by-step implementation following best practices with line-by-line verification.',
        difficulty: 'Easy-Moderate (25 min)',
      },
      {
        title: 'Foundational Knowledge Check',
        objective: 'Complete the level quiz questions to test retention of core concepts before moving ahead.',
        difficulty: 'Quiz Checkpoint (10 min)',
      },
    ];
  } else if (level === 'intermediate') {
    return [
      {
        title: 'Real-World Feature Implementation',
        objective: `Combine multiple intermediate techniques in ${courseTitle} to build a working, production-style mini-application.`,
        difficulty: 'Moderate (35-45 min)',
      },
      {
        title: 'Error Handling & Edge Case Debugging',
        objective: 'Diagnose common exceptions, inspect faulty inputs, and refactor code for defensive reliability.',
        difficulty: 'Moderate (30 min)',
      },
      {
        title: 'Applied Problem-Solving Assignment',
        objective: 'Solve practical interview-style challenges and verify performance with custom test cases.',
        difficulty: 'Challenge (40 min)',
      },
    ];
  } else {
    return [
      {
        title: 'Production Architecture & Scalability Task',
        objective: `Design and implement high-performance, fault-tolerant solutions adhering to industry standards in ${courseTitle}.`,
        difficulty: 'Advanced (60+ min)',
      },
      {
        title: 'Security, Concurrency & Optimization Audit',
        objective: 'Profile resource bottlenecks, eliminate vulnerabilities, and optimize asymptotic performance.',
        difficulty: 'Advanced (45 min)',
      },
      {
        title: 'End-to-End Capstone Project & Interview Review',
        objective: 'Deliver a complete deployable project, write architecture documentation, and answer senior-level interview prompts.',
        difficulty: 'Job-Ready Capstone (90 min)',
      },
    ];
  }
}
