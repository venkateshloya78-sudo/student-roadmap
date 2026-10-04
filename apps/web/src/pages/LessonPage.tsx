import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { CourseDetailOut, LessonOut } from '../types/course';
import CourseSidebar from '../components/Course/CourseSidebar';
import LessonContent from '../components/Course/LessonContent';
import LessonNav from '../components/Course/LessonNav';
import BreadcrumbNav from '../components/Course/BreadcrumbNav';
import InteractivePlayground from '../components/Course/InteractivePlayground';
import IndustryCaseStudies from '../components/Course/IndustryCaseStudies';
import InterviewVault from '../components/Course/InterviewVault';
import LessonFlashcards from '../components/Course/LessonFlashcards';
import ExportNotesModal from '../components/Course/ExportNotesModal';
import AIDeepDiveBar from '../components/Course/AIDeepDiveBar';
import CourseVideoPlayer from '../components/Course/CourseVideoPlayer';
import { Menu, BookOpen, Terminal, Building2, Award, Sparkles, Download, Bookmark, Video } from 'lucide-react';
import { FloatingAssistantWidget } from '../components/Assistant/FloatingAssistantWidget';
import { useLanguage } from '../i18n/LanguageContext';
import LanguageSelector from '../components/Common/LanguageSelector';

type TabType = 'notes' | 'video' | 'playground' | 'casestudies' | 'interview' | 'flashcards' | 'export';

