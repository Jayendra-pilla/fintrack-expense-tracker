import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, SortAsc, SortDesc, Trash2, Download,
  Upload, Plus, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { TransactionRow } from '../components/transactions/TransactionRow';
import { TransactionForm } from '../components/transactions/TransactionForm';
import { ConfirmModal } from '../components/common/ConfirmModal';
import { EmptyState } from '../components/common/SkeletonLoader';
import { Button } from '../components/ui/Button';
import { CATEGORIES } from '../data/categories';
import { exportToCSV, importFromCSV } from '../utils/csvHelpers';
import { toast } from 'react-hot-toast';
import clsx from 'clsx';

const PAGE_SIZE = 15;

export default function Transactions() {
  const { transactions, bulkDeleteTransactions, importTransactions, setHasExported } = useApp();
  const { isDark } = useTheme();

  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortField, setSortField] = useState('date');
  const [sortDir, setSortDir] = useState('desc');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);
  const [editTxn, setEditTxn] = useState(null);
  const [addOpen, setAddOpen] = useState(false);
  const [bulkConfirm, setBulkConfirm] = useState(false);

  const filtered = useMemo(() => {
    let result = [...transactions];
    if (search) result = result.filter((t) =>
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.category.toLowerCase().includes(search.toLowerCase())
    );
    if (typeFilter !== 'all') result = result.filter((t) => t.type === typeFilter);
    if (categoryFilter !== 'all') result = result.filter((t) => t.category === categoryFilter);
    result.sort((a, b) => {
      let va = a[sortField], vb = b[sortField];
      if (sortField === 'date') { va = new Date(va); vb = new Date(vb); }
      return sortDir === 'asc' ? (va > vb ? 1 : -1) : (va < vb ? 1 : -1);
    });
    return result;
  }, [transactions, search, typeFilter, categoryFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortField === field) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortField(field); setSortDir('desc'); }
    setPage(1);
  };

  const toggleSelect = (id) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleSelectAll = () =>
    setSelected(selected.length === paginated.length ? [] : paginated.map((t) => t.id));

  const handleBulkDelete = () => {
    bulkDeleteTransactions(selected);
    setSelected([]);
    toast.success(`Deleted ${selected.length} transactions`);
  };

  const handleExport = () => {
    exportToCSV(filtered);
    setHasExported(true);
    toast.success('CSV exported!');
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imported = await importFromCSV(file);
      importTransactions(imported);
      toast.success(`Imported ${imported.length} transactions!`);
    } catch {
      toast.error('Failed to parse CSV');
    }
    e.target.value = '';
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="page-container space-y-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={clsx('text-2xl font-bold', isDark ? 'text-white' : 'text-gray-900')}>Transactions</h1>
          <p className={clsx('text-sm mt-0.5', isDark ? 'text-white/40' : 'text-gray-500')}>
            {filtered.length} transactions found
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={handleExport} icon={<Download size={14} />}>
            Export
          </Button>
          <label className={clsx(
            'inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-xl cursor-pointer transition-all border',
            isDark ? 'bg-white/10 text-white hover:bg-white/20 border-white/10' : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200'
          )}>
            <Upload size={14} />
            Import
            <input type="file" accept=".csv" className="hidden" onChange={handleImport} />
          </label>
          <Button variant="primary" size="sm" onClick={() => setAddOpen(true)} icon={<Plus size={14} />}>
            Add
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className={clsx('rounded-2xl p-4 border', isDark ? 'glass-card' : 'glass-card-light')}>
        <div className="flex flex-wrap gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-48">
            <Search size={14} className={clsx('absolute left-3 top-1/2 -translate-y-1/2', isDark ? 'text-white/30' : 'text-gray-400')} />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search..."
              className={clsx('pl-9 w-full', isDark ? 'input-base' : 'input-base-light')}
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Type filter */}
          <div className={clsx('flex gap-1 p-1 rounded-xl', isDark ? 'bg-white/5' : 'bg-gray-100')}>
            {['all', 'income', 'expense'].map((t) => (
              <button
                key={t}
                onClick={() => { setTypeFilter(t); setPage(1); }}
                className={clsx(
                  'px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all',
                  typeFilter === t
                    ? t === 'income' ? 'bg-emerald-500 text-white' : t === 'expense' ? 'bg-rose-500 text-white' : 'bg-primary-500 text-white'
                    : isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
            className={clsx('text-xs rounded-xl px-3', isDark ? 'input-base' : 'input-base-light')}
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Sort row */}
        <div className="flex items-center gap-1 mt-3 pt-3 border-t border-white/5">
          <span className={clsx('text-xs mr-2', isDark ? 'text-white/30' : 'text-gray-400')}>Sort:</span>
          <button
            onClick={() => handleSort('date')}
            className={clsx(
              'flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded',
              sortField === 'date'
                ? 'text-primary-400'
                : isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Date
            {sortField === 'date' && (sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />)}
          </button>
          <button
            onClick={() => handleSort('amount')}
            className={clsx(
              'flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded',
              sortField === 'amount'
                ? 'text-primary-400'
                : isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Amount
            {sortField === 'amount' && (sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />)}
          </button>
          <button
            onClick={() => handleSort('category')}
            className={clsx(
              'flex items-center gap-1 text-xs font-medium transition-colors px-2 py-1 rounded',
              sortField === 'category'
                ? 'text-primary-400'
                : isDark ? 'text-white/40 hover:text-white' : 'text-gray-500 hover:text-gray-700'
            )}
          >
            Category
            {sortField === 'category' && (sortDir === 'asc' ? <SortAsc size={12} /> : <SortDesc size={12} />)}
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <AnimatePresence>
        {selected.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary-500/10 border border-primary-500/20"
          >
            <span className="text-sm text-primary-400 font-medium">{selected.length} selected</span>
            <button onClick={() => setSelected([])} className="text-white/40 hover:text-white text-xs ml-auto">
              Clear
            </button>
            <Button variant="danger" size="sm" onClick={() => setBulkConfirm(true)} icon={<Trash2 size={14} />}>
              Delete Selected
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction list */}
      <div className={clsx('rounded-2xl border overflow-hidden', isDark ? 'glass-card' : 'glass-card-light')}>
        {/* List header */}
        <div className={clsx(
          'flex items-center px-4 py-3 border-b text-xs font-medium',
          isDark ? 'border-white/5 text-white/30' : 'border-gray-100 text-gray-400'
        )}>
          <input
            type="checkbox"
            checked={selected.length === paginated.length && paginated.length > 0}
            onChange={toggleSelectAll}
            className="w-4 h-4 rounded accent-primary-500 mr-3 cursor-pointer"
          />
          <span className="flex-1">Transaction</span>
          <span className="w-24 text-right">Amount</span>
          <span className="w-16 ml-2" />
        </div>

        <div className="p-3 space-y-2">
          <AnimatePresence mode="popLayout">
            {paginated.length === 0 ? (
              <EmptyState
                icon="💸"
                title="No transactions found"
                message={search ? 'Try a different search term' : 'Add your first transaction!'}
              />
            ) : (
              paginated.map((txn) => (
                <TransactionRow
                  key={txn.id}
                  transaction={txn}
                  onEdit={setEditTxn}
                  isSelected={selected.includes(txn.id)}
                  onToggleSelect={() => toggleSelect(txn.id)}
                  selectable
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className={clsx(
            'flex items-center justify-between px-4 py-3 border-t',
            isDark ? 'border-white/5' : 'border-gray-100'
          )}>
            <span className={clsx('text-xs', isDark ? 'text-white/30' : 'text-gray-400')}>
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-1">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  isDark ? 'text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20'
                )}
              >
                <ChevronLeft size={14} />
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pg = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={clsx(
                      'w-7 h-7 rounded-lg text-xs font-medium transition-colors',
                      pg === page
                        ? 'bg-primary-500 text-white'
                        : isDark ? 'text-white/40 hover:text-white hover:bg-white/10' : 'text-gray-500 hover:bg-gray-100'
                    )}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className={clsx(
                  'p-1.5 rounded-lg transition-colors',
                  isDark ? 'text-white/40 hover:text-white hover:bg-white/10 disabled:opacity-20' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100 disabled:opacity-20'
                )}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <TransactionForm isOpen={addOpen} onClose={() => setAddOpen(false)} />
      <TransactionForm isOpen={!!editTxn} onClose={() => setEditTxn(null)} editTransaction={editTxn} />
      <ConfirmModal
        isOpen={bulkConfirm}
        onClose={() => setBulkConfirm(false)}
        onConfirm={handleBulkDelete}
        title="Bulk Delete"
        message={`Delete ${selected.length} transactions? This cannot be undone.`}
        confirmLabel="Delete All"
        danger
      />
    </motion.div>
  );
}
