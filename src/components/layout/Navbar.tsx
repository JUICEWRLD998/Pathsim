'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Compass, Menu, X, Sparkles, LogOut, User as UserIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  
  const { user, isAuthenticated, logout } = useUserStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  // Nav links change based on authentication state
  const navLinks = isAuthenticated
    ? ([
        { href: '/dashboard', label: 'Overview' },
        { href: '/quiz', label: 'Spark Quiz' },
        { href: '/galaxy', label: 'Career Galaxy' },
        { href: '/roadmap', label: 'Roadmap' },
      ] as const)
    : ([
        { href: '/', label: 'Home' },
        { href: '/quiz', label: 'Spark Quiz' },
      ] as const);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-[#040812]/90 backdrop-blur-xl border-b border-white/[0.06]'
            : 'bg-transparent'
        )}
      >
        <nav
          className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6"
          aria-label="Primary navigation"
        >
          {/* Logo */}
          <Link
            href={isAuthenticated ? '/dashboard' : '/'}
            className="flex items-center gap-2.5 font-display font-bold text-white"
            aria-label="PathSim AI — home"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <Compass className="h-4 w-4 text-white" aria-hidden />
            </div>
            <span>
              Path<span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">Sim</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {navLinks.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-200',
                      active ? 'text-white' : 'text-slate-400 hover:text-slate-200'
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-pill"
                        className="absolute inset-0 rounded-full bg-white/[0.08] border border-white/[0.1]"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <span className="relative z-10">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* User Account / Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-4">
                {/* User profile identifier */}
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.05] bg-white/[0.02] text-xs font-semibold text-slate-300">
                  <UserIcon className="h-3.5 w-3.5 text-purple-400" />
                  <span>{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/10 transition-all cursor-pointer"
                  aria-label="Log out"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-semibold text-slate-400 hover:text-white px-4 py-2 transition-colors"
                >
                  Log In
                </Link>
                <Link href="/quiz" className="btn-premium-primary text-xs px-5 py-2">
                  <Sparkles className="h-3.5 w-3.5" aria-hidden />
                  Start Quiz
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            suppressHydrationWarning
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-40 border-b border-white/[0.08] bg-[#040812]/95 backdrop-blur-xl px-4 py-4 md:hidden"
          >
            <ul className="flex flex-col gap-1" role="list">
              {navLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      pathname === href
                        ? 'bg-purple-500/10 text-purple-300'
                        : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
              {isAuthenticated && user ? (
                <li className="mt-2 pt-4 border-t border-white/[0.06] flex items-center justify-between px-4">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <UserIcon className="h-3.5 w-3.5 text-purple-400" />
                    <span>{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-xs font-bold text-rose-400 hover:underline cursor-pointer"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Log Out</span>
                  </button>
                </li>
              ) : (
                <li className="mt-2 pt-2 border-t border-white/[0.06] space-y-2">
                  <Link
                    href="/login"
                    className="block text-center w-full py-2.5 text-sm font-semibold text-slate-400 hover:text-white"
                  >
                    Log In
                  </Link>
                  <Link
                    href="/quiz"
                    className="btn-premium-primary text-center block w-full py-2.5"
                  >
                    Start Quiz
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
