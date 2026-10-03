import React, { useState } from 'react';
import { CourseDetailOut } from '../../types/course';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, CheckCircle2, PlayCircle, Circle, X } from 'lucide-react';
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

  const sidebarContent = (
    <div className="h-full flex flex-col bg-white border-r border-slate-200">
      {/* Sidebar Header */}
      <div className="p-5 border-b border-slate-100 flex-shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-slate-900 leading-tight pr-4">{course.title}</h2>
          {onCloseMobile && (
            <button onClick={onCloseMobile} className="md:hidden p-1 text-slate-400 hover:text-slate-700 bg-slate-50 rounded-full">
              <X size={18} />
            </button>
          )}
        </div>
        <ProgressBar pct={course.progress_pct} label="Course Progress" />
      </div>

      {/* Modules List */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        {course.modules.map((module, idx) => {
          const isExpanded = expandedModules.has(idx);
          const completedLessons = module.lessons.filter(l => l.is_completed).length;
          const totalLessons = module.lessons.length;
          
          return (
            <div key={module.id} className="border-b border-slate-100 last:border-b-0">
              <button
                onClick={() => toggleModule(idx)}
                className={`w-full px-5 py-4 flex items-start gap-3 text-left transition-colors hover:bg-slate-50 ${isExpanded ? 'bg-slate-50' : ''}`}
              >
                <div className="mt-0.5">
                  {module.is_completed ? (
                    <CheckCircle2 size={18} className="text-emerald-500" />
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-slate-300 flex items-center justify-center text-[9px] font-bold text-slate-500">
                      {idx + 1}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold text-sm truncate ${module.is_completed ? 'text-slate-700' : 'text-slate-900'}`}>
                    {module.title}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-500">
                    <span>{completedLessons}/{totalLessons} lessons</span>
                  </div>
                </div>
                <ChevronDown 
                  size={16} 
                  className={`text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} 
                />
              </button>

              {/* Lessons List */}
              <div 
                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
              >
                <div className="pb-3 px-2 bg-slate-50/50">
                  {module.lessons.map((lesson) => {
                    const isActive = lesson.id === activeLessonId;
                    
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => {
                          navigate(`/courses/${courseSlug}/lessons/${lesson.id}`);
                          if (onCloseMobile) onCloseMobile();
                        }}
                        className={`w-full flex items-start gap-3 p-2.5 rounded-lg text-left text-sm transition-colors mb-0.5
                          ${isActive 
                            ? 'bg-indigo-50 text-indigo-700 font-medium' 
                            : 'hover:bg-slate-100 text-slate-600'
                          }
                        `}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {lesson.is_completed ? (
                            <CheckCircle2 size={16} className="text-emerald-500" />
                          ) : isActive ? (
                            <PlayCircle size={16} className="text-indigo-500" />
                          ) : (
                            <Circle size={16} className="text-slate-300" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="block truncate">{lesson.title}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{lesson.estimated_minutes} min</span>
                        </div>
                      </button>
                    );
                  })}
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
