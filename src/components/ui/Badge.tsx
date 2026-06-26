'use client';

import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-white/10 text-slate-300 border-white/10',
  primary: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  success: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
  muted: 'bg-white/5 text-slate-500 border-white/5',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-xs px-3 py-1 gap-1.5',
};

export function Badge({
  variant = 'default',
  size = 'md',
  icon,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </span>
  );
}
