'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  Compass,
  Award,
  Users,
  Zap,
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { CAREERS } from '@/lib/careers';
import { CareerPreviewCards } from '@/components/landing/CareerPreviewCards';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Button } from '@/components/ui/Button';

const STATS = [
  { value: '12', label: 'Career Paths', icon: Compass },
  { value: '36', label: 'AI Scenarios', icon: BrainCircuit },
  { value: '5', label: 'Quiz Questions', icon: Zap },
  { value: '100%', label: 'Free to Use', icon: Award },
];

export default function LandingPage() {
  const previewCareers = CAREERS.slice(0, 6);

  return (
    <PageWrapper className="flex flex-col relative">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 pt-24 pb-20 text-center">
        {/* Glow Spheres */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="ambient-glow glow-purple h-[600px] w-[600px] -top-32 -left-20 opacity-[0.2]" />
          <div className="ambient-glow glow-cyan h-[500px] w-[500px] -bottom-20 -right-20 opacity-[0.15]" />
        </div>

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-purple-300">
              <Sparkles className="h-3.5 w-3.5 text-purple-400" aria-hidden />
              AI Career Simulation &middot; Youth Hackathon Entry
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mb-6 font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl text-white"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Play Your Future <br />
            <span className="shimmer-text">Before You Choose It</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-base leading-relaxed text-slate-400 sm:text-lg"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Step into realistic AI-generated career scenarios. Make decisions, see your match scores, and map out a 12-month blueprint tailored to your mind.
          </motion.p>

          {/* Call to Actions */}
          <motion.div
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/quiz" passHref legacyBehavior>
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
                className="w-full sm:w-auto"
              >
                Start the Spark Quiz
              </Button>
            </Link>
            <Link href="/galaxy" passHref legacyBehavior>
              <Button
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                Explore Career Galaxy
              </Button>
            </Link>
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-void bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white shadow-md"
                >
                  <Users className="h-3 w-3" aria-hidden />
                </div>
              ))}
            </div>
            <p className="text-xs sm:text-sm text-slate-500">
              Built for students who deserve better than traditional career fairs
            </p>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="h-8 w-5 rounded-full border border-white/10 flex items-start justify-center p-1">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-accent"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─── Stats Section ────────────────────────────────────────────────── */}
      <section className="py-16 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="section-container">
          <motion.div
            className="grid grid-cols-2 gap-8 sm:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="flex flex-col items-center gap-3 text-center"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Icon className="h-5 w-5" aria-hidden />
                </div>
                <div>
                  <div className="text-3xl font-extrabold font-display shimmer-text">{value}</div>
                  <div className="text-xs text-slate-500 font-semibold tracking-wider uppercase mt-1">{label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <HowItWorks />

      {/* ─── Career Preview Cards ────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/[0.04]">
        <div className="section-container">
          <motion.div
            className="mb-16 text-center"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
              12 Careers. Infinite Futures.
            </h2>
            <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
              Each simulation drops you into a real workday, presenting branching choices with immediate consequences.
            </p>
          </motion.div>

          <CareerPreviewCards careers={previewCareers} />

          <motion.div
            className="mt-14 flex justify-center"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Link href="/galaxy" passHref legacyBehavior>
              <Button
                variant="secondary"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                View Career Galaxy
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="section-container">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 p-12 text-center sm:p-20 shadow-2xl backdrop-blur-md"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="pointer-events-none absolute -top-20 left-1/2 h-44 w-72 -translate-x-1/2 rounded-full bg-purple-500/10 blur-3xl" />
            <h2 className="mb-4 font-display text-3xl font-extrabold tracking-tight sm:text-4xl text-white">
              Ready to find your path?
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-sm text-slate-400 sm:text-base leading-relaxed">
              Answer five questions, step into professional simulations, and discover the career that fits your mind.
            </p>
            <Link href="/quiz" passHref legacyBehavior>
              <Button
                variant="primary"
                size="lg"
                icon={<ArrowRight className="h-4 w-4" />}
                iconPosition="right"
              >
                Take the Spark Quiz
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
