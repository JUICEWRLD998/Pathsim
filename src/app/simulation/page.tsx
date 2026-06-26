'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { BrainCircuit, Clock, ChevronRight } from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { useQuizStore } from '@/store/quizStore';
import { callGemini } from '@/lib/api';
import type { Scenario } from '@/types/simulation';
import type { SimulationOutcome } from '@/types/simulation';
import { CAREERS } from '@/lib/careers';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { staggerContainer, staggerItem } from '@/lib/animations';

const TOTAL_SCENARIOS = 3;
const APPROACH_COLORS: Record<string, string> = {
  analytical: 'border-indigo-500/40 hover:border-indigo-500/70 hover:bg-indigo-500/10',
  creative: 'border-pink-500/40 hover:border-pink-500/70 hover:bg-pink-500/10',
  collaborative: 'border-emerald-500/40 hover:border-emerald-500/70 hover:bg-emerald-500/10',
  systematic: 'border-amber-500/40 hover:border-amber-500/70 hover:bg-amber-500/10',
};

const APPROACH_BADGES: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted' }> = {
  analytical: { label: 'Analytical', variant: 'primary' },
  creative: { label: 'Creative', variant: 'danger' },
  collaborative: { label: 'Collaborative', variant: 'success' },
  systematic: { label: 'Systematic', variant: 'warning' },
};

function CareerIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  return Icon ? <Icon className={className} aria-hidden /> : <BrainCircuit className={className} />;
}

