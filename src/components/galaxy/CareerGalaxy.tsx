'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as d3 from 'd3';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Info, TrendingUp } from 'lucide-react';
import { CAREERS, CLUSTER_META, formatSalary } from '@/lib/careers';
import { useSimulationStore } from '@/store/simulationStore';
import type { CareerNode, CareerLink } from '@/types/career';
import { Card } from '@/components/ui/Card';

interface TooltipState {
  x: number;
  y: number;
  career: CareerNode | null;
}

interface CareerGalaxyProps {
  selectedCluster: string | null;
}

export function CareerGalaxy({ selectedCluster }: CareerGalaxyProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const { setCareer } = useSimulationStore();
  const [tooltip, setTooltip] = useState<TooltipState>({ x: 0, y: 0, career: null });

  useEffect(() => {
    if (!svgRef.current) return;

    const container = svgRef.current.parentElement;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.attr('width', width).attr('height', height);
    svg.selectAll('*').remove();

    // Defs: radial glows
    const defs = svg.append('defs');
    CAREERS.forEach((career) => {
      const filterId = `glow-${career.id}`;
      const filter = defs.append('filter').attr('id', filterId);
      filter.append('feGaussianBlur').attr('stdDeviation', '4').attr('result', 'coloredBlur');
      const feMerge = filter.append('feMerge');
      feMerge.append('feMergeNode').attr('in', 'coloredBlur');
      feMerge.append('feMergeNode').attr('in', 'SourceGraphic');
    });

    // Data Mapping
    const nodes: CareerNode[] = CAREERS.map((c) => ({ ...c }));
    const links: CareerLink[] = [];
    CAREERS.forEach((career) => {
      career.relatedTo.forEach((relId) => {
        if (career.id < relId) {
          links.push({ source: career.id, target: relId });
        }
      });
    });

    // D3 Simulation
    const simulation = d3
      .forceSimulation<CareerNode>(nodes)
      .force(
        'link',
        d3
          .forceLink<CareerNode, CareerLink>(links)
          .id((d) => d.id)
          .distance(width < 640 ? 100 : 130)
          .strength(0.35)
      )
      .force('charge', d3.forceManyBody().strength(width < 640 ? -200 : -350))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(width < 640 ? 32 : 45));

    const g = svg.append('g').attr('class', 'main-group');

    // Zoom Controls
    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 2.5])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });
    svg.call(zoom);

    // Links Rendering
    const link = g
      .append('g')
      .selectAll('line')
      .data(links)
      .join('line')
      .attr('stroke', 'rgba(255, 255, 255, 0.04)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '5 5');

    // Node Groups
    const node = g
      .append('g')
      .attr('class', 'nodes-group')
      .selectAll<SVGGElement, CareerNode>('g')
      .data(nodes)
      .join('g')
      .attr('class', 'node-element')
      .style('cursor', 'pointer')
      .call(
        d3
          .drag<SVGGElement, CareerNode>()
          .on('start', (event, d) => {
            if (!event.active) simulation.alphaTarget(0.2).restart();
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

    // Outer Glow Ring
    node
      .append('circle')
      .attr('r', 27)
      .attr('fill', 'none')
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1)
      .attr('opacity', 0.15);

    // Core Sphere
    node
      .append('circle')
      .attr('r', 20)
      .attr('fill', (d) => `${d.color}15`)
      .attr('stroke', (d) => d.color)
      .attr('stroke-width', 1.5)
      .attr('filter', (d) => `url(#glow-${d.id})`);

    // Text Label Under node
    node
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 36)
      .attr('fill', '#cbd5e1')
      .attr('font-size', 10)
      .attr('font-family', 'var(--font-space-grotesk), system-ui, sans-serif')
      .attr('font-weight', '600')
      .text((d) => d.title);

    // Interactivity Hover Handlers
    node
      .on('mouseenter', (event, d) => {
        const rect = svgRef.current!.getBoundingClientRect();
        setTooltip({ x: event.clientX - rect.left, y: event.clientY - rect.top, career: d });

        d3.select(event.currentTarget)
          .select('circle:last-of-type')
          .transition()
          .duration(150)
          .attr('r', 24)
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
          .attr('r', 20)
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

  // Apply visual opacity filter based on active cluster selection
  useEffect(() => {
    if (!svgRef.current) return;
    const svg = d3.select(svgRef.current);
    if (selectedCluster) {
      svg.selectAll('.node-element')
        .transition()
        .duration(200)
        .style('opacity', (d: any) => (d.cluster === selectedCluster ? 1 : 0.25));
    } else {
      svg.selectAll('.node-element')
        .transition()
        .duration(200)
        .style('opacity', 1);
    }
  }, [selectedCluster]);

  return (
    <>
      <svg
        ref={svgRef}
        className="absolute inset-0 h-full w-full z-10"
        aria-label="Interactive career galaxy network graph"
        role="img"
      />

      {/* Hover Tooltip Overlay */}
      <AnimatePresence>
        {tooltip.career && (
          <motion.div
            key={tooltip.career.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 w-64 pointer-events-none"
            style={{
              left: Math.min(tooltip.x + 16, (svgRef.current?.parentElement?.clientWidth ?? 800) - 272),
              top: Math.max(16, tooltip.y - 120),
            }}
          >
            <Card padding="md" className="border-white/10 shadow-2xl bg-void/90 backdrop-blur-xl">
              <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">
                {CLUSTER_META[tooltip.career.cluster].label}
              </span>
              <h4 className="mt-1 font-display font-extrabold text-sm text-white">{tooltip.career.title}</h4>
              <p className="mt-1 text-[11px] leading-relaxed text-slate-400 line-clamp-3">{tooltip.career.description}</p>
              
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.05] pt-3 text-[10px] font-bold text-slate-400">
                <span className="text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" aria-hidden />
                  {tooltip.career.growthRate}
                </span>
                <span>
                  {formatSalary(tooltip.career.salary.entry)}–{formatSalary(tooltip.career.salary.senior)}
                </span>
              </div>
              
              <div className="mt-3.5 flex items-center gap-1 text-[10px] font-extrabold text-accent">
                Click to Simulate
                <ArrowRight className="h-3 w-3" aria-hidden />
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating controls panel */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2 rounded-full border border-white/[0.05] bg-black/40 px-3.5 py-2 text-[10px] font-semibold text-slate-500 backdrop-blur-sm z-20 select-none">
        <Info className="h-3.5 w-3.5 text-slate-500" aria-hidden />
        Drag nodes to pan &middot; Scroll to zoom
      </div>
    </>
  );
}
