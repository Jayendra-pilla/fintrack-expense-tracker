import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, ArrowLeftRight, BarChart3, Wallet, Target } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const MOBILE_NAV = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/transactions', icon: ArrowLeftRight, label: 'Txns' },
  { path: '/analytics', icon: BarChart3, label: 'Analytics' },
  { path: '/budget', icon: Wallet, label: 'Budget' },
  { path: '/goals', icon: Target, label: 'Goals' },
];

export function MobileNav() {
  const { isDark } = useTheme();
  const location = useLocation();

  return (
    <nav className={clsx(
      'mobile-nav lg:hidden',
      isDark ? '' : 'bg-white/95 border-gray-200'
    )}>
      {MOBILE_NAV.map(({ path, icon: Icon, label }) => {
        const isActive = location.pathname === path;
        return (
          <NavLink key={path} to={path} className="flex flex-col items-center gap-0.5 flex-1">
            <div className={clsx(
              'p-2 rounded-xl transition-all',
              isActive ? 'bg-primary-500/20' : 'transparent'
            )}>
              <Icon size={20} className={isActive ? 'text-primary-400' : isDark ? 'text-white/40' : 'text-gray-400'} />
            </div>
            <span className={clsx(
              'text-[10px] font-medium',
              isActive ? 'text-primary-400' : isDark ? 'text-white/40' : 'text-gray-400'
            )}>
              {label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