export default function SimulationPage() {
  const router = useRouter();
  const {
    selectedCareer,
    scenarios,
    decisions,
    currentScenario,
    outcome,
    isLoading,
    setCareer,
    addScenario,
    makeDecision,
    setOutcome,
    setLoading,
    error,
    setError,
  } = useSimulationStore();
  const { recommendations } = useQuizStore();

  // Auto-select first recommended career if none selected
  useEffect(() => {
    if (!selectedCareer && recommendations.length > 0) {
      const found = CAREERS.find((c) => c.id === recommendations[0].id);
      if (found) setCareer(found);
    } else if (!selectedCareer && CAREERS.length > 0) {
      setCareer(CAREERS[0]);
    }
  }, [selectedCareer, recommendations, setCareer]);

  // Load next scenario when needed
  useEffect(() => {
    if (!selectedCareer) return;
    if (currentScenario >= TOTAL_SCENARIOS) return;
    if (scenarios.length > currentScenario) return;

    const loadScenario = async () => {
      setLoading(true);
      try {
        const data = await callGemini<Scenario>('scenario_generation', {
          career: selectedCareer.title,
          scenarioNumber: String(currentScenario + 1),
        });
        addScenario(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate scenario');
      } finally {
        setLoading(false);
      }
    };

    loadScenario();
  }, [selectedCareer, currentScenario, scenarios.length, addScenario, setLoading, setError]);

  const handleChoice = async (optionId: string) => {
    if (!selectedCareer) return;
    const scenario = scenarios[currentScenario];
    const chosen = scenario.options.find((o) => o.id === optionId);
    if (!chosen) return;

    makeDecision({
      scenarioIndex: currentScenario,
      choiceId: chosen.id,
      choiceText: chosen.text,
      approach: chosen.approach,
    });

    // If we've done all scenarios, evaluate
    if (currentScenario + 1 >= TOTAL_SCENARIOS) {
      setLoading(true);
      try {
        const decisionsText = [...decisions, {
          scenarioIndex: currentScenario,
          choiceId: chosen.id,
          choiceText: chosen.text,
          approach: chosen.approach,
        }].map((d, i) => `Scenario ${i + 1}: Chose "${d.choiceText}" (${d.approach} approach)`).join('\n');

        const outcome = await callGemini<SimulationOutcome>('outcome_evaluation', {
          career: selectedCareer.title,
          decisions: decisionsText,
        });
        setOutcome(outcome);
        router.push('/dashboard');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to evaluate outcome');
        setLoading(false);
      }
    }
  };

  if (!selectedCareer) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <LoadingSpinner size="lg" label="Loading career simulation..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-slate-500">
            {currentScenario >= TOTAL_SCENARIOS
              ? 'Evaluating your decisions...'
              : `Generating scenario ${currentScenario + 1}...`}
          </p>
        </div>
      </div>
    );
  }

  const currentScenarioData = scenarios[currentScenario];

  return (
    <PageWrapper className="flex flex-1 flex-col pt-20 pb-16">
      <div className="section-container flex flex-1 flex-col">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="flex h-11 w-11 items-center justify-center rounded-xl"
              style={{
                backgroundColor: `${selectedCareer.color}18`,
                border: `1px solid ${selectedCareer.color}30`,
              }}
            >
              <CareerIcon
                iconName={selectedCareer.iconName}
                className="h-5 w-5"
              />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white sm:text-xl">
                {selectedCareer.title}
              </h1>
              <p className="text-xs text-slate-500">Day in the Life Simulation</p>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center gap-2">
            {[...Array(TOTAL_SCENARIOS)].map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i < decisions.length
                    ? 'bg-purple-500'
                    : i === currentScenario
                    ? 'bg-purple-500/50 ring-2 ring-purple-500/30'
                    : 'bg-white/10'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-6 lg:flex-row">
          {/* Main scenario */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              {currentScenarioData ? (
                <motion.div
                  key={currentScenario}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* Scenario card */}
                  <div className="mb-6 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 sm:p-8">
                    <div className="mb-4 flex items-center gap-2 text-sm text-slate-500">
                      <Clock className="h-4 w-4" aria-hidden />
                      <span>{currentScenarioData.setting}</span>
                      <span className="ml-auto text-xs font-medium text-purple-400">
                        Scenario {currentScenario + 1} / {TOTAL_SCENARIOS}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
                      {currentScenarioData.situation}
                    </p>
                  </div>

                  {/* Choices */}
                  <div>
                    <p className="mb-3 text-sm font-medium text-slate-500">
                      How do you respond?
                    </p>
                    <motion.div
                      className="grid gap-3"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {currentScenarioData.options.map((option) => {
                        const badge = APPROACH_BADGES[option.approach];
                        return (
                          <motion.button
                            key={option.id}
                            variants={staggerItem}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.99 }}
                            onClick={() => handleChoice(option.id)}
                            className={`w-full rounded-xl border bg-white/[0.02] p-4 text-left transition-all duration-200 ${APPROACH_COLORS[option.approach] ?? 'border-white/10 hover:border-white/20'}`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-bold text-slate-400">
                                  {option.id}
                                </span>
                                <p className="text-sm leading-relaxed text-slate-200">
                                  {option.text}
                                </p>
                              </div>
                              {badge && (
                                <Badge variant={badge.variant} size="sm" className="shrink-0">
                                  {badge.label}
                                </Badge>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </motion.div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex h-64 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                  <LoadingSpinner />
                </div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-300"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Decision history sidebar */}
          {decisions.length > 0 && (
            <motion.div
              className="w-full lg:w-64 lg:shrink-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="sticky top-24 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
                <h3 className="mb-4 text-sm font-semibold text-slate-400">
                  Your Decisions
                </h3>
                <ul className="space-y-3">
                  {decisions.map((decision, i) => {
                    const badge = APPROACH_BADGES[decision.approach];
                    return (
                      <li
                        key={i}
                        className="flex items-start gap-3 text-sm"
                      >
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-purple-500/20 text-xs font-bold text-purple-400 mt-0.5">
                          {i + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-slate-300 line-clamp-2 text-xs leading-relaxed">
                            {decision.choiceText}
                          </p>
                          {badge && (
                            <Badge variant={badge.variant} size="sm" className="mt-1">
                              {badge.label}
                            </Badge>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {decisions.length < TOTAL_SCENARIOS && (
                  <div className="mt-4 border-t border-white/[0.06] pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <ChevronRight className="h-3 w-3" />
                      {TOTAL_SCENARIOS - decisions.length} scenario{TOTAL_SCENARIOS - decisions.length !== 1 ? 's' : ''} remaining
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
