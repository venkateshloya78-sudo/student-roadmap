import { useNavigate, Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { clearToken, isLoggedIn } from '../../lib/auth'
import { useEffect } from 'react'
import { FloatingAssistantWidget } from '../Assistant/FloatingAssistantWidget'
import { useLanguage } from '../../i18n/LanguageContext'
import LanguageSelector from '../Common/LanguageSelector'
import {
  LayoutDashboard,
  Compass,
  Map,
  GraduationCap,
  Sparkles,
  User,
  LogOut,
  ChevronRight,
  Flame,
  Search,
  Bell
} from 'lucide-react'

export default function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()

  const navItems = [
    { label: t('nav.dashboard', 'Dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { label: t('nav.careers', 'Careers'), href: '/careers', icon: Compass },
    { label: t('nav.roadmap', 'My Roadmap'), href: '/roadmaps', icon: Map },
    { label: t('nav.courses', 'Courses'), href: '/courses', icon: GraduationCap },
    { label: t('nav.assistant', 'AI Assistant'), href: '/assistant', icon: Sparkles, badge: 'AI' },
    { label: t('nav.profile', 'Profile'), href: '/profile', icon: User },
  ]

  useEffect(() => {
    if (!isLoggedIn()) navigate('/login')
  }, [])

  const { data: me } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
    retry: false,
  })

  const handleLogout = () => {
    clearToken()
    navigate('/login')
  }

  const isRouteActive = (href: string) => {
    if (href === '/dashboard') {
      return location.pathname === '/dashboard'
    }
    return location.pathname.startsWith(href)
  }

  const userInitial = me?.user?.email?.[0]?.toUpperCase() || 'S'
  const userDisplayName = me?.user?.email?.split('@')[0] || 'Student'

  return (
    <div className="min-h-screen bg-slate-50 flex selection:bg-indigo-500 selection:text-white">
      {/* Sleek Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white/95 backdrop-blur-xl border-r border-slate-200/80 fixed inset-y-0 left-0 z-30 shadow-[1px_0_20px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="h-18 px-5 border-b border-slate-100 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-600 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/25 ring-2 ring-indigo-400/20 group-hover:scale-105 transition-all duration-300">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-slate-900 text-base tracking-tight group-hover:text-indigo-600 transition-colors">
                  Student<span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 bg-clip-text text-transparent">Roadmap</span>
                </span>
                <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 shadow-xs">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">Career Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Platform Menu
          </div>
          {navItems.map(item => {
            const active = isRouteActive(item.href)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                to={item.href}
                className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                  active
                    ? 'bg-gradient-to-r from-indigo-50/90 to-violet-50/70 text-indigo-700 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                {active && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-gradient-to-b from-indigo-600 to-violet-600 rounded-r-full shadow-xs shadow-indigo-500" />
                )}
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30'
                      : 'text-slate-400 group-hover:text-slate-700 group-hover:bg-slate-200/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="flex-1 truncate">{item.label}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-xs">
                    {item.badge}
                  </span>
                )}
                {active && (
                  <ChevronRight className="w-3.5 h-3.5 text-indigo-400 ml-auto opacity-70" />
                )}
              </Link>
            )
          })}

          {/* Quick Streak Card in Sidebar */}
          <div className="pt-4 px-2">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-indigo-500/5 via-violet-500/5 to-purple-500/10 border border-indigo-100/70">
              <div className="flex items-center gap-2 mb-1">
                <span className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-100 text-amber-600">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                </span>
                <span className="text-xs font-bold text-slate-800">Learning Streak</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-snug">
                Consistency is key. 1 lesson daily keeps your momentum!
              </p>
            </div>
          </div>
        </nav>

        {/* Language Selector in Sidebar */}
        <div className="px-4 py-2 border-t border-slate-100/80">
          <LanguageSelector variant="sidebar" />
        </div>

        {/* User Footer Profile */}
        <div className="p-3 border-t border-slate-100/80 bg-slate-50/50">
          <div className="flex items-center gap-3 p-2 rounded-xl hover:bg-white transition-colors duration-150 border border-transparent hover:border-slate-200/70">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-xs">
                {userInitial}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate capitalize">{userDisplayName}</p>
              <p className="text-[10px] text-slate-400 capitalize">{me?.user?.role || 'Student Scholar'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
              title={t('nav.signOut', 'Sign out')}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 h-15 flex items-center px-4 gap-2 shadow-xs">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-sm">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <span className="font-extrabold text-slate-900 text-sm">
            Student<span className="text-gradient">Roadmap</span>
          </span>
        </Link>
        <div className="flex-1" />
        <LanguageSelector variant="compact" />
        <button
          onClick={handleLogout}
          className="p-1.5 text-slate-500 hover:text-rose-600 rounded-lg"
          title={t('nav.signOut', 'Sign out')}
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-xl border-t border-slate-200/80 flex items-center justify-around py-1 shadow-lg">
        {navItems.map(item => {
          const active = isRouteActive(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex-1 flex flex-col items-center py-1.5 px-1 text-xs gap-1 transition-all ${
                active ? 'text-indigo-600 font-semibold' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              <div className={`p-1 rounded-lg ${active ? 'bg-indigo-50 text-indigo-600' : ''}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate max-w-[56px] text-[10px]">{item.label}</span>
            </Link>
          )
        })}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 pt-16 md:pt-0 pb-20 md:pb-8 min-h-screen">
        {children}
      </main>

      {/* Floating Gemini AI Assistant */}
      <FloatingAssistantWidget />
    </div>
  )
}
