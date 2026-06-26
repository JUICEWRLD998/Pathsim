import Link from 'next/link';
import { Compass, Github, Twitter } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-[#040812]">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <Compass className="h-3.5 w-3.5 text-white" aria-hidden />
            </div>
            <span>
              Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Sim</span> AI
            </span>
          </Link>

          {/* Links */}
          <nav aria-label="Footer navigation">
            <ul className="flex items-center gap-6 text-sm text-slate-500" role="list">
              <li>
                <Link href="/quiz" className="hover:text-slate-300 transition-colors">
                  Quiz
                </Link>
              </li>
              <li>
                <Link href="/galaxy" className="hover:text-slate-300 transition-colors">
                  Galaxy
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="hover:text-slate-300 transition-colors">
                  Roadmap
                </Link>
              </li>
            </ul>
          </nav>

          {/* Social */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/[0.05]"
              aria-label="GitHub"
            >
              <Github className="h-4 w-4" aria-hidden />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-600 hover:text-slate-300 transition-colors rounded-lg hover:bg-white/[0.05]"
              aria-label="Twitter"
            >
              <Twitter className="h-4 w-4" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-white/[0.04] pt-6 text-center text-xs text-slate-600">
          <p>
            &copy; {new Date().getFullYear()} PathSim AI — Youth Code x AI Hackathon &middot; Track 04 Career Planning
          </p>
        </div>
      </div>
    </footer>
  );
}
