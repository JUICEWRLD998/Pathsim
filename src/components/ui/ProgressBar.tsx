'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0–100
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  animate?: boolean;
}

const colorClasses = {
  primary: 'from-purple-500 to-cyan-500',
  success: 'from-emerald-500 to-teal-400',
  warning: 'from-amber-500 to-orange-400',
};

const heightClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

export function ProgressBar({
  value,
  max = 100,
  label,
  showValue = false,
  color = 'primary',
  size = 'md',
  className,
  animate = true,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="mb-1.5 flex items-center justify-between text-xs text-slate-400">
          {label && <span>{label}</span>}
          {showValue && <span className="font-medium text-slate-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div
        className={cn(
          'w-full overflow-hidden rounded-full bg-white/[0.07]',
          heightClasses[size]
        )}
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <motion.div
          className={cn('h-full rounded-full bg-gradient-to-r', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: animate ? `${pct}%` : `${pct}%` }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
    </div>
  );
}
