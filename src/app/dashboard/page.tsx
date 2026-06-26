'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import {
  ArrowRight,
  TrendingUp,
  Star,
  Target,
  Lightbulb,
  Map,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { useQuizStore } from '@/store/quizStore';
import { CAREERS } from '@/lib/careers';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { RingChart } from '@/components/ui/RingChart';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { getScoreColor } from '@/lib/utils';
import Link from 'next/link';

function CareerIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  return Icon ? <Icon className={className} aria-hidden /> : null;
}

export default function DashboardPage() {
  const router = useRouter();
  const { outcome, selectedCareer, reset: resetSim } = useSimulationStore();
  const { reset: resetQuiz, personalityProfile } = useQuizStore();

  useEffect(() => {
    if (!outcome || !selectedCareer) {
      router.replace('/quiz');
    }
  }, [outcome, selectedCareer, router]);

  if (!outcome || !selectedCareer) return null;

  const relatedCareers = outcome.relatedCareers
    .map((title) => CAREERS.find((c) => c.title === title || c.id === title.toLowerCase().replace(/\s+/g, '-')))
    .filter(Boolean);

  const handleRestart = () => {
    resetSim();
    resetQuiz();
    router.push('/quiz');
  };

  return (
    <PageWrapper className="flex flex-col pt-20 pb-16">
      <div className="section-container">

        {/* Page header */}
        <motion.div
          className="mb-10 text-center"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <Badge variant="success" icon={<CheckCircle2 className="h-3.5 w-3.5" />} className="mb-4">
            Simulation Complete
          </Badge>
          <h1 className="font-display text-3xl font-bold sm:text-4xl">
            Your Career Match Report
          </h1>
          <p className="mt-2 text-slate-500">
            Based on your decisions as a <span className="text-purple-300">{selectedCareer.title}</span>
          </p>
        </motion.div>

        {/* Top section: score + career */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">

          {/* Match score ring */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card className="flex flex-col items-center justify-center p-8 text-center h-full">
              <div className="relative mb-4">
                <RingChart score={outcome.matchScore} size={140} strokeWidth={10} label="match score" />
              </div>
              <p
                className={`text-sm font-medium ${getScoreColor(outcome.matchScore)}`}
              >
                {outcome.matchScore >= 80
                  ? 'Excellent Fit'
                  : outcome.matchScore >= 60
                  ? 'Good Potential'
                  : 'Explore Further'}
              </p>
              <h2 className="mt-3 text-lg font-semibold text-white">
                {selectedCareer.title}
              </h2>
            </Card>
          </motion.div>

          {/* Headline + career fit */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.15 }}
          >
            <Card className="h-full">
              <div className="flex items-start gap-3 mb-4">
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${selectedCareer.color}18`,
                    border: `1px solid ${selectedCareer.color}30`,
                  }}
                >
                  <CareerIcon iconName={selectedCareer.iconName} className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">AI Assessment</h2>
                  <p className="text-xs text-slate-500">Based on your simulation decisions</p>
                </div>
              </div>

              <p className="mb-4 text-base font-medium text-purple-200">
                {outcome.headline}
              </p>
              <p className="text-sm leading-relaxed text-slate-400">
                {outcome.careerFit}
              </p>

              {personalityProfile && (
                <div className="mt-4 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
                  <p className="mb-1 text-xs font-medium text-slate-500">Your Personality Profile</p>
                  <p className="text-sm text-slate-300 leading-relaxed">{personalityProfile}</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Strengths + Growth Areas */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2">

          {/* Strengths */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/15 border border-emerald-500/20">
                  <Star className="h-4 w-4 text-emerald-400" aria-hidden />
                </div>
                <h3 className="font-semibold text-white">Key Strengths</h3>
              </div>
              <motion.ul
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {outcome.strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden />
                    <div>
                      <p className="text-sm font-medium text-white">{strength.skill}</p>
                      <p className="text-xs text-slate-500">{strength.evidence}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          </motion.div>

          {/* Growth Areas */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Card className="h-full">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/15 border border-amber-500/20">
                  <Target className="h-4 w-4 text-amber-400" aria-hidden />
                </div>
                <h3 className="font-semibold text-white">Growth Areas</h3>
              </div>
              <motion.ul
                className="space-y-3"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {outcome.growthAreas.map((area, i) => (
                  <motion.li
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-3"
                  >
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" aria-hidden />
                    <div>
                      <p className="text-sm font-medium text-white">{area.skill}</p>
                      <p className="text-xs text-slate-500">{area.advice}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          </motion.div>
        </div>

        {/* Related Careers */}
        {relatedCareers.length > 0 && (
          <motion.div
            className="mb-8"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-400" aria-hidden />
              <h3 className="font-semibold text-white">Related Careers You Might Love</h3>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {relatedCareers.map((career) => career && (
                <Link
                  key={career.id}
                  href="/simulation"
                  className="group flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/15 hover:bg-white/[0.05]"
                  onClick={() => {
                    // TODO: set selected career to this one
                  }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: `${career.color}18`,
                      border: `1px solid ${career.color}30`,
                    }}
                  >
                    <CareerIcon iconName={career.iconName} className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white truncate">{career.title}</p>
                    <p className="text-xs text-slate-500">{career.growthRate}</p>
                  </div>
                  <ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" aria-hidden />
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTAs */}
        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Link href="/roadmap" className="btn-primary px-8 py-3.5">
            <Map className="h-4 w-4" aria-hidden />
            Get My Roadmap
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link href="/galaxy" className="btn-secondary px-8 py-3.5">
            Explore Career Galaxy
          </Link>
          <button
            onClick={handleRestart}
            className="btn-ghost px-6 py-3 text-sm"
          >
            <RotateCcw className="h-4 w-4" aria-hidden />
            Start Over
          </button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
