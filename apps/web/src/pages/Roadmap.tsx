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
  const { data, isLoading } = useQuery({
    queryKey: ['resources', skillSlug],
    queryFn: () => api.get(`/skills/${skillSlug}/resources`).then(r => r.data),
    staleTime: 300_000,
  })

  if (isLoading) {
    return (
      <div className="mt-3 p-3 bg-slate-50 rounded-lg animate-pulse">
        <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
        <div className="h-3 bg-slate-200 rounded w-2/3" />
      </div>
    )
  }

  const resources = data?.resources || []
  if (resources.length === 0) return null

  return (
    <div className="mt-3 rounded-xl border border-slate-100 bg-slate-50 overflow-hidden">
      <div className="px-4 py-2.5 border-b border-slate-100 bg-white">
        <p className="text-xs font-semibold text-slate-600">
          📚 Free learning resources for <span className="text-indigo-600">{skillName}</span>
        </p>
      </div>
      <div className="divide-y divide-slate-100">
        {resources.map((r: any) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-start gap-3 px-4 py-2.5 hover:bg-white transition-colors group"
          >
            <span className="text-base flex-shrink-0 mt-0.5">{r.icon}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-slate-700 group-hover:text-indigo-600 transition-colors font-medium leading-snug">
                {r.title}
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
            <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}

function RoadmapItemRow({ item, onToggle }: { item: any; onToggle: (id: string, status: string) => void }) {
  const [expanded, setExpanded] = useState(false)
  const done = item.status === 'completed' || item.status === 'verified'
  const cfg = statusConfig[item.status] || statusConfig.not_started

  // Extract skill slug from title e.g. "Learn Python" → "python"
  const skillSlug = item.title.replace(/^Learn\s+/i, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  const skillName = item.title.replace(/^Learn\s+/i, '')

  return (
    <div className={`border-b border-slate-50 last:border-0 transition-colors ${expanded ? 'bg-indigo-50/30' : ''}`}>
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
        <div className="flex items-center gap-3 flex-shrink-0">
          {item.estimated_hours && (
            <span className="text-xs text-slate-400">{item.estimated_hours}h</span>
          )}
          <span className={`flex items-center gap-1.5 text-xs font-medium ${cfg.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            <span className="hidden sm:inline">{cfg.label}</span>
          </span>
          {/* Resources toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            title="Show learning resources"
            className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all
              ${expanded
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600'}`}
          >
            {expanded ? '▲ Resources' : '📚 Resources'}
          </button>
        </div>
      </div>

      {/* Resources panel */}
      {expanded && (
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
