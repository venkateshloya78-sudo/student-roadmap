import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'

export default function RoadmapsList() {
  const { data, isLoading } = useQuery({
    queryKey: ['roadmaps'],
    queryFn: () => api.get('/roadmaps/').then(r => r.data),
  })

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">My roadmaps</h1>
          <p className="text-sm text-slate-500">Your personalised career learning plans.</p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => <div key={i} className="card p-5 h-20 animate-pulse bg-slate-50" />)}
          </div>
        ) : data?.items?.length > 0 ? (
          <div className="space-y-3">
            {data.items.map((rm: any) => (
              <Link key={rm.id} to={`/roadmaps/${rm.id}`}
                className="card p-5 flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-0.5 group">
                <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm flex-shrink-0">
                  {(rm.career_role_title || 'R')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">{rm.career_role_title || 'Roadmap'}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{rm.phases?.length || 0} phases · v{rm.version}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`badge ${rm.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                    {rm.status}
                  </span>
                  <svg className="w-4 h-4 text-slate-300 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-4">🗺️</div>
            <h2 className="font-semibold text-slate-900 mb-2">No roadmaps yet</h2>
            <p className="text-sm text-slate-500 mb-6">Browse a career path and generate your personalised roadmap.</p>
            <Link to="/careers" className="btn-primary">Browse careers →</Link>
          </div>
        )}
      </div>
    </AppShell>
  )
}
