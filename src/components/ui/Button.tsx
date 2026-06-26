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
  sm: 'h-9 px-4 text-xs gap-1.5',
  md: 'h-11 px-6 text-sm gap-2',
  lg: 'h-13 px-8 text-base gap-2.5',
};

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'btn-premium-primary',
  secondary: 'btn-premium-secondary',
  ghost: 'btn-premium-ghost',
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
        whileHover={disabled || loading ? undefined : { y: -1.5 }}
        whileTap={disabled || loading ? undefined : { scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={cn(
          'inline-flex items-center justify-center font-semibold rounded-full select-none cursor-pointer',
          'disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none disabled:active:scale-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-void focus-visible:ring-accent',
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
              <span className="shrink-0 transition-transform duration-200">{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
              <span className="shrink-0 transition-transform duration-200">{icon}</span>
            )}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
