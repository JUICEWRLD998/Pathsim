'use client';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Check } from 'lucide-react';
import type { QuizQuestion, QuizOption } from '@/types/quiz';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name];
  return Icon ? <Icon className={className} aria-hidden /> : null;
}

function CardOption({
  option,
  isSelected,
  onSelect,
}: {
  option: QuizOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'relative flex h-full w-full flex-col items-start gap-3 rounded-xl border p-5 text-left transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
        isSelected
          ? 'border-purple-500/60 bg-purple-500/10 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
          : 'border-white/[0.07] bg-white/[0.03] hover:border-white/[0.15] hover:bg-white/[0.06]'
      )}
    >
      {/* Icon */}
      {option.iconName && (
        <div
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200',
            isSelected ? 'bg-purple-500/20' : 'bg-white/[0.06]'
          )}
        >
          <DynamicIcon
            name={option.iconName}
            className={cn(
              'h-4 w-4 transition-colors',
              isSelected ? 'text-purple-400' : 'text-slate-400'
            )}
          />
        </div>
      )}

      <div className="flex-1">
        <p
          className={cn(
            'font-medium text-sm transition-colors',
            isSelected ? 'text-purple-200' : 'text-white'
          )}
        >
          {option.label}
        </p>
        {option.description && (
          <p className="mt-0.5 text-xs text-slate-500">{option.description}</p>
        )}
      </div>

      {/* Selected indicator */}
      {isSelected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-purple-500"
        >
          <Check className="h-3 w-3 text-white" aria-hidden />
        </motion.div>
      )}
    </motion.button>
  );
}

function ChipOption({
  option,
  isSelected,
  onSelect,
}: {
  option: QuizOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500',
        isSelected
          ? 'border-purple-500/60 bg-purple-500/15 text-purple-200'
          : 'border-white/[0.08] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
      )}
    >
      {option.iconName && (
        <DynamicIcon
          name={option.iconName}
          className={cn('h-3.5 w-3.5', isSelected ? 'text-purple-400' : 'text-slate-500')}
        />
      )}
      {option.label}
    </motion.button>
  );
}

export function QuizCard({ question, selectedAnswer, onAnswer }: QuizCardProps) {
  const isMulti = question.multiSelect ?? false;
  const isChip = question.type === 'chip';

  const isOptionSelected = (optionId: string): boolean => {
    if (!selectedAnswer) return false;
    if (Array.isArray(selectedAnswer)) return selectedAnswer.includes(optionId);
    return selectedAnswer === optionId;
  };

  const handleSelect = (optionId: string) => {
    if (isMulti) {
      const current = Array.isArray(selectedAnswer) ? selectedAnswer : [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      onAnswer(updated);
    } else {
      onAnswer(optionId);
    }
  };

  return (
    <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 sm:p-8">
      {/* Question text */}
      <div className="mb-6">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="mt-2 text-sm text-slate-500">{question.subtitle}</p>
        )}
        {isMulti && (
          <p className="mt-2 text-xs font-medium text-purple-400">
            Select all that apply
          </p>
        )}
      </div>

      {/* Options */}
      {isChip ? (
        <motion.div
          className="flex flex-wrap gap-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {question.options.map((option) => (
            <motion.div key={option.id} variants={staggerItem}>
              <ChipOption
                option={option}
                isSelected={isOptionSelected(option.id)}
                onSelect={() => handleSelect(option.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 gap-3 sm:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {question.options.map((option) => (
            <motion.div key={option.id} variants={staggerItem}>
              <CardOption
                option={option}
                isSelected={isOptionSelected(option.id)}
                onSelect={() => handleSelect(option.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
