import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Calendar, TrendingUp, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { ProgressBar } from '../components/ui/ProgressBar';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/SkeletonLoader';
import { formatCurrency, formatDate } from '../utils/formatters';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';
import { differenceInDays, parseISO } from 'date-fns';

const GOAL_ICONS = ['🎯', '✈️', '🏠', '💻', '🚗', '💰', '🎓', '🏋️', '💍', '🌴', '📱', '🎸'];

function GoalForm({ isOpen, onClose, editGoal = null }) {
  const { addGoal, updateGoal } = useApp();
  const [form, setForm] = useState(editGoal || {
    title: '', description: '', targetAmount: '', currentAmount: '',
    deadline: '', icon: '🎯', color: '#6366f1',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.targetAmount) { toast.error('Fill required fields'); return; }
    const goalData = { ...form, targetAmount: parseFloat(form.targetAmount), currentAmount: parseFloat(form.currentAmount) || 0 };
    if (editGoal) { updateGoal(editGoal.id, goalData); toast.success('Goal updated!'); }
    else { addGoal(goalData); toast.success('Goal created!'); }
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editGoal ? 'Edit Goal' : 'New Financial Goal'} size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Icon picker */}
        <div>
          <label className="text-sm font-medium text-white/70 block mb-2">Pick an Icon</label>
          <div className="flex flex-wrap gap-2">
            {GOAL_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                onClick={() => setForm((f) => ({ ...f, icon }))}
                className={clsx(
                  'w-9 h-9 rounded-lg text-lg flex items-center justify-center transition-all',
                  form.icon === icon ? 'bg-primary-500/30 ring-2 ring-primary-500' : 'bg-white/5 hover:bg-white/10'
                )}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>
        <Input label="Goal Title *" placeholder="e.g. Emergency Fund" value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
        <Input label="Description" placeholder="What's this goal for?" value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Target Amount (₹) *" type="number" prefix="₹" placeholder="0"
            value={form.targetAmount} onChange={(e) => setForm((f) => ({ ...f, targetAmount: e.target.value }))} />
          <Input label="Current Amount (₹)" type="number" prefix="₹" placeholder="0"
            value={form.currentAmount} onChange={(e) => setForm((f) => ({ ...f, currentAmount: e.target.value }))} />
        </div>
        <Input label="Target Date" type="date" value={form.deadline}
          onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} />
        <div className="flex gap-3 pt-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="primary" className="flex-1">
            {editGoal ? 'Update' : 'Create'} Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
}

