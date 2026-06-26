'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { BrainCircuit, Clock, ChevronRight, Check } from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { useQuizStore } from '@/store/quizStore';
import { useUserStore } from '@/store/userStore';
import { callGemini } from '@/lib/api';
import type { Scenario } from '@/types/simulation';
import type { SimulationOutcome } from '@/types/simulation';
import { CAREERS } from '@/lib/careers';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { staggerContainer, staggerItem } from '@/lib/animations';

const TOTAL_SCENARIOS = 3;

const APPROACH_COLORS: Record<string, { border: string; bg: string; hover: string; text: string; dot: string }> = {
  analytical: {
    border: 'border-indigo-500/25',
    bg: 'bg-indigo-500/5',
    hover: 'hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:shadow-[0_0_20px_rgba(99,102,241,0.1)]',
    text: 'text-indigo-400',
    dot: 'bg-indigo-500',
  },
  creative: {
    border: 'border-pink-500/25',
    bg: 'bg-pink-500/5',
    hover: 'hover:border-pink-500/50 hover:bg-pink-500/10 hover:shadow-[0_0_20px_rgba(244,114,182,0.1)]',
    text: 'text-pink-400',
    dot: 'bg-pink-500',
  },
  collaborative: {
    border: 'border-emerald-500/25',
    bg: 'bg-emerald-500/5',
    hover: 'hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  systematic: {
    border: 'border-amber-500/25',
    bg: 'bg-amber-500/5',
    hover: 'hover:border-amber-500/50 hover:bg-amber-500/10 hover:shadow-[0_0_20px_rgba(251,191,36,0.1)]',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
  },
};

const APPROACH_BADGES: Record<string, { label: string; variant: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'muted' }> = {
  analytical: { label: 'Analytical', variant: 'primary' },
  creative: { label: 'Creative', variant: 'danger' },
  collaborative: { label: 'Collaborative', variant: 'success' },
  systematic: { label: 'Systematic', variant: 'warning' },
};

