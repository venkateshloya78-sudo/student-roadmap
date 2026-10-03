import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { getCareerProfile, CareerProfile } from '../data/careerProfiles'
import { getRecommendedCoursesForCareer } from '../data/careerCoursesMap'
import { useLanguage } from '../i18n/LanguageContext'
import { 
  Briefcase, 
  Building2, 
  GraduationCap, 
  Wrench, 
  TrendingUp, 
  DollarSign, 
  Compass, 
  CheckCircle2, 
  ArrowRight, 
  Clock, 
  Users, 
  Sparkles, 
  Layers, 
  Award, 
  ChevronRight, 
  Target,
  BookOpen
} from 'lucide-react'

const difficultyColor: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-800',
  intermediate: 'bg-amber-100 text-amber-800',
  advanced: 'bg-rose-100 text-rose-800',
  expert: 'bg-purple-100 text-purple-800',
}

function ImportanceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color = pct >= 80 ? 'bg-indigo-600' : pct >= 60 ? 'bg-blue-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5 overflow-hidden">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right font-medium">{pct}%</span>
    </div>
  )
}

export default function CareerDetail() {
  const { slug = '' } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [hours, setHours] = useState(10)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const profile: CareerProfile | null = getCareerProfile(slug)

  const { data: career, isLoading } = useQuery({
    queryKey: ['career', slug],
    queryFn: () => api.get(`/careers/${slug}`).then(r => r.data),
  })

  const { data: gap } = useQuery({
    queryKey: ['gap', slug],
    queryFn: () => api.get(`/careers/${slug}/skill-gap`).then(r => r.data),
    retry: false,
  })

  const { data: allCourses = [] } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses').then(r => r.data),
    staleTime: 60_000,
  })

  const recommendedCourseSlugs = getRecommendedCoursesForCareer(slug)
  const matchedCourses = (allCourses as any[]).filter(c => recommendedCourseSlugs.includes(c.slug))

  const handleGenerate = async () => {
    setGenerating(true)
    setGenError('')
    try {
      const res = await api.post('/roadmaps/generate', { career_role_slug: slug, weekly_hours: hours })
      navigate(`/roadmaps/${res.data.id}`)
    } catch (err: any) {
      setGenError(err.response?.data?.detail || 'Failed to generate roadmap')
      setGenerating(false)
    }
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-6">
          <div className="h-4 bg-slate-100 rounded w-28" />
          <div className="h-10 bg-slate-100 rounded w-2/3" />
          <div className="h-20 bg-slate-100 rounded" />
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-4">
              <div className="h-40 bg-slate-100 rounded-2xl" />
              <div className="h-60 bg-slate-100 rounded-2xl" />
            </div>
            <div className="h-80 bg-slate-100 rounded-2xl" />
          </div>
        </div>
      </AppShell>
    )
  }

  const sortedSkills = [...(career?.required_skills || [])].sort((a, b) => b.importance - a.importance)
  const readiness = gap ? Math.round(gap.overall_readiness * 100) : null
  const careerTitle = career?.title || profile?.title || 'Career Profile'
  const careerOverview = profile?.overview || career?.description || ''

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation back */}
        <button
          onClick={() => navigate('/careers')}
          className="text-xs text-slate-500 hover:text-indigo-600 mb-4 inline-flex items-center gap-1 font-medium transition-colors"
        >
          ← {t('careers.back', 'Back to Careers')}
        </button>

        {/* Hero Header */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 mb-8 relative overflow-hidden shadow-xl border border-slate-800">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-3xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-3 border border-indigo-400/30">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>CAREER PROFILE & OCCUPATIONAL GUIDE</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-white">
                  {careerTitle}
                </h1>
                {profile?.tagline && (
                  <p className="text-indigo-200 text-base sm:text-lg font-medium mb-3">
                    {profile.tagline}
                  </p>
                )}
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                  {careerOverview}
                </p>
              </div>

              {/* Quick Readiness or Action Card */}
              <div className="lg:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex-shrink-0 flex flex-col justify-between">
                {readiness !== null ? (
                  <div className="mb-4">
                    <div className="text-xs text-indigo-200 font-medium mb-1">Your Assessed Readiness</div>
                    <div className="flex items-baseline gap-2">
                      <span className={`text-4xl font-black ${readiness >= 60 ? 'text-emerald-400' : readiness >= 30 ? 'text-amber-300' : 'text-rose-400'}`}>
                        {readiness}%
                      </span>
                      <span className="text-xs text-slate-300">match based on skills</span>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <div className="text-xs text-indigo-200 font-medium mb-1">Career Status</div>
                    <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-400" /> High Industry Demand
                    </div>
                  </div>
                )}

                <a
                  href="#roadmap-generator"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-semibold rounded-xl text-sm transition-all shadow-md active:scale-95"
                >
                  <span>Start My Roadmap</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Decorative glow */}
          <div className="absolute top-0 right-0 -mr-24 -mt-24 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/3 -mb-24 w-80 h-80 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Skill Gap Alert if present */}
        {gap && gap.gaps.length > 0 && (
          <div className="mb-8 p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-amber-900 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <span>🎯</span> Recommended Learning Priorities for You
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {gap.gaps.slice(0, 5).map((g: any) => (
                  <span key={g.skill.slug} className="badge bg-amber-100 text-amber-900 border border-amber-300 text-xs py-1 px-2.5">
                    {g.skill.name} <span className="ml-1 opacity-70 font-semibold">({Math.round(g.gap * 100)}% gap)</span>
                  </span>
                ))}
              </div>
            </div>
            <a
              href="#roadmap-generator"
              className="text-xs font-bold text-amber-900 hover:text-amber-950 underline whitespace-nowrap self-end sm:self-center"
            >
              Generate personalized plan →
            </a>
          </div>
        )}

        {/* Main Grid: Left Column Detailed Profile, Right Column Career Stats & Roadmap Generator */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main 2-column Information Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* 1. What This Professional Does */}
            {profile?.whatTheyDo && (
              <div className="card p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-3 text-slate-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Compass className="w-4 h-4" />
                  </div>
                  <h2>What Does a {careerTitle} Do?</h2>
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {profile.whatTheyDo}
                </p>
              </div>
            )}

            {/* 2. Typical Job Responsibilities */}
            {profile?.responsibilities && (
              <div className="card p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <h2>Typical Job Responsibilities</h2>
                </div>
                <ul className="space-y-3">
                  {profile.responsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 3. Career Progression Ladder */}
            {profile?.careerProgression && (
              <div className="card p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <h2>Career Progression & Hierarchy</h2>
                </div>
                <div className="relative border-l-2 border-indigo-100 ml-3 pl-6 space-y-6">
                  {profile.careerProgression.map((step, idx) => (
                    <div key={idx} className="relative group">
                      {/* Step Indicator Dot */}
                      <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-white border-4 border-indigo-600" />
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2 mb-1">
                          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                            {step.level}
                          </span>
                          <h3 className="font-bold text-slate-900 text-base">{step.title}</h3>
                          <span className="text-xs text-slate-500 font-medium">({step.experience})</span>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2">
                          {step.description}
                        </p>
                        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                          <DollarSign className="w-3.5 h-3.5" />
                          <span>Typical Comp: {step.typicalSalary}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Required Technical & Soft Skills */}
            <div className="card p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <h2>Required Technical & Soft Skills</h2>
              </div>

              {/* Technical skills list from profile or DB */}
              <div className="mb-6">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Technical Core Competencies
                </h3>
                {sortedSkills.length > 0 ? (
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {sortedSkills.map((rs: any) => (
                      <div key={rs.id} className="p-3.5 flex items-center gap-4 bg-white hover:bg-slate-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-slate-800">{rs.skill.name}</span>
                            <span className={`badge text-xs ${difficultyColor[rs.required_level] || 'bg-slate-100 text-slate-600'}`}>
                              {rs.required_level}
                            </span>
                          </div>
                          <ImportanceBar value={rs.importance} />
                        </div>
                        {gap && (
                          <div className="flex-shrink-0 w-20 text-right">
                            {(() => {
                              const gapEntry = gap.gaps.find((g: any) => g.skill.slug === rs.skill.slug)
                              const comp = gapEntry ? Math.round(gapEntry.student_competency * 100) : null
                              if (comp === null) return null
                              return (
                                <span className={`text-xs font-semibold px-2 py-0.5 rounded ${comp >= 60 ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                  {comp}% match
                                </span>
                              )
                            })()}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : profile?.technicalSkills ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.technicalSkills.map((s, idx) => (
                      <span key={idx} className="badge bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs px-3 py-1">
                        {s}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              {/* Soft Skills */}
              {profile?.softSkills && (
                <div>
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                    Essential Soft Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.softSkills.map((ss, idx) => (
                      <span key={idx} className="badge bg-slate-100 text-slate-700 border border-slate-200 text-xs px-3 py-1 font-medium">
                        ✦ {ss}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* RECOMMENDED COURSES: CAREER -> RECOMMENDED COURSES -> ROADMAP */}
            {matchedCourses.length > 0 && (
              <div className="card p-6 sm:p-7 shadow-xs border-indigo-100 bg-gradient-to-br from-indigo-50/20 via-white to-white">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                  <div className="flex items-center gap-2.5 text-slate-900 font-bold text-lg">
                    <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <h2>Recommended Career Courses</h2>
                  </div>
                  <Link to="/courses" className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                    <span>View All {allCourses.length} Courses</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                  Study these dedicated, structured courses to master the practical skills demanded for <strong>{careerTitle}</strong> roles. Completed lessons update your career progress.
                </p>

                <div className="grid sm:grid-cols-2 gap-3.5">
                  {matchedCourses.map((mc: any) => (
                    <Link
                      key={mc.id}
                      to={`/courses/${mc.slug}`}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all group flex flex-col justify-between bg-white"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                            {mc.category}
                          </span>
                          <span className="text-[10px] text-slate-400 font-semibold">
                            {mc.duration_weeks} wks · {mc.num_lessons} lessons
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors mb-1 line-clamp-1">
                          {mc.title}
                        </h3>
                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
                          {mc.description}
                        </p>
                      </div>
                      <div className="text-xs font-bold text-indigo-600 flex items-center justify-between pt-2 border-t border-slate-100">
                        <span>Start Learning Course</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 5. Tools and Technologies Used */}
            {profile?.toolsAndTechnologies && (
              <div className="card p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <h2>Common Tools & Technologies Used</h2>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {profile.toolsAndTechnologies.map((tool, idx) => (
                    <span
                      key={idx}
                      className="px-3.5 py-1.5 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-2xs"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 6. Where They Work & Industries That Hire */}
            {profile?.workplaces && (
              <div className="card p-6 sm:p-7 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <h2>Workplaces & Hiring Industries</h2>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                      Where Professionals Work
                    </h3>
                    <ul className="space-y-2">
                      {profile.workplaces.map((w, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-indigo-500 mt-0.5">🏢</span>
                          <span>{w}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5">
                      Industries Actively Hiring
                    </h3>
                    <ul className="space-y-2">
                      {profile.industries.map((ind, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">📈</span>
                          <span>{ind}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* 7. Who This Career Is Suitable For & Prerequisites */}
            <div className="card p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-lg">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <Target className="w-4 h-4" />
                </div>
                <h2>Suitability & Educational Prerequisites</h2>
              </div>
              <div className="space-y-5">
                {profile?.suitableFor && (
                  <div>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Who This Career Is Suitable For
                    </h3>
                    <ul className="space-y-1.5">
                      {profile.suitableFor.map((item, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-rose-500 font-bold">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {profile?.educationBackground && (
                  <div className="pt-3 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Educational Background
                    </h3>
                    <ul className="space-y-1.5">
                      {profile.educationBackground.map((edu, idx) => (
                        <li key={idx} className="text-xs sm:text-sm text-slate-700 flex items-start gap-2">
                          <GraduationCap className="w-4 h-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                          <span>{edu}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* 8. Related Careers */}
            {profile?.relatedCareers && profile.relatedCareers.length > 0 && (
              <div className="card p-6 shadow-xs">
                <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                  <span>🔗</span> Related Career Paths
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {profile.relatedCareers.map((rel, idx) => (
                    <Link
                      key={idx}
                      to={`/careers/${rel.slug}`}
                      className="p-3 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all group"
                    >
                      <div className="font-semibold text-slate-900 group-hover:text-indigo-600 text-xs sm:text-sm mb-1 flex items-center justify-between">
                        <span>{rel.title}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                      <p className="text-[11px] text-slate-500 leading-tight">
                        {rel.reason}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Salary, Opportunities, Entry Roles, & Roadmap Generator CTA */}
          <div className="space-y-6">
            {/* Compensation & Salary Breakdown */}
            {profile?.salaryRange && (
              <div className="card p-6 shadow-xs bg-gradient-to-br from-emerald-50/50 via-white to-white border-emerald-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-4">
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <h3>Compensation Benchmarks</h3>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/60">
                    <span className="text-xs text-slate-500 font-medium">Entry-Level (0-2y)</span>
                    <span className="text-xs font-bold text-slate-900">{profile.salaryRange.entry}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/60">
                    <span className="text-xs text-slate-500 font-medium">Mid-Career (2-5y)</span>
                    <span className="text-xs font-bold text-slate-900">{profile.salaryRange.mid}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-emerald-100/60">
                    <span className="text-xs text-slate-500 font-medium">Senior / Lead (5+y)</span>
                    <span className="text-xs font-bold text-emerald-700">{profile.salaryRange.senior}</span>
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 leading-relaxed italic">
                  Note: {profile.salaryRange.note}
                </p>
              </div>
            )}

            {/* Market Opportunities */}
            {profile?.opportunities && (
              <div className="card p-6 shadow-xs bg-indigo-50/40 border-indigo-100">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base mb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600" />
                  <h3>Industry Outlook & Demand</h3>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {profile.opportunities}
                </p>
              </div>
            )}

            {/* Entry-Level Job Roles */}
            {profile?.entryLevelRoles && (
              <div className="card p-6 shadow-xs">
                <div className="text-slate-900 font-bold text-sm mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-slate-500" />
                  <span>Entry-Level Job Titles</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profile.entryLevelRoles.map((role, idx) => (
                    <span key={idx} className="badge bg-slate-100 text-slate-700 text-xs py-1 px-2.5">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* ROADMAP GENERATOR BOX (The Gateway to the Roadmap Service) */}
            <div id="roadmap-generator" className="card p-6 sm:p-7 shadow-lg border-2 border-indigo-500 bg-white relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2 text-indigo-600 font-bold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Next Step in Your Journey</span>
              </div>
              <h3 className="font-extrabold text-slate-900 text-xl mb-1">
                Generate Your Career Roadmap
              </h3>
              <p className="text-xs text-slate-600 mb-5 leading-relaxed">
                Convert this career goal into a step-by-step ordered learning roadmap. We'll sequence skills from fundamentals to advanced projects.
              </p>

              {/* Hours slider */}
              <div className="mb-6 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs text-slate-700 font-bold flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Study Commitment:</span>
                  </label>
                  <span className="text-xs font-extrabold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                    {hours} hours / week
                  </span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={40}
                  step={5}
                  value={hours}
                  onChange={e => setHours(+e.target.value)}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-medium">
                  <span>5h (Casual)</span>
                  <span>15h (Balanced)</span>
                  <span>40h (Bootcamp)</span>
                </div>
              </div>

              {genError && (
                <div className="mb-4 p-3 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {genError}
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-indigo-500/25 active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Synthesizing Learning Sequence...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Start My Career Roadmap</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
                Strict IA Separation: Career details explain the role; Roadmap organizes the stages; Courses deliver the education.
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
