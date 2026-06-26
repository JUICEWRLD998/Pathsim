'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Zap, Play, BarChart3, Map } from 'lucide-react';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { Card } from '@/components/ui/Card';

const STEPS = [
  {
    number: '01',
    icon: Zap,
    title: 'Take the Spark Quiz',
    description:
      'Answer 5 carefully designed questions about your interests, working style, and natural strengths.',
    color: 'from-purple-500/10 to-purple-500/2',
    borderColor: 'group-hover:border-purple-500/30',
    iconBg: 'bg-purple-500/10 border-purple-500/20',
    iconColor: 'text-purple-400',
    href: '/quiz',
  },
  {
    number: '02',
    icon: Play,
    title: 'Enter the Simulation',
    description:
      'AI matches you to careers and drops you into a realistic "Day in the Life" workday scenario.',
    color: 'from-cyan-500/10 to-cyan-500/2',
    borderColor: 'group-hover:border-cyan-500/30',
    iconBg: 'bg-cyan-500/10 border-cyan-500/20',
    iconColor: 'text-cyan-400',
    href: '/simulation',
  },
  {
    number: '03',
    icon: BarChart3,
    title: 'See Your Match Score',
    description:
      'AI evaluates every decision you made, generating a detailed strengths profile and fit score.',
    color: 'from-emerald-500/10 to-emerald-500/2',
    borderColor: 'group-hover:border-emerald-500/30',
    iconBg: 'bg-emerald-500/10 border-emerald-500/20',
    iconColor: 'text-emerald-400',
    href: '/dashboard',
  },
  {
    number: '04',
    icon: Map,
    title: 'Get Your Roadmap',
    description:
      'Receive a personalized 12-month blueprint with courses, projects, and certifications.',
    color: 'from-amber-500/10 to-amber-500/2',
    borderColor: 'group-hover:border-amber-500/30',
    iconBg: 'bg-amber-500/10 border-amber-500/20',
    iconColor: 'text-amber-400',
    href: '/roadmap',
  },
];

export function HowItWorks() {
  return (
    <section className="py-24 relative overflow-hidden bg-white/[0.005] border-t border-white/[0.04]">
      <div className="section-container">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: '-50px' }}
        >
          <h2 className="mb-4 font-display text-3xl font-bold tracking-tight sm:text-4xl">
            How PathSim Works
          </h2>
          <p className="mx-auto max-w-xl text-sm leading-relaxed text-slate-400">
            From curiosity to career clarity — in under 15 minutes.
          </p>
        </motion.div>

        {/* Steps */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-50px' }}
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              variants={staggerItem}
              className="group relative h-full"
            >
              {/* Connector line */}
              {index < STEPS.length - 1 && (
                <div className="absolute top-12 left-[calc(100%_-_12px)] hidden h-[1px] w-6 bg-gradient-to-r from-white/[0.08] to-transparent lg:block z-0" />
              )}

              <Link href={step.href} className="block h-full">
                <Card hover padding="lg" className={`h-full flex flex-col justify-between border-white/[0.05] bg-gradient-to-b ${step.color} ${step.borderColor}`}>
                  <div>
                    {/* Number + icon */}
                    <div className="mb-6 flex items-start justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${step.iconBg}`}
                      >
                        <step.icon className={`h-5 w-5 ${step.iconColor}`} aria-hidden />
                      </div>
                      <span className="font-display text-4xl font-extrabold text-white/[0.04] select-none">
                        {step.number}
                      </span>
                    </div>

                    <h3 className="mb-2 font-display text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-slate-400">{step.description}</p>
                  </div>

                  <div className={`mt-6 flex items-center gap-1 text-xs font-bold ${step.iconColor} transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1`}>
                    Go to step
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
