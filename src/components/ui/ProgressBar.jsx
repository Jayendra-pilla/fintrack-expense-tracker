import { motion } from 'framer-motion';
import clsx from 'clsx';

export function ProgressBar({ value, max = 100, color = 'primary', height = 'h-2', showLabel = false, animated = true, className = '' }) {
  const percent = Math.min(100, (value / max) * 100);

  const colors = {
    primary: 'from-primary-400 to-violet-500',
    success: 'from-emerald-400 to-teal-500',
    warning: 'from-amber-400 to-orange-500',
    danger: 'from-rose-400 to-red-500',
    info: 'from-blue-400 to-cyan-500',
  };

  const getColor = () => {
    if (percent > 90) return colors.danger;
    if (percent > 70) return colors.warning;
    return colors[color] || colors.primary;
  };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-white/40 mb-1">
          <span>{Math.round(percent)}%</span>
          <span>{value.toLocaleString()} / {max.toLocaleString()}</span>
        </div>
      )}
      <div className={clsx('progress-track', height)}>
        <motion.div
          initial={animated ? { width: 0 } : { width: `${percent}%` }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
          className={clsx('h-full rounded-full bg-gradient-to-r', getColor())}
        />
      </div>
    </div>
  );
}