export default function LessonPage() {
  const { slug, lessonId } = useParams<{ slug: string, lessonId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('notes');

  // Bookmark state
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  React.useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      const saved = JSON.parse(localStorage.getItem('srm_bookmarked_lessons') || '[]');
      setIsBookmarked(saved.includes(lessonId));
    } catch {
      setIsBookmarked(false);
    }
  }, [lessonId]);

  const toggleBookmark = () => {
    if (!lessonId) return;
    try {
      const saved: string[] = JSON.parse(localStorage.getItem('srm_bookmarked_lessons') || '[]');
      const next = saved.includes(lessonId) ? saved.filter(id => id !== lessonId) : [...saved, lessonId];
      localStorage.setItem('srm_bookmarked_lessons', JSON.stringify(next));
      setIsBookmarked(!isBookmarked);
    } catch {}
  };

  const { data: course } = useQuery<CourseDetailOut>({
    queryKey: ['course', slug],
    queryFn: () => api.get(`/courses/${slug}`).then(r => r.data),
    enabled: !!slug
  });

  const { data: lesson, isLoading } = useQuery<LessonOut>({
    queryKey: ['lesson', slug, lessonId],
    queryFn: () => api.get(`/courses/${slug}/lessons/${lessonId}`).then(r => r.data),
    enabled: !!slug && !!lessonId
  });

  const markCompleteMutation = useMutation({
    mutationFn: () => api.post(`/courses/${slug}/lessons/${lessonId}/complete`),
    onSuccess: () => {
      // Invalidate queries to refresh progress
      queryClient.invalidateQueries({ queryKey: ['course', slug] });
      queryClient.invalidateQueries({ queryKey: ['lesson', slug, lessonId] });
      queryClient.invalidateQueries({ queryKey: ['course-progress', slug] });
      
      // Auto navigate to next lesson after a short delay
      if (lesson?.next_lesson_id) {
        setTimeout(() => {
          navigate(`/courses/${slug}/lessons/${lesson.next_lesson_id}`);
          setActiveTab('notes');
        }, 1000);
      } else {
        setTimeout(() => {
          navigate(`/courses/${slug}/complete`);
        }, 1000);
      }
    }
  });

  if (!course || (!lesson && !isLoading)) return null;

  // Find module info for breadcrumb
  const moduleInfo = course.modules.find(m => m.id === lesson?.module_id);

  // Extract initial code snippet from content blocks if available
  const codeBlock = lesson?.content_blocks.find(b => b.type === 'code');
  const codeSnippet = codeBlock ? (Array.isArray(codeBlock.content) ? codeBlock.content.join('\n') : codeBlock.content) : undefined;
  const codeLang = codeBlock?.language || (
    slug?.includes('sql') ? 'sql' :
    slug?.includes('linux') || slug?.includes('devops') || slug?.includes('git') || slug?.includes('cloud') ? 'bash' :
    slug?.includes('web') || slug?.includes('mobile') ? 'javascript' :
    'python'
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3 min-w-0">
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>
          <div className="hidden sm:block">
            <BreadcrumbNav items={[
              { label: 'Home', href: '/' },
              { label: course.title, href: `/courses/${course.slug}` },
              { label: moduleInfo?.title || 'Module', href: undefined },
              { label: lesson?.title || 'Lesson', href: undefined }
            ]} />
          </div>
          <div className="sm:hidden font-bold text-slate-900 truncate text-sm">
            {lesson?.title || 'Loading...'}
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">{t('common.progress', 'Progress')}</span>
            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-indigo-600 rounded-full transition-all" 
                style={{ width: `${course.progress_pct}%` }}
              />
            </div>
            <span className="text-xs font-bold text-indigo-600">{Math.round(course.progress_pct)}%</span>
          </div>

          {/* Language Selector */}
          <LanguageSelector variant="compact" />

          <button
            onClick={toggleBookmark}
            className={`p-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              isBookmarked
                ? 'bg-amber-50 border-amber-300 text-amber-700 shadow-xs'
                : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
            title={isBookmarked ? t('lesson.bookmarked', 'Bookmarked') : t('lesson.bookmark', 'Bookmark this lesson')}
          >
            <Bookmark size={15} className={isBookmarked ? 'fill-amber-500 text-amber-500' : ''} />
            <span className="hidden sm:inline">{isBookmarked ? t('lesson.bookmarked', 'Bookmarked') : t('lesson.bookmark', 'Bookmark')}</span>
          </button>

          <button 
            onClick={() => navigate(`/courses/${slug}`)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
          >
            {t('lesson.exit', 'Exit')}
          </button>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <CourseSidebar 
          course={course} 
          activeLessonId={lessonId!} 
          courseSlug={slug!} 
          isMobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 flex flex-col pb-24 lg:pb-0">
          <div className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 md:p-8">
            {isLoading ? (
              <div className="animate-pulse space-y-6">
                <div className="h-10 bg-slate-200 rounded-lg w-2/3"></div>
                <div className="h-4 bg-slate-200 rounded w-1/4 mb-12"></div>
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-full"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : lesson ? (
              <>
                {/* Lesson Header Banner */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <button
                      onClick={() => navigate(`/courses/${slug}`)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-2xs mr-2 transition-colors"
                    >
                      ← Back to Course
                    </button>
                    <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${
                      (moduleInfo?.level || '').toLowerCase() === 'advanced'
                        ? 'bg-purple-100 text-purple-800'
                        : (moduleInfo?.level || '').toLowerCase() === 'intermediate'
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {(moduleInfo?.level || '').toLowerCase() === 'advanced' ? '🚀 Advanced Level' : (moduleInfo?.level || '').toLowerCase() === 'intermediate' ? '🌿 Intermediate Level' : '🌱 Beginner Level'}
                    </span>
                    <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                      Module {moduleInfo?.module_number || 1} • Lesson {lesson.lesson_number}
                    </span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-3 tracking-tight">
                    {lesson.title}
                  </h1>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-500 font-medium">
                    <span className="flex items-center gap-1">⏱️ {lesson.estimated_minutes} min read</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">🎓 {course.title}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">✨ Comprehensive Mastery Mode</span>
                    <span>•</span>
                    <button
                      onClick={() => setActiveTab('video')}
                      className="flex items-center gap-1.5 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-0.5 rounded-full font-bold text-xs transition-colors border border-red-200"
                    >
                      <Video size={13} />
                      <span>🎥 Video Class Available</span>
                    </button>
                  </div>
                </div>


                {/* Multi-Tab Navigation Bar */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-8 border-b border-slate-200 no-scrollbar">
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'notes'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <BookOpen size={16} />
                    <span>📖 {t('lesson.deepNotes', 'Deep Notes')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('video')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'video'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Video size={16} className={activeTab === 'video' ? 'text-white' : 'text-red-500'} />
                    <span>🎥 {t('lesson.videoClass', 'Video Class')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('playground')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'playground'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Terminal size={16} />
                    <span>💻 {t('lesson.codePlayground', 'Code Playground')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('casestudies')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'casestudies'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Building2 size={16} />
                    <span>🏢 {t('lesson.caseStudies', 'Case Studies')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('interview')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'interview'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Award size={16} />
                    <span>🎯 {t('lesson.interviewVault', 'FAANG Interview Vault')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('flashcards')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'flashcards'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Sparkles size={16} />
                    <span>🗂️ {t('lesson.flashcards', 'Flashcards')}</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('export')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm whitespace-nowrap transition-all ${
                      activeTab === 'export'
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Download size={16} />
                    <span>📥 {t('lesson.downloadPDF', 'Download PDF Notes')}</span>
                  </button>
                </div>

                {/* Tab Views */}
                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    {/* Inline AI Concept Expansion Bar */}
                    <AIDeepDiveBar lessonTitle={lesson.title} courseTitle={course.title} />

                    {/* Core Lesson Content Blocks */}
                    <LessonContent blocks={lesson.content_blocks} />
                  </div>
                )}

                {activeTab === 'video' && (
                  <CourseVideoPlayer
                    courseSlug={slug!}
                    lessonTitle={lesson.title}
                    courseTitle={course.title}
                  />
                )}

                {activeTab === 'playground' && (
                  <InteractivePlayground
                    initialCode={codeSnippet}
                    language={codeLang}
                    lessonTitle={lesson.title}
                  />
                )}

                {activeTab === 'casestudies' && (
                  <IndustryCaseStudies
                    lessonTitle={lesson.title}
                    courseCategory={course.category}
                  />
                )}

                {activeTab === 'interview' && (
                  <InterviewVault
                    lessonTitle={lesson.title}
                    courseCategory={course.category}
                  />
                )}

                {activeTab === 'flashcards' && (
                  <LessonFlashcards
                    lessonTitle={lesson.title}
                    blocks={lesson.content_blocks}
                  />
                )}

                {activeTab === 'export' && (
                  <ExportNotesModal
                    lessonTitle={lesson.title}
                    courseTitle={course.title}
                    lessonNumber={lesson.lesson_number}
                    moduleTitle={moduleInfo?.title}
                    estimatedMinutes={lesson.estimated_minutes}
                    blocks={lesson.content_blocks}
                  />
                )}
              </>
            ) : (
              <div className="text-center py-20 text-slate-500">
                Lesson not found.
              </div>
            )}
          </div>

          {/* Bottom Navigation */}
          {lesson && (
            <LessonNav
              prevLessonId={lesson.prev_lesson_id}
              nextLessonId={lesson.next_lesson_id}
              prevLessonTitle={lesson.prev_lesson_title}
              nextLessonTitle={lesson.next_lesson_title}
              courseSlug={slug!}
              lessonId={lessonId!}
              isCompleted={lesson.is_completed}
              onMarkComplete={() => markCompleteMutation.mutate()}
              isMarkingComplete={markCompleteMutation.isPending}
            />
          )}
        </main>
      </div>

      {/* Floating AI Assistant Widget */}
      <FloatingAssistantWidget />
    </div>
  );
}
