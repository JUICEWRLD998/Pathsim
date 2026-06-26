'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Sparkles,
  BrainCircuit,
  RouteOff,
  Award,
  Users,
  Zap,
} from 'lucide-react';
import { staggerContainer, staggerItem, fadeUp } from '@/lib/animations';
import { CAREERS } from '@/lib/careers';
import { CareerPreviewCards } from '@/components/landing/CareerPreviewCards';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { PageWrapper } from '@/components/layout/PageWrapper';

const STATS = [
  { value: '12', label: 'Career Paths', icon: RouteOff },
  { value: '36', label: 'AI Scenarios', icon: BrainCircuit },
  { value: '5', label: 'Quiz Questions', icon: Zap },
  { value: '100%', label: 'Free to Use', icon: Award },
];

export default function LandingPage() {
  const previewCareers = CAREERS.slice(0, 6);

  return (
    <PageWrapper className="flex flex-col">
      {/* ─── Hero ───────────────────────────────────────────────────── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center overflow-hidden px-4 pt-20 pb-16 text-center">
        {/* Ambient blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="glow-blob h-[600px] w-[600px] bg-purple-600/15 -top-32 -left-32 animate-pulse-glow" />
          <div className="glow-blob h-[500px] w-[500px] bg-cyan-600/10 -bottom-20 -right-20 animate-pulse-glow" style={{ animationDelay: '1.2s' }} />
          <div className="glow-blob h-64 w-64 bg-purple-500/10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 mx-auto max-w-4xl">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-sm font-medium text-purple-300">
              <Sparkles className="h-3.5 w-3.5" aria-hidden />
              AI Career Simulation &middot; Youth Code x AI Hackathon
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            className="mb-6 font-display text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl md:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          >
            Play Your Future{' '}
            <span className="shimmer">Before You Choose It</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-slate-400 sm:text-xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Take a 5-question quiz, then step into real AI-generated career scenarios.
            Make decisions. See how you score. Discover the career that fits your mind.
          </motion.p>

          {/* CTAs */}
          <motion.div
            className="flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link
              href="/quiz"
              className="btn-primary text-base px-8 py-3.5 shadow-[0_0_30px_rgba(168,85,247,0.25)]"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Start the Quiz
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/galaxy" className="btn-secondary text-base px-8 py-3.5">
              Explore Career Galaxy
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.div
            className="mt-12 flex items-center justify-center gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
          >
            <div className="flex -space-x-2">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-8 w-8 rounded-full border-2 border-[#040812] bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white"
                >
                  <Users className="h-3 w-3" aria-hidden />
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-500">
              <span className="text-slate-300 font-medium">Built for students</span> who deserve better than career fairs
            </p>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="h-8 w-5 rounded-full border border-white/10 flex items-start justify-center p-1">
            <motion.div
              className="h-1.5 w-1.5 rounded-full bg-purple-500"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: 'easeInOut' }}
            />
          </div>
        </motion.div>
      </section>

      {/* ─── Stats ──────────────────────────────────────────────────── */}
      <section className="py-12 border-y border-white/[0.05]">
        <div className="section-container">
          <motion.div
            className="grid grid-cols-2 gap-6 sm:grid-cols-4"
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div
                key={label}
                variants={staggerItem}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                  <Icon className="h-5 w-5 text-purple-400" aria-hidden />
                </div>
                <div className="text-2xl font-bold font-display gradient-text">{value}</div>
                <div className="text-xs text-slate-500 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── How It Works ───────────────────────────────────────────── */}
      <HowItWorks />

      {/* ─── Career Preview Cards ───────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            className="mb-12 text-center"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-50px' }}
          >
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
              12 Careers. Infinite Futures.
            </h2>
            <p className="mx-auto max-w-xl text-slate-400">
              Each simulation drops you into a real workday — a decision with consequences,
              just like the professionals face.
            </p>
          </motion.div>

          <CareerPreviewCards careers={previewCareers} />

          <motion.div
            className="mt-10 flex justify-center"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <Link href="/galaxy" className="btn-secondary">
              View All in Career Galaxy
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Banner ─────────────────────────────────────────────── */}
      <section className="py-20">
        <div className="section-container">
          <motion.div
            className="relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 via-transparent to-cyan-500/10 p-10 text-center sm:p-16"
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
          >
            <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-purple-500/20 blur-3xl" />
            <h2 className="mb-4 font-display text-3xl font-bold sm:text-4xl">
              Ready to find your path?
            </h2>
            <p className="mx-auto mb-8 max-w-lg text-slate-400">
              Five questions. Three careers. One simulation. Zero commitment.
              Your future is waiting.
            </p>
            <Link
              href="/quiz"
              className="btn-primary text-base px-10 py-4 shadow-[0_0_40px_rgba(168,85,247,0.3)]"
            >
              <Sparkles className="h-4 w-4" aria-hidden />
              Take the Spark Quiz
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </motion.div>
        </div>
      </section>
    </PageWrapper>
  );
}
