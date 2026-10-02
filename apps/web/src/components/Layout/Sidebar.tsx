import { NavLink, Link } from 'react-router-dom';
import {
  LayoutDashboard, Map, BookOpen, TrendingUp, User,
  LogOut, GraduationCap,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import clsx from 'clsx';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/roadmap',   icon: Map,             label: 'My Roadmap' },
  { to: '/careers',   icon: BookOpen,         label: 'Careers' },
  { to: '/progress',  icon: TrendingUp,       label: 'Progress' },
  { to: '/profile',   icon: User,             label: 'Profile' },
];

export const Sidebar = () => {
  const { user, logout } = useAuth();

  return (
    <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-screen sticky top-0 flex-shrink-0">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2.5 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
        <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <GraduationCap className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-gray-900 text-lg leading-none">
          Student<span className="text-brand-600">Roadmap</span>
        </span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              clsx(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150',
                isActive
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )
            }
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-brand-700 text-sm font-semibold">
              {user?.email?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-[10px] text-gray-500 capitalize">{user?.role}</p>
          </div>
          <button
            onClick={logout}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
