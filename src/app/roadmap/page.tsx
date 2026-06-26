'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ExternalLink,
  BookOpen,
  Monitor,
  Award,
  Users,
  Lightbulb,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { useUserStore } from '@/store/userStore';
import { callGemini } from '@/lib/api';
import type { RoadmapResponse, RoadmapMilestone, RoadmapAction } from '@/types/api';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import Link from 'next/link';

const ACTION_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  course: Monitor,
  certification: Award,
  project: Lightbulb,
  community: Users,
  book: BookOpen,
};

function ActionIcon({ type }: { type: string }) {
  const Icon = ACTION_ICONS[type] ?? BookOpen;
  return <Icon className="h-4.5 w-4.5" aria-hidden />;
}

const MILESTONE_COLORS = [
  { bg: 'from-purple-500/10 to-purple-500/2', border: 'border-purple-500/20', dot: 'bg-purple-500 shadow-[0_0_12px_#a855f7]', badge: 'bg-purple-500/10 text-purple-300 border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.06)]' },
  { bg: 'from-cyan-500/10 to-cyan-500/2', border: 'border-cyan-500/20', dot: 'bg-cyan-500 shadow-[0_0_12px_#06b6d4]', badge: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.06)]' },
  { bg: 'from-emerald-500/10 to-emerald-500/2', border: 'border-emerald-500/20', dot: 'bg-emerald-500 shadow-[0_0_12px_#10b981]', badge: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.06)]' },
  { bg: 'from-amber-500/10 to-amber-500/2', border: 'border-amber-500/20', dot: 'bg-amber-500 shadow-[0_0_12px_#f59e0b]', badge: 'bg-amber-500/10 text-amber-300 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.06)]' },
];

