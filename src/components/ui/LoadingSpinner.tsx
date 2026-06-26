'use client';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: { outer: 28, inner: 18, border: 2 },
  md: { outer: 48, inner: 32, border: 2.5 },
  lg: { outer: 68, inner: 46, border: 3 },
};

export function LoadingSpinner({ size = 'md', label, className }: LoadingSpinnerProps) {
  const { outer, inner, border } = sizeMap[size];

  return (
    <div
      className={cn('flex flex-col items-center justify-center gap-4 text-center select-none', className)}
      role="status"
      aria-label={label ?? 'Loading'}
    >
      <div className="relative flex items-center justify-center" style={{ width: outer, height: outer }}>
        {/* Outer Orbit (Violet) */}
        <div
          className="absolute inset-0 rounded-full border-transparent animate-spin"
          style={{
            border: `${border}px solid transparent`,
            borderTopColor: '#a855f7',
            borderRightColor: 'rgba(168, 85, 247, 0.2)',
            animationDuration: '1.2s',
          }}
        />
        {/* Inner Orbit (Cyan - Reverse) */}
        <div
          className="absolute rounded-full border-transparent animate-spin"
          style={{
            width: inner,
            height: inner,
            border: `${border}px solid transparent`,
            borderTopColor: '#06b6d4',
            borderLeftColor: 'rgba(6, 182, 212, 0.2)',
            animationDuration: '0.8s',
            animationDirection: 'reverse',
          }}
        />
        {/* Glowing Center Core */}
        <div
          className="absolute rounded-full bg-accent/40 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-pulse"
          style={{
            width: border * 2,
            height: border * 2,
          }}
        />
      </div>
      {label && (
        <p className="font-display text-sm font-semibold tracking-wide text-slate-400 animate-pulse">{label}</p>
      )}
    </div>
  );
}
