import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonNavProps {
  prevLessonId?: string;
  nextLessonId?: string;
  prevLessonTitle?: string;
  nextLessonTitle?: string;
  courseSlug: string;
  lessonId: string;
  isCompleted: boolean;
  onMarkComplete: () => void;
  isMarkingComplete: boolean;
}

export default function LessonNav({
  prevLessonId,
  nextLessonId,
  prevLessonTitle,
  nextLessonTitle,
  courseSlug,
  isCompleted,
  onMarkComplete,
  isMarkingComplete
}: LessonNavProps) {
  const navigate = useNavigate();

  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 mt-12 z-20">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={() => prevLessonId && navigate(`/courses/${courseSlug}/lessons/${prevLessonId}`)}
          disabled={!prevLessonId}
          className={`group flex flex-col items-start px-4 py-2 rounded-xl transition-all w-1/3 ${
            prevLessonId 
              ? 'hover:bg-slate-100 cursor-pointer' 
              : 'opacity-50 cursor-not-allowed'
          }`}
        >
          <div className="flex items-center text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
            <ChevronLeft size={18} className="mr-1" />
            Previous
          </div>
          {prevLessonTitle && (
            <span className="text-xs text-slate-500 truncate max-w-full pl-6">
              {prevLessonTitle}
            </span>
          )}
        </button>

        {/* Mark Complete Button */}
        <div className="flex justify-center w-1/3">
          <button
            onClick={onMarkComplete}
            disabled={isMarkingComplete || isCompleted}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold shadow-sm transition-all ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-700 cursor-default'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20 hover:shadow-emerald-500/40'
            }`}
          >
            <CheckCircle2 size={20} className={isCompleted ? 'text-emerald-600' : 'text-white'} />
            {isCompleted ? 'Completed' : (isMarkingComplete ? 'Marking...' : 'Mark as Complete')}
          </button>
        </div>

        {/* Next Button */}
        <button
          onClick={() => {
            if (nextLessonId) {
              navigate(`/courses/${courseSlug}/lessons/${nextLessonId}`);
            } else {
              navigate(`/courses/${courseSlug}/complete`);
            }
          }}
          className="group flex flex-col items-end px-4 py-2 rounded-xl hover:bg-indigo-50 transition-all cursor-pointer w-1/3 text-right"
        >
          <div className="flex items-center text-sm font-bold text-indigo-600 group-hover:text-indigo-800 transition-colors">
            {nextLessonId ? 'Next Lesson' : 'Complete Course'}
            <ChevronRight size={18} className="ml-1" />
          </div>
          {nextLessonTitle ? (
            <span className="text-xs text-indigo-400 truncate max-w-full pr-6 group-hover:text-indigo-500">
              {nextLessonTitle}
            </span>
          ) : (
            <span className="text-xs text-indigo-400 truncate max-w-full pr-6 group-hover:text-indigo-500">
              Finish!
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
