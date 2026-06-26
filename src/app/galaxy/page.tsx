'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Info, TrendingUp } from 'lucide-react';
import { CAREERS, CLUSTER_META, formatSalary } from '@/lib/careers';
import { useSimulationStore } from '@/store/simulationStore';
import type { CareerNode, CareerLink } from '@/types/career';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { Badge } from '@/components/ui/Badge';
import { fadeUp } from '@/lib/animations';

interface TooltipState {
  x: number;
  y: number;
  career: CareerNode | null;
}

function StarField() {
  const stars = Array.from({ length: 80 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
    duration: 2 + Math.random() * 3,
  }));

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
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
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const { setCareer } = useSimulationStore();
  const [tooltip, setTooltip] = useState<TooltipState>({ x: 0, y: 0, career: null });
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    // Defs: glow filters
    const defs = svg.append('defs');
    CAREERS.forEach((career) => {
      const filterId = `glow-${career.id}`;
      const filter = defs.append('filter').attr('id', filterId);
      filter.append('feGaussianBlur').attr('stdDeviation', '3').attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Data
    const nodes: CareerNode[] = CAREERS.map((c) => ({ ...c }));
    const links: CareerLink[] = [];
    CAREERS.forEach((career) => {
      career.relatedTo.forEach((relId) => {
        if (career.id < relId) {
          links.push({ source: career.id, target: relId });
        }
      });
    });

    // Simulation
    const simulation = d3
      .forceSimulation<CareerNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<CareerNode, CareerLink>(links)
          .id((d) => d.id)
          .distance(120)
          .strength(0.4)
      )
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(40));

    const g = svg.append('g');

    // Zoom
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 3])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Links
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255,255,255,0.06)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4 4');

    // Node groups
    const node = g
      .append('g')
      .selectAll<SVGGElement, CareerNode>('g')
      .data(nodes)
      .join('g')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, CareerNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
          })
          .on('drag', (event, d) => {
            d.fx = event.x;
            d.fy = event.y;
          })
          .on('end', (event, d) => {
            if (!event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
          })
      );

    // Outer glow ring
    node
      .append('circle')
      .attr('r', 28)
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1)
      .attr('opacity', 0.2);

    // Main circle
    node
      .append('circle')
      .attr('r', 22)
      .attr('fill', (d) => `${d.color}22`)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.5)
      .attr('filter', (d) => `url(#glow-${d.id})`);

    // Labels
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 38)
      .attr('fill', '#94a3b8')
      .attr('font-size', 10)
      .attr('font-family', 'Inter, system-ui, sans-serif')
      .attr('font-weight', '500')
      .text((d) => d.title);

    // Hover interactions
    node
      .on('mouseenter', (event, d) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top, career: d });

        d3.select(event.currentTarget)
          .select('circle:last-of-type')
          .transition()
          .duration(150)
          .attr('r', 27)
          .attr('stroke-width', 2.5);
      })
      .on('mousemove', (event) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip((prev) => ({
          ...prev,
          x: event.clientX - rect.left,
          y: event.clientY - rect.top,
        }));
      })
      .on('mouseleave', (event) => {
        setTooltip({ x: 0, y: 0, career: null });
        d3.select(event.currentTarget)
          .select('circle:last-of-type')
          .transition()
          .duration(200)
          .attr('r', 22)
          .attr('stroke-width', 1.5);
      })
      .on('click', (_, d) => {
        setCareer(d);
        router.push('/simulation');
      });

    simulation.on('tick', () => {
      link
        .attr('x1', (d) => (d.source as CareerNode).x!)
        .attr('y1', (d) => (d.source as CareerNode).y!)
        .attr('x2', (d) => (d.target as CareerNode).x!)
        .attr('y2', (d) => (d.target as CareerNode).y!);

      node.attr('transform', (d) => `translate(${d.x},${d.y})`);
    });

    return () => {
      simulation.stop();
    };
  }, [router, setCareer]);

  return (
    <PageWrapper className="flex flex-1 flex-col pt-16">
      {/* Header */}
      <div className="relative z-10 section-container py-8">
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
        >
          <h1 className="font-display text-2xl font-bold sm:text-3xl">
            Career Galaxy
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Explore 12 interconnected careers. Click any node to start a simulation.
          </p>
        </motion.div>

        {/* Cluster legend */}
        <motion.div
          className="mt-4 flex flex-wrap gap-2"
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
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-all duration-200 ${
                selectedCluster === key
                  ? 'border-white/20 bg-white/10 text-white'
                  : 'border-white/[0.06] bg-white/[0.02] text-slate-400 hover:text-slate-200'
              }`}
              style={selectedCluster === key ? { borderColor: `${meta.color}60` } : {}}
            >
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              {meta.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Graph */}
      <div className="relative flex-1 overflow-hidden">
        <StarField />
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
          aria-label="Interactive career galaxy graph"
          role="img"
        />

        {/* Tooltip */}
        <AnimatePresence>
          {tooltip.career && (
            <motion.div
              key={tooltip.career.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="pointer-events-none absolute z-20 w-56 rounded-xl border border-white/[0.1] bg-[#080f1e]/90 backdrop-blur-xl p-4 shadow-xl"
              style={{
                left: Math.min(tooltip.x + 16, (svgRef.current?.parentElement?.clientWidth ?? 800) - 240),
                top: Math.max(0, tooltip.y - 80),
              }}
            >
              <p className="mb-0.5 font-semibold text-white text-sm">{tooltip.career.title}</p>
              <p className="mb-3 text-xs text-slate-400 line-clamp-2">{tooltip.career.description}</p>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" aria-hidden />
                  {tooltip.career.growthRate}
                </span>
                <span>
                  {formatSalary(tooltip.career.salary.entry)}–{formatSalary(tooltip.career.salary.senior)}
                </span>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs font-medium text-purple-400">
                Click to simulate
                <ArrowRight className="h-3 w-3" aria-hidden />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls hint */}
        <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-black/30 px-3 py-1.5 text-xs text-slate-600 backdrop-blur-sm">
          <Info className="h-3 w-3" aria-hidden />
          Scroll to zoom · Drag to pan
        </div>
      </div>
    </PageWrapper>
  );
}
