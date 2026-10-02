import { useNavigate, Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/api'
import { clearToken, isLoggedIn } from '../../lib/auth'
import { useEffect } from 'react'

const navItems = [
  { label: 'Dashboard', href: '/dashboard', icon: '⊞' },
  { label: 'Careers', href: '/careers', icon: '🎯' },
  { label: 'My Roadmap', href: '/roadmaps', icon: '🗺️' },
  { label: 'Profile', href: '/profile', icon: '👤' },
]

export default function AppShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()

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

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 bg-white border-r border-slate-100 fixed inset-y-0 left-0 z-30">
        <div className="h-16 flex items-center px-5 border-b border-slate-100">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-xs font-bold">SR</span>
            </div>
            <span className="font-bold text-slate-900 text-sm">StudentRoadmap</span>
          </Link>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.href} to={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
              {me?.user?.email?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-900 truncate">{me?.user?.email || 'Loading...'}</p>
              <p className="text-xs text-slate-400 capitalize">{me?.user?.role || 'student'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full text-left text-xs text-slate-400 hover:text-red-500 transition-colors px-1">
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile topbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b border-slate-100 h-14 flex items-center px-4 gap-4">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">SR</span>
          </div>
          <span className="font-bold text-slate-900 text-sm">StudentRoadmap</span>
        </Link>
        <div className="flex-1" />
        <button onClick={handleLogout} className="text-xs text-slate-400">Sign out</button>
      </div>

      {/* Mobile bottom nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-100 flex">
        {navItems.map(item => (
          <Link key={item.href} to={item.href} className="flex-1 flex flex-col items-center py-2 text-slate-500 hover:text-indigo-600 text-xs gap-0.5">
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label.split(' ')[0]}</span>
          </Link>
        ))}
      </div>

      {/* Main */}
      <main className="flex-1 md:ml-60 pt-14 md:pt-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
