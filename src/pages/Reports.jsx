import { motion } from 'framer-motion';
import { Download, FileText, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/Button';
import { formatCurrency, formatMonthYear } from '../utils/formatters';
import { getTopCategories } from '../utils/calculations';
import { getCategoryById } from '../data/categories';
import clsx from 'clsx';
import { useRef } from 'react';

export default function Reports() {
  const { currentIncome, currentExpenses, categoryBreakdown, savingsRate, healthScore } = useApp();
  const { isDark } = useTheme();
  const reportRef = useRef(null);

  const topCats = getTopCategories(categoryBreakdown, 3);
  const currentMonthStr = formatMonthYear(new Date().toISOString().slice(0, 10));

  // Print function (basic browser print scoped to report div via CSS in a real app, here we just trigger print)
  const handleDownload = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container space-y-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Reports</h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
            Monthly financial summaries
          </p>
        </div>
        <Button variant="primary" icon={<Download size={14} />} onClick={handleDownload}>
          Download PDF
        </Button>
      </div>

      <div className={clsx('rounded-2xl p-8 border max-w-3xl mx-auto', isDark ? 'bg-white/5 border-white/10' : 'bg-white border-gray-200 shadow-lg')} ref={reportRef} id="printable-report">
        {/* Report Header */}
        <div className="flex items-center justify-between border-b pb-6 mb-6" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-violet-500 flex items-center justify-center">
              <FileText size={20} className="text-white" />
            </div>
            <div>
              <h2 className={clsx('text-xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>FinTrack Summary</h2>
              <p className={clsx('text-sm', isDark ? 'text-white/40' : 'text-gray-500')}>{currentMonthStr}</p>
            </div>
          </div>
          <div className="text-right">
            <p className={clsx('text-sm font-medium', isDark ? 'text-white/60' : 'text-gray-500')}>Health Score</p>
            <p className="text-2xl font-bold text-primary-400">{healthScore}/100</p>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="mb-8">
          <h3 className={clsx('text-base font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>Executive Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={clsx('p-4 rounded-xl border', isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100')}>
              <p className={clsx('text-xs mb-1', isDark ? 'text-white/50' : 'text-gray-500')}>Total Income</p>
              <p className="text-xl font-bold text-emerald-400">{formatCurrency(currentIncome)}</p>
            </div>
            <div className={clsx('p-4 rounded-xl border', isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100')}>
              <p className={clsx('text-xs mb-1', isDark ? 'text-white/50' : 'text-gray-500')}>Total Expenses</p>
              <p className="text-xl font-bold text-rose-400">{formatCurrency(currentExpenses)}</p>
            </div>
            <div className={clsx('p-4 rounded-xl border', isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100')}>
              <p className={clsx('text-xs mb-1', isDark ? 'text-white/50' : 'text-gray-500')}>Net Savings</p>
              <p className="text-xl font-bold text-primary-400">{formatCurrency(Math.max(0, currentIncome - currentExpenses))}</p>
            </div>
            <div className={clsx('p-4 rounded-xl border', isDark ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100')}>
              <p className={clsx('text-xs mb-1', isDark ? 'text-white/50' : 'text-gray-500')}>Savings Rate</p>
              <p className="text-xl font-bold text-primary-400">{savingsRate.toFixed(1)}%</p>
            </div>
          </div>
        </div>

        {/* Top Spending */}
        <div className="mb-8">
          <h3 className={clsx('text-base font-semibold mb-4', isDark ? 'text-white' : 'text-gray-900')}>Top Expense Categories</h3>
          <div className="space-y-3">
            {topCats.map((cat, i) => {
              const category = getCategoryById(cat.id);
              const pct = ((cat.amount / currentExpenses) * 100).toFixed(1);
              return (
                <div key={cat.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}>
                  <div className="flex items-center gap-3">
                    <span className={clsx('text-sm w-4 font-medium', isDark ? 'text-white/40' : 'text-gray-400')}>{i + 1}.</span>
                    <span className={clsx('text-sm', isDark ? 'text-white/80' : 'text-gray-700')}>{category.label}</span>
                  </div>
                  <div className="text-right">
                    <span className={clsx('text-sm font-semibold block', isDark ? 'text-white' : 'text-gray-900')}>{formatCurrency(cat.amount)}</span>
                    <span className={clsx('text-[10px]', isDark ? 'text-white/40' : 'text-gray-500')}>{pct}% of total</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Achievements / Note */}
        <div className={clsx('p-4 rounded-xl flex items-start gap-3', isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600')}>
          <CheckCircle size={20} className="mt-0.5 shrink-0" />
          <div>
            <h4 className="text-sm font-semibold mb-1">Financial Check-in</h4>
            <p className="text-xs opacity-80 leading-relaxed">
              Based on your {savingsRate.toFixed(0)}% savings rate and health score of {healthScore}, your financial trajectory is {healthScore > 70 ? 'excellent' : 'developing'}. Keep tracking your expenses and stick to your budget!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t text-center" style={{ borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}>
          <p className={clsx('text-[10px]', isDark ? 'text-white/30' : 'text-gray-400')}>
            Generated by FinTrack AI Dashboard • {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>
      
      {/* Print styles injected via JS for simplicity */}
      <style dangerouslySetInnerHTML={{__html: `
        @media print {
          body * { visibility: hidden; }
          #printable-report, #printable-report * { visibility: visible; }
          #printable-report { position: absolute; left: 0; top: 0; width: 100%; max-width: 100%; border: none; box-shadow: none; padding: 0; }
          /* Force light mode colors for printing */
          #printable-report { background: white !important; color: black !important; }
          .bg-white\\/5 { background: #f9fafb !important; border-color: #e5e7eb !important; }
          .text-white { color: #111827 !important; }
          .text-white\\/80 { color: #374151 !important; }
          .text-white\\/60 { color: #4b5563 !important; }
          .text-white\\/50 { color: #6b7280 !important; }
          .text-white\\/40 { color: #9ca3af !important; }
        }
      `}} />
    </motion.div>
  );
}
