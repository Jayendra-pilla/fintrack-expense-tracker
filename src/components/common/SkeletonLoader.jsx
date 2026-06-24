import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

export function SkeletonLoader({ rows = 3, type = 'card' }) {
  const { isDark } = useTheme();
  const base = isDark ? 'skeleton' : 'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-xl';

  if (type === 'table') {
    return (
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4">
            <div className={clsx(base, 'w-10 h-10 rounded-full flex-shrink-0')} />
            <div className="flex-1 space-y-2">
              <div className={clsx(base, 'h-3 w-1/2')} />
              <div className={clsx(base, 'h-2 w-1/3')} />
            </div>
            <div className={clsx(base, 'h-4 w-20')} />
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className={clsx(
            'rounded-2xl p-5 border',
            isDark ? 'border-white/10' : 'border-gray-200'
          )}>
            <div className={clsx(base, 'w-10 h-10 rounded-xl mb-4')} />
            <div className={clsx(base, 'h-3 w-1/2 mb-2')} />
            <div className={clsx(base, 'h-6 w-3/4')} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={clsx(base, 'h-12')} />
      ))}
    </div>
  );
}

export function EmptyState({ icon, title, message, action }) {
  const { isDark } = useTheme();
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className={clsx(
        'w-20 h-20 rounded-3xl flex items-center justify-center text-4xl',
        isDark ? 'bg-white/5' : 'bg-gray-100'
      )}>
        {icon || '📭'}
      </div>
      <div>
        <h3 className={clsx('text-lg font-semibold mb-1', isDark ? 'text-white' : 'text-gray-900')}>
          {title || 'Nothing here yet'}
        </h3>
        <p className={clsx('text-sm', isDark ? 'text-white/40' : 'text-gray-500')}>
          {message || 'Add something to get started'}
        </p>
      </div>
      {action}
    </div>
  );
}
