import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { useLanguage } from '../i18n/LanguageContext'
import {
  Compass,
  GraduationCap,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Flame,
  Clock,
  BookOpen,
  TrendingUp,
  Award,
  ChevronRight,
  AlertCircle,
  Play,
  Layers,
  FileText
} from 'lucide-react'

export default function Dashboard() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
  })
  const { data: roadmaps } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => api.get('/roadmaps/').then(r => r.data),
    retry: false,
  })
  const { data: courses } = useQuery({
    queryKey: ['courses-list'],
    queryFn: () => api.get('/courses/').then(r => r.data),
    retry: false,
    staleTime: 300_000,
  })

  const profile = me?.profile
  const profileComplete = profile?.degree && profile?.branch && profile?.year

  const enrolledCourses = (courses || []).filter((c: any) => c.enrolled)
  const inProgressCourse = enrolledCourses.find((c: any) => c.progress_pct > 0 && c.progress_pct < 100)

  // Compute study progress stats from localStorage
  const { studiedTopics, myNotesTotal } = useMemo(() => {
    let studied = 0
    let notes = 0
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith('srm_studied_')) {
        try { studied += JSON.parse(localStorage.getItem(key) || '[]').length } catch {}
      }
      if (key.startsWith('srm_mynotes_')) {
        try { notes += Object.keys(JSON.parse(localStorage.getItem(key) || '{}')).length } catch {}
      }
    }
    return { studiedTopics: studied, myNotesTotal: notes }
  }, [])

  const hasRoadmap = (roadmaps?.items?.length ?? 0) > 0
  const activeRoadmap = hasRoadmap ? roadmaps.items[0] : null
  const userName = me?.user?.email?.split('@')[0] || 'Scholar'

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Modern Command Center Hero Greeting */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 shadow-xl shadow-indigo-950/15 border border-indigo-900/40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 right-20 w-64 h-64 bg-purple-500/15 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold border border-white/10 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>3-Day Learning Streak</span>
                </span>
                {profile?.branch && (
                  <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-medium border border-indigo-400/20">
                    {profile.branch} • Year {profile.year || '1'}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
                {t('dashboard.welcome', 'Welcome back')}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 capitalize">{userName}</span> 👋
              </h1>
              <p className="text-sm text-slate-300 max-w-xl leading-relaxed">
                {hasRoadmap 
                  ? `You are on track for ${activeRoadmap?.career_role_title || 'your dream role'}. Keep the momentum going today!`
                  : 'Start your career acceleration journey by selecting your target role and generating a personalized learning plan.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                to={hasRoadmap ? `/roadmaps/${activeRoadmap.id}` : '/careers'}
                className="btn-primary text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-indigo-600/30 font-semibold"
              >
                <span>{hasRoadmap ? 'View Roadmap' : 'Generate Roadmap'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/assistant"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-sm border border-white/15 transition-all"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Ask AI Copilot</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Profile Incomplete Warning Banner */}
        {!isLoading && !profileComplete && (
          <div className="flex items-center justify-between gap-4 p-4 bg-amber-500/10 border border-amber-300/40 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-amber-900">Complete your student profile</p>
                <p className="text-xs text-amber-700">Add your degree, branch, and academic year to calibrate AI roadmaps accurately.</p>
              </div>
            </div>
            <Link to="/profile" className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs shrink-0 transition-all">
              Complete now →
            </Link>
          </div>
        )}

        {/* Continue Learning Prominent Banner */}
        {inProgressCourse && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-50 via-purple-50/60 to-white border border-indigo-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/25 shrink-0">
                <Play className="w-6 h-6 fill-white ml-0.5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-100/70 px-2 py-0.5 rounded-md">
                    {t('dashboard.continueLearning', 'Resume Course')}
                  </span>
                  <span className="text-xs text-slate-500">
                    {Math.round(inProgressCourse.progress_pct)}% completed
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{inProgressCourse.title}</h3>
                <div className="w-full sm:w-64 bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.max(5, inProgressCourse.progress_pct)}%` }} 
                  />
                </div>
              </div>
            </div>
            <Link 
              to={`/courses/${inProgressCourse.slug}`} 
              className="btn-primary text-sm px-6 py-2.5 rounded-xl whitespace-nowrap self-start md:self-center"
            >
              <span>{t('common.next', 'Continue Lesson')}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>
        )}

        {/* 4 Core Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {/* Stat 1: Target Career */}
          <div className="card p-5 group hover:border-indigo-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('nav.careers', 'Career Path')}
              </span>
              <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900 truncate">
              {hasRoadmap ? activeRoadmap?.career_role_title?.split(' ')[0] : '—'}
            </div>
            <p className="text-xs text-indigo-600 font-medium mt-1 truncate">
              {hasRoadmap ? 'Active Roadmap' : 'None Selected'}
            </p>
          </div>

          {/* Stat 2: Active Courses */}
          <div className="card p-5 group hover:border-purple-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {t('nav.courses', 'Courses')}
              </span>
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <GraduationCap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {courses?.length || 12}
            </div>
            <p className="text-xs text-purple-600 font-medium mt-1">
              {enrolledCourses.length > 0 ? `${enrolledCourses.length} in progress` : '12 Available to start'}
            </p>
          </div>

          {/* Stat 3: Topics Studied */}
          <div className="card p-5 group hover:border-emerald-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Topics Studied
              </span>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {studiedTopics > 0 ? studiedTopics : '0'}
            </div>
            <p className="text-xs text-emerald-600 font-medium mt-1">
              {studiedTopics > 0 ? 'Verified mastery' : 'Begin your first topic'}
            </p>
          </div>

          {/* Stat 4: Personal Notes */}
          <div className="card p-5 group hover:border-rose-300 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                My Notes
              </span>
              <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
            </div>
            <div className="text-2xl font-black text-slate-900">
              {myNotesTotal > 0 ? myNotesTotal : '0'}
            </div>
            <p className="text-xs text-rose-600 font-medium mt-1">
              {myNotesTotal > 0 ? 'Study snippets created' : 'Write notes in lessons'}
            </p>
          </div>
        </div>

        {/* Bento Grid: Core Platform Pillars */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Pillar 1: Career Roadmap Status */}
          <div className="card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  {hasRoadmap ? 'Active Path' : 'Roadmap Engine'}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">
                {hasRoadmap ? t('roadmap.title', 'Continue your roadmap') : t('careers.generateRoadmap', 'Generate your roadmap')}
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                {hasRoadmap
                  ? `${activeRoadmap?.career_role_title} roadmap with sequenced prerequisite stages and checkpoints.`
                  : 'Select your target engineering or design role to compute a step-by-step career blueprint.'}
              </p>
            </div>
            <Link
              to={hasRoadmap ? `/roadmaps/${activeRoadmap.id}` : '/careers'}
              className="btn-primary text-sm w-full justify-between"
            >
              <span>{hasRoadmap ? 'Open Roadmap Graph' : 'Explore Careers & Build'}</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Pillar 2: Course Catalog & Interactive Practice */}
          <div className="card p-6 flex flex-col justify-between group">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                  12 Full Courses
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">
                Curated Skill Courses
              </h3>
              <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                Deep dive into Python, DSA, SQL, Web Dev, Cloud Architecture, DevOps, and Cybersecurity with interactive quizzes.
              </p>
            </div>
            <Link
              to="/courses"
              className="btn-secondary text-sm w-full justify-between group-hover:border-purple-300"
            >
              <span>Browse All 12 Courses</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          {/* Pillar 3: AI Copilot Prompt Launcher */}
          <div className="card p-6 flex flex-col justify-between group bg-gradient-to-br from-white via-indigo-50/20 to-purple-50/30">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                  Gemini AI Mentor
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-lg mb-1">
                AI Study Advisor
              </h3>
              <p className="text-sm text-slate-500 mb-4 leading-relaxed">
                Need clarification or mock interview prep? Ask the AI mentor anything:
              </p>
              
              <div className="space-y-2 mb-4">
                <button
                  onClick={() => navigate('/assistant')}
                  className="w-full text-left text-xs p-2 rounded-lg bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors truncate"
                >
                  ⚡ "Explain Big-O time complexity with examples"
                </button>
                <button
                  onClick={() => navigate('/assistant')}
                  className="w-full text-left text-xs p-2 rounded-lg bg-slate-100/80 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 font-medium transition-colors truncate"
                >
                  🎯 "What projects make a Cloud Engineer resume stand out?"
                </button>
              </div>
            </div>

            <Link
              to="/assistant"
              className="btn-primary text-sm w-full justify-between bg-gradient-to-r from-indigo-600 to-purple-600"
            >
              <span>Open AI Assistant</span>
              <Sparkles className="w-4 h-4 ml-1" />
            </Link>
          </div>

        </div>

        {/* Profile Snapshot Card */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                <Award className="w-4 h-4" />
              </div>
              <h2 className="font-bold text-slate-900 text-base">Academic & Career Profile</h2>
            </div>
            <Link to="/profile" className="text-xs text-indigo-600 hover:text-indigo-700 font-semibold flex items-center gap-1">
              <span>Edit Profile</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { label: 'Degree', value: profile?.degree?.toUpperCase() || 'Not set' },
              { label: 'Branch', value: profile?.branch || 'Not set' },
              { label: 'Year', value: profile?.year ? `Year ${profile.year}` : 'Not set' },
              { label: 'University', value: profile?.university || 'Not set' },
              { label: 'Location', value: profile?.location_city || 'Not set' },
              { label: 'Weekly Target', value: profile?.weekly_learning_hours ? `${profile.weekly_learning_hours} hrs/wk` : 'Not set' },
            ].map(f => (
              <div key={f.label} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100">
                <p className="text-[11px] font-medium text-slate-400 mb-1">{f.label}</p>
                <p className={`text-xs font-bold truncate ${f.value === 'Not set' ? 'text-slate-400' : 'text-slate-800'}`}>
                  {f.value}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppShell>
  )
}
