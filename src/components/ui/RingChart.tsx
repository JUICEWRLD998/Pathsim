'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect } from 'react';
import { getScoreRingColor } from '@/lib/utils';

interface RingChartProps {
  score: number; // 0–100
  size?: number; // px
  strokeWidth?: number;
  showScore?: boolean;
  label?: string;
  className?: string;
}

export function RingChart({
  score,
  size = 140,
  strokeWidth = 10,
  showScore = true,
  label,
  className,
}: RingChartProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const count = useMotionValue(0);
  const displayScore = useTransform(count, (v) => Math.round(v));
  const dashOffset = useTransform(
    count,
    [0, 100],
    [circumference, circumference * (1 - score / 100)]
  );

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    });
    return controls.stop;
  }, [count, score]);

  const color = getScoreRingColor(score);

  return (
    <div
      className={className}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score: ${score}%`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
          filter="url(#ring-glow)"
        />
        <defs>
          <filter id="ring-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {showScore && (
        <div
          className="absolute inset-0 flex flex-col items-center justify-center"
          style={{ width: size, height: size, top: 0, left: 0, position: 'absolute' }}
        >
          <motion.span
            className="text-3xl font-bold tabular-nums"
            style={{ color, position: 'relative', top: 0 }}
          >
            {displayScore}
            <span className="text-lg">%</span>
          </motion.span>
          {label && <span className="mt-0.5 text-xs text-slate-500">{label}</span>}
        </div>
      )}
    </div>
  );
}
