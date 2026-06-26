'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  ArrowRight,
  TrendingUp,
  Star,
  Target,
  Lightbulb,
  RotateCcw,
  CheckCircle2,
  Gamepad2,
  Sparkles,
  Search,
  BookOpen,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { useQuizStore } from '@/store/quizStore';
import { useUserStore } from '@/store/userStore';
import { getAllCareers, CLUSTER_META, formatSalary } from '@/lib/careers';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { RingChart } from '@/components/ui/RingChart';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { cn } from '@/lib/utils';
import Link from 'next/link';

function CareerIcon({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
  return Icon ? <Icon className={className} style={style} aria-hidden /> : <Gamepad2 className={className} style={style} />;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') || 'overview') as 'overview' | 'catalog' | 'report';

  const { user, profile, simulations, isLoading } = useUserStore();
  const { setCareer, reset: resetSim, setSimulationId, resumeSimulation } = useSimulationStore();
  const { reset: resetQuiz } = useQuizStore();

  // Search & Filter state for catalog
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  // AI custom career state
  const [customTitle, setCustomTitle] = useState('');
  const [isGeneratingCustom, setIsGeneratingCustom] = useState(false);
  const [customError, setCustomError] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-void text-white">
        <LoadingSpinner size="lg" label="Syncing profile session..." />
      </div>
    );
  }

  // Calculate statistics
  const activeRuns = simulations.filter((s) => !s.completed);
  const completedRuns = simulations.filter((s) => s.completed);
  
  const avgMatchScore = completedRuns.length > 0
    ? Math.round(completedRuns.reduce((sum, s) => sum + s.score, 0) / completedRuns.length)
    : 0;

  const unlockedSkills = Array.from(
    new Set(
      completedRuns.flatMap((r) => r.history.flatMap((h) => h.skillsGained || []))
    )
  );

  const latestCompletedRun = completedRuns.length > 0
    ? [...completedRuns].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  // Retrieve full expanded careers list (static + DB custom)
  const allCareers = getAllCareers();

  // Handle starting a simulation
  const handleStartSimulation = (career: any, activeRun?: any) => {
    resetSim();
    setCareer(career);
    if (activeRun) {
      // Resume existing simulation run
      resumeSimulation(activeRun, career);
    } else {
      // Setup a brand new simulation
      setSimulationId(crypto.randomUUID());
    }
    router.push('/simulation');
  };

  // Handle generating custom career simulation
  const handleGenerateCustomCareer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTitle.trim()) return;

    setIsGeneratingCustom(true);
    setCustomError(null);

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          promptKey: 'custom_career_generation',
          variables: { title: customTitle.trim() },
        }),
      });

      const json = await res.json();
      if (!res.ok || json.error) {
        throw new Error(json.error ?? 'Failed to generate custom simulation');
      }

      // Sync and start custom career immediately!
      const generatedCareer = json.data;
      handleStartSimulation(generatedCareer);
    } catch (err) {
      setCustomError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsGeneratingCustom(false);
    }
  };

  const handleRestartQuiz = () => {
    resetSim();
    resetQuiz();
    router.push('/quiz');
  };

  return (
    <DashboardSidebar activeKey={activeTab}>
      <div className="max-w-5xl mx-auto w-full space-y-8">
        
        {/* --- OVERVIEW TAB --- */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative p-6 sm:p-8 rounded-2xl border border-white/[0.05] bg-gradient-to-br from-purple-500/10 via-[#030712] to-[#030712] overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 h-40 w-40 bg-purple-500/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <span className="text-xs font-extrabold uppercase tracking-wider text-purple-400">Student Dashboard</span>
                <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-1">
                  Hello, {user?.name}!
                </h1>
                <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
                  Welcome to your digital career playground. Explore professional domains, start interactive workspace simulations, and track your fit scores.
                </p>
              </div>
            </motion.div>

            {/* Metrics Row */}
            <motion.div
              variants={staggerContainer}
              initial="initial"
              animate="animate"
              className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {[
                { label: 'Active Simulations', value: activeRuns.length, icon: Gamepad2, color: 'text-cyan-400', bg: 'bg-cyan-500/5', border: 'border-cyan-500/10' },
                { label: 'Completed Careers', value: completedRuns.length, icon: CheckCircle2, color: 'text-purple-400', bg: 'bg-purple-500/5', border: 'border-purple-500/10' },
                { label: 'Avg Match Index', value: avgMatchScore > 0 ? `${avgMatchScore}%` : 'N/A', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/5', border: 'border-emerald-500/10' },
                { label: 'Skills Unlocked', value: unlockedSkills.length, icon: Star, color: 'text-amber-400', bg: 'bg-amber-500/5', border: 'border-amber-500/10' },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={i} variants={staggerItem}>
                    <Card padding="md" className={cn('border', stat.border, stat.bg, 'flex flex-col justify-between h-32')}>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide leading-tight">{stat.label}</span>
                        <Icon className={cn('h-4 w-4 shrink-0', stat.color)} />
                      </div>
                      <p className="text-2xl sm:text-3xl font-display font-extrabold text-white mt-2">{stat.value}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Two Column Grid */}
            <div className="grid gap-6 lg:grid-cols-5">
              {/* Recommendations (Left column, 3/5 width) */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <Star className="h-4.5 w-4.5 text-purple-400" />
                  <h2 className="font-display font-bold text-white text-base">Recommended Sim Paths</h2>
                </div>

                {profile?.quizCompleted && profile?.recommendations?.length > 0 ? (
                  <div className="space-y-3.5">
                    {profile.recommendations.map((rec: any, idx: number) => {
                      const career = allCareers.find((c) => c.id === rec.id || c.title.toLowerCase() === rec.title.toLowerCase());
                      if (!career) return null;
                      return (
                        <Card key={idx} padding="md" className="border-white/[0.05] hover:border-purple-500/30 transition-all flex items-start gap-4">
                          <div
                            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all"
                            style={{
                              backgroundColor: `${career.color}15`,
                              border: `1px solid ${career.color}25`,
                            }}
                          >
                            <CareerIcon iconName={career.iconName} className="h-5 w-5" style={{ color: career.color }} />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-display font-bold text-slate-100 text-sm">{career.title}</h3>
                              <Badge variant="primary" size="sm" className="font-semibold">{rec.matchScore}% Match</Badge>
                            </div>
                            <p className="mt-1 text-xs text-slate-400 leading-relaxed font-medium">{rec.whyYou}</p>
                            <button
                              onClick={() => handleStartSimulation(career)}
                              className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-purple-400 hover:text-white hover:underline cursor-pointer"
                            >
                              <span>Launch Simulation</span>
                              <ArrowRight className="h-3 w-3" />
                            </button>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card padding="lg" className="border-dashed border-white/10 bg-white/[0.01] text-center p-8">
                    <Sparkles className="h-8 w-8 text-slate-500 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-slate-200 text-sm">Find Your Career Spark</h3>
                    <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                      Take our 10-question personality assessment to generate your custom recommendations profile.
                    </p>
                    <Button onClick={handleRestartQuiz} className="mt-4 text-xs font-bold" size="sm">
                      Take Spark Quiz
                    </Button>
                  </Card>
                )}
              </div>

              {/* AI Custom Simulation Generator (Right column, 2/5 width) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex items-center gap-2 px-1">
                  <Sparkles className="h-4.5 w-4.5 text-cyan-400" />
                  <h2 className="font-display font-bold text-white text-base">AI Custom Simulation</h2>
                </div>

                <Card padding="lg" className="border-white/[0.05] flex flex-col justify-between h-[310px]">
                  <div>
                    <h3 className="text-sm font-bold text-slate-200">Design Any Career Sim</h3>
                    <p className="mt-1.5 text-xs text-slate-400 leading-relaxed font-medium">
                      Can't find a career? Describe any job (e.g. "Game Developer" or "Cyber Forensic Investigator") and the AI will generate custom scenarios.
                    </p>

                    <form onSubmit={handleGenerateCustomCareer} className="mt-4 space-y-3">
                      <input
                        type="text"
                        required
                        placeholder="e.g. Bio-Defense Specialist"
                        value={customTitle}
                        onChange={(e) => setCustomTitle(e.target.value)}
                        disabled={isGeneratingCustom}
                        className="w-full h-10 px-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:bg-white/[0.04] transition-all"
                      />
                      {customError && (
                        <p className="text-[10px] font-bold text-rose-400 leading-relaxed">{customError}</p>
                      )}
                      <Button
                        type="submit"
                        loading={isGeneratingCustom}
                        disabled={isGeneratingCustom || !customTitle.trim()}
                        className="w-full h-10 text-xs font-bold shadow-[0_0_15px_rgba(6,182,212,0.1)] btn-premium-primary"
                        icon={<PlusCircle className="h-3.5 w-3.5" />}
                      >
                        Generate Simulation
                      </Button>
                    </form>
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-wider text-slate-600">Simulations generated on-the-fly</span>
                </Card>
              </div>
            </div>

            {/* Resume Active simulations list */}
            {activeRuns.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 px-1">
                  <Gamepad2 className="h-4.5 w-4.5 text-slate-400" />
                  <h2 className="font-display font-bold text-white text-base">Resume Active Simulations</h2>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  {activeRuns.map((run) => {
                    const career = allCareers.find((c) => c.id === run.careerId);
                    if (!career) return null;
                    return (
                      <Card key={run.id} padding="md" className="border-white/[0.05] hover:border-purple-500/20 transition-all flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${career.color}12`,
                              border: `1px solid ${career.color}25`,
                            }}
                          >
                            <CareerIcon iconName={career.iconName} className="h-4.5 w-4.5" style={{ color: career.color }} />
                          </div>
                          <div>
                            <h3 className="font-display font-bold text-slate-200 text-xs sm:text-sm">{run.careerTitle}</h3>
                            <p className="text-[10px] text-slate-500 font-semibold tracking-wider mt-0.5">Scenario {run.currentScenarioIndex} of 3</p>
                          </div>
                        </div>
                        <Button onClick={() => handleStartSimulation(career, run)} size="sm" className="text-xs font-bold">
                          Resume
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}
          </>
        )}

        {/* --- SIMULATION CATALOG TAB --- */}
        {activeTab === 'catalog' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">Simulation Catalog</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wide mt-1">
                Browse all 24+ pre-loaded career paths and custom generated modules.
              </p>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between border-b border-white/[0.04] pb-6">
              {/* Search input */}
              <div className="relative max-w-md w-full">
                <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search career fields..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-10 pl-10 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-xs text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 focus:bg-white/[0.04] transition-all"
                />
              </div>

              {/* Cluster Filters */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCluster(null)}
                  className={cn(
                    'px-3 py-1.5 rounded-full border text-xs font-semibold select-none cursor-pointer transition-all duration-200',
                    selectedCluster === null
                      ? 'border-white/20 bg-white/10 text-white'
                      : 'border-white/[0.05] bg-white/[0.02] text-slate-400 hover:text-slate-200'
                  )}
                >
                  All
                </button>
                {Object.entries(CLUSTER_META).map(([key, meta]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedCluster(selectedCluster === key ? null : key)}
                    className={cn(
                      'px-3 py-1.5 rounded-full border text-xs font-semibold select-none cursor-pointer transition-all duration-200',
                      selectedCluster === key
                        ? 'border-white/20 bg-white/10 text-white'
                        : 'border-white/[0.05] bg-white/[0.02] text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {meta.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {allCareers
                .filter((career) => {
                  const matchesSearch = career.title.toLowerCase().includes(searchQuery.toLowerCase()) || career.description.toLowerCase().includes(searchQuery.toLowerCase());
                  const matchesCluster = !selectedCluster || career.cluster === selectedCluster;
                  return matchesSearch && matchesCluster;
                })
                .map((career) => {
                  const activeRun = activeRuns.find((r) => r.careerId === career.id);
                  const completedRun = completedRuns.find((r) => r.careerId === career.id);
                  
                  return (
                    <Card
                      key={career.id}
                      padding="md"
                      className="border-white/[0.05] hover:border-purple-500/20 transition-all flex flex-col justify-between h-[190px] relative overflow-hidden"
                    >
                      <div>
                        <div className="flex justify-between items-start gap-4">
                          <div
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                            style={{
                              backgroundColor: `${career.color}12`,
                              border: `1px solid ${career.color}25`,
                            }}
                          >
                            <CareerIcon iconName={career.iconName} className="h-4.5 w-4.5" style={{ color: career.color }} />
                          </div>
                          {completedRun ? (
                            <Badge variant="success" size="sm">Completed ({completedRun.score}%)</Badge>
                          ) : activeRun ? (
                            <Badge variant="warning" size="sm">In Progress</Badge>
                          ) : null}
                        </div>
                        <h3 className="font-display font-bold text-slate-100 text-sm mt-3 leading-snug">{career.title}</h3>
                        <p className="mt-1.5 text-[11px] text-slate-400 font-medium leading-relaxed line-clamp-2">{career.description}</p>
                      </div>

                      <div className="flex items-center justify-between mt-3 pt-3 border-t border-white/[0.04]">
                        <span className="text-[10px] text-slate-500 font-bold tracking-wide uppercase">
                          Mid: {formatSalary(career.salary.mid)}
                        </span>
                        <Button
                          onClick={() => handleStartSimulation(career, activeRun)}
                          size="sm"
                          variant={activeRun ? 'primary' : 'ghost'}
                          className="text-[10px] h-7 px-3 font-semibold hover:bg-purple-500/10 hover:text-purple-300"
                        >
                          {activeRun ? 'Resume' : completedRun ? 'Replay' : 'Start Path'}
                        </Button>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </div>
        )}

        {/* --- LATEST MATCH REPORT TAB --- */}
        {activeTab === 'report' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl font-extrabold text-white tracking-tight">Match Assessment Report</h1>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold tracking-wide mt-1">
                Detailed fit analysis generated by AI based on your latest completed career simulation run.
              </p>
            </div>

            {latestCompletedRun ? (
              <div className="space-y-6">
                {/* Score and Header Card */}
                <div className="grid gap-6 lg:grid-cols-3">
                  <Card className="flex flex-col items-center justify-center p-8 text-center h-full border-white/[0.05]">
                    <div className="relative mb-6">
                      <RingChart score={latestCompletedRun.score} size={140} strokeWidth={11} label="match index" />
                    </div>
                    <Badge variant="success" className="font-semibold">
                      Simulation Complete
                    </Badge>
                    <h2 className="mt-4 font-display font-extrabold text-white text-base">
                      {latestCompletedRun.careerTitle}
                    </h2>
                  </Card>

                  {/* AI Evaluation */}
                  <div className="lg:col-span-2">
                    <Card padding="lg" className="h-full border-white/[0.05] flex flex-col justify-between bg-white/[0.01]">
                      {latestCompletedRun.outcome ? (
                        <div>
                          <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                              <Star className="h-5 w-5" />
                            </div>
                            <div>
                              <h3 className="font-display font-bold text-white text-sm sm:text-base">AI Evaluation & Archetype</h3>
                              <p className="text-xs text-slate-500 font-medium">Decisions evaluated dynamically by Gemini</p>
                            </div>
                          </div>

                          <p className="mb-4 text-sm font-semibold leading-relaxed text-purple-300">
                            "{latestCompletedRun.outcome.headline}"
                          </p>
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-400">
                            {latestCompletedRun.outcome.careerFit}
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-center p-4">
                          <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-3" />
                          <h4 className="font-bold text-sm text-slate-200">Simulation Successfully Completed!</h4>
                          <p className="text-xs text-slate-500 mt-1 max-w-sm">
                            Run completed with score: {latestCompletedRun.score}%. Detailed outcome profiles are compiled inside the database records.
                          </p>
                        </div>
                      )}
                    </Card>
                  </div>
                </div>

                {/* History Log */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-1">
                    <BookOpen className="h-4.5 w-4.5 text-slate-400" />
                    <h3 className="font-display font-bold text-white text-base">Simulation Decision Log</h3>
                  </div>

                  <div className="space-y-3.5">
                    {latestCompletedRun.history.map((h, i) => (
                      <Card key={i} padding="md" className="border-white/[0.05] bg-white/[0.01]">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-[10px] font-extrabold text-purple-300">
                              {i + 1}
                            </span>
                            <div>
                              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">{h.scenarioTitle}</p>
                              <p className="text-xs sm:text-sm font-medium text-slate-200 mt-1">Chose: "{h.choiceText}"</p>
                            </div>
                          </div>
                          {h.skillsGained && h.skillsGained.length > 0 && (
                            <div className="flex gap-1.5 flex-wrap">
                              {h.skillsGained.map((s, k) => (
                                <Badge key={k} variant="success" size="sm" className="font-semibold">{s}</Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Card padding="lg" className="border-dashed border-white/10 bg-white/[0.01] text-center p-12">
                <FileBarChart2 className="h-8 w-8 text-slate-500 mx-auto mb-4" />
                <h3 className="font-display font-bold text-slate-200 text-sm">No Reports Available</h3>
                <p className="mt-1.5 text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                  Complete at least one simulation path from the catalog to compile your fit report and skills roadmap.
                </p>
                <Button onClick={() => router.push('/dashboard?tab=catalog')} className="mt-4 text-xs font-bold" size="sm">
                  Browse Catalog
                </Button>
              </Card>
            )}
          </div>
        )}
      </div>
    </DashboardSidebar>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen items-center justify-center bg-void text-white">
        <LoadingSpinner size="lg" label="Loading dashboard panels..." />
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
