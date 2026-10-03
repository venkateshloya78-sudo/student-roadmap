import React, { useState } from 'react';
import AppShell from '../components/Layout/AppShell';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../lib/api';
import { CourseDetailOut } from '../types/course';
import { Clock, BookOpen, Target, CheckCircle2, PlayCircle, ChevronDown, Award } from 'lucide-react';
import BreadcrumbNav from '../components/Course/BreadcrumbNav';
import ProgressBar from '../components/Course/ProgressBar';

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

  const [expandedModules, setExpandedModules] = useState<Set<number>>(new Set([0]));

  const toggleModule = (idx: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-8">
          <div className="h-64 bg-slate-100 rounded-3xl"></div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-4">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl"></div>)}
            </div>
            <div className="h-64 bg-slate-100 rounded-xl"></div>
          </div>
        </div>
      </AppShell>
    );
  }

  if (!course) return null;

  const firstLessonId = course.modules[0]?.lessons[0]?.id;
  const continueLessonId = progress?.last_lesson_id || firstLessonId;
  const isCompleted = course.progress_pct === 100;

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <BreadcrumbNav items={[
          { label: 'Home', href: '/' },
          { label: 'Courses', href: '/courses' },
          { label: course.title }
        ]} />

        {/* Hero Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 mb-8 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row gap-12 items-start justify-between">
            <div className="flex-1 max-w-3xl">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                  {course.difficulty}
                </span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                {course.title}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl">
                {course.description}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-slate-500 mb-10">
                <div className="flex items-center gap-2">
                  <Clock className="text-indigo-500" size={18} />
                  {course.duration_weeks} weeks
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="text-indigo-500" size={18} />
                  {course.num_modules} modules, {course.num_lessons} lessons
                </div>
              </div>

              {/* Skills Gained */}
              {course.skills_gained?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-bold text-slate-900 mb-3 uppercase tracking-wider flex items-center gap-2">
                    <Target size={16} className="text-emerald-500" />
                    Skills you'll gain
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {course.skills_gained.map((skill, i) => (
                      <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium border border-emerald-100">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button (Mobile only) */}
              <div className="md:hidden mt-8">
                {isCompleted ? (
                  <button onClick={() => navigate(`/courses/${course.slug}/complete`)} className="w-full px-6 py-4 bg-emerald-600 text-white font-bold rounded-xl shadow-lg shadow-emerald-200">
                    View Certificate
                  </button>
                ) : course.enrolled ? (
                  <button onClick={() => navigate(`/courses/${course.slug}/lessons/${continueLessonId}`)} className="w-full px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 flex justify-center items-center gap-2">
                    <PlayCircle size={20} /> Continue Learning
                  </button>
                ) : (
                  <button onClick={() => navigate(`/courses/${course.slug}/lessons/${firstLessonId}`)} className="w-full px-6 py-4 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200">
                    Start Learning Now
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Action Card */}
            <div className="hidden md:block w-80 bg-slate-50 rounded-2xl p-6 border border-slate-200 flex-shrink-0 relative top-0 right-0">
              {isCompleted ? (
                <div className="text-center">
                  <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award size={40} />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2">Course Completed!</h3>
                  <p className="text-sm text-slate-500 mb-6">You've successfully finished all lessons and quizzes.</p>
                  <button onClick={() => navigate(`/courses/${course.slug}/complete`)} className="w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-emerald-200">
                    View Certificate
                  </button>
                </div>
              ) : course.enrolled ? (
                <div>
                  <div className="mb-6">
                    <ProgressBar pct={course.progress_pct} label="Overall Progress" />
                  </div>
                  <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
                    <span>{progress?.lessons_completed || 0} / {course.num_lessons} lessons</span>
                    <span>{progress?.modules_completed || 0} / {course.num_modules} modules</span>
                  </div>
                  <button onClick={() => navigate(`/courses/${course.slug}/lessons/${continueLessonId}`)} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 flex justify-center items-center gap-2 hover:-translate-y-0.5">
                    <PlayCircle size={20} /> Continue Learning
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-bold text-xl text-slate-900 mb-2">Ready to start?</h3>
                  <p className="text-sm text-slate-500 mb-6">Enroll now to track your progress and earn a certificate.</p>
                  <button onClick={() => navigate(`/courses/${course.slug}/lessons/${firstLessonId}`)} className="w-full px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:-translate-y-0.5">
                    Start Learning Now
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Course Curriculum */}
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            Course Curriculum
          </h2>
          
          <div className="space-y-4">
            {course.modules.map((module, idx) => {
              const isExpanded = expandedModules.has(idx);
              const completedLessons = module.lessons.filter(l => l.is_completed).length;
              const totalLessons = module.lessons.length;
              const pct = (completedLessons / totalLessons) * 100 || 0;

              return (
                <div key={module.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:border-indigo-200 transition-colors">
                  <button
                    onClick={() => toggleModule(idx)}
                    className="w-full px-6 py-5 flex items-start gap-4 text-left transition-colors hover:bg-slate-50"
                  >
                    <div className="mt-1">
                      {module.is_completed ? (
                        <CheckCircle2 size={24} className="text-emerald-500" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-slate-500">
                          {idx + 1}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 pr-4">
                      <h3 className="font-bold text-lg text-slate-900 mb-1">{module.title}</h3>
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
                          <span className="flex items-center gap-1 text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            <Target size={12} />
                            Quiz included
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
                      <div className="p-2">
                      {module.lessons.map((lesson, lIdx) => (
                        <Link
                          key={lesson.id}
                          to={`/courses/${course.slug}/lessons/${lesson.id}`}
                          className="flex items-center justify-between p-4 rounded-xl hover:bg-white hover:shadow-sm transition-all group border border-transparent hover:border-slate-200 mb-1"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-slate-400 group-hover:text-indigo-500 transition-colors">
                              {lesson.is_completed ? (
                                <CheckCircle2 size={18} className="text-emerald-500" />
                              ) : (
                                <PlayCircle size={18} />
                              )}
                            </div>
                            <div>
                              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-3">Lesson {lIdx + 1}</span>
                              <span className={`font-medium ${lesson.is_completed ? 'text-slate-600' : 'text-slate-900 group-hover:text-indigo-700'}`}>
                                {lesson.title}
                              </span>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                            {lesson.estimated_minutes} min
                          </div>
                        </Link>
                      ))}
                      
                      {module.quiz_questions_count > 0 && (
                        <Link
                          to={`/courses/${course.slug}/modules/${module.module_number}/quiz`}
                          className="flex items-center justify-between p-4 rounded-xl bg-indigo-50/50 hover:bg-indigo-50 transition-all group border border-indigo-100 mt-2"
                        >
                          <div className="flex items-center gap-4">
                            <div className="text-indigo-400 group-hover:text-indigo-600 transition-colors">
                              <Target size={18} />
                            </div>
                            <div>
                              <span className="font-bold text-indigo-900 group-hover:text-indigo-700">Module Quiz: {module.title}</span>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-indigo-600 bg-white px-2.5 py-1 rounded-md border border-indigo-100 shadow-sm">
                            {module.quiz_questions_count} Questions
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
      </div>
    </AppShell>
  );
}


