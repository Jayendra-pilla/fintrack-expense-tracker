import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getCategoryById, CATEGORIES } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import clsx from 'clsx';

const RADIAN = Math.PI / 180;
const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const CustomTooltip = ({ active, payload, isDark }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0];
  return (
    <div className={clsx(
      'rounded-xl px-4 py-3 border text-xs shadow-xl',
      isDark ? 'bg-dark-850/95 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    )}>
      <div className="flex items-center gap-2 mb-1">
        <div className="w-2 h-2 rounded-full" style={{ background: item.payload.color }} />
        <span className="font-semibold">{item.name}</span>
      </div>
      <p>{formatCurrency(item.value)}</p>
      <p className={isDark ? 'text-white/40' : 'text-gray-400'}>{(item.payload.percent * 100).toFixed(1)}% of total</p>
    </div>
  );
};

export function CategoryPieChart() {
  const { categoryBreakdown } = useApp();
  const { isDark } = useTheme();
  const [activeIndex, setActiveIndex] = useState(null);

  const data = Object.entries(categoryBreakdown)
    .map(([id, value]) => {
      const cat = getCategoryById(id);
      return { name: cat.label, value, color: cat.color, id };
    })
    .filter((d) => d.value > 0)
    .sort((a, b) => b.value - a.value);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className={clsx('text-sm', isDark ? 'text-white/30' : 'text-gray-400')}>No expense data</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
          Category Distribution
        </h3>
        <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-400')}>
          Spending by category this month
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={3}
            dataKey="value"
            labelLine={false}
            label={renderCustomLabel}
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            {data.map((entry, index) => (
              <Cell
                key={entry.id}
                fill={entry.color}
                opacity={activeIndex === null || activeIndex === index ? 1 : 0.5}
                stroke="none"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="space-y-2 mt-2">
        {data.slice(0, 5).map((item) => {
          const total = data.reduce((s, d) => s + d.value, 0);
          const pct = total > 0 ? (item.value / total) * 100 : 0;
          return (
            <div key={item.id} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
              <span className={clsx('text-xs flex-1 truncate', isDark ? 'text-white/60' : 'text-gray-600')}>
                {item.name}
              </span>
              <span className={clsx('text-xs font-medium', isDark ? 'text-white/40' : 'text-gray-400')}>
                {pct.toFixed(1)}%
              </span>
              <span className={clsx('text-xs font-semibold w-20 text-right', isDark ? 'text-white' : 'text-gray-900')}>
                {formatCurrency(item.value)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
