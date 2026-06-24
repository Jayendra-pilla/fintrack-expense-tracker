import { motion } from 'framer-motion';
import {
  TrendingUp, TrendingDown, PiggyBank, Activity, Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { StatCard } from '../components/common/StatCard';
import { InsightCard } from '../components/common/InsightCard';
import { TransactionRow } from '../components/transactions/TransactionRow';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { SpendingTrendChart } from '../charts/SpendingTrendChart';
import { CategoryPieChart } from '../charts/CategoryPieChart';
import { ProgressBar } from '../components/ui/ProgressBar';
import { generateInsights } from '../utils/insights';
import { formatCurrency, getHealthLabel, getHealthBg } from '../utils/formatters';
import { getCategoryById } from '../data/categories';
import { useState } from 'react';
import clsx from 'clsx';

export default function Dashboard() {
  const { isDark } = useTheme();
  const {
    totalBalance, currentIncome, currentExpenses, lastIncome, lastExpenses,
    savingsRate, budgetUtil, healthScore, categoryBreakdown, avgDailySpend,
    transactions, budgets, streak,
  } = useApp();

  const [editTxn, setEditTxn] = useState(null);

  const incomeChange = lastIncome > 0 ? ((currentIncome - lastIncome) / lastIncome) * 100 : 0;
  const expenseChange = lastExpenses > 0 ? ((currentExpenses - lastExpenses) / lastExpenses) * 100 : 0;
  const savings = Math.max(0, currentIncome - currentExpenses);

  const insights = generateInsights({
    currentMonth: { income: currentIncome, expenses: currentExpenses },
    lastMonth: { income: lastIncome, expenses: lastExpenses },
    categoryBreakdown,
    budget: budgets.overall,
    savingsRate,
    avgDailySpend,
  });

  const recentTxns = [...transactions]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" className="page-container space-y-6">

      {/* ── Hero Balance Card ── */}
      <div className={clsx(
        'rounded-3xl p-6 relative overflow-hidden border',
        isDark ? 'bg-gradient-to-br from-primary-600/30 to-violet-600/20 border-primary-500/20' : 'bg-gradient-to-br from-primary-500 to-violet-600 border-transparent'
      )}>
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-64 h-64 bg-white/5 rounded-full -top-20 -right-20" />
          <div className="absolute w-48 h-48 bg-white/5 rounded-full -bottom-10 -left-10" />
        </div>

        <div className="relative z-10">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className={clsx('text-sm font-medium mb-1', isDark ? 'text-white/60' : 'text-white/80')}>
                Total Balance
              </p>
              <h2 className={clsx('text-4xl font-bold tracking-tight', isDark ? 'text-white' : 'text-white')}>
                {formatCurrency(totalBalance)}
              </h2>
              <p className={clsx('text-sm mt-1', isDark ? 'text-white/40' : 'text-white/70')}>
                All time net balance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div className={clsx('text-right', isDark ? 'text-white/70' : 'text-white/90')}>
                <p className="text-2xl font-bold">{streak}</p>
                <p className="text-xs">day streak</p>
              </div>
            </div>
          </div>

          {/* Health score bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className={clsx('text-xs font-medium', isDark ? 'text-white/50' : 'text-white/80')}>
                Financial Health Score
              </span>
              <div className="flex items-center gap-2">
                <span className={clsx('text-sm font-bold', isDark ? 'text-white' : 'text-white')}>
                  {healthScore}/100
                </span>
                <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', isDark ? 'bg-white/10 text-white/70' : 'bg-white/20 text-white')}>
                  {getHealthLabel(healthScore)}
                </span>
              </div>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${healthScore}%` }}
                transition={{ duration: 1.5, ease: 'easeOut', delay: 0.3 }}
                className={clsx('h-full rounded-full bg-gradient-to-r', isDark ? `${getHealthBg(healthScore)}` : 'from-white/80 to-white')}
              />
            </div>
          </div>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Monthly Income"
          value={currentIncome}
          change={incomeChange}
          changeLabel="vs last month"
          icon={TrendingUp}
          gradient="from-emerald-500 to-teal-500"
          index={0}
        />
        <StatCard
          title="Monthly Expenses"
          value={currentExpenses}
          change={expenseChange}
          changeLabel="vs last month"
          icon={TrendingDown}
          gradient="from-rose-500 to-pink-500"
          index={1}
        />
        <StatCard
          title="Savings"
          value={savings}
          change={savingsRate}
          changeLabel="savings rate"
          icon={PiggyBank}
          gradient="from-primary-500 to-violet-500"
          index={2}
        />
        <StatCard
          title="Budget Used"
          value={Math.round(budgetUtil)}
          type="percent"
          changeLabel={`₹${(currentExpenses / 1000).toFixed(0)}K / ₹${(budgets.overall / 1000).toFixed(0)}K`}
          icon={Activity}
          gradient="from-amber-500 to-orange-500"
          index={3}
        />
      </div>

      {/* ── Main Grid ── */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Spending Chart */}
        <div className={clsx(
          'lg:col-span-2 rounded-2xl p-5 border',
          isDark ? 'glass-card' : 'glass-card-light'
        )}>
          <SpendingTrendChart />
        </div>

        {/* Pie Chart */}
        <div className={clsx(
          'rounded-2xl p-5 border',
          isDark ? 'glass-card' : 'glass-card-light'
        )}>
          <CategoryPieChart />
        </div>
      </div>

      {/* ── Budget Utilization ── */}
      <div className={clsx('rounded-2xl p-5 border', isDark ? 'glass-card' : 'glass-card-light')}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Budget Utilization
            </h3>
            <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-400')}>
              Category-wise budget usage this month
            </p>
          </div>
          {budgetUtil > 90 && (
            <span className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-lg font-medium">
              ⚠️ Budget Alert
            </span>
          )}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(budgets.categories || {}).map(([catId, limit]) => {
            const spent = categoryBreakdown[catId] || 0;
            const pct = Math.min(100, (spent / limit) * 100);
            const cat = getCategoryById(catId);
            const Icon = cat.icon;
            return (
              <div key={catId} className={clsx(
                'rounded-xl p-3 border',
                isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-100'
              )}>
                <div className="flex items-center gap-2 mb-2">
                  <div className={clsx('w-7 h-7 rounded-lg flex items-center justify-center', cat.bgColor)}>
                    <Icon size={14} className={cat.textColor} />
                  </div>
                  <span className={clsx('text-xs font-medium truncate', isDark ? 'text-white/70' : 'text-gray-700')}>
                    {cat.label}
                  </span>
                </div>
                <ProgressBar value={spent} max={limit} height="h-1.5" animated />
                <div className="flex justify-between mt-1.5">
                  <span className={clsx('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>
                    ₹{(spent / 1000).toFixed(1)}K
                  </span>
                  <span className={clsx(
                    'text-[10px] font-medium',
                    pct > 90 ? 'text-rose-400' : isDark ? 'text-white/40' : 'text-gray-500'
                  )}>
                    {pct.toFixed(0)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Insights + Recent Transactions ── */}
      <div className="grid lg:grid-cols-2 gap-6">

        {/* Insights */}
        <div className={clsx('rounded-2xl p-5 border', isDark ? 'glass-card' : 'glass-card-light')}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <div>
              <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                AI Insights
              </h3>
            </div>
          </div>
          <div className="space-y-3">
            {insights.length === 0 ? (
              <p className={clsx('text-sm text-center py-8', isDark ? 'text-white/30' : 'text-gray-400')}>
                Add more transactions to get personalized insights!
              </p>
            ) : (
              insights.map((ins, i) => <InsightCard key={ins.id} insight={ins} index={i} />)
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className={clsx('rounded-2xl p-5 border', isDark ? 'glass-card' : 'glass-card-light')}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              Recent Transactions
            </h3>
            <a href="/transactions" className="text-xs text-primary-400 hover:text-primary-300 font-medium">
              View all →
            </a>
          </div>
          <div className="space-y-2">
            {recentTxns.length === 0 ? (
              <p className={clsx('text-sm text-center py-8', isDark ? 'text-white/30' : 'text-gray-400')}>
                No transactions yet
              </p>
            ) : (
              recentTxns.map((txn) => (
                <TransactionRow
                  key={txn.id}
                  transaction={txn}
                  onEdit={setEditTxn}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TransactionForm
        isOpen={!!editTxn}
        onClose={() => setEditTxn(null)}
        editTransaction={editTxn}
      />
    </motion.div>
  );
}
