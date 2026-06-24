import { forwardRef } from 'react';
import clsx from 'clsx';
import { useTheme } from '../../context/ThemeContext';

export const Input = forwardRef(({
  label,
  error,
  prefix,
  suffix,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const { isDark } = useTheme();
  return (
    <div className={clsx('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label className={clsx('text-sm font-medium', isDark ? 'text-white/70' : 'text-gray-600')}>
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {prefix && (
          <span className={clsx('absolute left-3 text-sm', isDark ? 'text-white/40' : 'text-gray-400')}>
            {prefix}
          </span>
        )}
        <input
          ref={ref}
          className={clsx(
            isDark ? 'input-base' : 'input-base-light',
            prefix && 'pl-8',
            suffix && 'pr-8',
            error && 'border-rose-500/50 focus:ring-rose-500/30',
            className
          )}
          {...props}
        />
        {suffix && (
          <span className={clsx('absolute right-3 text-sm', isDark ? 'text-white/40' : 'text-gray-400')}>
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';