function GoalCard({ goal }) {
  const { updateGoal, deleteGoal } = useApp();
  const { isDark } = useTheme();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [addFunds, setAddFunds] = useState('');
  const [fundOpen, setFundOpen] = useState(false);

  const progress = goal.targetAmount > 0 ? (goal.currentAmount / goal.targetAmount) * 100 : 0;
  const isCompleted = goal.currentAmount >= goal.targetAmount;
  const daysLeft = goal.deadline ? differenceInDays(parseISO(goal.deadline), new Date()) : null;
  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);

  const handleAddFunds = () => {
    const amount = parseFloat(addFunds);
    if (isNaN(amount) || amount <= 0) { toast.error('Invalid amount'); return; }
    updateGoal(goal.id, { currentAmount: Math.min(goal.targetAmount, goal.currentAmount + amount) });
    toast.success(`Added ${formatCurrency(amount)} to ${goal.title}`);
    setAddFunds('');
    setFundOpen(false);
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={clsx(
          'rounded-2xl p-5 border relative overflow-hidden',
          isCompleted
            ? isDark ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'
            : isDark ? 'glass-card' : 'glass-card-light'
        )}
      >
        {isCompleted && (
          <div className="absolute top-3 right-3">
            <span className="text-xs bg-emerald-500/20 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 font-medium flex items-center gap-1">
              <CheckCircle size={12} /> Completed!
            </span>
          </div>
        )}

        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
            style={{ background: `${goal.color}20`, border: `1px solid ${goal.color}30` }}>
            {goal.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={clsx('text-base font-semibold truncate', isDark ? 'text-white' : 'text-gray-900')}>
              {goal.title}
            </h3>
            {goal.description && (
              <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
                {goal.description}
              </p>
            )}
          </div>
        </div>

        {/* Progress */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-2">
            <span className={clsx(isDark ? 'text-white/50' : 'text-gray-500')}>
              {formatCurrency(goal.currentAmount)} saved
            </span>
            <span className={clsx('font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
              {Math.min(100, progress).toFixed(0)}%
            </span>
          </div>
          <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color={isCompleted ? 'success' : 'primary'} height="h-2.5" animated />
          <div className="flex justify-between mt-1.5 text-xs">
            <span className={isDark ? 'text-white/30' : 'text-gray-400'}>
              Target: {formatCurrency(goal.targetAmount)}
            </span>
            {!isCompleted && (
              <span className={isDark ? 'text-white/30' : 'text-gray-400'}>
                Remaining: {formatCurrency(remaining)}
              </span>
            )}
          </div>
        </div>

        {/* Deadline */}
        {goal.deadline && (
          <div className={clsx(
            'flex items-center gap-2 text-xs mb-4 px-3 py-2 rounded-lg',
            daysLeft !== null && daysLeft < 30
              ? 'bg-amber-500/10 text-amber-400'
              : isDark ? 'bg-white/5 text-white/40' : 'bg-gray-100 text-gray-500'
          )}>
            <Calendar size={12} />
            {daysLeft !== null && daysLeft >= 0
              ? `${daysLeft} days left · ${formatDate(goal.deadline)}`
              : daysLeft < 0
                ? `Deadline passed`
                : formatDate(goal.deadline)
            }
          </div>
        )}

        {/* Add funds */}
        <AnimatePresence>
          {fundOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  value={addFunds}
                  onChange={(e) => setAddFunds(e.target.value)}
                  placeholder="Amount to add"
                  className={clsx('flex-1 text-sm', isDark ? 'input-base' : 'input-base-light')}
                />
                <Button size="sm" onClick={handleAddFunds}>Add</Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex gap-2">
          {!isCompleted && (
            <Button variant="primary" size="sm" className="flex-1"
              onClick={() => setFundOpen((o) => !o)}
              icon={<TrendingUp size={13} />}>
              {fundOpen ? 'Cancel' : 'Add Funds'}
            </Button>
          )}
          <button onClick={() => setEditOpen(true)}
            className={clsx('p-2 rounded-xl transition-colors', isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100')}>
            <Edit3 size={15} />
          </button>
          <button onClick={() => setDeleteConfirm(true)}
            className="p-2 rounded-xl text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition-colors">
            <Trash2 size={15} />
          </button>
        </div>
      </motion.div>

      <GoalForm isOpen={editOpen} onClose={() => setEditOpen(false)} editGoal={goal} />
      <ConfirmModal
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}
        onConfirm={() => { deleteGoal(goal.id); toast.success('Goal deleted'); }}
        title="Delete Goal"
        message={`Delete "${goal.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        danger
      />
    </>
  );
}

export default function Goals() {
  const { goals } = useApp();
  const { isDark } = useTheme();
  const [addOpen, setAddOpen] = useState(false);

  const completed = goals.filter((g) => g.currentAmount >= g.targetAmount);
  const active = goals.filter((g) => g.currentAmount < g.targetAmount);
  const totalSaved = goals.reduce((s, g) => s + g.currentAmount, 0);
  const totalTarget = goals.reduce((s, g) => s + g.targetAmount, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Financial Goals</h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
            Track your savings goals and milestones
          </p>
        </div>
        <Button variant="primary" icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
          New Goal
        </Button>
      </div>

      {/* Summary */}
      {goals.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Total Saved', value: formatCurrency(totalSaved), icon: '💰', color: 'text-emerald-400' },
            { label: 'Total Target', value: formatCurrency(totalTarget), icon: '🎯', color: isDark ? 'text-white' : 'text-gray-900' },
            { label: 'Goals Complete', value: `${completed.length}/${goals.length}`, icon: '✅', color: 'text-primary-400' },
          ].map((item) => (
            <div key={item.label} className={clsx('rounded-2xl p-4 border text-center', isDark ? 'glass-card' : 'glass-card-light')}>
              <p className="text-2xl mb-1">{item.icon}</p>
              <p className={clsx('text-lg font-bold', item.color)}>{item.value}</p>
              <p className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-500')}>{item.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <EmptyState
          icon="🎯"
          title="No goals yet"
          message="Create your first financial goal to start tracking your savings"
          action={
            <Button variant="primary" icon={<Plus size={14} />} onClick={() => setAddOpen(true)}>
              Create Goal
            </Button>
          }
        />
      ) : (
        <>
          {active.length > 0 && (
            <div>
              <h2 className={clsx('text-sm font-semibold mb-3', isDark ? 'text-white/50' : 'text-gray-500')}>
                Active Goals ({active.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {active.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            </div>
          )}
          {completed.length > 0 && (
            <div>
              <h2 className={clsx('text-sm font-semibold mb-3 flex items-center gap-2', isDark ? 'text-white/50' : 'text-gray-500')}>
                <CheckCircle size={14} className="text-emerald-400" />
                Completed ({completed.length})
              </h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {completed.map((goal) => <GoalCard key={goal.id} goal={goal} />)}
              </div>
            </div>
          )}
        </>
      )}

      <GoalForm isOpen={addOpen} onClose={() => setAddOpen(false)} />
    </motion.div>
  );
}
