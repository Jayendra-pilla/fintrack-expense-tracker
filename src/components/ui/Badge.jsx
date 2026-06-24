import clsx from 'clsx';

export function Badge({ children, variant = 'default', size = 'sm', className = '' }) {
  const variants = {
    default: 'bg-white/10 text-white/70',
    primary: 'bg-primary-500/20 text-primary-400 border border-primary-500/20',
    success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/20',
    warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/20',
    info: 'bg-blue-500/20 text-blue-400 border border-blue-500/20',
    income: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20',
    expense: 'bg-rose-500/20 text-rose-400 border border-rose-500/20',
  };

  const sizes = {
    xs: 'text-[10px] px-1.5 py-0.5',
    sm: 'text-xs px-2.5 py-0.5',
    md: 'text-sm px-3 py-1',
  };

  return (
    <span className={clsx('badge', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}
