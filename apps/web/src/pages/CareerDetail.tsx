import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'

const difficultyColor: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
  expert: 'bg-purple-100 text-purple-700',
}

function ImportanceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100)
  const color = pct >= 80 ? 'bg-red-500' : pct >= 60 ? 'bg-amber-500' : 'bg-emerald-500'
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-slate-100 rounded-full h-1.5">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-slate-500 w-8 text-right">{pct}%</span>
    </div>
  )
}

export default function CareerDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [hours, setHours] = useState(10)
  const [generating, setGenerating] = useState(false)
  const [genError, setGenError] = useState('')

  const { data: career, isLoading } = useQuery({
    queryKey: ['career', slug],
    queryFn: () => api.get(`/careers/${slug}`).then(r => r.data),
  })

  const { data: gap } = useQuery({
    queryKey: ['gap', slug],
    queryFn: () => api.get(`/careers/${slug}/skill-gap`).then(r => r.data),
    retry: false,
  })

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
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 animate-pulse">
          <div className="h-8 bg-slate-100 rounded w-1/2 mb-4" />
          <div className="h-4 bg-slate-100 rounded w-3/4 mb-8" />
          <div className="card p-6">
            {Array(6).fill(0).map((_, i) => <div key={i} className="h-12 bg-slate-50 rounded mb-3" />)}
          </div>
        </div>
      </AppShell>
    )
  }

  const sorted = [...(career?.required_skills || [])].sort((a, b) => b.importance - a.importance)
  const readiness = gap ? Math.round(gap.overall_readiness * 100) : null

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <button onClick={() => navigate('/careers')} className="text-xs text-slate-400 hover:text-slate-600 mb-4 flex items-center gap-1">
            ← Back to careers
          </button>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{career?.title}</h1>
              <p className="text-slate-500 text-sm">{career?.description}</p>
            </div>
            {readiness !== null && (
              <div className="flex-shrink-0 text-center">
                <div className={`text-2xl font-black ${readiness >= 60 ? 'text-emerald-600' : readiness >= 30 ? 'text-amber-600' : 'text-red-500'}`}>
                  {readiness}%
                </div>
                <div className="text-xs text-slate-400">your readiness</div>
              </div>
            )}
          </div>
        </div>

        {/* Gap analysis banner */}
        {gap && gap.gaps.length > 0 && (
          <div className="mb-6 card p-4 border-amber-100 bg-amber-50">
            <p className="text-xs font-semibold text-amber-700 mb-2">Top skill gaps to close</p>
            <div className="flex flex-wrap gap-2">
              {gap.gaps.slice(0, 4).map((g: any) => (
                <span key={g.skill.slug} className="badge bg-amber-100 text-amber-800">
                  {g.skill.name} <span className="ml-1 opacity-60">{Math.round(g.gap * 100)}% gap</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Required skills */}
        <div className="card mb-6">
          <div className="px-6 py-4 border-b border-slate-50">
            <h2 className="font-semibold text-slate-900 text-sm">Required skills ({sorted.length})</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {sorted.map((rs: any) => (
              <div key={rs.id} className="px-6 py-3 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-slate-800">{rs.skill.name}</span>
                    <span className={`badge text-xs ${difficultyColor[rs.required_level] || 'bg-slate-100 text-slate-500'}`}>
                      {rs.required_level}
                    </span>
                  </div>
                  <ImportanceBar value={rs.importance} />
                </div>
                {gap && (
                  <div className="flex-shrink-0 w-14 text-right">
                    {(() => {
                      const gapEntry = gap.gaps.find((g: any) => g.skill.slug === rs.skill.slug)
                      const comp = gapEntry ? Math.round(gapEntry.student_competency * 100) : null
                      if (comp === null) return null
                      return <span className={`text-xs font-medium ${comp >= 60 ? 'text-emerald-600' : 'text-slate-400'}`}>{comp}% you</span>
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Generate roadmap */}
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 mb-1">Generate your roadmap</h2>
          <p className="text-sm text-slate-500 mb-5">We'll build a personalised, prerequisite-ordered plan based on your current skills.</p>
          <div className="flex items-center gap-4 mb-5">
            <label className="text-sm text-slate-700 font-medium whitespace-nowrap">Hours per week</label>
            <input type="range" min={5} max={40} step={5} value={hours} onChange={e => setHours(+e.target.value)}
              className="flex-1 accent-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600 w-14 text-right">{hours}h/week</span>
          </div>
          {genError && <p className="text-sm text-red-500 mb-3">{genError}</p>}
          <button onClick={handleGenerate} disabled={generating} className="btn-primary w-full justify-center py-3">
            {generating ? (
              <><svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>Generating roadmap...</>
            ) : `Generate roadmap for ${career?.title} →`}
          </button>
        </div>
      </div>
    </AppShell>
  )
}
