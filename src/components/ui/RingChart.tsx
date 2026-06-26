'use client';

import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';
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

  // MotionValue used for SVG strokeDashoffset
  const count = useMotionValue(0);
  const dashOffset = useTransform(
    count,
    [0, 100],
    [circumference, circumference * (1 - score / 100)]
  );

  // Plain state for the visible counter (MotionValue is not a valid ReactNode)
  const [displayScore, setDisplayScore] = useState(0);

  useEffect(() => {
    const controls = animate(count, score, {
      duration: 1.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplayScore(Math.round(v)),
    });
    return controls.stop;
  }, [count, score]);

  const color = getScoreRingColor(score);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className ?? ''}`}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Match score: ${score}%`}
    >
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} className="drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
        {/* Track Ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.03)"
          strokeWidth={strokeWidth}
        />
        {/* Ambient Ring Glow Backdrop */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - score / 100)}
          className="opacity-[0.15] blur-[4px]"
        />
        {/* Actual Progress Ring */}
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
          filter="url(#ring-glow-filter)"
        />
        <defs>
          <filter id="ring-glow-filter">
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
          className="absolute inset-0 flex flex-col items-center justify-center text-center"
          style={{ width: size, height: size, top: 0, left: 0 }}
        >
          <span
            className="font-display text-4xl font-extrabold tracking-tight tabular-nums flex items-baseline justify-center"
            style={{ color, textShadow: `0 0 20px ${color}35` }}
          >
            {displayScore}
            <span className="text-sm font-bold opacity-80 ml-0.5">%</span>
          </span>
          {label && <span className="mt-1 font-display text-[9px] font-semibold uppercase tracking-wider text-slate-500">{label}</span>}
        </div>
      )}
    </div>
  );
}
