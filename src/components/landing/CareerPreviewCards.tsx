'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import type { Career } from '@/types/career';
import { formatSalary } from '@/lib/careers';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { CLUSTER_META } from '@/lib/careers';

interface CareerPreviewCardsProps {
  careers: Career[];
}

function CareerIcon({ iconName, className }: { iconName: string; className?: string }) {
  const Icon = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[iconName];
  if (!Icon) return null;
  return <Icon className={className} aria-hidden />;
}

export function CareerPreviewCards({ careers }: CareerPreviewCardsProps) {
  return (
    <motion.div
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      {careers.map((career) => {
        const clusterMeta = CLUSTER_META[career.cluster];
        return (
          <motion.div key={career.id} variants={staggerItem}>
            <Link
              href={`/quiz?career=${career.id}`}
              className="group block h-full rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 transition-all duration-300 hover:bg-white/[0.06] hover:border-white/[0.14] hover:shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:-translate-y-1"
            >
              {/* Icon + cluster badge */}
              <div className="mb-4 flex items-start justify-between">
                <div
                  className="flex h-12 w-12 items-center justify-center rounded-xl"
                  style={{ backgroundColor: `${career.color}18`, border: `1px solid ${career.color}30` }}
                >
                  <CareerIcon
                    iconName={career.iconName}
                    className="h-6 w-6"
                  />
                </div>
                <span
                  className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium"
                  style={{
                    backgroundColor: `${clusterMeta.color}15`,
                    color: clusterMeta.color,
                    border: `1px solid ${clusterMeta.color}30`,
                  }}
                >
                  <CareerIcon iconName={clusterMeta.iconName} className="h-3 w-3" />
                  {clusterMeta.label}
                </span>
              </div>

              {/* Title & description */}
              <h3 className="mb-2 font-semibold text-white group-hover:text-purple-200 transition-colors">
                {career.title}
              </h3>
              <p className="mb-4 text-sm leading-relaxed text-slate-500 line-clamp-2">
                {career.description}
              </p>

              {/* Salary + growth */}
              <div className="mb-4 flex items-center gap-4 text-xs text-slate-500">
                <span className="font-medium text-slate-300">
                  {formatSalary(career.salary.entry)}–{formatSalary(career.salary.senior)}
                </span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <TrendingUp className="h-3 w-3" aria-hidden />
                  {career.growthRate}
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {career.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-white/[0.06] px-2.5 py-0.5 text-xs text-slate-400"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Hover CTA */}
              <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
                Simulate this career
                <ArrowRight className="h-3 w-3" aria-hidden />
              </div>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
