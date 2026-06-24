import { motion } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';

const typeStyles = {
  success: { bg: 'bg-emerald-500/10 border-emerald-500/20', text: 'text-emerald-400', badge: 'bg-emerald-500/20 text-emerald-400' },
  warning: { bg: 'bg-amber-500/10 border-amber-500/20', text: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-400' },
  danger: { bg: 'bg-rose-500/10 border-rose-500/20', text: 'text-rose-400', badge: 'bg-rose-500/20 text-rose-400' },
  info: { bg: 'bg-blue-500/10 border-blue-500/20', text: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-400' },
  tip: { bg: 'bg-violet-500/10 border-violet-500/20', text: 'text-violet-400', badge: 'bg-violet-500/20 text-violet-400' },
};

export function InsightCard({ insight, index = 0 }) {
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const style = typeStyles[insight.type] || typeStyles.info;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={clsx(
        'rounded-xl border p-4 flex gap-3',
        isDark ? style.bg : 'bg-white border-gray-200 shadow-sm'
      )}
    >
      <span className="text-xl flex-shrink-0 mt-0.5">{insight.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className={clsx('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            {insight.title}
          </p>
          <span className={clsx('badge text-[10px]', style.badge)}>
            {insight.type}
          </span>
        </div>
        <p className={clsx('text-xs leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500')}>
          {insight.message}
        </p>
        {insight.action && insight.actionPath && (
          <button
            onClick={() => navigate(insight.actionPath)}
            className={clsx('text-xs font-medium mt-2 hover:underline', style.text)}
          >
            {insight.action} →
          </button>
        )}
      </div>
    </motion.div>
  );
}
