'use client';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { Check } from 'lucide-react';
import type { QuizQuestion, QuizOption } from '@/types/quiz';
import { cn } from '@/lib/utils';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface QuizCardProps {
  question: QuizQuestion;
  selectedAnswer?: string | string[];
  onAnswer: (answer: string | string[]) => void;
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[name];
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
      whileHover={isSelected ? undefined : { y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onSelect}
      aria-pressed={isSelected}
      className="relative block h-full w-full select-none text-left cursor-pointer focus-visible:outline-none"
    >
      <Card
        padding="md"
        className={cn(
          'h-full flex flex-col justify-between border transition-all duration-300',
          isSelected
            ? 'border-purple-500 bg-purple-500/10 shadow-[0_0_25px_rgba(168,85,247,0.15)]'
            : 'border-white/[0.05] bg-white/[0.02] hover:border-white/15 hover:bg-white/[0.05]'
        )}
      >
        <div className="flex items-start gap-4">
          {/* Icon container */}
          {option.iconName && (
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-300',
                isSelected
                  ? 'bg-purple-500/20 border-purple-500/30 text-purple-300'
                  : 'bg-white/[0.04] border-white/[0.06] text-slate-400'
              )}
            >
              <DynamicIcon name={option.iconName} className="h-5 w-5" />
            </div>
          )}

          <div className="flex-1">
            <h4
              className={cn(
                'font-display font-bold text-sm sm:text-base transition-colors duration-200',
                isSelected ? 'text-purple-200' : 'text-white'
              )}
            >
              {option.label}
            </h4>
            {option.description && (
              <p className="mt-1 text-xs text-slate-400 leading-relaxed">{option.description}</p>
            )}
          </div>
        </div>

        {/* Selected circle marker */}
        <div className="absolute right-4 top-4">
          <div
            className={cn(
              'h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-300',
              isSelected
                ? 'bg-purple-500 border-purple-500'
                : 'border-white/10 bg-transparent'
            )}
          >
            {isSelected && <Check className="h-3 w-3 text-white" aria-hidden />}
          </div>
        </div>
      </Card>
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
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.96 }}
      onClick={onSelect}
      aria-pressed={isSelected}
      className={cn(
        'flex items-center gap-2.5 rounded-full border px-5 py-2.5 text-sm font-semibold select-none cursor-pointer transition-all duration-300 focus-visible:outline-none',
        isSelected
          ? 'border-purple-500 bg-purple-500/15 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
          : 'border-white/[0.06] bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200 hover:bg-white/[0.05]'
      )}
    >
      {option.iconName && (
        <DynamicIcon
          name={option.iconName}
          className={cn('h-4 w-4 transition-colors', isSelected ? 'text-purple-400' : 'text-slate-500')}
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
    <Card padding="lg" className="border-white/[0.05]">
      {/* Question Header */}
      <div className="mb-8">
        <h2 className="font-display text-xl font-bold text-white sm:text-2xl leading-snug">
          {question.question}
        </h2>
        {question.subtitle && (
          <p className="mt-2 text-xs sm:text-sm text-slate-500">{question.subtitle}</p>
        )}
        {isMulti && (
          <Badge variant="primary" size="sm" className="mt-3 font-semibold">
            Select Multiple Options
          </Badge>
        )}
      </div>

      {/* Options Render */}
      {isChip ? (
        <motion.div
          className="flex flex-wrap gap-2.5"
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
          className="grid grid-cols-1 gap-4 sm:grid-cols-2"
          variants={staggerContainer}
          initial="initial"
          animate="animate"
        >
          {question.options.map((option) => (
            <motion.div key={option.id} variants={staggerItem} className="h-full">
              <CardOption
                option={option}
                isSelected={isOptionSelected(option.id)}
                onSelect={() => handleSelect(option.id)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}
    </Card>
  );
}