// Career Icon Component mapping
function CareerIcon({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
  return Icon ? <Icon className={className} style={style} aria-hidden /> : <BrainCircuit className={className} style={style} />;
}

export default function SimulationPage() {
  const router = useRouter();
  const {
    simulationId,
    setSimulationId,
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

  // Auto-select recommended career if none
  useEffect(() => {
    if (!selectedCareer && recommendations.length > 0) {
      const found = CAREERS.find((c) => c.id === recommendations[0].id);
      if (found) setCareer(found);
    } else if (!selectedCareer && CAREERS.length > 0) {
      setCareer(CAREERS[0]);
    }
  }, [selectedCareer, recommendations, setCareer]);

  // Fetch scenarios from Gemini
  useEffect(() => {
    if (!selectedCareer) return;
    if (currentScenario >= TOTAL_SCENARIOS) return;
    if (scenarios.length > currentScenario) return;

    const loadScenario = async () => {
      setLoading(true);
      setError(null);
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

    const currentRunId = simulationId || crypto.randomUUID();
    if (!simulationId) {
      setSimulationId(currentRunId);
    }

    const updatedDecision = {
      scenarioIndex: currentScenario,
      choiceId: chosen.id,
      choiceText: chosen.text,
      approach: chosen.approach,
    };

    makeDecision(updatedDecision);

    const updatedDecisions = [...decisions, updatedDecision];

    // Construct run history for the DB
    const historyItem = {
      scenarioTitle: scenario.setting || `Scenario ${currentScenario + 1}`,
      choiceIndex: chosen.id.charCodeAt(0) - 65, // A -> 0, B -> 1
      choiceText: chosen.text,
      feedback: 'Logged.',
      skillsGained: [
        chosen.approach === 'analytical'
          ? 'Data Analysis'
          : chosen.approach === 'creative'
          ? 'Innovation'
          : chosen.approach === 'collaborative'
          ? 'Teamwork'
          : 'System Thinking',
      ],
    };

    const updatedHistory = [
      ...decisions.map((d, i) => ({
        scenarioTitle: scenarios[i]?.setting || `Scenario ${i + 1}`,
        choiceIndex: d.choiceId.charCodeAt(0) - 65,
        choiceText: d.choiceText,
        feedback: 'Logged.',
        skillsGained: [
          d.approach === 'analytical'
            ? 'Data Analysis'
            : d.approach === 'creative'
            ? 'Innovation'
            : d.approach === 'collaborative'
            ? 'Teamwork'
            : 'System Thinking',
        ],
      })),
      historyItem,
    ];

    const nextScenarioIndex = currentScenario + 1;
    const isCompleted = nextScenarioIndex >= TOTAL_SCENARIOS;

    let score = 0;
    let evalOutcome = null;

    if (isCompleted) {
      setLoading(true);
      try {
        const decisionsText = updatedDecisions
          .map((d, i) => `Scenario ${i + 1}: Chose "${d.choiceText}" (${d.approach} approach)`)
          .join('\n');

        evalOutcome = await callGemini<SimulationOutcome>('outcome_evaluation', {
          career: selectedCareer.title,
          decisions: decisionsText,
        });
        setOutcome(evalOutcome);
        score = evalOutcome.matchScore;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to evaluate outcome');
        setLoading(false);
        return;
      }
    }

    // Save simulation run to server database!
    try {
      const res = await fetch('/api/simulation/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: currentRunId,
          careerId: selectedCareer.id,
          careerTitle: selectedCareer.title,
          currentScenarioIndex: nextScenarioIndex,
          history: updatedHistory,
          score,
          completed: isCompleted,
          outcome: evalOutcome,
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.data) {
          useUserStore.getState().addSimulation(resData.data);
        }
      }
    } catch (saveErr) {
      console.error('Error syncing simulation run to server:', saveErr);
    }

    if (isCompleted) {
      setLoading(false);
      router.push('/dashboard');
    }
  };

  if (!selectedCareer) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[70vh]">
        <LoadingSpinner size="lg" label="Initializing Simulation..." />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 min-h-[70vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <LoadingSpinner size="lg" />
          <p className="mt-5 text-sm text-slate-500 font-display font-semibold tracking-wide animate-pulse">
            {currentScenario >= TOTAL_SCENARIOS
              ? 'Analyzing your decisions with AI...'
              : `Synthesizing scenario ${currentScenario + 1}...`}
          </p>
        </motion.div>
      </div>
    );
  }

  const currentScenarioData = scenarios[currentScenario];

  return (
    <PageWrapper className="flex flex-1 flex-col pt-24 pb-16 min-h-[calc(100vh-4rem)]">
      <div className="section-container flex flex-1 flex-col gap-8">
        {/* Top Header Card */}
        <Card padding="md" className="border-white/[0.05] flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300"
              style={{
                backgroundColor: `${selectedCareer.color}15`,
                border: `1px solid ${selectedCareer.color}25`,
              }}
            >
              <CareerIcon
                iconName={selectedCareer.iconName}
                className="h-6 w-6"
                style={{ color: selectedCareer.color }}
              />
            </div>
            <div>
              <h1 className="font-display text-lg font-bold text-white sm:text-xl tracking-tight">
                {selectedCareer.title} Simulation
              </h1>
              <p className="text-xs text-slate-500 font-medium">Day in the Life Scenarios</p>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="flex items-center gap-3 bg-white/[0.03] border border-white/[0.06] rounded-full px-4 py-2 self-start sm:self-auto">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Progress</span>
            <div className="flex gap-2">
              {[...Array(TOTAL_SCENARIOS)].map((_, i) => (
                <div
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                    i < decisions.length
                      ? 'bg-purple-500'
                      : i === currentScenario
                      ? 'bg-purple-500/40 ring-2 ring-purple-500/30 scale-110'
                      : 'bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>
        </Card>

        {/* Main Interface Layout */}
        <div className="flex flex-1 flex-col gap-6 lg:flex-row items-stretch">
          {/* Active Scenario Console */}
          <div className="flex-1 flex flex-col justify-between">
            <AnimatePresence mode="wait">
              {currentScenarioData ? (
                <motion.div
                  key={currentScenario}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col gap-6"
                >
                  {/* Setting Header + Situation Card */}
                  <Card padding="lg" className="border-white/[0.05] relative overflow-hidden bg-white/[0.01]">
                    {/* Faint side border overlay matching career color */}
                    <div
                      className="absolute left-0 top-0 bottom-0 w-1"
                      style={{ backgroundColor: selectedCareer.color }}
                    />
                    <div className="mb-4 flex items-center justify-between text-xs text-slate-500 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5 text-slate-500" aria-hidden />
                        {currentScenarioData.setting}
                      </span>
                      <span className="text-purple-400">
                        Scenario {currentScenario + 1} / {TOTAL_SCENARIOS}
                      </span>
                    </div>
                    <p className="text-base leading-relaxed text-slate-200 sm:text-lg">
                      {currentScenarioData.situation}
                    </p>
                  </Card>

                  {/* Actions/Options Grid */}
                  <div>
                    <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-wider text-slate-500">
                      Select Your Decision Approach:
                    </h3>
                    <motion.div
                      className="grid gap-3.5"
                      variants={staggerContainer}
                      initial="initial"
                      animate="animate"
                    >
                      {currentScenarioData.options.map((option) => {
                        const style = APPROACH_COLORS[option.approach] ?? { border: 'border-white/10', bg: 'bg-white/5', hover: 'hover:bg-white/10', text: 'text-slate-400', dot: 'bg-slate-400' };
                        const badge = APPROACH_BADGES[option.approach];
                        return (
                          <motion.button
                            key={option.id}
                            variants={staggerItem}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.995 }}
                            onClick={() => handleChoice(option.id)}
                            className={`group w-full select-none cursor-pointer rounded-xl border text-left p-4.5 transition-all duration-300 focus-visible:outline-none ${style.border} ${style.bg} ${style.hover}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-4">
                                <span className="mt-0.5 flex h-6.5 w-6.5 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-xs font-extrabold text-slate-400 group-hover:text-white transition-colors">
                                  {option.id}
                                </span>
                                <p className="text-sm leading-relaxed text-slate-300 group-hover:text-white transition-colors">
                                  {option.text}
                                </p>
                              </div>
                              {badge && (
                                <Badge variant={badge.variant} size="sm" className="shrink-0 font-semibold">
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
                <Card className="flex h-64 items-center justify-center border-white/[0.05]">
                  <LoadingSpinner />
                </Card>
              )}
            </AnimatePresence>

            {/* Error alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 rounded-xl border border-rose-500/20 bg-rose-500/5 p-4 text-xs font-semibold text-rose-400"
              >
                {error}
              </motion.div>
            )}
          </div>

          {/* Decision Timeline Sidebar */}
          {decisions.length > 0 && (
            <motion.div
              className="w-full lg:w-72 lg:shrink-0 h-full"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Card padding="md" className="sticky top-24 border-white/[0.05] h-full flex flex-col justify-between">
                <div>
                  <h3 className="mb-4 font-display text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-white/[0.04] pb-3">
                    Decision Log
                  </h3>
                  <ul className="space-y-4">
                    {decisions.map((decision, i) => {
                      const badge = APPROACH_BADGES[decision.approach];
                      const style = APPROACH_COLORS[decision.approach] ?? { dot: 'bg-purple-500' };
                      return (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-xs leading-relaxed border-b border-white/[0.03] pb-3 last:border-0 last:pb-0"
                        >
                          <div className={`mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[9px] font-extrabold text-white ${style.dot}`}>
                            {i + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-slate-300 font-medium">
                              {decision.choiceText}
                            </p>
                            {badge && (
                              <Badge variant={badge.variant} size="sm" className="mt-1.5 font-semibold">
                                {badge.label}
                              </Badge>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                {decisions.length < TOTAL_SCENARIOS && (
                  <div className="mt-6 border-t border-white/[0.04] pt-4 text-center">
                    <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 font-medium">
                      <ChevronRight className="h-3.5 w-3.5" />
                      {TOTAL_SCENARIOS - decisions.length} scenario{TOTAL_SCENARIOS - decisions.length !== 1 ? 's' : ''} left
                    </div>
                  </div>
                )}
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
