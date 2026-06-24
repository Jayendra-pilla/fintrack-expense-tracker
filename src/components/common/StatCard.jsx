import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';
import { useState, useEffect } from 'react';

// Animated number counter
function AnimatedNumber({ value, prefix = '' }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const steps = 40;
    const step = value / steps;
    let current = 0;
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      current = Math.min(value, current + step);
      setDisplay(Math.round(current));
      if (frame >= steps) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);

  return <span>{prefix}{display.toLocaleString('en-IN')}</span>;
}

export function StatCard({ title, value, change, changeLabel, icon: Icon, gradient, type = 'currency', index = 0 }) {
  const { isDark } = useTheme();
  const isPositive = change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={clsx(
        'rounded-2xl p-5 border relative overflow-hidden',
        isDark
          ? 'bg-white/5 backdrop-blur-xl border-white/10 hover:border-white/20'
          : 'bg-white border-gray-200 shadow-card hover:shadow-card-hover'
      )}
    >
      {/* Gradient accent */}
      <div className={clsx(
        'absolute inset-0 opacity-5 bg-gradient-to-br pointer-events-none',
        gradient || 'from-primary-500 to-violet-500'
      )} />

      <div className="flex items-start justify-between mb-3">
        <div className={clsx(
          'p-2.5 rounded-xl bg-gradient-to-br',
          gradient || 'from-primary-500 to-violet-500',
          'shadow-glow'
        )}>
          <Icon size={20} className="text-white" />
        </div>
        {change !== undefined && (
          <div className={clsx(
            'flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg',
            isPositive ? 'bg-emerald-500/15 text-emerald-400' : 'bg-rose-500/15 text-rose-400'
          )}>
            {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(change).toFixed(1)}%
          </div>
        )}
      </div>

      <div>
        <p className={clsx('text-sm mb-1', isDark ? 'text-white/50' : 'text-gray-500')}>{title}</p>
        <p className={clsx('text-2xl font-bold tracking-tight', isDark ? 'text-white' : 'text-gray-900')}>
          {type === 'currency' ? (
            <>₹<AnimatedNumber value={value} /></>
          ) : type === 'percent' ? (
            <AnimatedNumber value={value} prefix="" />
          ) : (
            <AnimatedNumber value={value} />
          )}
          {type === 'percent' && <span className="text-base font-medium">%</span>}
        </p>
        {changeLabel && (
          <p className={clsx('text-xs mt-1', isDark ? 'text-white/30' : 'text-gray-400')}>{changeLabel}</p>
        )}
      </div>
    </motion.div>
  );
}
