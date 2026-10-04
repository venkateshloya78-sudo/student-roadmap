import React, { useState, useMemo } from 'react';
import AppShell from '../components/Layout/AppShell';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { CourseDetailOut } from '../types/course';
import {
  Clock,
  BookOpen,
  Target,
  CheckCircle2,
  PlayCircle,
  ChevronDown,
  Award,
  Video,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  ShieldCheck,
  Check,
  Code,
  FileText
} from 'lucide-react';
import BreadcrumbNav from '../components/Course/BreadcrumbNav';
import ProgressBar from '../components/Course/ProgressBar';
import {
  CourseLevelKey,
  COURSE_LEVELS_CONFIG,
  getCourseLevelsData,
  LevelData
} from '../utils/courseLevelHelpers';

export default function CourseHome() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const { data: course, isLoading } = useQuery<CourseDetailOut>({
    queryKey: ['course', slug],
    queryFn: () => api.get(`/courses/${slug}`).then(r => r.data),
    enabled: !!slug
  });

  const { data: progress } = useQuery({
    queryKey: ['course-progress', slug],
    queryFn: () => api.get(`/courses/${slug}/progress`).then(r => r.data),
    enabled: !!slug && !!course?.enrolled
  });

  // Level selector state: 'beginner' | 'intermediate' | 'advanced'
  const [selectedLevel, setSelectedLevel] = useState<CourseLevelKey>('beginner');
  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5]));

  const levelsData = useMemo(() => {
    if (!course) return null;
    return getCourseLevelsData(course);
  }, [course]);

  const toggleModule = (modNum: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(modNum)) next.delete(modNum);
      else next.add(modNum);
      return next;
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-8">
          <div className="h-64 bg-slate-100 rounded-3xl"></div>
          <div className="h-16 bg-slate-100 rounded-2xl"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-28 bg-slate-100 rounded-xl"></div>)}
            </div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!course || !levelsData) return null;

  const currentLevelData: LevelData = levelsData[selectedLevel];
  const firstLessonId = course.modules[0]?.lessons[0]?.id;
  const continueLessonId = progress?.last_lesson_id || firstLessonId;
  const isOverallCompleted = course.progress_pct === 100;

  // Level progression order
  const levelKeys: CourseLevelKey[] = ['beginner', 'intermediate', 'advanced'];
  const currentLevelIdx = levelKeys.indexOf(selectedLevel);
  const nextLevelKey = currentLevelIdx < levelKeys.length - 1 ? levelKeys[currentLevelIdx + 1] : null;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation & Back Action */}
        <div className="flex items-center justify-between mb-6">
          <BreadcrumbNav items={[
            { label: 'Home', href: '/' },
            { label: 'Courses', href: '/courses' },
            { label: course.title }
          ]} />
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors bg-white px-3.5 py-1.5 rounded-xl border border-slate-200 shadow-sm"
          >
            <ArrowLeft size={16} />
            Back to All Courses
          </Link>
        </div>

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-10 mb-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start justify-between">
            <div className="flex-1 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 uppercase tracking-wider flex items-center gap-1">
                  <Layers size={13} /> 3 Structured Levels
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  Beginner → Intermediate → Advanced
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                {course.title}
              </h1>
              <p className="text-base sm:text-lg text-slate-600 mb-6 leading-relaxed">
                {course.description}
              </p>

              {/* Course Meta Info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm font-medium text-slate-500 mb-6">
                <div className="flex items-center gap-2">
                  <Clock className="text-indigo-500" size={18} />
                  {course.duration_weeks} weeks
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-indigo-500" size={18} />
                  {course.num_modules} modules, {course.num_lessons} lessons
                </div>
                <div className="flex items-center gap-2 text-red-600 bg-red-50 border border-red-200/70 px-3 py-1 rounded-xl text-xs font-bold">
                  <Video className="text-red-500" size={16} />
                  <span>🎬 Video Classes Included</span>
                </div>
              </div>

              {/* Prerequisites Section */}
              {course.prerequisites_text && (
                <div className="mb-6 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1 flex items-center gap-1.5">
                    <ShieldCheck size={15} className="text-indigo-600" />
                    Prerequisites & Getting Started
                  </h4>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {course.prerequisites_text}
                  </p>
                </div>
              )}

              {/* Skills Gained */}
              {course.skills_gained?.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold text-slate-900 mb-2 uppercase tracking-wider flex items-center gap-1.5">
                    <Target size={15} className="text-emerald-500" />
                    Skills you'll gain across all 3 levels
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills_gained.map((skill, i) => (
                      <span key={i} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-semibold border border-emerald-100">
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Action & Overall Progress Card */}
            <div className="hidden md:block w-80 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex-shrink-0">
              {isOverallCompleted ? (
                <div className="text-center">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Award size={36} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">Course Completed!</h3>
                  <p className="text-xs text-slate-500 mb-5">You've mastered all 3 levels: Beginner, Intermediate, and Advanced.</p>
                  <button
                    onClick={() => navigate(`/courses/${course.slug}/complete`)}
                    className="w-full px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200 text-sm"
                  >
                    View Certificate 🎓
                  </button>
                </div>
              ) : course.enrolled ? (
                <div>
                  <div className="mb-4">
                    <ProgressBar pct={course.progress_pct} label="Overall Course Progress" />
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-600 mb-5">
                    <span>{progress?.lessons_completed || 0} / {course.num_lessons} lessons done</span>
                    <span className="font-bold text-indigo-600">{course.progress_pct}%</span>
                  </div>
                  <button
                    onClick={() => navigate(`/courses/${course.slug}/lessons/${continueLessonId}`)}
                    className="w-full px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 text-sm hover:-translate-y-0.5"
                  >
                    <PlayCircle size={18} /> Continue Learning
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-bold text-lg text-slate-900 mb-1">Select Your Level</h3>
                  <p className="text-xs text-slate-500 mb-5">Start with Beginner foundations or jump to your desired level below.</p>
                  <button
                    onClick={() => {
                      const startId = currentLevelData.firstLessonId || firstLessonId;
                      navigate(`/courses/${course.slug}/lessons/${startId}`);
                    }}
                    className="w-full px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 text-sm hover:-translate-y-0.5"
                  >
                    Start {COURSE_LEVELS_CONFIG[selectedLevel].label}
                  </button>
                </div>
              )}

              {/* Quick Level Status in Sidebar */}
              <div className="mt-6 pt-5 border-t border-slate-200/80 space-y-2.5">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Level Breakdown
                </div>
                {levelKeys.map(k => {
                  const lvl = levelsData[k];
                  const cfg = COURSE_LEVELS_CONFIG[k];
                  return (
                    <button
                      key={k}
                      onClick={() => setSelectedLevel(k)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        selectedLevel === k ? 'bg-indigo-50 border border-indigo-200 font-bold text-indigo-900' : 'hover:bg-white text-slate-600'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{cfg.icon}</span>
                        <span>{cfg.label}</span>
                      </span>
                      <span className="font-mono text-xs">
                        {lvl.completedLessons}/{lvl.totalLessons}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ─── LEVEL SELECTOR TABS (BEGINNER / INTERMEDIATE / ADVANCED) ─── */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                <Sparkles className="text-amber-500" size={24} />
                Choose Your Learning Level
              </h2>
              <p className="text-sm text-slate-500">
                Switch between levels anytime. Each level features dedicated lessons, practice tasks, and quizzes.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {levelKeys.map((k) => {
              const cfg = COURSE_LEVELS_CONFIG[k];
              const lvl = levelsData[k];
              const isSelected = selectedLevel === k;

              return (
                <button
                  key={k}
                  onClick={() => setSelectedLevel(k)}
                  className={`text-left p-5 rounded-2xl transition-all border relative flex flex-col justify-between ${
                    isSelected
                      ? `bg-white shadow-md ${cfg.color.activeBorder} -translate-y-0.5`
                      : 'bg-white hover:bg-slate-50 border-slate-200 opacity-90 hover:opacity-100'
                  }`}
                >
                  {/* Top Badge & Completion Status */}
                  <div className="flex items-center justify-between mb-3">
                    <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${cfg.color.badgeBg} ${cfg.color.badgeText}`}>
                      {cfg.badge}
                    </span>
                    {lvl.isCompleted ? (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <Check size={12} /> Completed
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-slate-400">
                        {lvl.progressPct}% done
                      </span>
                    )}
                  </div>

                  {/* Level Title & Tagline */}
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {cfg.tagline}
                    </p>
                  </div>

                  {/* Mini Stats Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={13} className="text-slate-400" />
                      {lvl.totalLessons} Lessons
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Target size={13} className="text-indigo-500" />
                      {lvl.quizCount} Quiz MCQs
                    </span>
                  </div>

                  {/* Progress Indicator line */}
                  <div className="w-full bg-slate-100 h-1.5 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        lvl.isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                      }`}
                      style={{ width: `${lvl.progressPct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* ─── ACTIVE LEVEL OVERVIEW & CONTENT ─── */}
        <div className="space-y-8">
          {/* Active Level Header Banner */}
          <div className={`p-6 sm:p-8 rounded-3xl border ${currentLevelData.config.color.border} ${currentLevelData.config.color.bgLight} relative`}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{currentLevelData.config.icon}</span>
                  <h2 className="text-2xl font-extrabold text-slate-900">
                    {currentLevelData.config.label} Curriculum
                  </h2>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${currentLevelData.config.color.badgeBg} ${currentLevelData.config.color.badgeText}`}>
                    {currentLevelData.config.badge}
                  </span>
                </div>
                <p className="text-sm text-slate-600 max-w-2xl leading-relaxed mb-3">
                  {currentLevelData.config.description}
                </p>
                <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                  <span className="font-bold text-slate-700">Ideal for:</span> {currentLevelData.config.idealFor}
                </div>
              </div>

              {/* Start Level CTA Button */}
              <div className="flex-shrink-0">
                <button
                  onClick={() => {
                    const targetLesson = currentLevelData.nextIncompleteLessonId || currentLevelData.firstLessonId;
                    if (targetLesson) {
                      navigate(`/courses/${course.slug}/lessons/${targetLesson}`);
                    }
                  }}
                  className={`px-6 py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center gap-2 hover:-translate-y-0.5 ${currentLevelData.config.color.button}`}
                >
                  <PlayCircle size={18} />
                  {currentLevelData.completedLessons > 0 ? `Continue ${currentLevelData.config.label}` : `Start ${currentLevelData.config.label}`}
                </button>
              </div>
            </div>
          </div>

          {/* ─── MODULES & LESSONS ACCORDION FOR THIS LEVEL ─── */}
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen size={18} className="text-indigo-600" />
                {currentLevelData.config.label} Topics & Lessons ({currentLevelData.modules.length} Modules)
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {currentLevelData.completedLessons} of {currentLevelData.totalLessons} lessons completed
              </span>
            </h3>

            <div className="space-y-4">
              {currentLevelData.modules.map((module) => {
                const isExpanded = expandedModules.has(module.module_number);
                const completedLessons = module.lessons.filter(l => l.is_completed).length;
                const totalLessons = module.lessons.length;
                const pct = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

                return (
                  <div key={module.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-200 transition-colors shadow-sm">
                    <button
                      onClick={() => toggleModule(module.module_number)}
                      className="w-full px-6 py-5 flex items-start gap-4 text-left transition-colors hover:bg-slate-50"
                    >
                      <div className="mt-1">
                        {module.is_completed ? (
                          <CheckCircle2 size={24} className="text-emerald-500" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                            {module.module_number}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                            Module {module.module_number}
                          </span>
                          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${currentLevelData.config.color.badgeBg} ${currentLevelData.config.color.badgeText}`}>
                            {selectedLevel}
                          </span>
                        </div>
                        <h4 className="font-bold text-lg text-slate-900 mb-1">{module.title}</h4>
                        <p className="text-sm text-slate-500 mb-3 line-clamp-2">{module.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} className="text-slate-400" />
                            {totalLessons} lessons
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} className="text-slate-400" />
                            {module.estimated_hours} hours
                          </span>
                          {module.quiz_questions_count > 0 && (
                            <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded font-semibold">
                              <Target size={12} />
                              {module.quiz_questions_count} Quiz Questions
                            </span>
                          )}
                        </div>

                        {course.enrolled && (
                          <div className="mt-4">
                            <ProgressBar pct={pct} />
                          </div>
                        )}
                      </div>
                      <div className="mt-1">
                        <ChevronDown size={20} className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/50">
                        <div className="p-3 space-y-1">
                          {module.lessons.map((lesson, lIdx) => (
                            <Link
                              key={lesson.id}
                              to={`/courses/${course.slug}/lessons/${lesson.id}`}
                              className="flex items-center justify-between p-3.5 rounded-xl hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-slate-200"
                            >
                              <div className="flex items-center gap-3.5">
                                <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                                  {lesson.is_completed ? (
                                    <CheckCircle2 size={18} className="text-emerald-500" />
                                  ) : (
                                    <PlayCircle size={18} />
                                  )}
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mr-2.5">
                                    Lesson {lIdx + 1}
                                  </span>
                                  <span className={`text-sm font-semibold ${lesson.is_completed ? 'text-slate-600' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                                    {lesson.title}
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                                {lesson.estimated_minutes} min
                              </div>
                            </Link>
                          ))}

                          {/* Module Quiz Card */}
                          {module.quiz_questions_count > 0 && (
                            <Link
                              to={`/courses/${course.slug}/modules/${module.module_number}/quiz`}
                              className="flex items-center justify-between p-3.5 rounded-xl bg-indigo-50/60 hover:bg-indigo-50 transition-all group border border-indigo-100 mt-2"
                            >
                              <div className="flex items-center gap-3.5">
                                <div className="text-indigo-600 group-hover:scale-110 transition-transform">
                                  <Target size={18} />
                                </div>
                                <div>
                                  <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider mr-2">
                                    Assessment
                                  </span>
                                  <span className="text-sm font-bold text-indigo-900 group-hover:text-indigo-700">
                                    {module.title} — Quiz
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs font-bold text-indigo-600 bg-white px-3 py-1 rounded-md border border-indigo-100 shadow-sm">
                                {module.quiz_questions_count} MCQs
                              </div>
                            </Link>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── LEVEL PRACTICE EXERCISES & TASKS ─── */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
              <Code size={20} className="text-indigo-600" />
              {currentLevelData.config.label} Practice Exercises & Tasks
            </h3>
            <p className="text-sm text-slate-500 mb-6">
              Hands-on practical challenges designed specifically to solidify your {selectedLevel} skills.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {currentLevelData.practiceTasks.map((task, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/60 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                        Task #{idx + 1}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {task.difficulty}
                      </span>
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 mb-1.5">{task.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{task.objective}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between text-xs font-semibold text-indigo-600">
                    <span>Integrated inside lessons</span>
                    <FileText size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── LEVEL COMPLETION SUMMARY & NEXT LEVEL CTA ─── */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-2">
                  <span>{currentLevelData.config.icon}</span>
                  <span>{currentLevelData.config.label} Progress Summary</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-extrabold mb-3">
                  {currentLevelData.isCompleted
                    ? `🎉 You've Completed the ${currentLevelData.config.label}!`
                    : `You are ${currentLevelData.progressPct}% through the ${currentLevelData.config.label}`}
                </h3>
                <div className="flex flex-wrap items-center gap-6 text-sm text-slate-300">
                  <div>
                    <span className="font-extrabold text-white text-base mr-1">{currentLevelData.completedLessons}</span>
                    <span className="text-slate-400">Lessons Completed</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-base mr-1">{currentLevelData.remainingLessons}</span>
                    <span className="text-slate-400">Remaining</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-white text-base mr-1">{currentLevelData.quizCount}</span>
                    <span className="text-slate-400">MCQs Ready</span>
                  </div>
                  <div>
                    <span className="font-extrabold text-emerald-400 text-base mr-1">
                      {currentLevelData.isCompleted ? '100%' : `${currentLevelData.progressPct}%`}
                    </span>
                    <span className="text-slate-400">Level Score</span>
                  </div>
                </div>
              </div>

              {/* Continue to Next Level / Quiz CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                {currentLevelData.firstModuleQuizNumber !== undefined && (
                  <Link
                    to={`/courses/${course.slug}/modules/${currentLevelData.firstModuleQuizNumber}/quiz`}
                    className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    <Target size={16} /> Take {currentLevelData.config.label} Quiz
                  </Link>
                )}

                {nextLevelKey ? (
                  <button
                    onClick={() => {
                      setSelectedLevel(nextLevelKey);
                      window.scrollTo({ top: 380, behavior: 'smooth' });
                    }}
                    className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    Continue to {COURSE_LEVELS_CONFIG[nextLevelKey].label}
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => navigate(`/courses/${course.slug}/complete`)}
                    className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition-all hover:scale-105"
                  >
                    <Award size={16} /> View Final Certificate
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
