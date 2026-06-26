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
      'relative rounded-2xl',
      'bg-white/[0.04] backdrop-blur-xl',
      'border border-white/[0.08]',
      paddingClasses[padding],
      hover && [
        'cursor-pointer',
        'hover:bg-white/[0.07]',
        'hover:border-purple-500/30',
        'hover:shadow-[0_0_30px_rgba(168,85,247,0.12)]',
        'transition-all duration-300',
      ],
      glow && 'shadow-[0_0_60px_rgba(168,85,247,0.06)]',
      className
    );

    if (hover) {
      return (
        <motion.div
          ref={ref}
          whileHover={{ y: -2 }}
          transition={{ duration: 0.2 }}
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
