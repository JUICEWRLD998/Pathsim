'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: { outer: 24, inner: 16, border: 2 },
  md: { outer: 44, inner: 30, border: 2.5 },
  lg: { outer: 64, inner: 44, border: 3 },
};

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  const { outer, inner, border } = sizeMap[size];

  return (
    <div
      className={cn('flex flex-col items-center gap-3', className)}
      role="status"
      aria-label={label ?? 'Loading'}
    >
      <div className="relative" style={{ width: outer, height: outer }}>
        {/* Outer ring */}
        <div
          className="absolute inset-0 rounded-full border-transparent animate-spin"
          style={{
            border: `${border}px solid transparent`,
            borderTopColor: '#a855f7',
            borderRightColor: 'rgba(168,85,247,0.3)',
            animationDuration: '1s',
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute rounded-full border-transparent animate-spin"
          style={{
            top: (outer - inner) / 2,
            left: (outer - inner) / 2,
            width: inner,
            height: inner,
            border: `${border}px solid transparent`,
            borderTopColor: '#22d3ee',
            borderLeftColor: 'rgba(34,211,238,0.3)',
            animationDuration: '0.7s',
            animationDirection: 'reverse',
          }}
        />
        {/* Center dot */}
        <div
          className="absolute rounded-full bg-purple-500/40"
          style={{
            top: outer / 2 - 3,
            left: outer / 2 - 3,
            width: 6,
            height: 6,
          }}
        />
      </div>
      {label && (
        <p className="text-sm text-slate-400 animate-pulse">{label}</p>
      )}
    </div>
  );
}
