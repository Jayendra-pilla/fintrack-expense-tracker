import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ArrowLeftRight, BarChart3, Wallet, Target,
  Calendar, FileText, Moon, Sun, Zap, ChevronRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import clsx from 'clsx';

const NAV_ITEMS = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Transactions' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/budget', icon: Wallet, label: 'Budget' },
  { path: '/goals', icon: Target, label: 'Goals' },
  { path: '/calendar', icon: Calendar, label: 'Calendar' },
  { path: '/reports', icon: FileText, label: 'Reports' },
];

export function Sidebar() {
  const { isDark, toggleTheme } = useTheme();
  const { healthScore, streak } = useApp();
  const location = useLocation();

  return (
    <aside className={clsx(
      'hidden lg:flex flex-col w-64 h-screen sticky top-0 border-r z-30',
      isDark
        ? 'bg-dark-900/80 backdrop-blur-xl border-white/10'
        : 'bg-white/80 backdrop-blur-xl border-gray-200'
    )}>
      {/* Logo */}
      <div className="px-6 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center shadow-glow">
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h1 className={clsx('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>FinTrack</h1>
          <p className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>AI Finance</p>
        </div>
      </div>

      {/* Health Score Mini */}
      <div className="px-4 mb-4">
        <div className={clsx(
          'rounded-xl px-4 py-3 border',
          isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-200'
        )}>
          <div className="flex items-center justify-between mb-2">
            <span className={clsx('text-xs font-medium', isDark ? 'text-white/60' : 'text-gray-500')}>
              Health Score
            </span>
            <span className="text-xs text-primary-400 font-bold">{healthScore}/100</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-1.5">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${healthScore}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="h-full rounded-full bg-gradient-to-r from-primary-400 to-violet-400"
            />
          </div>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-orange-400">🔥</span>
            <span className={clsx('text-xs', isDark ? 'text-white/50' : 'text-gray-500')}>
              {streak} day streak
            </span>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink key={path} to={path}>
              <motion.div
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                className={clsx(
                  'nav-link',
                  isActive
                    ? isDark
                      ? 'nav-link-active'
                      : 'bg-primary-50 text-primary-600 border border-primary-100'
                    : isDark
                      ? 'nav-link-inactive'
                      : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                )}
              >
                <Icon size={18} className={isActive ? 'text-primary-400' : ''} />
                <span>{label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-primary-400/60" />}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className={clsx('px-4 py-4 border-t', isDark ? 'border-white/10' : 'border-gray-200')}>
        <button
          onClick={toggleTheme}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            isDark ? 'text-white/60 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          )}
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <div className={clsx('mt-3 text-xs text-center', isDark ? 'text-white/20' : 'text-gray-400')}>
          FinTrack v1.0 · Made with ❤️
        </div>
      </div>
    </aside>
  );
}
