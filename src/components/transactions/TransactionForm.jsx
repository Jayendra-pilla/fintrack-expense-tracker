import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { CATEGORIES } from '../../data/categories';
import { useApp } from '../../context/AppContext';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

const emptyForm = {
  type: 'expense',
  amount: '',
  description: '',
  category: 'food',
  date: new Date().toISOString().slice(0, 10),
  note: '',
};

export function TransactionForm({ isOpen, onClose, editTransaction = null }) {
  const { addTransaction, updateTransaction } = useApp();
  const { isDark } = useTheme();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editTransaction) {
      setForm({ ...editTransaction, note: editTransaction.note || '' });
    } else {
      setForm(emptyForm);
    }
    setErrors({});
  }, [editTransaction, isOpen]);

  const validate = () => {
    const errs = {};
    if (!form.amount || isNaN(form.amount) || parseFloat(form.amount) <= 0)
      errs.amount = 'Enter a valid amount';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const txnData = { ...form, amount: parseFloat(form.amount) };
    if (editTransaction) {
      updateTransaction(editTransaction.id, txnData);
      toast.success('Transaction updated!');
    } else {
      addTransaction(txnData);
      toast.success('Transaction added!');
    }
    onClose();
    setForm(emptyForm);
  };

  const selectedCat = CATEGORIES.find((c) => c.id === form.category);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editTransaction ? 'Edit Transaction' : 'Add Transaction'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Type Toggle */}
        <div className={clsx(
          'flex rounded-xl p-1 gap-1',
          isDark ? 'bg-white/5' : 'bg-gray-100'
        )}>
          {['expense', 'income'].map((t) => (
            <motion.button
              key={t}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => setForm((f) => ({ ...f, type: t }))}
              className={clsx(
                'flex-1 py-2 rounded-lg text-sm font-medium capitalize transition-all duration-200',
                form.type === t
                  ? t === 'expense'
                    ? 'bg-rose-500 text-white shadow-sm'
                    : 'bg-emerald-500 text-white shadow-sm'
                  : isDark
                    ? 'text-white/50 hover:text-white'
                    : 'text-gray-500 hover:text-gray-700'
              )}
            >
              {t === 'income' ? '+ Income' : '- Expense'}
            </motion.button>
          ))}
        </div>

        {/* Amount */}
        <Input
          label="Amount (₹)"
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          prefix="₹"
          value={form.amount}
          onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
          error={errors.amount}
        />

        {/* Description */}
        <Input
          label="Description"
          type="text"
          placeholder="e.g. Grocery shopping"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          error={errors.description}
        />

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={form.date}
          onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
          error={errors.date}
        />

        {/* Category */}
        <div className="flex flex-col gap-1">
          <label className={clsx('text-sm font-medium', isDark ? 'text-white/70' : 'text-gray-600')}>
            Category
          </label>
          <div className="grid grid-cols-5 gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isSelected = form.category === cat.id;
              return (
                <motion.button
                  key={cat.id}
                  type="button"
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setForm((f) => ({ ...f, category: cat.id }))}
                  className={clsx(
                    'flex flex-col items-center gap-1 p-2.5 rounded-xl border transition-all text-xs',
                    isSelected
                      ? `${cat.bgColor} ${cat.borderColor} ${cat.textColor}`
                      : isDark
                        ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                        : 'bg-gray-100 border-gray-200 text-gray-500 hover:bg-gray-200'
                  )}
                  title={cat.label}
                >
                  <Icon size={16} />
                  <span className="truncate w-full text-center" style={{ fontSize: '9px' }}>
                    {cat.label.split(' ')[0]}
                  </span>
                </motion.button>
              );
            })}
          </div>
          {selectedCat && (
            <p className={clsx('text-xs mt-1', isDark ? 'text-white/40' : 'text-gray-400')}>
              Selected: <span className={selectedCat.textColor}>{selectedCat.label}</span>
            </p>
          )}
        </div>

        {/* Note (optional) */}
        <div className="flex flex-col gap-1">
          <label className={clsx('text-sm font-medium', isDark ? 'text-white/70' : 'text-gray-600')}>
            Note <span className={isDark ? 'text-white/30' : 'text-gray-400'}>(optional)</span>
          </label>
          <textarea
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
            placeholder="Add a note..."
            rows={2}
            className={clsx(
              'resize-none',
              isDark ? 'input-base' : 'input-base-light'
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" className="flex-1">
            {editTransaction ? 'Update' : 'Add'} Transaction
          </Button>
        </div>
      </form>
    </Modal>
  );
}
