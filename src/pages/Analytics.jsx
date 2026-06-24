import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { SpendingTrendChart, IncomeExpenseBar, SavingsTrendLine } from '../charts/SpendingTrendChart';
import { CategoryPieChart } from '../charts/CategoryPieChart';
import { SpendingHeatmap } from '../charts/SpendingHeatmap';
import { getCategoryById } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import { getTopCategories } from '../utils/calculations';
import clsx from 'clsx';

export default function Analytics() {
  const { isDark } = useTheme();
  const { categoryBreakdown, currentExpenses, currentIncome, savingsRate } = useApp();

  const topCategories = getTopCategories(categoryBreakdown, 5);
  const maxAmount = topCategories[0]?.amount || 1;

  const card = clsx('rounded-2xl p-5 border', isDark ? 'glass-card' : 'glass-card-light');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container space-y-6"
    >
      {/* Header */}
      <div>
        <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Analytics</h1>
        <p className={clsx('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
          Detailed financial insights and trends
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Income', value: currentIncome, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Total Expenses', value: currentExpenses, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Savings Rate', value: `${savingsRate.toFixed(1)}%`, color: 'text-primary-400', bg: 'bg-primary-500/10 border-primary-500/20' },
        ].map((item) => (
          <div key={item.label} className={clsx('rounded-2xl p-4 border', isDark ? item.bg : 'bg-white border-gray-200 shadow-sm')}>
            <p className={clsx('text-xs', isDark ? 'text-white/50' : 'text-gray-500')}>{item.label}</p>
            <p className={clsx('text-xl font-bold mt-1', isDark ? item.color : 'text-gray-900')}>
              {typeof item.value === 'number' ? formatCurrency(item.value) : item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Row 1: Spending Trend + Category Pie */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className={clsx(card, 'lg:col-span-2')}><SpendingTrendChart /></div>
        <div className={card}><CategoryPieChart /></div>
      </div>

      {/* Row 2: Income vs Expense Bar + Savings Trend */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className={card}><IncomeExpenseBar /></div>
        <div className={card}><SavingsTrendLine /></div>
      </div>

      {/* Row 3: Top Categories + Heatmap */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Top Spending Categories */}
        <div className={card}>
          <h3 className={clsx('text-base font-semibold mb-1', isDark ? 'text-white' : 'text-gray-900')}>
            Top Spending Categories
          </h3>
          <p className={clsx('text-xs mb-5', isDark ? 'text-white/40' : 'text-gray-400')}>
            This month's highest expenses
          </p>
          {topCategories.length === 0 ? (
            <p className={clsx('text-sm text-center py-8', isDark ? 'text-white/30' : 'text-gray-400')}>No data yet</p>
          ) : (
            <div className="space-y-3">
              {topCategories.map(({ id, amount }, i) => {
                const cat = getCategoryById(id);
                const Icon = cat.icon;
                const pct = (amount / maxAmount) * 100;
                return (
                  <div key={id} className="flex items-center gap-3">
                    <span className={clsx('text-xs font-bold w-4', isDark ? 'text-white/30' : 'text-gray-400')}>
                      {i + 1}
                    </span>
                    <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0', cat.bgColor)}>
                      <Icon size={15} className={cat.textColor} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className={clsx('text-xs font-medium', isDark ? 'text-white/80' : 'text-gray-800')}>
                          {cat.label}
                        </span>
                        <span className={clsx('text-xs font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                          {formatCurrency(amount)}
                        </span>
                      </div>
                      <div className={clsx('h-1.5 rounded-full overflow-hidden', isDark ? 'bg-white/10' : 'bg-gray-100')}>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${pct}%` }}
                          transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
                          className={clsx('h-full rounded-full bg-gradient-to-r', cat.gradient)}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Spending Heatmap */}
        <div className={card}><SpendingHeatmap /></div>
      </div>
    </motion.div>
  );
}
