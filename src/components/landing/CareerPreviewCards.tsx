'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, TrendingUp } from 'lucide-react';
import type { Career } from '@/types/career';
import { formatSalary } from '@/lib/careers';
import { staggerContainer, staggerItem } from '@/lib/animations';
import { CLUSTER_META } from '@/lib/careers';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface CareerPreviewCardsProps {
  careers: Career[];
}

function CareerIcon({ iconName, className, style }: { iconName: string; className?: string; style?: React.CSSProperties }) {
  const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>>)[iconName];
  if (!Icon) return null;
  return <Icon className={className} style={style} aria-hidden />;
}

export function CareerPreviewCards({ careers }: CareerPreviewCardsProps) {
  return (
    <motion.div
      className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-50px' }}
    >
      {careers.map((career) => {
        const clusterMeta = CLUSTER_META[career.cluster];
        return (
          <motion.div key={career.id} variants={staggerItem} className="h-full">
            <Link href={`/quiz?career=${career.id}`} className="block h-full group">
              <Card hover padding="lg" className="h-full flex flex-col justify-between border-white/[0.05] hover:border-purple-500/30">
                <div>
                  {/* Icon + Cluster Badge */}
                  <div className="mb-6 flex items-center justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl transition-colors duration-300 group-hover:bg-purple-500/10"
                      style={{ backgroundColor: `${career.color}10`, border: `1px solid ${career.color}25` }}
                    >
                      <CareerIcon
                        iconName={career.iconName}
                        className="h-5 w-5"
                        style={{ color: career.color }}
                      />
                    </div>
                    <Badge
                      variant="muted"
                      className="transition-colors font-semibold"
                      style={{
                        backgroundColor: `${clusterMeta.color}08`,
                        color: clusterMeta.color,
                        borderColor: `${clusterMeta.color}20`,
                      }}
                      icon={<CareerIcon iconName={clusterMeta.iconName} className="h-3 w-3 mr-1" />}
                    >
                      {clusterMeta.label}
                    </Badge>
                  </div>

                  {/* Title & Description */}
                  <h3 className="mb-2 font-display text-lg font-bold text-white transition-colors group-hover:text-purple-300">
                    {career.title}
                  </h3>
                  <p className="mb-6 text-xs leading-relaxed text-slate-400 line-clamp-3">
                    {career.description}
                  </p>
                </div>

                <div>
                  {/* Salary + Growth */}
                  <div className="mb-5 flex items-center gap-4 text-xs font-semibold text-slate-400">
                    <span className="text-white">
                      {formatSalary(career.salary.entry)}–{formatSalary(career.salary.senior)}
                    </span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <TrendingUp className="h-3.5 w-3.5" aria-hidden />
                      {career.growthRate}
                    </span>
                  </div>

                  {/* Skills Section */}
                  <div className="flex flex-wrap gap-1.5 pt-4 border-t border-white/[0.04]">
                    {career.skills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 uppercase tracking-wider"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Hover Call-To-Action */}
                  <div className="mt-5 flex items-center gap-1 text-xs font-bold text-accent transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:translate-x-1">
                    Simulate Career
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </div>
                </div>
              </Card>
            </Link>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
