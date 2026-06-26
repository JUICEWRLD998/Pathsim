'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Play, BarChart3, Map } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';

const STEPS = [
  {
    number: '01',
    icon: Zap,
    title: 'Take the Spark Quiz',
    description:
      'Answer 5 carefully designed questions about your interests, working style, and natural strengths. No right or wrong answers.',
    color: 'from-purple-500/20 to-purple-500/5',
    borderColor: 'border-purple-500/20',
    iconColor: 'text-purple-400',
    href: '/quiz',
  },
  {
    number: '02',
    icon: Play,
    title: 'Enter the Simulation',
    description:
      'AI matches you to careers and drops you into a realistic "Day in the Life" — real decisions, real trade-offs, real consequences.',
    color: 'from-cyan-500/20 to-cyan-500/5',
    borderColor: 'border-cyan-500/20',
    iconColor: 'text-cyan-400',
    href: '/simulation',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'See Your Match Score',
    description:
      'AI evaluates every decision you made and generates a detailed personality profile, strengths breakdown, and match percentage.',
    color: 'from-emerald-500/20 to-emerald-500/5',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
    href: '/dashboard',
  },
  {
    number: '04',
    icon: Map,
    title: 'Get Your Roadmap',
    description:
      'Receive a personalized 12-month career roadmap — courses, certifications, and action items tailored exactly to your results.',
    color: 'from-amber-500/20 to-amber-500/5',
    borderColor: 'border-amber-500/20',
    iconColor: 'text-amber-400',
    href: '/roadmap',
  },
];

export function HowItWorks() {
  return (
    <section className="py-20">
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How PathSim Works
          </h2>
          <p className="mx-auto max-w-xl text-slate-400">
            From curiosity to clarity — in under 15 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="group relative"
            >
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-10 left-[calc(100%_-_8px)] hidden h-px w-8 bg-gradient-to-r from-white/10 to-transparent lg:block" />
              )}

              <Link
                href={step.href}
                className={`block h-full rounded-2xl border bg-gradient-to-br p-6 transition-all duration-300 ${step.color} ${step.borderColor} hover:border-white/20 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
              >
                {/* Number + icon */}
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border bg-white/5 ${step.borderColor}`}
                  >
                    <step.icon className={`h-5 w-5 ${step.iconColor}`} aria-hidden />
                  </div>
                  <span className="font-display text-4xl font-extrabold text-white/[0.06]">
                    {step.number}
                  </span>
                </div>

                <h3 className="mb-2 font-semibold text-white">{step.title}</h3>
                <p className="text-sm leading-relaxed text-slate-400">{step.description}</p>

                <div className={`mt-4 flex items-center gap-1.5 text-xs font-medium ${step.iconColor} opacity-0 group-hover:opacity-100 transition-opacity`}>
                  Go to step
                  <ArrowRight className="h-3 w-3" aria-hidden />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
