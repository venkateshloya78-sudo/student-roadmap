import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'

const difficultyColor: Record<string, string> = {
  beginner: 'bg-emerald-100 text-emerald-700',
  intermediate: 'bg-amber-100 text-amber-700',
  advanced: 'bg-red-100 text-red-700',
  expert: 'bg-purple-100 text-purple-700',
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
  documentation: 'bg-blue-50 text-blue-700 border-blue-100',
  video: 'bg-red-50 text-red-700 border-red-100',
  course: 'bg-purple-50 text-purple-700 border-purple-100',
  book: 'bg-amber-50 text-amber-700 border-amber-100',
  tutorial: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  other: 'bg-slate-50 text-slate-600 border-slate-100',
}

const weekColors = [
  'border-indigo-400 bg-indigo-50',
  'border-violet-400 bg-violet-50',
  'border-blue-400 bg-blue-50',
  'border-cyan-400 bg-cyan-50',
  'border-teal-400 bg-teal-50',
  'border-emerald-400 bg-emerald-50',
  'border-amber-400 bg-amber-50',
  'border-rose-400 bg-rose-50',
]

export default function SkillDoc() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'curriculum' | 'resources'>('curriculum')
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set([0]))

  const { data: topicData, isLoading: topicsLoading } = useQuery({
    queryKey: ['skill-topics', slug],
    queryFn: () => api.get(`/skills/${slug}/topics`).then(r => r.data),
    enabled: !!slug,
  })

  const { data: resourceData, isLoading: resLoading } = useQuery({
    queryKey: ['skill-resources', slug],
    queryFn: () => api.get(`/skills/${slug}/resources`).then(r => r.data),
    enabled: !!slug && activeTab === 'resources',
  })

  const { data: skillDetail } = useQuery({
    queryKey: ['skill-detail', slug],
    queryFn: () => api.get(`/skills/${slug}`).then(r => r.data),
    enabled: !!slug,
  })

  const toggleWeek = (idx: number) => {
    setExpandedWeeks(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  const expandAll = () => setExpandedWeeks(new Set(topicData?.curriculum?.map((_: any, i: number) => i) || []))
  const collapseAll = () => setExpandedWeeks(new Set())

  const isLoading = topicsLoading

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
          <div className="h-8 bg-slate-100 rounded w-1/3 mb-2" />
          <div className="h-4 bg-slate-100 rounded w-2/3 mb-8" />
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-20 bg-slate-50 rounded-xl" />)}
        </div>
      </AppShell>
    )
  }

  const skill = topicData?.skill
  const curriculum = topicData?.curriculum || []
  const resources = resourceData?.resources || []

  // Group resources by type
  const resourceGroups = resources.reduce((acc: any, r: any) => {
    if (!acc[r.type]) acc[r.type] = []
    acc[r.type].push(r)
    return acc
  }, {})

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <button onClick={() => navigate(-1)} className="hover:text-slate-600">← Back</button>
          <span>/</span>
          <Link to="/careers" className="hover:text-slate-600">Careers</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium">{skill?.name}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 text-xl font-bold flex-shrink-0">
              {skill?.name?.[0] || '?'}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{skill?.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                {skill?.difficulty && (
                  <span className={`badge ${difficultyColor[skill.difficulty] || 'bg-slate-100 text-slate-600'}`}>
                    {skill.difficulty}
                  </span>
                )}
                {skillDetail?.category && (
                  <span className="badge bg-indigo-50 text-indigo-700">{skillDetail.category}</span>
                )}
                {topicData?.has_full_curriculum && (
                  <span className="badge bg-emerald-50 text-emerald-700">📋 Full curriculum</span>
                )}
                <span className="badge bg-blue-50 text-blue-700">
                  {resources.length > 0 ? `${resources.length} free resources` : 'Resources loading...'}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {topicData?.description && (
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-5">
              <p className="text-slate-700 leading-relaxed">{topicData.description}</p>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        {skillDetail?.prerequisites?.length > 0 && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-xl">
            <p className="text-xs font-semibold text-amber-700 mb-2">⚠️ Learn these first (prerequisites)</p>
            <div className="flex flex-wrap gap-2">
              {skillDetail.prerequisites.map((p: any) => (
                <Link key={p.slug} to={`/skills/${p.slug}`}
                  className="badge bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors cursor-pointer">
                  {p.name} →
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 rounded-xl p-1 mb-6">
          {(['curriculum', 'resources'] as const).map(tab => (
            <button key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-semibold transition-all capitalize
                ${activeTab === tab
                  ? 'bg-white text-indigo-700 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab === 'curriculum' ? `📋 Curriculum (${curriculum.length} weeks)` : `📚 Resources (${resources.length})`}
            </button>
          ))}
        </div>

        {/* CURRICULUM TAB */}
        {activeTab === 'curriculum' && (
          <div>
            {curriculum.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-3">🚧</div>
                <h3 className="font-semibold text-slate-900 mb-2">Curriculum coming soon</h3>
                <p className="text-slate-500 text-sm mb-4">
                  We're building the full week-by-week curriculum for {skill?.name}.<br/>
                  Switch to <strong>Resources</strong> to start learning now.
                </p>
                <button onClick={() => setActiveTab('resources')} className="btn-primary">
                  View Learning Resources →
                </button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    {curriculum.reduce((t: number, w: any) => t + (w.items?.length || 0), 0)} topics across {curriculum.length} weeks
                  </p>
                  <div className="flex gap-2">
                    <button onClick={expandAll} className="text-xs text-indigo-600 hover:underline">Expand all</button>
                    <span className="text-slate-300">·</span>
                    <button onClick={collapseAll} className="text-xs text-slate-400 hover:underline">Collapse all</button>
                  </div>
                </div>

                <div className="space-y-3">
                  {curriculum.map((week: any, idx: number) => {
                    const isOpen = expandedWeeks.has(idx)
                    const colorClass = weekColors[idx % weekColors.length]
                    return (
                      <div key={idx} className={`card border-l-4 ${colorClass} overflow-hidden`}>
                        <button
                          onClick={() => toggleWeek(idx)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-white border-2 border-current flex items-center justify-center text-xs font-bold text-slate-600 flex-shrink-0">
                              {idx + 1}
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">Week {week.week || idx + 1}: {week.title}</p>
                              <p className="text-xs text-slate-400">{week.items?.length} topics</p>
                            </div>
                          </div>
                          <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5">
                            <div className="grid sm:grid-cols-2 gap-2">
                              {(week.items || []).map((item: string, i: number) => (
                                <div key={i} className="flex items-start gap-2.5 p-3 bg-white rounded-lg border border-slate-100">
                                  <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <span className="text-indigo-600 text-xs font-bold">{i + 1}</span>
                                  </div>
                                  <p className="text-sm text-slate-700 leading-snug">{item}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* CTA to resources */}
                <div className="mt-6 card p-5 bg-indigo-50 border-indigo-100 flex items-center gap-4">
                  <div className="text-3xl">🎓</div>
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900 text-sm">Ready to start learning?</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      View all free courses, Wikipedia articles, and PDFs for {skill?.name}.
                    </p>
                  </div>
                  <button onClick={() => setActiveTab('resources')} className="btn-primary text-sm whitespace-nowrap">
                    View Resources →
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* RESOURCES TAB */}
        {activeTab === 'resources' && (
          <div>
            {resLoading ? (
              <div className="space-y-3">
                {Array(4).fill(0).map((_, i) => (
                  <div key={i} className="card p-5 animate-pulse">
                    <div className="h-3 bg-slate-100 rounded w-1/4 mb-3" />
                    <div className="h-10 bg-slate-50 rounded mb-2" />
                    <div className="h-10 bg-slate-50 rounded" />
                  </div>
                ))}
              </div>
            ) : resources.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-slate-500">No resources found for this skill yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {Object.entries(resourceGroups).map(([type, items]: [string, any]) => (
                  <div key={type} className="card overflow-hidden">
                    <div className={`px-5 py-3 border-b border-slate-50 flex items-center gap-2 ${typeBadge[type] || typeBadge.other} border-0 rounded-none`}>
                      <span className="text-lg">{typeIcon[type] || '🔗'}</span>
                      <span className="text-sm font-semibold capitalize">{type}</span>
                      <span className="ml-auto text-xs opacity-70">{items.length} resource{items.length > 1 ? 's' : ''}</span>
                    </div>
                    <div className="divide-y divide-slate-50">
                      {items.map((r: any) => (
                        <div key={r.id} className="flex items-center group px-5 py-4 hover:bg-slate-50 transition-colors">
                          <Link to={`/learn/${r.id}`} className="flex-1 flex items-start gap-4 cursor-pointer min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-slate-800 group-hover:text-indigo-600 transition-colors leading-snug mb-1">
                                {r.title}
                              </p>
                              <div className="flex items-center gap-2">
                                {r.is_free && (
                                  <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium">
                                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    Free
                                  </span>
                                )}
                                <span className="text-xs text-slate-400">
                                  {r.url.replace(/^https?:\/\//, '').split('/')[0]}
                                </span>
                              </div>
                            </div>
                          </Link>
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="ml-4 p-2 text-slate-300 hover:text-indigo-500 transition-colors rounded-full hover:bg-indigo-50" title="External link">
                            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                <p className="text-center text-xs text-slate-400 py-4">
                  All resources above are free. Click any to open in a new tab.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}
