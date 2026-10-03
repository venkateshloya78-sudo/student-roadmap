import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
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

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm text-slate-500 mb-1">Welcome back 👋</p>
          <h1 className="text-2xl font-bold text-slate-900">
            {isLoading ? 'Loading...' : me?.user?.email?.split('@')[0] || 'Student'}
          </h1>
        </div>

        {/* Profile incomplete banner */}
        {!isLoading && !profileComplete && (
          <div className="mb-6 flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <div className="text-2xl">⚠️</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Complete your profile to get started</p>
              <p className="text-xs text-amber-600 mt-0.5">Add your degree, branch, and year to unlock roadmap generation.</p>
            </div>
            <Link to="/profile" className="btn-primary text-xs py-2 px-3 bg-amber-600 hover:bg-amber-700">
              Complete now →
            </Link>
          </div>
        )}

        {/* Continue learning banner — if mid-course */}
        {inProgressCourse && (
          <div className="mb-6 flex items-center gap-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
            <div className="text-2xl">📖</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-indigo-900">Continue where you left off</p>
              <p className="text-xs text-indigo-600 mt-0.5 truncate">{inProgressCourse.title} — {Math.round(inProgressCourse.progress_pct)}% complete</p>
            </div>
            <Link to={`/courses/${inProgressCourse.slug}`} className="btn-primary text-xs py-2 px-3 whitespace-nowrap">
              Continue →
            </Link>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="Career Path"
            value={hasRoadmap ? '1' : '—'}
            sub={hasRoadmap ? 'roadmap active' : 'not started'}
            color="text-indigo-600"
          />
          <StatCard
            label="Courses"
            value={String(enrolledCourses.length || (courses?.length ?? 0))}
            sub={enrolledCourses.length > 0 ? `${enrolledCourses.length} enrolled` : 'available'}
            color="text-purple-600"
          />
          <StatCard
            label="Topics Studied"
            value={studiedTopics > 0 ? String(studiedTopics) : '0'}
            sub={studiedTopics > 0 ? 'topics marked done' : 'start studying'}
            color="text-emerald-600"
          />
          <StatCard
            label="My Notes"
            value={myNotesTotal > 0 ? String(myNotesTotal) : '0'}
            sub={myNotesTotal > 0 ? 'personal notes' : 'add your first'}
            color="text-rose-500"
          />
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">

          {/* Roadmap card */}
          <div className="card p-6">
            <div className="text-2xl mb-3">🗺️</div>
            <h3 className="font-semibold text-slate-900 mb-1">
              {hasRoadmap ? 'Continue your roadmap' : 'Generate your roadmap'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {hasRoadmap
                ? `${activeRoadmap?.career_role_title || 'Career'} — pick up where you left off.`
                : 'Select a career and get a personalised learning plan.'}
            </p>
            {hasRoadmap
              ? <Link to={`/roadmaps/${activeRoadmap.id}`} className="btn-primary text-sm">View roadmap →</Link>
              : <Link to="/careers" className="btn-primary text-sm">Get started →</Link>}
          </div>

          {/* Courses card */}
          <div className="card p-6">
            <div className="text-2xl mb-3">📚</div>
            <h3 className="font-semibold text-slate-900 mb-1">
              {inProgressCourse ? 'Resume learning' : 'Start a course'}
            </h3>
            <p className="text-sm text-slate-500 mb-4">
              {inProgressCourse
                ? `${inProgressCourse.title} · ${Math.round(inProgressCourse.progress_pct)}% done`
                : '4 courses available — Python, SQL, Web Dev, Data Analytics.'}
            </p>
            <Link
              to={inProgressCourse ? `/courses/${inProgressCourse.slug}` : '/courses'}
              className="btn-primary text-sm"
            >
              {inProgressCourse ? 'Resume →' : 'Browse courses →'}
            </Link>
          </div>

          {/* Skills / Explore card */}
          <div className="card p-6">
            <div className="text-2xl mb-3">🎯</div>
            <h3 className="font-semibold text-slate-900 mb-1">Explore careers</h3>
            <p className="text-sm text-slate-500 mb-4">
              Browse 12 career roles. See required skills, salaries, and growth paths.
            </p>
            <Link to="/careers" className="btn-secondary text-sm">Browse careers →</Link>
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