export default function RoadmapPage() {
  const router = useRouter();
  const { outcome: simOutcome, selectedCareer: simCareer } = useSimulationStore();
  const { simulations, isLoading: userLoading } = useUserStore();

  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Extract latest completed run database fallback
  const completedRuns = simulations.filter((s) => s.completed);
  const latestCompletedRun = completedRuns.length > 0
    ? [...completedRuns].sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0]
    : null;

  // Decide source of career / outcome
  const career = simCareer || (latestCompletedRun ? { title: latestCompletedRun.careerTitle } : null);
  const outcome = simOutcome || (latestCompletedRun ? latestCompletedRun.outcome : null);

  useEffect(() => {
    if (userLoading) return;
    if (!outcome || !career) return;

    const fetchRoadmap = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await callGemini<RoadmapResponse>('roadmap_generation', {
          career: career.title,
          strengths: outcome.strengths?.map((s: any) => s.skill).join(', ') || 'communication, collaboration',
          growthAreas: outcome.growthAreas?.map((g: any) => g.skill).join(', ') || 'technical depth',
        });
        setRoadmap(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [outcome, career, userLoading]);

  if (userLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-void text-white">
        <LoadingSpinner size="lg" label="Loading roadmap session..." />
      </div>
    );
  }

  // Render empty state if no active completed run details exist
  if (!outcome || !career) {
    return (
      <DashboardSidebar activeKey="roadmap">
        <div className="max-w-md mx-auto text-center p-12 relative z-10 flex flex-col items-center justify-center min-h-[50vh]">
          <Card padding="lg" className="border-dashed border-white/10 bg-white/[0.01] w-full">
            <Map className="h-10 w-10 text-slate-500 mx-auto mb-4" />
            <h3 className="font-display font-bold text-slate-200 text-base">No Roadmap Unlocked</h3>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
              Please complete at least one career simulation pathway to unlock your 12-month skills learning blueprint!
            </p>
            <Button onClick={() => router.push('/dashboard?tab=catalog')} className="mt-5 text-xs font-bold" size="sm">
              Launch Career Simulation
            </Button>
          </Card>
        </div>
      </DashboardSidebar>
    );
  }

  return (
    <DashboardSidebar activeKey="roadmap">
      <div className="max-w-4xl mx-auto w-full space-y-10">
        {/* Header */}
        <motion.div
          className="text-center"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <Badge variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />} className="mb-4 font-semibold">
            Personalized Roadmap
          </Badge>
          <h1 className="font-display text-2xl font-extrabold sm:text-3xl text-white tracking-tight leading-snug">
            Your Path to <span className="shimmer-text">{career.title}</span>
          </h1>
          {roadmap?.profile && (
            <div className="mt-4 max-w-xl mx-auto">
              <span className="font-display font-bold text-xs tracking-wider uppercase text-purple-400">
                Archetype: {roadmap.profile.archetype}
              </span>
              <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed font-medium">
                {roadmap.profile.summary}
              </p>
            </div>
          )}
        </motion.div>

        {/* Load Spinner */}
        {isLoading ? (
          <div className="flex items-center justify-center p-12 min-h-[300px]">
            <LoadingSpinner size="md" label="Assembling your personalized 12-month blueprint..." />
          </div>
        ) : error ? (
          <div className="flex items-center justify-center p-12">
            <Card className="text-center p-8 max-w-md border-white/[0.05]">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400">
                <RotateCcw className="h-5 w-5 animate-spin" style={{ animationDuration: '3s' }} />
              </div>
              <h3 className="text-slate-200 font-display font-bold text-base mb-1">Failed to generate roadmap</h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">{error}</p>
              <Button
                variant="primary"
                onClick={() => window.location.reload()}
              >
                Retry Generation
              </Button>
            </Card>
          </div>
        ) : (
          /* Timeline representation */
          roadmap && (
            <div className="relative max-w-3xl mx-auto">
              {/* Vertical timeline connector */}
              <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/30 via-white/5 to-transparent sm:left-8" />

              <motion.div
                className="space-y-10"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {roadmap.milestones.map((milestone, index) => {
                  const color = MILESTONE_COLORS[index % MILESTONE_COLORS.length];
                  return (
                    <motion.div
                      key={index}
                      variants={staggerItem}
                      className="relative pl-14 sm:pl-20"
                    >
                      {/* Timeline dot marker */}
                      <div className={`absolute left-[19px] top-6 h-3.5 w-3.5 rounded-full border-2 border-void ${color.dot} sm:left-[27px]`} />

                      {/* Milestone details wrapper */}
                      <div className={`rounded-2xl border bg-gradient-to-b p-6.5 sm:p-8 ${color.bg} ${color.border}`}>
                        {/* Header */}
                        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <span
                              className={`inline-flex rounded-full border px-3.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${color.badge}`}
                            >
                              {milestone.timeframe}
                            </span>
                            <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold text-white tracking-tight">
                              {milestone.title}
                            </h3>
                          </div>
                          <Badge variant="muted" size="sm" className="font-bold">
                            {milestone.actions.length} Action Items
                          </Badge>
                        </div>

                        {/* Actions grid */}
                        <div className="grid gap-4 sm:grid-cols-2">
                          {milestone.actions.map((action, ai) => (
                            <ActionCard key={ai} action={action} />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </div>
          )
        )}
      </div>
    </DashboardSidebar>
  );
}

function ActionCard({ action }: { action: RoadmapAction }) {
  const isLinkable = action.url && action.url !== 'https://example.com';
  
  return (
    <a
      href={isLinkable ? action.url : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-4 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4.5 transition-all duration-300 hover:border-white/15 hover:bg-white/[0.05]"
      aria-label={`${action.title} on ${action.platform} &middot; ${action.time}`}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/[0.04] border border-white/[0.06] text-slate-400 group-hover:bg-purple-500/10 group-hover:text-purple-300 group-hover:border-purple-500/20 transition-colors duration-300">
        <ActionIcon type={action.type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs sm:text-sm font-bold text-slate-200 line-clamp-2 group-hover:text-purple-300 transition-colors duration-350 leading-snug">
          {action.title}
        </p>
        <div className="mt-2 flex items-center gap-2 text-[10px] font-semibold text-slate-500">
          <span className="text-slate-400">{action.platform}</span>
          <span>&middot;</span>
          <span>{action.time}</span>
        </div>
      </div>
      {isLinkable && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-white transition-colors mt-0.5" aria-hidden />
      )}
    </a>
  );
}
