import { type ClassValue, clsx } from 'clsx';

// cn utility — combine class names (works with Tailwind)
export function cn(...inputs: ClassValue[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Format salary number to $XXK string
export function formatSalary(amount: number | string): string {
  if (typeof amount === 'string') return amount;
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(1)}M`;
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`;
  return `$${amount}`;
}

// Get score color class based on value
export function getScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-400';
  if (score >= 60) return 'text-amber-400';
  return 'text-rose-400';
}

export function getScoreRingColor(score: number): string {
  if (score >= 80) return '#34d399'; // emerald
  if (score >= 60) return '#fbbf24'; // amber
  return '#f87171'; // rose
}

// Stagger delay for list items
export function staggerDelay(index: number, baseMs = 80): number {
  return index * baseMs;
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Sleep utility
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
