import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { useLanguage } from '../i18n/LanguageContext'
import { 
  Compass, 
  ArrowRight, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Layers, 
  Plus, 
  AlertTriangle 
} from 'lucide-react'

const careerGradients = [
  'from-blue-600 to-indigo-600',
  'from-indigo-600 to-purple-600',
  'from-emerald-600 to-teal-600',
  'from-rose-600 to-pink-600',
  'from-amber-600 to-orange-600',
  'from-purple-600 to-violet-600',
]

export default function RoadmapsList() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => api.get('/roadmaps/').then(r => r.data),
    staleTime: 0,
  })

  const deleteRoadmap = useMutation({
    mutationFn: (id: string) => api.delete(`/roadmaps/${id}`),
    onMutate: (id) => setDeletingId(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['roadmaps'] })
      qc.invalidateQueries({ queryKey: ['dashboard'] })
      setConfirmDeleteId(null)
      setDeletingId(null)
    },
    onError: () => {
      setDeletingId(null)
    }
  })

  // Deduplicate on the client side as a bulletproof safeguard:
  // If multiple copies exist for the same career role, keep the one with highest completion or newest
  const roadmaps = useMemo(() => {
    const rawItems: any[] = data?.items || []
    const byCareer: Record<string, any> = {}

    for (const rm of rawItems) {
      const key = rm.career_role_id || rm.career_role_title || rm.id
      const totalItems = rm.phases?.reduce((s: number, p: any) => s + (p.items?.length || 0), 0) || 0
      const completedItems = rm.phases?.reduce((s: number, p: any) =>
        s + (p.items?.filter((i: any) => i.status === 'completed' || i.status === 'verified').length || 0), 0) || 0
      const pct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

      const enriched = {
        ...rm,
        totalItems,
        completedItems,
        pct,
      }

      if (!byCareer[key]) {
        byCareer[key] = enriched
      } else {
        // Compare: prefer the one with more completed items, or later creation
        const existing = byCareer[key]
        if (enriched.completedItems > existing.completedItems) {
          byCareer[key] = enriched
        }
      }
    }

    return Object.values(byCareer)
  }, [data])

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-2 border border-indigo-100">
              <Compass className="w-3.5 h-3.5" />
              <span>LEARNING PLANS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {t('nav.roadmaps', 'My Career Roadmaps')}
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Your personalized, sequential learning paths. Pick a career to continue your journey.
            </p>
          </div>

          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-all shadow-sm active:scale-95 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Explore Careers</span>
          </Link>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="card p-6 h-28 animate-pulse bg-slate-50 rounded-2xl" />
            ))}
          </div>
        ) : roadmaps.length > 0 ? (
          <div className="space-y-4">
            {roadmaps.map((rm: any, idx: number) => {
              const gradient = careerGradients[idx % careerGradients.length]
              const isConfirming = confirmDeleteId === rm.id

              return (
                <div
                  key={rm.id}
                  className="card p-5 sm:p-6 hover:shadow-md transition-all duration-200 border border-slate-200/80 rounded-2xl bg-white group relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5">
                    {/* Left: Avatar & Title info */}
                    <div className="flex items-start sm:items-center gap-4 min-w-0">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-extrabold text-lg flex-shrink-0 shadow-xs`}>
                        {(rm.career_role_title || 'R')[0]}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <h2 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-indigo-600 transition-colors truncate">
                            {rm.career_role_title || 'Career Roadmap'}
                          </h2>
                          <span className="badge bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs py-0.5 px-2">
                            Active
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium flex-wrap">
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5 text-slate-400" />
                            {rm.phases?.length || 0} Phases ({rm.totalItems} Stages)
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-400" />
                            {rm.weekly_hours_committed || 10}h / week
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {rm.completedItems} of {rm.totalItems} done
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Progress bar & Actions */}
                    <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                      {/* Mini Progress */}
                      <div className="w-28 sm:w-32 text-right">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-slate-400 font-medium">Progress</span>
                          <span className="font-bold text-slate-800">{rm.pct}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                            style={{ width: `${rm.pct}%` }}
                          />
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <Link
                          to={`/roadmaps/${rm.id}`}
                          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition-all inline-flex items-center gap-1.5 shadow-xs active:scale-95"
                        >
                          <span>Continue</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Delete Button / Confirmation */}
                        {isConfirming ? (
                          <div className="flex items-center gap-1.5 bg-rose-50 p-1 rounded-xl border border-rose-200">
                            <button
                              onClick={() => deleteRoadmap.mutate(rm.id)}
                              disabled={deletingId === rm.id}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-colors"
                            >
                              {deletingId === rm.id ? 'Deleting...' : 'Delete?'}
                            </button>
                            <button
                              onClick={() => setConfirmDeleteId(null)}
                              className="px-2 py-1 text-slate-500 hover:text-slate-700 text-xs font-semibold"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteId(rm.id)}
                            title="Delete this roadmap"
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          /* Empty state */
          <div className="card p-12 text-center border border-slate-200 rounded-3xl bg-slate-50/50">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              🗺️
            </div>
            <h2 className="font-bold text-slate-900 text-lg mb-2">No active roadmaps found</h2>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Browse our occupational career paths, choose a target role, and initialize your custom roadmap sequence.
            </p>
            <Link to="/careers" className="btn-primary inline-flex items-center gap-2">
              <span>Browse Career Paths</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
