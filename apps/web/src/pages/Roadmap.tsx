import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  not_started: { label: 'Not started', color: 'text-slate-400', dot: 'bg-slate-300' },
  in_progress:  { label: 'In progress',  color: 'text-blue-600',  dot: 'bg-blue-400 animate-pulse' },
  completed:    { label: 'Completed',    color: 'text-emerald-600', dot: 'bg-emerald-500' },
  verified:     { label: 'Verified',     color: 'text-indigo-600', dot: 'bg-indigo-500' },
}

const typeIcon: Record<string, string> = {
  documentation: '📖',
  video: '🎬',
  course: '🎓',
  book: '📚',
  tutorial: '🛠️',
  other: '🔗',
}

const typeBadge: Record<string, string> = {
  documentation: 'bg-blue-50 text-blue-700',
  video: 'bg-red-50 text-red-700',
  course: 'bg-purple-50 text-purple-700',
  book: 'bg-amber-50 text-amber-700',
  tutorial: 'bg-emerald-50 text-emerald-700',
  other: 'bg-slate-50 text-slate-600',
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
      <div className="mt-3 p-3 bg-slate-50 rounded-lg animate-pulse">
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
        <p className="text-xs text-amber-700">⚠️ No resources available yet for <strong>{skillName}</strong>.</p>
      </div>
    )
  }

  const resources = data?.resources || []
  if (resources.length === 0) {
    return (
      <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
        <p className="text-xs text-slate-500">📭 No resources added yet for <strong>{skillName}</strong>.</p>
      </div>
    )
  }

  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 bg-white">
        <p className="text-xs font-semibold text-slate-600">
          📚 Free learning resources for <span className="text-indigo-600">{skillName}</span>
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {resources.map((r: any) => {
          const isCompleted = localStorage.getItem('srm_progress') ? JSON.parse(localStorage.getItem('srm_progress') || '{}')[r.id]?.completed : false;
          return (
          <div
            key={r.id}
            className="flex items-center group px-4 py-2.5 hover:bg-white transition-colors border-b border-slate-100 last:border-0"
          >
            <Link to={`/learn/${r.id}`} className="flex-1 flex items-start gap-3 min-w-0">
              <span className="text-base flex-shrink-0 mt-0.5">{r.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors font-medium leading-snug flex items-center gap-2">
                  {r.title}
                  {isCompleted && <span className="inline-flex items-center text-xs text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-200">✓ Done</span>}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`badge text-xs ${typeBadge[r.type] || typeBadge.other}`}>
                    {r.type}
                  </span>
                  {r.is_free && (
                    <span className="badge bg-emerald-50 text-emerald-700 text-xs">Free</span>
                  )}
                  <span className="text-xs text-slate-400 truncate">{r.url.replace(/^https?:\/\//, '').split('/')[0]}</span>
                </div>
              </div>
            </Link>
            <a href={r.url} target="_blank" rel="noopener noreferrer" className="ml-3 p-1.5 text-slate-300 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50 flex-shrink-0" title="External link">
              <svg className="w-3.5 h-3.5 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        )})}
      </div>
    </div>
  )
}

function LearningGuidePanel({ skillSlug, skillName }: { skillSlug: string; skillName: string }) {
  const { data, isLoading } = useQuery({
    queryKey: ['skill-topics', skillSlug],
    queryFn: () => api.get(`/skills/${skillSlug}/topics`).then(r => r.data),
    staleTime: 300_000,
    retry: false,
  })

  if (isLoading) {
    return (
      <div className="mt-3 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 animate-pulse space-y-2">
        <div className="h-4 bg-indigo-200 rounded w-1/3" />
        <div className="h-3 bg-indigo-100 rounded w-3/4" />
        <div className="h-3 bg-indigo-100 rounded w-1/2" />
      </div>
    )
  }

  const firstWeek = data?.curriculum?.[0]
  const firstItem = firstWeek?.items?.[0]

  const guide = {
    why: firstItem?.why_learning || `Essential foundational capability for ${skillName} required across industry production stacks.`,
    meaning: firstItem?.meaning || `Conceptual methodology and toolset used to build, manage, and scale ${skillName} systems.`,
    whatToLearn: firstItem?.what_to_learn || `Syntax, architecture, configuration, standard patterns, and production reliability.`,
    practice: firstItem?.how_to_practice || `Implement isolated exercises and build test scenarios verifying input and output validity.`,
    example: firstItem?.example || `# Getting started with ${skillName}\nprint('Initialising ${skillName} environment...')`,
    build: firstItem?.what_to_build || `A modular utility or baseline component demonstrating clean fundamentals in ${skillName}.`,
    career: firstItem?.career_uses || `Software Engineers, Backend Architects, and Tech Specialists worldwide.`,
    next: firstItem?.next_steps || `Advanced concepts, architectural design, and system-wide integration.`,
  }

  return (
    <div className="mt-3 rounded-xl border border-indigo-200 bg-gradient-to-br from-indigo-50/60 to-white overflow-hidden shadow-xs">
      <div className="px-4 py-3 border-b border-indigo-100 bg-white/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-base">💡</span>
          <p className="text-xs font-bold text-slate-800">
            7-Pillar Learning Guide for <span className="text-indigo-600">{skillName}</span>
          </p>
        </div>
        <Link
          to={`/skills/${skillSlug}`}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
        >
          View Full Curriculum →
        </Link>
      </div>

      <div className="p-4 space-y-3 text-xs text-slate-700">
        {/* 1. Why am I learning this? */}
        <div className="bg-white p-3 rounded-lg border border-indigo-100 shadow-2xs">
          <div className="font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
            <span>🎯</span> 1. Why am I learning this?
          </div>
          <p className="leading-relaxed">{guide.why}</p>
        </div>

        {/* 2. What does it mean? */}
        <div className="bg-white p-3 rounded-lg border border-sky-100 shadow-2xs">
          <div className="font-bold text-sky-900 mb-1 flex items-center gap-1.5">
            <span>💡</span> 2. What does it mean?
          </div>
          <p className="leading-relaxed">{guide.meaning}</p>
        </div>

        {/* 3. What should I learn? */}
        <div className="bg-white p-3 rounded-lg border border-purple-100 shadow-2xs">
          <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
            <span>📘</span> 3. What should I learn?
          </div>
          <p className="leading-relaxed">{guide.whatToLearn}</p>
        </div>

        {/* 4. How do I practice it? */}
        <div className="bg-white p-3 rounded-lg border border-emerald-100 shadow-2xs">
          <div className="font-bold text-emerald-900 mb-1 flex items-center gap-1.5">
            <span>✍️</span> 4. How do I practice it?
          </div>
          <p className="leading-relaxed mb-2">{guide.practice}</p>
          {guide.example && (
            <div className="bg-slate-900 text-emerald-300 p-2.5 rounded font-mono text-[11px] overflow-x-auto whitespace-pre-wrap">
              <code>{guide.example}</code>
            </div>
          )}
        </div>

        {/* 5. What can I build? */}
        <div className="bg-white p-3 rounded-lg border border-amber-100 shadow-2xs">
          <div className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
            <span>🛠️</span> 5. What can I build?
          </div>
          <p className="leading-relaxed">{guide.build}</p>
        </div>

        {/* 6. Which career uses it? */}
        <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
          <div className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
            <span>💼</span> 6. Which career uses it?
          </div>
          <p className="leading-relaxed font-medium text-slate-800">{guide.career}</p>
        </div>

        {/* 7. What should I learn next? */}
        <div className="bg-white p-3 rounded-lg border border-teal-100 shadow-2xs">
          <div className="font-bold text-teal-900 mb-1 flex items-center gap-1.5">
            <span>🚀</span> 7. What should I learn next?
          </div>
          <p className="leading-relaxed">{guide.next}</p>
        </div>

        {/* Quick actions */}
        <div className="pt-2 flex flex-wrap gap-2">
          <Link
            to={`/skills/${skillSlug}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            📖 Open In-Depth Skill Page
          </Link>
          <Link
            to="/courses"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            🎓 Practice in Interactive Courses
          </Link>
        </div>
      </div>
    </div>
  )
}

function RoadmapItemRow({ item, onToggle }: { item: any; onToggle: (id: string, status: string) => void }) {
  const [activePanel, setActivePanel] = useState<'resources' | 'guide' | null>(null)
  const done = item.status === 'completed' || item.status === 'verified'
  const cfg = statusConfig[item.status] || statusConfig.not_started

  // Use the actual skill_slug from API response — fallback to deriving from title
  const skillSlug = item.skill_slug
    || item.title.replace(/^Learn\s+/i, '').toLowerCase()
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const skillName = item.title.replace(/^Learn\s+/i, '')

  return (
    <div className={`border-b border-slate-50 last:border-0 transition-colors ${activePanel ? 'bg-indigo-50/20' : ''}`}>
      <div className="px-5 py-3 flex items-center gap-3">
        {/* Checkbox */}
        <button
          onClick={() => onToggle(item.id, done ? 'not_started' : 'completed')}
          className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
            ${done
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : item.status === 'in_progress'
              ? 'border-blue-400 bg-blue-50'
              : 'border-slate-200 hover:border-indigo-400'}`}
        >
          {done && (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/skills/${skillSlug}`}
            className={`text-sm font-medium hover:text-indigo-600 transition-colors
              ${done ? 'line-through text-slate-400' : 'text-slate-800'}`}
          >
            {item.title}
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {item.estimated_hours && (
            <span className="text-xs text-slate-400 hidden sm:inline">{item.estimated_hours}h</span>
          )}
          <span className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <span className="hidden md:inline">{cfg.label}</span>
          </span>

          {/* Guide toggle */}
          <button
            onClick={() => setActivePanel(activePanel === 'guide' ? null : 'guide')}
            title="Show 7-pillar learning guide"
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all border
              ${activePanel === 'guide'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'}`}
          >
            💡 Guide
          </button>

          {/* Resources toggle */}
          <button
            onClick={() => setActivePanel(activePanel === 'resources' ? null : 'resources')}
            title="Show learning resources"
            className={`text-xs px-2.5 py-1 rounded-full font-medium transition-all border
              ${activePanel === 'resources'
                ? 'bg-slate-800 text-white border-slate-800 shadow-2xs'
                : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-800'}`}
          >
            📚 Resources
          </button>
        </div>
      </div>

      {/* Panels */}
      {activePanel === 'guide' && (
        <div className="px-5 pb-4">
          <LearningGuidePanel skillSlug={skillSlug} skillName={skillName} />
        </div>
      )}

      {activePanel === 'resources' && (
        <div className="px-5 pb-4">
          <ResourcePanel skillSlug={skillSlug} skillName={skillName} />
        </div>
      )}
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
    staleTime: 0,      // always fetch fresh so skill_slug is up to date
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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
          <div className="h-7 bg-slate-100 rounded w-1/2" />
          {Array(3).fill(0).map((_, i) => <div key={i} className="card p-6 h-32 bg-slate-50" />)}
        </div>
      </AppShell>
    )
  }

  if (!roadmap) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="text-4xl mb-3">🗺️</div>
          <h2 className="font-semibold text-slate-900 mb-2">Roadmap not found</h2>
          <Link to="/careers" className="btn-primary">Browse careers</Link>
        </div>
      </AppShell>
    )
  }

  const totalItems = roadmap.phases?.reduce((s: number, p: any) => s + (p.items?.length || 0), 0) || 0
  const completedItems = roadmap.phases?.reduce((s: number, p: any) =>
    s + (p.items?.filter((i: any) => i.status === 'completed' || i.status === 'verified').length || 0), 0) || 0
  const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <button onClick={() => navigate(-1)} className="text-xs text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">
          ← Back
        </button>

        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {roadmap.career_role_title || 'Your Roadmap'}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {roadmap.phases?.length} phases · {totalItems} skills · {roadmap.weekly_hours_committed}h/week
            </p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className={`text-2xl font-black ${pct >= 60 ? 'text-emerald-600' : pct >= 30 ? 'text-amber-600' : 'text-indigo-600'}`}>
              {pct}%
            </div>
            <div className="text-xs text-slate-400">complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-2">
          <div className="bg-indigo-600 h-2 rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mb-8">
          <span>{completedItems} of {totalItems} completed</span>
          <span>Click 📚 Resources on any item to see learning materials</span>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 mb-5 text-xs text-slate-500 bg-indigo-50 rounded-xl px-4 py-2.5">
          <span>💡 Click</span>
          <span className="badge bg-indigo-100 text-indigo-700">📚 Resources</span>
          <span>on any skill to open free Wikipedia, courses, and PDFs</span>
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {(roadmap.phases || []).map((phase: any, pi: number) => {
            const phaseComplete = phase.items?.every((i: any) => i.status === 'completed' || i.status === 'verified')
            const phasePct = phase.items?.length
              ? Math.round((phase.items.filter((i: any) => i.status === 'completed' || i.status === 'verified').length / phase.items.length) * 100)
              : 0

            return (
              <div key={phase.id} className="card overflow-hidden">
                {/* Phase header */}
                <div className={`px-5 py-3.5 flex items-center justify-between border-b border-slate-50
                  ${phaseComplete ? 'bg-emerald-50' : pi === 0 ? 'bg-indigo-50' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                      ${phaseComplete ? 'bg-emerald-500 text-white' : pi === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {phaseComplete ? '✓' : phase.phase_number}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{phase.title}</p>
                      <p className="text-xs text-slate-400">~{phase.estimated_hours}h estimated</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-20 bg-slate-200 rounded-full h-1.5 hidden sm:block">
                      <div className={`h-1.5 rounded-full transition-all ${phaseComplete ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                        style={{ width: `${phasePct}%` }} />
                    </div>
                    <span className={`badge text-xs ${phaseComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      {phaseComplete ? '✓ Done' : `${phasePct}%`}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div>
                  {(phase.items || []).map((item: any) => (
                    <RoadmapItemRow
                      key={item.id}
                      item={item}
                      onToggle={(itemId, status) => updateItem.mutate({ itemId, status })}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Done state */}
        {pct === 100 && (
          <div className="mt-6 card p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="font-bold text-slate-900 mb-2 text-xl">Roadmap complete!</h2>
            <p className="text-slate-500 text-sm mb-5">You've completed all phases. Time to apply!</p>
            <Link to="/careers" className="btn-primary">Explore next career →</Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
