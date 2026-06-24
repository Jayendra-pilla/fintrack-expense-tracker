import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Save, AlertTriangle, CheckCircle, TrendingUp } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getCategoryById, CATEGORIES } from '../data/categories';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Button } from '../components/ui/Button';
import { formatCurrency } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

export default function Budget() {
  const { budgets, updateBudget, categoryBreakdown, currentExpenses } = useApp();
  const { isDark } = useTheme();
  const [editing, setEditing] = useState(false);
  const [tempBudgets, setTempBudgets] = useState(budgets);

  const handleSave = () => {
    updateBudget(tempBudgets);
    setEditing(false);
    toast.success('Budget updated!');
  };

  const handleCancel = () => {
    setTempBudgets(budgets);
    setEditing(false);
  };

  const overallUtil = budgets.overall > 0 ? (currentExpenses / budgets.overall) * 100 : 0;
  const remaining = Math.max(0, budgets.overall - currentExpenses);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Budget</h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
            Set and track your monthly spending limits
          </p>
        </div>
        {!editing ? (
          <Button variant="secondary" icon={<Edit3 size={14} />} onClick={() => { setTempBudgets(budgets); setEditing(true); }}>
            Edit Budget
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>Cancel</Button>
            <Button variant="primary" icon={<Save size={14} />} onClick={handleSave}>Save</Button>
          </div>
        )}
      </div>

      {/* Overall Budget Card */}
      <div className={clsx(
        'rounded-2xl p-6 border relative overflow-hidden',
        overallUtil > 100
          ? isDark ? 'bg-rose-500/10 border-rose-500/20' : 'bg-rose-50 border-rose-200'
          : overallUtil > 80
            ? isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
            : isDark ? 'glass-card' : 'glass-card-light'
      )}>
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className={clsx('text-sm font-medium mb-1', isDark ? 'text-white/60' : 'text-gray-500')}>Monthly Budget</p>
            {editing ? (
              <div className="flex items-center gap-2">
                <span className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>₹</span>
                <input
                  type="number"
                  value={tempBudgets.overall}
                  onChange={(e) => setTempBudgets((b) => ({ ...b, overall: parseFloat(e.target.value) || 0 }))}
                  className={clsx('text-2xl font-bold bg-transparent border-b-2 border-primary-500 outline-none w-36', isDark ? 'text-white' : 'text-gray-900')}
                />
              </div>
            ) : (
              <h2 className={clsx('text-3xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>
                {formatCurrency(budgets.overall)}
              </h2>
            )}
          </div>
          <div className="text-right">
            {overallUtil > 100 ? (
              <div className="flex items-center gap-2 text-rose-400">
                <AlertTriangle size={18} />
                <span className="text-sm font-semibold">Over Budget!</span>
              </div>
            ) : overallUtil < 70 ? (
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle size={18} />
                <span className="text-sm font-semibold">On Track</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-400">
                <TrendingUp size={18} />
                <span className="text-sm font-semibold">Watch Out</span>
              </div>
            )}
          </div>
        </div>

        <ProgressBar value={currentExpenses} max={budgets.overall || 1} height="h-3" animated />

        <div className="grid grid-cols-3 gap-4 mt-5">
          {[
            { label: 'Spent', value: formatCurrency(currentExpenses), color: overallUtil > 100 ? 'text-rose-400' : isDark ? 'text-white' : 'text-gray-900' },
            { label: 'Remaining', value: formatCurrency(remaining), color: 'text-emerald-400' },
            { label: 'Used', value: `${overallUtil.toFixed(1)}%`, color: overallUtil > 100 ? 'text-rose-400' : 'text-amber-400' },
          ].map((item) => (
            <div key={item.label} className={clsx('rounded-xl p-3 text-center', isDark ? 'bg-white/5' : 'bg-gray-50')}>
              <p className={clsx('text-lg font-bold', item.color)}>{item.value}</p>
              <p className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Category Budgets */}
      <div className={clsx('rounded-2xl border overflow-hidden', isDark ? 'glass-card' : 'glass-card-light')}>
        <div className="px-5 py-4 border-b border-white/5">
          <h3 className={clsx('text-base font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
            Category Budgets
          </h3>
        </div>
        <div className="p-5 space-y-5">
          {CATEGORIES.map((cat) => {
            const limit = editing
              ? (tempBudgets.categories?.[cat.id] || 0)
              : (budgets.categories?.[cat.id] || 0);
            const spent = categoryBreakdown[cat.id] || 0;
            const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
            const Icon = cat.icon;
            const isOver = spent > limit && limit > 0;

            return (
              <motion.div
                key={cat.id}
                layout
                className={clsx(
                  'rounded-xl p-4 border transition-all',
                  isOver
                    ? isDark ? 'bg-rose-500/5 border-rose-500/20' : 'bg-rose-50 border-rose-200'
                    : isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-100'
                )}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', cat.bgColor)}>
                    <Icon size={16} className={cat.textColor} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={clsx('text-sm font-medium', isDark ? 'text-white' : 'text-gray-900')}>
                        {cat.label}
                      </span>
                      {isOver && (
                        <span className="text-xs text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20">
                          Over by {formatCurrency(spent - limit)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <ProgressBar value={spent} max={limit || 1} height="h-2" animated />

                <div className="flex items-center justify-between mt-2">
                  <span className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>
                    Spent: <span className={clsx('font-medium', isDark ? 'text-white/70' : 'text-gray-700')}>
                      {formatCurrency(spent)}
                    </span>
                  </span>
                  {editing ? (
                    <div className="flex items-center gap-1">
                      <span className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-400')}>₹</span>
                      <input
                        type="number"
                        value={tempBudgets.categories?.[cat.id] || ''}
                        onChange={(e) => setTempBudgets((b) => ({
                          ...b,
                          categories: { ...b.categories, [cat.id]: parseFloat(e.target.value) || 0 },
                        }))}
                        className={clsx(
                          'w-24 text-xs text-right border-b outline-none bg-transparent',
                          isDark ? 'border-white/20 text-white' : 'border-gray-300 text-gray-900'
                        )}
                        placeholder="0"
                      />
                    </div>
                  ) : (
                    <span className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>
                      Budget: <span className={clsx('font-medium', isDark ? 'text-white/70' : 'text-gray-700')}>
                        {limit > 0 ? formatCurrency(limit) : 'Not set'}
                      </span>
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
