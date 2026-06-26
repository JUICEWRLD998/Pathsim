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
} from 'lucide-react';
import { useSimulationStore } from '@/store/simulationStore';
import { useQuizStore } from '@/store/quizStore';
import { CAREERS } from '@/lib/careers';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { RingChart } from '@/components/ui/RingChart';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { getScoreColor } from '@/lib/utils';
import Link from 'next/link';

function CareerIcon({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
  return Icon ? <Icon className={className} style={style} aria-hidden /> : null;
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
    <PageWrapper className="flex flex-col pt-24 pb-16 min-h-[calc(100vh-4rem)]">
      <div className="section-container">
        {/* Page Header */}
        <motion.div
          className="mb-12 text-center"
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <Badge variant="success" icon={<CheckCircle2 className="h-3.5 w-3.5" />} className="mb-4 font-semibold">
            Simulation Complete
          </Badge>
          <h1 className="font-display text-3xl font-bold sm:text-4xl text-white tracking-tight leading-snug">
            Your Career Match Report
          </h1>
          <p className="mt-2 text-sm text-slate-500 font-semibold tracking-wider uppercase">
            Performance Analysis as a <span className="text-purple-400">{selectedCareer.title}</span>
          </p>
        </motion.div>

        {/* Top summary section */}
        <div className="mb-8 grid gap-6 lg:grid-cols-3">
          {/* Match Score Gauge */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.1 }}
          >
            <Card className="flex flex-col items-center justify-center p-8 text-center h-full border-white/[0.05]">
              <div className="relative mb-6">
                <RingChart score={outcome.matchScore} size={150} strokeWidth={12} label="match index" />
              </div>
              <Badge
                variant={outcome.matchScore >= 80 ? 'success' : outcome.matchScore >= 60 ? 'warning' : 'danger'}
                className="font-semibold"
              >
                {outcome.matchScore >= 80
                  ? 'Excellent Fit'
                  : outcome.matchScore >= 60
                  ? 'Good Potential'
                  : 'Explore Further'}
              </Badge>
              <h2 className="mt-4 font-display font-extrabold text-white text-lg">
                {selectedCareer.title}
              </h2>
            </Card>
          </motion.div>

          {/* AI Assessment & Personality Profile */}
          <motion.div
            className="lg:col-span-2"
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ delay: 0.15 }}
          >
            <Card padding="lg" className="h-full border-white/[0.05] flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-all duration-300"
                    style={{
                      backgroundColor: `${selectedCareer.color}15`,
                      border: `1px solid ${selectedCareer.color}25`,
                    }}
                  >
                    <CareerIcon iconName={selectedCareer.iconName} className="h-5 w-5" style={{ color: selectedCareer.color }} />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-white text-base">AI Evaluation & Archetype</h3>
                    <p className="text-xs text-slate-500 font-medium">Derived from simulated workspace actions</p>
                  </div>
                </div>

                <p className="mb-4 text-base font-semibold leading-relaxed text-purple-300">
                  "{outcome.headline}"
                </p>
                <p className="text-sm leading-relaxed text-slate-400">
                  {outcome.careerFit}
                </p>
              </div>

              {personalityProfile && (
                <div className="mt-6 rounded-xl border border-white/[0.05] bg-white/[0.01] p-4.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">Your Personality Profile</span>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">{personalityProfile}</p>
                </div>
              )}
            </Card>
          </motion.div>
        </div>

        {/* Strengths & Growth Areas Grid */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2">
          {/* Strengths Card */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <Card padding="lg" className="h-full border-white/[0.05] bg-emerald-500/[0.01]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <Star className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="font-display font-bold text-white text-base">Core Strengths</h3>
              </div>
              <motion.ul
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {outcome.strengths.map((strength, i) => (
                  <motion.li
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-3.5"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{strength.skill}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{strength.evidence}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          </motion.div>

          {/* Growth Areas Card */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            <Card padding="lg" className="h-full border-white/[0.05] bg-amber-500/[0.01]">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Target className="h-4 w-4" aria-hidden />
                </div>
                <h3 className="font-display font-bold text-white text-base">Growth Areas</h3>
              </div>
              <motion.ul
                className="space-y-4"
                variants={staggerContainer}
                initial="initial"
                whileInView="animate"
                viewport={{ once: true }}
              >
                {outcome.growthAreas.map((area, i) => (
                  <motion.li
                    key={i}
                    variants={staggerItem}
                    className="flex items-start gap-3.5"
                  >
                    <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-400">
                      <Lightbulb className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-200">{area.skill}</p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-0.5">{area.advice}</p>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            </Card>
          </motion.div>
        </div>

        {/* Related Careers recommendation card panel */}
        {relatedCareers.length > 0 && (
          <motion.div
            className="mb-10"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="mb-6 flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-purple-400" aria-hidden />
              <h3 className="font-display font-bold text-white text-base">Explore Related Careers</h3>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {relatedCareers.map((career) => career && (
                <Link
                  key={career.id}
                  href="/simulation"
                  className="group block"
                  onClick={() => {
                    // Save career to store
                    useSimulationStore.getState().setCareer(career);
                    // Reset scenarios list for the new career simulation
                    useSimulationStore.getState().reset();
                    useSimulationStore.getState().setCareer(career);
                  }}
                >
                  <Card padding="md" className="flex items-center gap-3.5 border-white/[0.05] hover:border-purple-500/30 group-hover:bg-white/[0.04]">
                    <div
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors duration-300"
                      style={{
                        backgroundColor: `${career.color}12`,
                        border: `1px solid ${career.color}25`,
                      }}
                    >
                      <CareerIcon iconName={career.iconName} className="h-4.5 w-4.5" style={{ color: career.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-purple-300 transition-colors truncate">{career.title}</p>
                      <p className="text-[10px] text-emerald-400 font-semibold tracking-wider mt-0.5">{career.growthRate}</p>
                    </div>
                    <ArrowRight className="ml-auto h-4 w-4 text-slate-600 group-hover:text-white transition-colors shrink-0 group-hover:translate-x-1 duration-300" aria-hidden />
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Action CTAs */}
        <motion.div
          className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center mt-12 border-t border-white/[0.04] pt-8"
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <Link href="/roadmap" passHref legacyBehavior>
            <Button variant="primary" size="lg" icon={<Map className="h-4 w-4" />} iconPosition="left">
              Get Personalized Roadmap
            </Button>
          </Link>
          <Link href="/galaxy" passHref legacyBehavior>
            <Button variant="secondary" size="lg">
              Explore Career Galaxy
            </Button>
          </Link>
          <Button
            variant="ghost"
            onClick={handleRestart}
            icon={<RotateCcw className="h-4 w-4" />}
            iconPosition="left"
            className="text-slate-500 hover:text-white"
          >
            Start Over
          </Button>
        </motion.div>
      </div>
    </PageWrapper>
  );
}
