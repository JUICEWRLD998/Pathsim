'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CLUSTER_META } from '@/lib/careers';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { CareerGalaxy } from '@/components/galaxy/CareerGalaxy';
import { fadeUp } from '@/lib/animations';

function StarField() {
  const stars = Array.from({ length: 60 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 1.5 + 0.5,
    delay: Math.random() * 4,
    duration: 3 + Math.random() * 4,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white animate-star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}

export default function GalaxyPage() {
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  return (
    <PageWrapper className="flex flex-1 flex-col pt-24 min-h-[calc(100vh-4rem)] relative">
      {/* Page Header and Legend Panel */}
      <div className="relative z-10 section-container pt-4 pb-6">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="font-display text-2xl font-bold sm:text-3xl text-white tracking-tight">
            Career Galaxy
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 font-semibold tracking-wide">
            Explore 12 interconnected professional domains. Drag to pan, scroll to zoom, click nodes to simulate.
          </p>
        </motion.div>

        {/* Legend buttons acting as filters */}
        <motion.div
          className="mt-6 flex flex-wrap gap-2.5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {Object.entries(CLUSTER_META).map(([key, meta]) => (
            <button
              key={key}
              onClick={() =>
                setSelectedCluster(selectedCluster === key ? null : key)
              }
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold cursor-pointer select-none transition-all duration-300 ${
                selectedCluster === key
                  ? 'border-white/20 bg-white/10 text-white'
                  : 'border-white/[0.05] bg-white/[0.02] text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
              style={selectedCluster === key ? { borderColor: `${meta.color}60` } : {}}
            >
              <div
                className="h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]"
                style={{ backgroundColor: meta.color, color: meta.color }}
              />
              {meta.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Force graph Canvas wrapper */}
      <div className="relative flex-1 overflow-hidden min-h-[550px] border-t border-white/[0.04] bg-[#02050d]">
        <StarField />
        <CareerGalaxy selectedCluster={selectedCluster} />
      </div>
    </PageWrapper>
  );
}
