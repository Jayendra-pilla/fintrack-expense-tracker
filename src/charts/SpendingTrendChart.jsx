import { useState } from 'react';
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getMonthlyChartData, getWeeklyChartData } from '../utils/calculations';
import { formatCurrency } from '../utils/formatters';
import clsx from 'clsx';

const CustomTooltip = ({ active, payload, label, isDark }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className={clsx(
      'rounded-xl px-4 py-3 border text-xs shadow-xl',
      isDark ? 'bg-dark-850/95 border-white/10 text-white' : 'bg-white border-gray-200 text-gray-900'
    )}>
      <p className={clsx('font-semibold mb-2', isDark ? 'text-white/70' : 'text-gray-500')}>{label}</p>
      {payload.map((entry) => (
        <div key={entry.name} className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
          <span className={isDark ? 'text-white/60' : 'text-gray-500'}>{entry.name}:</span>
          <span className="font-semibold">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  );
};

export function SpendingTrendChart() {
  const { transactions } = useApp();
  const { isDark } = useTheme();
  const [view, setView] = useState('monthly');

  const monthlyData = getMonthlyChartData(transactions, 6);
  const weeklyData = getWeeklyChartData(transactions);
  const data = view === 'monthly' ? monthlyData : weeklyData;
  const xKey = view === 'monthly' ? 'month' : 'week';

  const axisStyle = { fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 11 };
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            Spending Trend
          </h3>
          <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-400')}>
            Income vs Expenses over time
          </p>
        </div>
        <div className={clsx('flex gap-1 p-1 rounded-lg', isDark ? 'bg-white/5' : 'bg-gray-100')}>
          {['monthly', 'weekly'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-medium capitalize transition-all',
                view === v
                  ? 'bg-primary-500 text-white shadow'
                  : isDark ? 'text-white/50 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xKey} tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Legend formatter={(v) => <span className={clsx('text-xs', isDark ? 'text-white/60' : 'text-gray-500')}>{v}</span>} />
          <Area type="monotone" dataKey="income" name="Income" stroke="#10b981" strokeWidth={2} fill="url(#incomeGrad)" dot={false} activeDot={{ r: 4, fill: '#10b981' }} />
          <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#f43f5e" strokeWidth={2} fill="url(#expenseGrad)" dot={false} activeDot={{ r: 4, fill: '#f43f5e' }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function IncomeExpenseBar() {
  const { transactions } = useApp();
  const { isDark } = useTheme();
  const data = getMonthlyChartData(transactions, 6);
  const axisStyle = { fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 11 };
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';

  return (
    <div>
      <div className="mb-6">
        <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
          Income vs Expenses
        </h3>
        <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-400')}>
          Last 6 months comparison
        </p>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }} barGap={4} barCategoryGap="25%">
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Legend formatter={(v) => <span className={clsx('text-xs', isDark ? 'text-white/60' : 'text-gray-500')}>{v}</span>} />
          <Bar dataKey="income" name="Income" fill="#10b981" radius={[6, 6, 0, 0]} />
          <Bar dataKey="expenses" name="Expenses" fill="#f43f5e" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function SavingsTrendLine() {
  const { transactions } = useApp();
  const { isDark } = useTheme();
  const data = getMonthlyChartData(transactions, 6);
  const axisStyle = { fill: isDark ? 'rgba(255,255,255,0.3)' : '#9ca3af', fontSize: 11 };
  const gridColor = isDark ? 'rgba(255,255,255,0.05)' : '#f3f4f6';

  return (
    <div>
      <div className="mb-6">
        <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
          Savings Trend
        </h3>
        <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-400')}>
          Monthly net savings
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="month" tick={axisStyle} axisLine={false} tickLine={false} />
          <YAxis tick={axisStyle} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}K`} />
          <Tooltip content={<CustomTooltip isDark={isDark} />} />
          <Area type="monotone" dataKey="savings" name="Savings" stroke="#6366f1" strokeWidth={2.5} fill="url(#savingsGrad)" dot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }} activeDot={{ r: 6 }} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
