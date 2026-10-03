import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { getRoadmapStageMeta, RoadmapStageMeta } from '../utils/roadmapStageHelpers'
import { 
  CheckCircle2, 
  Circle, 
  PlayCircle, 
  Clock, 
  ArrowRight, 
  BookOpen, 
  ExternalLink, 
  Layers, 
  Sparkles,
  Compass,
  AlertCircle
} from 'lucide-react'

const difficultyBadge: Record<string, string> = {
  beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  intermediate: 'bg-amber-50 text-amber-700 border-amber-200',
  advanced: 'bg-rose-50 text-rose-700 border-rose-200',
}

function ResourcePanel({ skillSlug, skillName }: { skillSlug: string; skillName: string }) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['resources', skillSlug],
    queryFn: () => api.get(`/skills/${skillSlug}/resources`).then(r => r.data),
    staleTime: 300_000,
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="mt-3 p-3 bg-slate-50 rounded-xl animate-pulse">
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
    )
  }

  if (isError || !data?.resources || data.resources.length === 0) {
    return (
      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
        <p className="text-xs text-slate-500">
          No external documentation links added yet for <strong>{skillName}</strong>. Use the official interactive course above!
        </p>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
      <div className="px-4 py-2 border-b border-slate-200 bg-white">
        <p className="text-xs font-semibold text-slate-700">
          📚 Supplementary External References for <span className="text-indigo-600">{skillName}</span>
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {data.resources.slice(0, 4).map((r: any) => (
          <div key={r.id} className="flex items-center justify-between px-4 py-2 hover:bg-white transition-colors">
            <Link to={`/learn/${r.id}`} className="text-xs text-slate-700 hover:text-indigo-600 font-medium truncate flex-1 mr-2">
              {r.icon || '🔗'} {r.title}
            </Link>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-indigo-600">
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

interface RoadmapStageCardProps {
  item: any;
  stageNumber: number;
  totalStages: number;
  nextStageTitle?: string;
  onStatusChange: (id: string, status: string) => void;
}

function RoadmapStageCard({
  item,
  stageNumber,
  totalStages,
  nextStageTitle,
  onStatusChange,
}: RoadmapStageCardProps) {
  const [showResources, setShowResources] = useState(false)
  const skillSlug = item.skill_slug
    || item.title.replace(/^Learn\s+/i, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const skillName = item.title.replace(/^Learn\s+/i, '')

  const meta: RoadmapStageMeta = getRoadmapStageMeta(item.title, skillSlug)

  const isCompleted = item.status === 'completed' || item.status === 'verified'
  const isInProgress = item.status === 'in_progress'
  const isNotStarted = !isCompleted && !isInProgress

  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
      isCompleted
        ? 'bg-white border-emerald-200 shadow-xs'
        : isInProgress
        ? 'bg-white border-blue-400 shadow-md ring-1 ring-blue-400/30'
        : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
    }`}>
      {/* Top Banner with Stage # and Status Badge */}
      <div className={`px-5 py-3 border-b flex flex-wrap items-center justify-between gap-3 ${
        isCompleted
          ? 'bg-emerald-50/70 border-emerald-100'
          : isInProgress
          ? 'bg-blue-50/70 border-blue-100'
          : 'bg-slate-50 border-slate-100'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider ${
            isCompleted
              ? 'bg-emerald-600 text-white'
              : isInProgress
              ? 'bg-blue-600 text-white'
              : 'bg-slate-200 text-slate-700'
          }`}>
            Stage {stageNumber} of {totalStages}
          </span>
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold capitalize ${
            difficultyBadge[meta.difficulty] || difficultyBadge.beginner
          }`}>
            {meta.difficulty}
          </span>
        </div>

        {/* Visual Status Switcher */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
          <button
            onClick={() => onStatusChange(item.id, 'not_started')}
            title="Mark Not Started"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isNotStarted ? 'bg-slate-800 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Circle className="w-3 h-3" />
            <span>Not Started</span>
          </button>

          <button
            onClick={() => onStatusChange(item.id, 'in_progress')}
            title="Mark In Progress"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isInProgress ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <PlayCircle className="w-3 h-3" />
            <span>In Progress</span>
          </button>

          <button
            onClick={() => onStatusChange(item.id, 'completed')}
            title="Mark Completed"
            className={`px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
              isCompleted ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span>Completed</span>
          </button>
        </div>
      </div>

      {/* Main Stage Content */}
      <div className="p-5 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
          <div>
            <h3 className={`text-lg sm:text-xl font-bold transition-colors ${
              isCompleted ? 'text-slate-900' : 'text-slate-900'
            }`}>
              {skillName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-indigo-500" />
              <span>Recommended Duration: <strong>{meta.duration}</strong></span>
              <span>·</span>
              <span>Order: <strong>Step {stageNumber}</strong></span>
            </p>
          </div>

          {/* Primary CTA: START / CONTINUE COURSE */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link
              to={`/courses/${meta.courseSlug}`}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm active:scale-95 ${
                isCompleted
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100'
                  : isInProgress
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{isCompleted ? 'Review Course' : isInProgress ? 'Continue Course' : 'Start Course'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Structured Stage Information: Why Required & Prerequisites */}
        <div className="grid sm:grid-cols-2 gap-3 mb-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>🎯</span> Why this is required
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {meta.whyRequired}
            </p>
          </div>

          <div>
            <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
              <span>🔑</span> Prerequisites
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {meta.prerequisites}
            </p>
          </div>
        </div>

        {/* Next Step & Quick Links Footer */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100 text-xs">
          <div className="text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-slate-700">Next Stage:</span>
            {nextStageTitle ? (
              <span className="text-indigo-600 font-medium truncate max-w-xs">{nextStageTitle}</span>
            ) : (
              <span className="text-emerald-600 font-medium">Final Stage (Portfolio & Interview Prep)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowResources(!showResources)}
              className="text-xs text-slate-500 hover:text-indigo-600 font-medium inline-flex items-center gap-1 transition-colors"
            >
              <span>{showResources ? 'Hide external links' : '📚 Extra references'}</span>
            </button>
          </div>
        </div>

        {/* Optional Collapsible Resources */}
        {showResources && (
          <ResourcePanel skillSlug={skillSlug} skillName={skillName} />
        )}
      </div>
    </div>
  )
}

export default function RoadmapView() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const qc = useQueryClient()

  const { data: roadmap, isLoading } = useQuery({
    queryKey: ['roadmap', id],
    queryFn: () => api.get(`/roadmaps/${id}`).then(r => r.data),
    staleTime: 0,
    gcTime: 60_000,
  })

  const updateItem = useMutation({
    mutationFn: ({ itemId, status }: { itemId: string; status: string }) =>
      api.patch(`/roadmaps/items/${itemId}`, { status }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['roadmap', id] }),
  })

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-6">
          <div className="h-6 bg-slate-100 rounded w-1/4" />
          <div className="h-28 bg-slate-100 rounded-3xl" />
          {Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-44 bg-slate-100 rounded-2xl" />
          ))}
        </div>
      </AppShell>
    )
  }

  if (!roadmap) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <h2 className="font-bold text-slate-900 mb-2 text-xl">Roadmap not found</h2>
          <p className="text-slate-500 text-sm mb-6">Explore career profiles and initialize your personalized learning sequence.</p>
          <Link to="/careers" className="btn-primary">Browse Careers</Link>
        </div>
      </AppShell>
    )
  }

  // Flatten all items across phases to establish clear sequence: 1, 2, 3...
  const allStages: Array<{ item: any; phase: any; overallIndex: number }> = []
  let stageCounter = 1
  for (const phase of (roadmap.phases || [])) {
    for (const item of (phase.items || [])) {
      allStages.push({
        item,
        phase,
        overallIndex: stageCounter++,
      })
    }
  }

  const totalStages = allStages.length
  const completedCount = allStages.filter(s => s.item.status === 'completed' || s.item.status === 'verified').length
  const inProgressCount = allStages.filter(s => s.item.status === 'in_progress').length
  const notStartedCount = totalStages - completedCount - inProgressCount
  const pct = totalStages > 0 ? Math.round((completedCount / totalStages) * 100) : 0

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
          <Link to="/careers" className="hover:text-slate-600 transition-colors">Careers</Link>
          <span>/</span>
          <span className="text-slate-700 font-semibold">{roadmap.career_role_title || 'Roadmap'}</span>
          <span>/</span>
          <span className="text-indigo-600 font-semibold">Structured Roadmap</span>
        </div>

        {/* Roadmap Goal Banner */}
        <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 mb-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold mb-3 border border-indigo-400/30">
              <Compass className="w-3.5 h-3.5" />
              <span>ROADMAP SERVICE · STRUCTURED LEARNING SEQUENCE</span>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {roadmap.career_role_title || 'Your Career'} Learning Path
                </h1>
                <p className="text-indigo-200 text-sm mt-1">
                  Sequential order of skills to master · {roadmap.weekly_hours_committed || 10}h/week study commitment
                </p>
              </div>

              <div className="text-right flex-shrink-0 bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
                <div className={`text-3xl font-black ${pct >= 60 ? 'text-emerald-400' : pct >= 30 ? 'text-amber-300' : 'text-indigo-300'}`}>
                  {pct}%
                </div>
                <div className="text-[11px] text-slate-300 font-medium">Roadmap Progress</div>
              </div>
            </div>

            {/* Overall Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden mb-4">
              <div
                className="bg-gradient-to-r from-indigo-400 to-emerald-400 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>

            {/* Visual Status Count Pills */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5">
                <div className="text-base sm:text-lg font-bold text-slate-300">{notStartedCount}</div>
                <div className="text-[10px] sm:text-xs text-slate-400">Not Started</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5">
                <div className="text-base sm:text-lg font-bold text-blue-300">{inProgressCount}</div>
                <div className="text-[10px] sm:text-xs text-blue-200">In Progress</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-2 sm:p-2.5">
                <div className="text-base sm:text-lg font-bold text-emerald-400">{completedCount}</div>
                <div className="text-[10px] sm:text-xs text-emerald-200">Completed</div>
              </div>
            </div>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        </div>

        {/* Information Architecture Clarification Notice */}
        <div className="mb-6 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            <span>
              <strong>Information Architecture:</strong> Career page shows job info → Roadmap shows sequence & order → Course provides interactive lessons & practice.
            </span>
          </div>
          <Link to="/courses" className="text-indigo-600 hover:text-indigo-700 font-semibold underline whitespace-nowrap hidden sm:inline">
            Browse All Courses →
          </Link>
        </div>

        {/* Stage-by-Stage Sequential List */}
        <div className="space-y-5">
          {allStages.map((stageObj, idx) => {
            const nextObj = allStages[idx + 1]
            return (
              <RoadmapStageCard
                key={stageObj.item.id}
                item={stageObj.item}
                stageNumber={stageObj.overallIndex}
                totalStages={totalStages}
                nextStageTitle={nextObj ? nextObj.item.title.replace(/^Learn\s+/i, '') : undefined}
                onStatusChange={(itemId, status) => updateItem.mutate({ itemId, status })}
              />
            )
          })}
        </div>

        {/* Celebration Banner when 100% complete */}
        {pct === 100 && (
          <div className="mt-8 card p-8 sm:p-10 text-center bg-gradient-to-br from-emerald-50 via-teal-50 to-white border-2 border-emerald-300 shadow-lg">
            <div className="text-5xl mb-3">🎓</div>
            <h2 className="font-extrabold text-slate-900 mb-2 text-2xl">Roadmap Fully Completed!</h2>
            <p className="text-slate-600 text-sm max-w-md mx-auto mb-6">
              You've completed every stage in your {roadmap.career_role_title || 'career'} learning roadmap. You're ready to build capstone projects and apply for roles!
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/courses" className="btn-primary">
                Explore More Skills & Courses
              </Link>
              <Link to="/careers" className="btn-secondary">
                View Career Details
              </Link>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  )
}
