import { useQuery } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color: string }) {
  return (
    <div className="card p-5">
      <p className="text-xs text-slate-500 font-medium mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </div>
  )
}

export default function Dashboard() {
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

  const profile = me?.profile
  const profileComplete = profile?.degree && profile?.branch && profile?.year

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-1">Welcome back</p>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLoading ? 'Loading...' : me?.user?.email?.split('@')[0] || 'Student'}
          </h1>
        </div>

        {/* Profile incomplete banner */}
        {!isLoading && !profileComplete && (
          <div className="mb-6 flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="text-2xl">👋</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Complete your profile to get started</p>
              <p className="text-xs text-amber-600 mt-0.5">Add your degree, branch, and year to unlock roadmap generation.</p>
            </div>
            <Link to="/profile" className="btn-primary text-xs py-2 px-3 bg-amber-600 hover:bg-amber-700">
              Complete now →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard label="Career Path" value={roadmaps?.items?.length > 0 ? '1' : '—'} sub={roadmaps?.items?.length > 0 ? 'roadmap active' : 'not started'} color="text-indigo-600" />
          <StatCard label="Skills Declared" value={String(me?.profile?.skills_count || '0')} sub="self-rated" color="text-emerald-600" />
          <StatCard label="Phases Done" value="0" sub="of your roadmap" color="text-purple-600" />
          <StatCard label="Readiness" value="—" sub="run gap analysis" color="text-rose-500" />
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <div className="card p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-slate-900 mb-1">Choose a career path</h3>
            <p className="text-sm text-slate-500 mb-4">Browse 12 roles and see the skills required for each.</p>
            <Link to="/careers" className="btn-secondary text-sm">Browse careers →</Link>
          </div>
          <div className="card p-6">
            <div className="text-2xl mb-3">🗺️</div>
            <h3 className="font-semibold text-slate-900 mb-1">
              {roadmaps?.items?.length > 0 ? 'Continue your roadmap' : 'Generate your roadmap'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {roadmaps?.items?.length > 0
                ? 'Pick up where you left off.'
                : 'Select a career and get a personalised learning plan.'}
            </p>
            {roadmaps?.items?.length > 0
              ? <Link to={`/roadmaps/${roadmaps.items[0].id}`} className="btn-primary text-sm">View roadmap →</Link>
              : <Link to="/careers" className="btn-primary text-sm">Get started →</Link>}
          </div>
        </div>

        {/* Profile summary */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-slate-900">Your profile</h2>
            <Link to="/profile" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Edit →</Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { label: 'Degree', value: profile?.degree?.toUpperCase() || 'Not set' },
              { label: 'Branch', value: profile?.branch || 'Not set' },
              { label: 'Year', value: profile?.year ? `Year ${profile.year}` : 'Not set' },
              { label: 'University', value: profile?.university || 'Not set' },
              { label: 'Location', value: profile?.location_city || 'Not set' },
              { label: 'Weekly hours', value: profile?.weekly_learning_hours ? `${profile.weekly_learning_hours}h/week` : 'Not set' },
            ].map(f => (
              <div key={f.label}>
                <p className="text-xs text-slate-400 mb-0.5">{f.label}</p>
                <p className={`text-sm font-medium ${f.value === 'Not set' ? 'text-slate-300' : 'text-slate-800'}`}>{f.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}
