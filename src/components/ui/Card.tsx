'use client';

import { motion } from 'framer-motion';
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  glow?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: 'div' | 'article' | 'section';
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  (
    {
      hover = false,
      glow = false,
      padding = 'md',
      as: Tag = 'div',
      className,
      children,
      ...props
    },
    ref
  ) => {
    const base = cn(
      'glass-card-premium',
      paddingClasses[padding],
      hover && 'glass-card-premium-hover',
      glow && 'shadow-[0_0_50px_rgba(168,85,247,0.08)] border-purple-500/15',
      className
    );

    if (hover) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -2 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={base}
          {...(props as React.ComponentProps<typeof motion.div>)}
        >
          {children}
        </motion.div>
      );
    }

    return (
      <Tag ref={ref} className={base} {...props}>
        {children}
      </Tag>
    );
  }
);

Card.displayName = 'Card';
