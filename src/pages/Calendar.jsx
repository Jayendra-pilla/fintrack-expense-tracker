import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameMonth, isToday, startOfWeek, endOfWeek,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { getCategoryById } from '../data/categories';
import { formatCurrency } from '../utils/formatters';
import clsx from 'clsx';

export default function Calendar() {
  const { transactions } = useApp();
  const { isDark } = useTheme();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const dateFormat = 'd';

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  const nextMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)));
  const prevMonth = () => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)));

  // Selected date transactions
  const selectedTxns = selectedDate
    ? transactions.filter((t) => t.date === format(selectedDate, 'yyyy-MM-dd'))
    : [];
  const selectedTotal = selectedTxns.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Calendar</h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
            Daily spending overview
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className={clsx('lg:col-span-2 rounded-2xl border p-5', isDark ? 'glass-card' : 'glass-card-light')}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className={clsx('text-lg font-bold', isDark ? 'text-white' : 'text-gray-900')}>
              {format(currentDate, 'MMMM yyyy')}
            </h2>
            <div className="flex gap-2">
              <button onClick={prevMonth} className={clsx('p-2 rounded-xl border', isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900')}>
                <ChevronLeft size={16} />
              </button>
              <button onClick={nextMonth} className={clsx('p-2 rounded-xl border', isDark ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white/70 hover:text-white' : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900')}>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Days */}
          <div className="grid grid-cols-7 mb-2">
            {weekDays.map((day) => (
              <div key={day} className={clsx('text-center text-xs font-semibold uppercase tracking-wider', isDark ? 'text-white/40' : 'text-gray-400')}>
                {day}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-7 gap-1 lg:gap-2">
            {days.map((day) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayTxns = transactions.filter((t) => t.date === dateStr);
              const totalSpent = dayTxns.reduce((sum, t) => sum + (t.type === 'expense' ? t.amount : 0), 0);
              const hasIncome = dayTxns.some((t) => t.type === 'income');
              
              const isSelected = selectedDate && isSameMonth(day, selectedDate) && day.getDate() === selectedDate.getDate();
              const isCurrentMonth = isSameMonth(day, monthStart);
              const isTodayDate = isToday(day);

              return (
                <div
                  key={day.toString()}
                  onClick={() => setSelectedDate(day)}
                  className={clsx(
                    'min-h-[80px] p-1.5 lg:p-2 rounded-xl border cursor-pointer transition-all flex flex-col',
                    !isCurrentMonth && 'opacity-30',
                    isSelected
                      ? 'border-primary-500 bg-primary-500/10'
                      : isTodayDate
                        ? isDark ? 'border-violet-500/50 bg-violet-500/10' : 'border-violet-400 bg-violet-50'
                        : isDark ? 'border-white/5 bg-white/3 hover:bg-white/5' : 'border-gray-100 bg-gray-50 hover:bg-gray-100'
                  )}
                >
                  <div className="flex justify-between items-start">
                    <span className={clsx(
                      'text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full',
                      isTodayDate ? 'bg-violet-500 text-white' : isDark ? 'text-white/70' : 'text-gray-700'
                    )}>
                      {format(day, dateFormat)}
                    </span>
                    {hasIncome && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-1" />}
                  </div>
                  
                  {totalSpent > 0 && (
                    <div className="mt-auto">
                      <span className={clsx(
                        'text-[10px] lg:text-xs font-semibold block truncate',
                        totalSpent > 5000 ? 'text-rose-400' : isDark ? 'text-white/60' : 'text-gray-600'
                      )}>
                        {formatCurrency(totalSpent, true)}
                      </span>
                      {/* Dots for transactions */}
                      <div className="flex gap-0.5 mt-1 hidden lg:flex">
                        {dayTxns.filter(t => t.type === 'expense').slice(0, 4).map((t, j) => (
                          <span key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: getCategoryById(t.category).color }} />
                        ))}
                        {dayTxns.filter(t => t.type === 'expense').length > 4 && (
                          <span className={clsx('text-[8px] leading-[6px]', isDark ? 'text-white/40' : 'text-gray-400')}>+</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className={clsx('rounded-2xl border p-5 flex flex-col', isDark ? 'glass-card' : 'glass-card-light')}>
          {selectedDate ? (
            <>
              <h3 className={clsx('text-lg font-bold mb-1', isDark ? 'text-white' : 'text-gray-900')}>
                {format(selectedDate, 'EEEE, MMM d')}
              </h3>
              {selectedTotal > 0 && (
                <p className={clsx('text-sm mb-4', isDark ? 'text-white/50' : 'text-gray-500')}>
                  Total spent: <span className="font-semibold text-rose-400">{formatCurrency(selectedTotal)}</span>
                </p>
              )}
              
              <div className="flex-1 overflow-y-auto space-y-3 mt-4">
                {selectedTxns.length === 0 ? (
                  <p className={clsx('text-sm text-center py-8', isDark ? 'text-white/30' : 'text-gray-400')}>
                    No transactions on this day
                  </p>
                ) : (
                  selectedTxns.map((txn) => {
                    const cat = getCategoryById(txn.category);
                    const Icon = cat.icon;
                    return (
                      <div key={txn.id} className={clsx('flex items-center gap-3 p-3 rounded-xl border', isDark ? 'bg-white/3 border-white/5' : 'bg-gray-50 border-gray-100')}>
                        <div className={clsx('w-8 h-8 rounded-lg flex items-center justify-center', cat.bgColor)}>
                          <Icon size={14} className={cat.textColor} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={clsx('text-sm font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>{txn.description}</p>
                          <p className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>{cat.label}</p>
                        </div>
                        <span className={clsx('text-sm font-bold', txn.type === 'income' ? 'text-emerald-400' : 'text-rose-400')}>
                          {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
              <span className="text-4xl mb-4">📅</span>
              <p className={clsx('text-sm', isDark ? 'text-white/40' : 'text-gray-500')}>
                Select a date to view transactions
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
