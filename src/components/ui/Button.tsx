'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-sm gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2.5',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'relative overflow-hidden',
    'bg-gradient-to-r from-purple-500 to-cyan-500',
    'text-white font-semibold',
    'shadow-[0_0_0_1px_rgba(168,85,247,0.3)]',
    'hover:shadow-[0_8px_30px_rgba(168,85,247,0.4)]',
    'hover:-translate-y-px',
    'active:translate-y-0 active:shadow-none',
    'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0',
    'transition-all duration-200',
  ].join(' '),

  secondary: [
    'bg-white/5 backdrop-blur-sm',
    'border border-purple-500/30',
    'text-purple-200 font-medium',
    'hover:bg-purple-500/10 hover:border-purple-500/50',
    'hover:-translate-y-px',
    'active:translate-y-0',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200',
  ].join(' '),

  ghost: [
    'bg-transparent',
    'text-slate-400',
    'hover:text-slate-200 hover:bg-white/5',
    'active:bg-white/10',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'transition-all duration-200',
  ].join(' '),
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.97 }}
        className={cn(
          'inline-flex items-center justify-center rounded-full font-medium',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[#040812]',
          sizeClasses[size],
          variantClasses[variant],
          className
        )}
        disabled={disabled || loading}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {loading ? (
          <span className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
            <span>Loading…</span>
          </span>
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <span className="shrink-0">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
