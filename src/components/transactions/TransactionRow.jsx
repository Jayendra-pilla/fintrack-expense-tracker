import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Trash2, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { getCategoryById } from '../../data/categories';
import { formatCurrency, formatRelativeTime } from '../../utils/formatters';
import { useApp } from '../../context/AppContext';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

export function TransactionRow({ transaction, onEdit, isSelected, onToggleSelect, selectable = false }) {
  const { deleteTransaction } = useApp();
  const { isDark } = useTheme();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const cat = getCategoryById(transaction.category);
  const Icon = cat.icon;
  const isIncome = transaction.type === 'income';

  const handleDelete = () => {
    deleteTransaction(transaction.id);
    toast.success('Transaction deleted');
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.2 }}
        className={clsx(
          'flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all group',
          isSelected
            ? 'border-primary-500/40 bg-primary-500/10'
            : isDark
              ? 'border-white/5 bg-white/3 hover:bg-white/8 hover:border-white/10'
              : 'border-gray-100 bg-white hover:bg-gray-50 hover:border-gray-200 shadow-sm'
        )}
      >
        {/* Checkbox */}
        {selectable && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-4 h-4 rounded accent-primary-500 cursor-pointer flex-shrink-0"
          />
        )}

        {/* Category icon */}
        <div className={clsx('w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0', cat.bgColor)}>
          <Icon size={18} className={cat.textColor} />
        </div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <p className={clsx('text-sm font-medium truncate', isDark ? 'text-white' : 'text-gray-900')}>
            {transaction.description}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-400')}>
              {formatRelativeTime(transaction.date)}
            </span>
            <span className={clsx('text-white/20', isDark ? '' : 'text-gray-200')}>·</span>
            <span className={clsx('category-pill text-[10px]', cat.bgColor, cat.textColor)}>
              {cat.label}
            </span>
          </div>
        </div>

        {/* Amount */}
        <div className="flex flex-col items-end gap-1">
          <span className={clsx(
            'text-sm font-bold',
            isIncome ? 'text-emerald-400' : 'text-rose-400'
          )}>
            {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
          <div className={clsx(
            'flex items-center gap-1 text-[10px]',
            isIncome ? 'text-emerald-400/60' : 'text-rose-400/60'
          )}>
            {isIncome
              ? <ArrowDownLeft size={10} />
              : <ArrowUpRight size={10} />
            }
            {transaction.type}
          </div>
        </div>

        {/* Actions (on hover) */}
        <div className={clsx(
          'flex items-center gap-1 ml-2 transition-all',
          'opacity-0 group-hover:opacity-100'
        )}>
          <button
            onClick={() => onEdit(transaction)}
            className={clsx(
              'p-1.5 rounded-lg transition-colors',
              isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            )}
          >
            <Edit3 size={14} />
          </button>
          <button
            onClick={() => setConfirmOpen(true)}
            className="p-1.5 rounded-lg text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message={`Delete "${transaction.description}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}
