'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/[0.04] text-slate-300 border-white/[0.08]',
  primary: 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.06)]',
  success: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.06)]',
  warning: 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.06)]',
  danger: 'bg-rose-500/10 text-rose-300 border-rose-500/20 shadow-[0_0_15px_rgba(239,68,68,0.06)]',
  muted: 'bg-white/[0.02] text-slate-500 border-white/[0.04]',
};

const sizeClasses = {
  sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold uppercase tracking-wider',
  md: 'text-xs px-3 py-1 gap-1.5 font-medium',
};

export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: BadgeProps): React.ReactNode {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border select-none transition-all duration-250',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 flex items-center justify-center">{icon}</span>}
      {children}
    </span>
  );
}
