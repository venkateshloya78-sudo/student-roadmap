import React, { useState } from 'react';
import { CourseDetailOut } from '../../types/course';
import { useNavigate, Link } from 'react-router-dom';
import { ChevronDown, CheckCircle2, PlayCircle, Circle, X, ArrowLeft, Layers } from 'lucide-react';
import ProgressBar from './ProgressBar';

interface CourseSidebarProps {
  course: CourseDetailOut;
  activeLessonId: string;
  courseSlug: string;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export default function CourseSidebar({ 
  course, 
  activeLessonId, 
  courseSlug,
  isMobileOpen = false,
  onCloseMobile
}: CourseSidebarProps) {
  const navigate = useNavigate();
  // Find which module contains the active lesson to expand it by default
  const activeModuleIndex = course.modules.findIndex(m => 
    m.lessons.some(l => l.id === activeLessonId)
  );
  
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set([activeModuleIndex !== -1 ? activeModuleIndex : 0])
  );

  const toggleModule = (idx: number) => {
    setExpandedModules(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  const getLevelBadge = (level?: string) => {
    const l = (level || 'beginner').toLowerCase();
    if (l === 'intermediate') {
      return { icon: '🌿', text: 'Intermediate', cls: 'bg-indigo-100 text-indigo-700' };
    }
    if (l === 'advanced') {
      return { icon: '🚀', text: 'Advanced', cls: 'bg-purple-100 text-purple-700' };
    }
    return { icon: '🌱', text: 'Beginner', cls: 'bg-emerald-100 text-emerald-700' };
  };

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="p-4 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-2">
          <Link
            to={`/courses/${courseSlug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <ArrowLeft size={14} /> Back to Course Overview
          </Link>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="md:hidden p-1 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full">
              <X size={18} />
            </button>
          )}
        </div>
        <h2 className="font-bold text-slate-900 leading-tight pr-4 text-sm truncate mb-3" title={course.title}>
          {course.title}
        </h2>
        <ProgressBar pct={course.progress_pct} label="Overall Progress" />
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {course.modules.map((module, idx) => {
          const isExpanded = expandedModules.has(idx);
          const completedLessons = module.lessons.filter(l => l.is_completed).length;
          const totalLessons = module.lessons.length;
          const levelInfo = getLevelBadge(module.level);
          
          return (
            <div key={module.id} className="border-b border-slate-100 last:border-b-0">
              <button
                onClick={() => toggleModule(idx)}
                className={`w-full px-4 py-3.5 flex items-start gap-2.5 text-left transition-colors hover:bg-slate-50 ${isExpanded ? 'bg-slate-50/70' : ''}`}
              >
                <div className="mt-0.5 flex-shrink-0">
                  {module.is_completed ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500">
                      {module.module_number}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ${levelInfo.cls}`}>
                      {levelInfo.icon} {levelInfo.text}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">
                      M{module.module_number}
                    </span>
                  </div>
                  <h3 className={`font-semibold text-xs leading-snug line-clamp-2 ${module.is_completed ? 'text-slate-700' : 'text-slate-900'}`}>
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                    <span>{completedLessons}/{totalLessons} lessons</span>
                    {module.quiz_questions_count > 0 && (
                      <span>• {module.quiz_questions_count} MCQs</span>
                    )}
                  </div>
                </div>
                <ChevronDown 
                  size={14} 
                  className={`text-slate-400 mt-1 transition-transform duration-200 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Lessons List */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pb-2 px-2 bg-slate-50/40">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          navigate(`/courses/${courseSlug}/lessons/${lesson.id}`);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-start gap-2.5 p-2 rounded-lg text-left text-xs transition-colors mb-0.5
                          ${isActive 
                            ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-xs' 
                            : 'hover:bg-slate-100/80 text-slate-600'
                          }
                        `}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {lesson.is_completed ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : isActive ? (
                            <PlayCircle size={14} className="text-indigo-600" />
                          ) : (
                            <Circle size={14} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block truncate">{lesson.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{lesson.estimated_minutes} min</span>
                        </div>
                      </button>
                    );
                  })}

                  {/* Module Quiz link inside sidebar */}
                  {module.quiz_questions_count > 0 && (
                    <button
                      onClick={() => {
                        navigate(`/courses/${courseSlug}/modules/${module.module_number}/quiz`);
                        if (onCloseMobile) onCloseMobile();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-lg text-left text-xs text-indigo-700 hover:bg-indigo-50 font-semibold transition-colors mt-1"
                    >
                      <span className="text-xs">🎯</span>
                      <span className="truncate flex-1">Take Module Quiz</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-mono">
                        {module.quiz_questions_count} Qs
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:block w-72 flex-shrink-0 h-[calc(100vh-3.5rem)] sticky top-14 z-10">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <div className="relative flex-1 w-full max-w-xs bg-white h-full transform transition-transform shadow-xl">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
