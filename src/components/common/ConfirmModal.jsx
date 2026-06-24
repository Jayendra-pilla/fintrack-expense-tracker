import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Trash2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useTheme } from '../../context/ThemeContext';
import clsx from 'clsx';

export function ConfirmModal({ isOpen, onClose, onConfirm, title = 'Confirm Action', message = 'Are you sure?', confirmLabel = 'Confirm', danger = false }) {
  const { isDark } = useTheme();
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className={clsx(
          'w-14 h-14 rounded-2xl flex items-center justify-center',
          danger ? 'bg-rose-500/20' : 'bg-amber-500/20'
        )}>
          {danger ? (
            <Trash2 size={24} className="text-rose-400" />
          ) : (
            <AlertTriangle size={24} className="text-amber-400" />
          )}
        </div>
        <p className={clsx('text-sm leading-relaxed', isDark ? 'text-white/60' : 'text-gray-500')}>
          {message}
        </p>
        <div className="flex gap-3 w-full">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button variant={danger ? 'danger' : 'primary'} className="flex-1" onClick={() => { onConfirm(); onClose(); }}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
