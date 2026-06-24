import { forwardRef } from 'react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

export const Select = forwardRef(({ label, error, options = [], className = '', containerClassName = '', ...props }, ref) => {
  const { isDark } = useTheme();
  return (
    <div className={clsx('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className={clsx('text-sm font-medium', isDark ? 'text-white/70' : 'text-gray-600')}>
          {label}
        </label>
      )}
      <select
        ref={ref}
        className={clsx(
          isDark ? 'input-base' : 'input-base-light',
          isDark ? 'bg-dark-850' : 'bg-white',
          error && 'border-rose-500/50',
          className
        )}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className={isDark ? 'bg-dark-850' : 'bg-white'}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
