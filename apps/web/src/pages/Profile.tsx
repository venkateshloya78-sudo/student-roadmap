import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import AppShell from '../components/Layout/AppShell'
import { useLanguage } from '../i18n/LanguageContext'
import LanguageSelector from '../components/Common/LanguageSelector'

const degrees = ['btech', 'bsc', 'bcom', 'ba', 'mtech', 'msc', 'other']
const years = [1, 2, 3, 4]
const learningStyles = ['visual', 'reading', 'hands_on', 'video', 'mixed']
const hours = [5, 10, 15, 20, 25, 30]

export default function Profile() {
  const qc = useQueryClient()
  const { t } = useLanguage()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<Record<string, any>>({})

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => {
      const profile = r.data.profile || {}
      setForm(profile)
      return r.data
    }),
  })

  const updateProfile = useMutation({
    mutationFn: (data: any) => api.patch('/profile', data).then(r => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['me'] })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    },
  })

  const set = (key: string, val: any) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfile.mutate(form)
  }

  if (isLoading) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 animate-pulse space-y-4">
          {Array(4).fill(0).map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">{t('profile.title', 'Your profile')}</h1>
          <p className="text-sm text-slate-500">{t('profile.subtitle', 'This info personalises your skill-gap analysis and roadmap.')}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Education */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <span>🎓</span> Education
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">Degree</label>
                <select value={form.degree || ''} onChange={e => set('degree', e.target.value)} className="input capitalize">
                  <option value="">Select degree</option>
                  {degrees.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Branch / Major</label>
                <input value={form.branch || ''} onChange={e => set('branch', e.target.value)}
                  placeholder="e.g. Computer Science" className="input" />
              </div>
              <div>
                <label className="label">Year</label>
                <select value={form.year || ''} onChange={e => set('year', +e.target.value)} className="input">
                  <option value="">Select year</option>
                  {years.map(y => <option key={y} value={y}>Year {y}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Semester</label>
                <select value={form.semester || ''} onChange={e => set('semester', +e.target.value)} className="input">
                  <option value="">Select semester</option>
                  {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label">University / College</label>
                <input value={form.university || ''} onChange={e => set('university', e.target.value)}
                  placeholder="e.g. IIT Hyderabad" className="input" />
              </div>
            </div>
          </div>

          {/* Location & Schedule */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <span>📍</span> Location & Schedule
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="label">City</label>
                <input value={form.location_city || ''} onChange={e => set('location_city', e.target.value)}
                  placeholder="e.g. Hyderabad" className="input" />
              </div>
              <div>
                <label className="label">State</label>
                <input value={form.location_state || ''} onChange={e => set('location_state', e.target.value)}
                  placeholder="e.g. Telangana" className="input" />
              </div>
              <div>
                <label className="label">Weekly learning hours</label>
                <select value={form.weekly_learning_hours || ''} onChange={e => set('weekly_learning_hours', +e.target.value)} className="input">
                  <option value="">Select hours</option>
                  {hours.map(h => <option key={h} value={h}>{h} hours/week</option>)}
                </select>
              </div>
              <div>
                <label className="label">Learning style</label>
                <select value={form.learning_style || ''} onChange={e => set('learning_style', e.target.value)} className="input capitalize">
                  <option value="">Select style</option>
                  {learningStyles.map(s => <option key={s} value={s}>{s.replace('_', '-')}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Language & Regional Settings */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <span>🌐</span> {t('profile.languageSettings', 'Language & Regional Settings')}
            </h2>
            <LanguageSelector variant="profile" />
          </div>

          {/* Goal */}
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-slate-900 mb-5 flex items-center gap-2">
              <span>🎯</span> Career goal
            </h2>
            <div>
              <label className="label">Describe your career goal</label>
              <textarea value={form.career_goal_text || ''} onChange={e => set('career_goal_text', e.target.value)}
                placeholder="e.g. I want to become a data analyst at a product company within 12 months..."
                className="input min-h-[100px] resize-none" />
            </div>
          </div>

          {/* Account info */}
          <div className="card p-5 bg-slate-50 border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                {me?.user?.email?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900">{me?.user?.email}</p>
                <p className="text-xs text-slate-400 capitalize">{me?.user?.role} account</p>
              </div>
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-3">
            <button type="submit" disabled={updateProfile.isPending} className="btn-primary px-6 py-2.5">
              {updateProfile.isPending ? t('common.loading', 'Saving...') : t('common.save', 'Save profile')}
            </button>
            {saved && (
              <span className="text-sm text-emerald-600 font-medium flex items-center gap-1.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {t('common.saved', 'Saved!')}
              </span>
            )}
            {updateProfile.isError && (
              <span className="text-sm text-red-500">{t('common.error', 'Failed to save. Try again.')}</span>
            )}
          </div>
        </form>
      </div>
    </AppShell>
  )
}
