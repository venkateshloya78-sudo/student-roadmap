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

function StatusBadge({ status }: { status: string }) {
  const c = statusConfig[status] || statusConfig.not_started
  return (
    <span className={`flex items-center gap-1.5 text-xs font-medium ${c.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
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
        <button onClick={() => navigate('/dashboard')} className="text-xs text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">
          ← Back to dashboard
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
          <div className="text-right">
            <div className="text-2xl font-black text-indigo-600">{pct}%</div>
            <div className="text-xs text-slate-400">complete</div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8">
          <div className="bg-indigo-600 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>

        {/* Phases */}
        <div className="space-y-4">
          {(roadmap.phases || []).map((phase: any, pi: number) => {
            const phaseComplete = phase.items?.every((i: any) => i.status === 'completed' || i.status === 'verified')
            return (
              <div key={phase.id} className="card overflow-hidden">
                {/* Phase header */}
                <div className={`px-5 py-3.5 flex items-center justify-between border-b border-slate-50
                  ${phaseComplete ? 'bg-emerald-50' : pi === 0 ? 'bg-indigo-50' : 'bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
                      ${phaseComplete ? 'bg-emerald-500 text-white' : pi === 0 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {phaseComplete ? '✓' : phase.phase_number}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{phase.title}</p>
                      <p className="text-xs text-slate-400">~{phase.estimated_hours}h</p>
                    </div>
                  </div>
                  <span className={`badge ${phaseComplete ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {phaseComplete ? 'Done' : `${phase.items?.length || 0} items`}
                  </span>
                </div>

                {/* Phase items */}
                <div className="divide-y divide-slate-50">
                  {(phase.items || []).map((item: any) => (
                    <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                      <button
                        onClick={() => updateItem.mutate({
                          itemId: item.id,
                          status: item.status === 'completed' ? 'not_started' : 'completed',
                        })}
                        className={`w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all
                          ${item.status === 'completed' || item.status === 'verified'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : item.status === 'in_progress'
                            ? 'border-blue-400 bg-blue-50'
                            : 'border-slate-200 hover:border-indigo-400'}`}
                      >
                        {(item.status === 'completed' || item.status === 'verified') && (
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${item.status === 'completed' || item.status === 'verified' ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {item.title}
                        </p>
                        {item.description && <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        {item.estimated_hours && (
                          <span className="text-xs text-slate-400">{item.estimated_hours}h</span>
                        )}
                        <StatusBadge status={item.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Done state */}
        {pct === 100 && (
          <div className="mt-6 card p-8 text-center bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
            <div className="text-4xl mb-3">🎉</div>
            <h2 className="font-bold text-slate-900 mb-2">Roadmap complete!</h2>
            <p className="text-slate-500 text-sm mb-4">You've completed all phases. Time to apply!</p>
            <Link to="/careers" className="btn-primary">Explore next career path →</Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
