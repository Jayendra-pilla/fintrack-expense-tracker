import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, Plus, X } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useApp } from '../../context/AppContext';
import { formatDate } from '../../utils/formatters';
import { ACHIEVEMENTS } from '../../data/achievements';
import { AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

export function Header({ onAddTransaction }) {
  const { isDark } = useTheme();
  const { earnedAchievements } = useApp();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { transactions } = useApp();

  const results = query.length > 1
    ? transactions.filter((t) =>
        t.description.toLowerCase().includes(query.toLowerCase()) ||
        t.category.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  });

  return (
    <header className={clsx(
      'sticky top-0 z-20 px-4 sm:px-6 py-4 border-b flex items-center justify-between gap-4',
      isDark
        ? 'bg-dark-900/80 backdrop-blur-xl border-white/10'
        : 'bg-white/80 backdrop-blur-xl border-gray-200'
    )}>
      {/* Date */}
      <div className="hidden sm:block">
        <p className={clsx('text-sm', isDark ? 'text-white/40' : 'text-gray-500')}>{today}</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        {searchOpen ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search transactions..."
              className={clsx('w-full pl-9 pr-10 py-2 rounded-xl text-sm', isDark ? 'input-base' : 'input-base-light')}
            />
            <button onClick={() => { setSearchOpen(false); setQuery(''); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white">
              <X size={14} />
            </button>
            {results.length > 0 && (
              <div className={clsx(
                'absolute top-full mt-2 w-full rounded-xl border shadow-2xl overflow-hidden z-50',
                isDark ? 'bg-dark-850 border-white/10' : 'bg-white border-gray-200'
              )}>
                {results.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => { navigate('/transactions'); setSearchOpen(false); setQuery(''); }}
                    className={clsx(
                      'w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors',
                      isDark ? 'hover:bg-white/5 text-white' : 'hover:bg-gray-50 text-gray-900'
                    )}
                  >
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{t.description}</span>
                      <span className={clsx('text-xs', isDark ? 'text-white/40' : 'text-gray-400')}>{formatDate(t.date)}</span>
                    </div>
                    <span className={t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'}>
                      {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ) : (
          <button
            onClick={() => setSearchOpen(true)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-xl text-sm w-full border transition-all',
              isDark
                ? 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
                : 'bg-gray-100 border-gray-200 text-gray-400 hover:text-gray-600'
            )}
          >
            <Search size={14} />
            <span>Search transactions...</span>
            <kbd className={clsx('ml-auto text-[10px] px-1.5 py-0.5 rounded', isDark ? 'bg-white/10' : 'bg-gray-200')}>⌘K</kbd>
          </button>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className={clsx(
              'relative w-8 h-8 rounded-full flex items-center justify-center border text-sm transition-all',
              isDark ? 'bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10' : 'bg-gray-100 border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-200'
            )}
          >
            <Bell size={16} />
            {earnedAchievements.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-rose-500 rounded-full text-[9px] text-white flex items-center justify-center">
                {earnedAchievements.length}
              </span>
            )}
          </button>

          <AnimatePresence>
            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={clsx(
                    'absolute right-0 mt-2 w-72 md:w-80 rounded-2xl border shadow-2xl overflow-hidden z-50',
                    isDark ? 'bg-dark-850 border-white/10' : 'bg-white border-gray-200'
                  )}
                >
                  <div className={clsx('px-4 py-3 border-b', isDark ? 'border-white/10' : 'border-gray-100')}>
                    <h3 className={clsx('font-semibold text-sm', isDark ? 'text-white' : 'text-gray-900')}>
                      Notifications
                    </h3>
                  </div>
                  <div className="max-h-[300px] overflow-y-auto">
                    {earnedAchievements.length === 0 ? (
                      <div className="p-6 text-center">
                        <span className="text-3xl mb-2 block">🔔</span>
                        <p className={clsx('text-sm', isDark ? 'text-white/40' : 'text-gray-500')}>
                          No achievements yet. Add more transactions to unlock them!
                        </p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        {[...earnedAchievements].reverse().map((id) => {
                          const achievement = ACHIEVEMENTS.find((a) => a.id === id);
                          if (!achievement) return null;
                          return (
                            <div
                              key={id}
                              className={clsx(
                                'flex items-start gap-3 p-3 border-b last:border-0 transition-colors',
                                isDark ? 'border-white/5 hover:bg-white/5' : 'border-gray-50 hover:bg-gray-50'
                              )}
                            >
                              <div className="text-2xl pt-1 drop-shadow-md achievement-glow">{achievement.icon}</div>
                              <div>
                                <p className={clsx('text-sm font-semibold', isDark ? 'text-white' : 'text-gray-900')}>
                                  {achievement.title}
                                </p>
                                <p className={clsx('text-xs mt-0.5', isDark ? 'text-white/50' : 'text-gray-500')}>
                                  {achievement.description}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddTransaction}
          className="btn-primary text-sm"
        >
          <Plus size={16} />
          <span className="hidden sm:inline">Add</span>
        </motion.button>
      </div>
    </header>
  );
}
