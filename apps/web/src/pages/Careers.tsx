import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'

const categoryColors: Record<string, string> = {
  technical: 'bg-blue-50 text-blue-700',
  soft: 'bg-purple-50 text-purple-700',
  domain: 'bg-amber-50 text-amber-700',
  tool: 'bg-emerald-50 text-emerald-700',
}

const gradients = [
  'from-blue-500 to-cyan-500', 'from-violet-500 to-purple-500', 'from-rose-500 to-pink-500',
  'from-amber-500 to-orange-500', 'from-emerald-500 to-teal-500', 'from-indigo-500 to-blue-500',
  'from-pink-500 to-rose-500', 'from-cyan-500 to-blue-500', 'from-green-500 to-emerald-500',
  'from-yellow-500 to-amber-500', 'from-red-500 to-rose-500', 'from-teal-500 to-cyan-500',
]

export default function Careers() {
  const [search, setSearch] = useState('')
  const { data, isLoading } = useQuery({
    queryKey: ['careers', search],
    queryFn: () => api.get(`/careers?search=${search}&size=50`).then(r => r.data),
    staleTime: 60_000,
  })

  return (
    <AppShell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Career paths</h1>
          <p className="text-slate-500 text-sm">Choose a career to see required skills and generate your roadmap.</p>
        </div>

        {/* Search */}
        <div className="relative mb-8 max-w-md">
          <svg className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search careers (e.g. data, cloud, design)..."
            className="input pl-10" />
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card p-5 animate-pulse">
                <div className="w-10 h-10 bg-slate-100 rounded-xl mb-4" />
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                <div className="flex gap-2">
                  <div className="h-5 bg-slate-100 rounded-full w-16" />
                  <div className="h-5 bg-slate-100 rounded-full w-12" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            <div className="text-xs text-slate-400 mb-4">{data?.total || 0} career paths</div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(data?.items || []).map((career: any, i: number) => (
                <Link key={career.id} to={`/careers/${career.slug}`}
                  className="card p-5 hover:shadow-md transition-all hover:-translate-y-0.5 group cursor-pointer">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradients[i % gradients.length]} mb-4 flex items-center justify-center`}>
                    <span className="text-white text-base font-bold">{career.title[0]}</span>
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{career.title}</h3>
                  <p className="text-xs text-slate-400 mb-3 line-clamp-2">{career.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {career.required_skills.slice(0, 4).map((rs: any) => (
                      <span key={rs.id} className={`badge ${categoryColors[rs.skill.category] || 'bg-slate-100 text-slate-600'}`}>
                        {rs.skill.name}
                      </span>
                    ))}
                    {career.required_skills.length > 4 && (
                      <span className="badge bg-slate-100 text-slate-500">+{career.required_skills.length - 4}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-auto">
                    <span>{career.required_skills.length} skills required</span>
                    <span>·</span>
                    <span className="capitalize">{career.seniority_level} level</span>
                  </div>
                </Link>
              ))}
            </div>
            {data?.items?.length === 0 && (
              <div className="text-center py-16 text-slate-400">
                <div className="text-4xl mb-3">🔍</div>
                <p className="font-medium">No careers found for "{search}"</p>
                <button onClick={() => setSearch('')} className="text-indigo-600 text-sm mt-2 hover:underline">Clear search</button>
              </div>
            )}
          </>
        )}
      </div>
    </AppShell>
  )
}
