import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { useLanguage } from '../i18n/LanguageContext'
import {
  Compass,
  Search,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Layers,
  Award,
  ChevronRight,
  X
} from 'lucide-react'

const categoryColors: Record<string, string> = {
  technical: 'bg-blue-50 text-blue-700 border-blue-200/60',
  soft: 'bg-purple-50 text-purple-700 border-purple-200/60',
  domain: 'bg-amber-50 text-amber-700 border-amber-200/60',
  tool: 'bg-emerald-50 text-emerald-700 border-emerald-200/60',
}

const gradients = [
  'from-blue-600 via-indigo-600 to-cyan-500',
  'from-violet-600 via-purple-600 to-pink-500',
  'from-rose-500 via-pink-600 to-purple-600',
  'from-amber-500 via-orange-600 to-rose-500',
  'from-emerald-500 via-teal-600 to-cyan-600',
  'from-indigo-600 via-blue-600 to-purple-600',
  'from-pink-500 via-rose-600 to-orange-500',
  'from-cyan-500 via-blue-600 to-indigo-600',
  'from-green-500 via-emerald-600 to-teal-500',
  'from-yellow-500 via-amber-600 to-orange-500',
  'from-red-500 via-rose-600 to-pink-500',
  'from-teal-500 via-cyan-600 to-blue-500',
]

const categoryFilters = [
  { id: 'all', label: 'All Roles' },
  { id: 'engineering', label: 'Software & Dev' },
  { id: 'data', label: 'Data & AI' },
  { id: 'cloud', label: 'Cloud & Systems' },
  { id: 'design', label: 'Product & Design' },
]

export default function Careers() {
  const { t } = useLanguage()
  const [search, setSearch] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

  const { data, isLoading } = useQuery({
    queryKey: ['careers', search],
    queryFn: () => api.get(`/careers?search=${search}&size=50`).then(r => r.data),
    staleTime: 60_000,
  })

  const careersList = data?.items || []

  const filteredCareers = useMemo(() => {
    if (selectedFilter === 'all') return careersList
    return careersList.filter((c: any) => {
      const title = c.title.toLowerCase()
      const desc = (c.description || '').toLowerCase()
      if (selectedFilter === 'engineering') {
        return title.includes('developer') || title.includes('software') || title.includes('full') || title.includes('frontend') || title.includes('backend')
      }
      if (selectedFilter === 'data') {
        return title.includes('data') || title.includes('ai') || title.includes('machine') || title.includes('analyst')
      }
      if (selectedFilter === 'cloud') {
        return title.includes('cloud') || title.includes('devops') || title.includes('security') || title.includes('system')
      }
      if (selectedFilter === 'design') {
        return title.includes('designer') || title.includes('product') || title.includes('ui') || title.includes('ux')
      }
      return true
    })
  }, [careersList, selectedFilter])

  return (
    <AppShell>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-8 sm:p-10 shadow-xl border border-indigo-900/40">
          <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-indigo-200 text-xs font-semibold mb-4 border border-white/10 backdrop-blur-md">
              <Compass className="w-3.5 h-3.5 text-indigo-300" />
              <span>INDUSTRY CAREER BLUEPRINTS</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-3">
              {t('careers.title', 'Explore Verified Career Paths')}
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              {t('careers.subtitle', 'Choose a career to inspect verified required skills, salary insights, prerequisite chains, and generate your step-by-step roadmap.')}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 shadow-xs space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder={t('careers.searchPlaceholder', 'Search roles by title, skill, or keyword...')}
                className="input pl-10 pr-9 text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Category Tabs */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categoryFilters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedFilter === filter.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Showing <strong>{filteredCareers.length}</strong> of <strong>{careersList.length}</strong> career roles</span>
          {search && <span>Filtered by search: <em>"{search}"</em></span>}
        </div>

        {/* Career Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="card p-6 animate-pulse space-y-4">
                <div className="w-12 h-12 bg-slate-100 rounded-2xl" />
                <div className="h-5 bg-slate-100 rounded w-2/3" />
                <div className="h-10 bg-slate-100 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-100 rounded-md w-16" />
                  <div className="h-6 bg-slate-100 rounded-md w-16" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredCareers.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 text-2xl">
              🔍
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No career paths matched</h3>
            <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
              Try adjusting your search terms or clearing your category filters.
            </p>
            <button
              onClick={() => { setSearch(''); setSelectedFilter('all') }}
              className="btn-primary text-xs py-2 px-4 rounded-xl"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCareers.map((career: any, i: number) => {
              const bgGradient = gradients[i % gradients.length]
              return (
                <Link
                  key={career.id}
                  to={`/careers/${career.slug}`}
                  className="card-interactive p-6 flex flex-col justify-between group relative overflow-hidden"
                >
                  <div>
                    {/* Top Row: Icon + Seniority Pill */}
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${bgGradient} text-white flex items-center justify-center font-black text-lg shadow-md group-hover:scale-105 transition-transform duration-300`}>
                        {career.title[0]}
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 border border-slate-200/70">
                        {career.seniority_level || 'Entry Level'}
                      </span>
                    </div>

                    {/* Title & Description */}
                    <h3 className="font-bold text-slate-900 text-lg mb-1.5 group-hover:text-indigo-600 transition-colors">
                      {career.title}
                    </h3>
                    <p className="text-xs text-slate-500 mb-4 line-clamp-2 leading-relaxed">
                      {career.description}
                    </p>

                    {/* Required Skills */}
                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {career.required_skills?.slice(0, 4).map((rs: any) => (
                        <span
                          key={rs.id}
                          className={`badge border ${categoryColors[rs.skill?.category] || 'bg-slate-100 text-slate-600 border-slate-200'}`}
                        >
                          {rs.skill?.name}
                        </span>
                      ))}
                      {career.required_skills?.length > 4 && (
                        <span className="badge bg-slate-100 text-slate-500 border border-slate-200">
                          +{career.required_skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Metadata + CTA */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {career.required_skills?.length || 0} skills mapped
                    </span>
                    <span className="font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                      <span>View Roadmap</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

      </div>
    </AppShell>
  )
}
