import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getDailyHeatmapData } from '../utils/calculations';
import { formatCurrency, formatDate } from '../utils/formatters';
import { format, parseISO, eachWeekOfInterval, startOfWeek, endOfWeek, eachDayOfInterval, subMonths } from 'date-fns';
import clsx from 'clsx';
import { useState } from 'react';

export function SpendingHeatmap() {
  const { transactions } = useApp();
  const { isDark } = useTheme();
  const [tooltip, setTooltip] = useState(null);
  const data = getDailyHeatmapData(transactions);

  const maxAmount = Math.max(...data.map((d) => d.amount), 1);

  const getColor = (amount) => {
    if (amount === 0) return isDark ? 'rgba(255,255,255,0.04)' : '#f3f4f6';
    const intensity = amount / maxAmount;
    if (intensity < 0.25) return '#312e81';
    if (intensity < 0.5) return '#4f46e5';
    if (intensity < 0.75) return '#6366f1';
    return '#a78bfa';
  };

  // Group by weeks
  const end = new Date();
  const start = subMonths(end, 3);
  const weeks = eachWeekOfInterval({ start, end }, { weekStartsOn: 1 });
  const dayLabels = ['Mon', '', 'Wed', '', 'Fri', '', 'Sun'];

  return (
    <div>
      <div className="mb-4">
        <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
          Spending Heatmap
        </h3>
        <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-400')}>
          Daily spending activity — last 3 months
        </p>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-2">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          {dayLabels.map((d, i) => (
            <div key={i} style={{ height: 12, fontSize: 9, lineHeight: '12px' }} className={clsx('text-right w-6', isDark ? 'text-white/20' : 'text-gray-400')}>
              {d}
            </div>
          ))}
        </div>

        {/* Heatmap grid */}
        {weeks.map((weekStart, wi) => {
          const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
          const days = eachDayOfInterval({ start: weekStart, end: weekEnd });
          return (
            <div key={wi} className="flex flex-col gap-1">
              {days.map((day) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const entry = data.find((d) => d.date === dateStr);
                const amount = entry?.amount || 0;
                return (
                  <div
                    key={dateStr}
                    className="heatmap-cell relative"
                    style={{ width: 12, height: 12, background: getColor(amount), borderRadius: 3, cursor: amount > 0 ? 'pointer' : 'default' }}
                    onMouseEnter={() => amount > 0 && setTooltip({ date: dateStr, amount })}
                    onMouseLeave={() => setTooltip(null)}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div className={clsx(
          'mt-2 text-xs px-3 py-2 rounded-lg border inline-block',
          isDark ? 'bg-dark-850 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
        )}>
          <span className={isDark ? 'text-white/50' : 'text-gray-500'}>{formatDate(tooltip.date)}:</span>{' '}
          <span className="font-semibold text-rose-400">{formatCurrency(tooltip.amount)}</span>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center gap-2 mt-3">
        <span className={clsx('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>Less</span>
        {[0, 0.25, 0.5, 0.75, 1].map((v) => (
          <div key={v} className="w-3 h-3 rounded-sm" style={{ background: getColor(v * maxAmount) }} />
        ))}
        <span className={clsx('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>More</span>
      </div>
    </div>
  );
}
