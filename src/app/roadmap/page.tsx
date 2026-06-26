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
  CheckCircle2,
  ArrowRight,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { callGemini } from '@/lib/api';
import type { RoadmapResponse, RoadmapMilestone, RoadmapAction } from '@/types/api';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
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
  return <Icon className="h-4 w-4" aria-hidden />;
}

const MILESTONE_COLORS = [
  { bg: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', dot: 'bg-purple-500', badge: 'bg-purple-500/15 text-purple-300 border-purple-500/30' },
  { bg: 'from-cyan-500/20 to-cyan-500/5', border: 'border-cyan-500/20', dot: 'bg-cyan-500', badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' },
  { bg: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', dot: 'bg-emerald-500', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' },
  { bg: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20', dot: 'bg-amber-500', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30' },
];

export default function RoadmapPage() {
  const router = useRouter();
  const { outcome, selectedCareer } = useSimulationStore();
  const [roadmap, setRoadmap] = useState<RoadmapResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!outcome || !selectedCareer) {
      router.replace('/quiz');
      return;
    }

    const fetchRoadmap = async () => {
      setIsLoading(true);
      try {
        const data = await callGemini<RoadmapResponse>('roadmap_generation', {
          career: selectedCareer.title,
          strengths: outcome.strengths.map((s) => s.skill).join(', '),
          growthAreas: outcome.growthAreas.map((g) => g.skill).join(', '),
        });
        setRoadmap(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate roadmap');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoadmap();
  }, [outcome, selectedCareer, router]);

  if (!outcome || !selectedCareer) return null;

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-sm text-slate-500">
            Building your personalized 12-month roadmap...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-500/15 border border-rose-500/20">
            <RotateCcw className="h-6 w-6 text-rose-400" />
          </div>
          <p className="text-slate-300 font-medium mb-2">Failed to load roadmap</p>
          <p className="text-sm text-slate-500 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageWrapper className="flex flex-col pt-20 pb-16">
      <div className="section-container">

        {/* Header */}
        <motion.div
          className="mb-10 text-center"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <Badge variant="primary" icon={<Sparkles className="h-3.5 w-3.5" />} className="mb-4">
            Personalized Roadmap
          </Badge>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Your Path to{' '}
            <span className="gradient-text">{selectedCareer.title}</span>
          </h1>
          {roadmap?.profile && (
            <>
              <p className="mt-3 font-medium text-purple-300">
                {roadmap.profile.archetype}
              </p>
              <p className="mx-auto mt-2 max-w-xl text-sm text-slate-400">
                {roadmap.profile.summary}
              </p>
            </>
          )}
        </motion.div>

        {/* Timeline */}
        {roadmap && (
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-purple-500/40 via-white/5 to-transparent sm:left-8" />

            <motion.div
              className="space-y-8"
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
                    className="relative pl-14 sm:pl-18"
                  >
                    {/* Timeline dot */}
                    <div className={`absolute left-3.5 top-5 h-5 w-5 rounded-full border-2 border-[#040812] ${color.dot} sm:left-5.5`} />

                    {/* Milestone card */}
                    <div className={`rounded-2xl border bg-gradient-to-br p-6 ${color.bg} ${color.border}`}>
                      {/* Header */}
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <span
                            className={`inline-flex rounded-full border px-3 py-0.5 text-xs font-semibold ${color.badge}`}
                          >
                            {milestone.timeframe}
                          </span>
                          <h3 className="mt-2 font-display text-lg font-bold text-white">
                            {milestone.title}
                          </h3>
                        </div>
                        <Badge variant="muted" size="sm">
                          {milestone.actions.length} action{milestone.actions.length !== 1 ? 's' : ''}
                        </Badge>
                      </div>

                      {/* Actions */}
                      <div className="grid gap-3 sm:grid-cols-2">
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
        )}

        {/* Bottom CTAs */}
        <motion.div
          className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Link href="/galaxy" className="btn-secondary px-8 py-3">
            Explore Career Galaxy
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/dashboard" className="btn-ghost px-6 py-3">
            View My Results
          </Link>
        </motion.div>
      </div>
    </PageWrapper>
  );
}

function ActionCard({ action }: { action: RoadmapAction }) {
  return (
    <a
      href={action.url !== 'https://example.com' ? action.url : undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 transition-all duration-200 hover:border-white/[0.14] hover:bg-white/[0.06]"
      aria-label={`${action.title} on ${action.platform} — ${action.time}`}
    >
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/[0.06] text-slate-400">
        <ActionIcon type={action.type} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white line-clamp-2 group-hover:text-purple-200 transition-colors">
          {action.title}
        </p>
        <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
          <span>{action.platform}</span>
          <span>&middot;</span>
          <span>{action.time}</span>
        </div>
      </div>
      {action.url && action.url !== 'https://example.com' && (
        <ExternalLink className="h-3.5 w-3.5 shrink-0 text-slate-600 group-hover:text-slate-300 transition-colors mt-0.5" aria-hidden />
      )}
    </a>
  );
}
