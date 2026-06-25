export default function Home() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-void px-4 text-center">
      {/* Glow blobs */}
      <div className="pointer-events-none absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-purple-600/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-cyan-600/20 blur-3xl" />

      <div className="relative z-10 max-w-3xl">
        <span className="mb-8 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300">
          🎮 AI Career Simulation · Youth Code x AI Hackathon
        </span>

        <h1 className="mb-6 font-display text-5xl font-extrabold leading-tight md:text-7xl">
          Play Your Future <span className="shimmer">Before You Choose It</span>
        </h1>

        <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-400">
          Foundation ready — design system, fonts, and tokens are live. The full
          experience lands in the next build phases.
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <button className="btn-primary text-lg">🚀 Start Simulation</button>
          <button className="rounded-full border border-purple-500/40 px-8 py-3 text-lg font-semibold text-purple-300 transition-all duration-200 hover:bg-purple-500/10">
            🌌 Explore Galaxy
          </button>
        </div>

        <div className="glass-card mx-auto mt-12 max-w-md p-6 text-left text-sm text-slate-300">
          <p className="mb-2 font-semibold gradient-text">Phase 1 complete</p>
          <ul className="space-y-1 text-slate-400">
            <li>✓ Next.js + TypeScript + Tailwind v4</li>
            <li>✓ framer-motion · zustand · d3 · lucide-react</li>
            <li>✓ Design system (colors, fonts, animations)</li>
            <li>✓ Folder structure + env scaffolding</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
