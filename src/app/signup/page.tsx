'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useUserStore } from '@/store/userStore';

export default function SignupPage() {
  const router = useRouter();
  const fetchUser = useUserStore((state) => state.fetchUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? 'Failed to sign up');
      }

      await fetchUser();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 min-h-[calc(100vh-4rem)] bg-void relative overflow-hidden">
      {/* Grid overlay */}
      <div className="pointer-events-none absolute inset-0 z-0 bg-grid-tech opacity-[0.25] [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />

      <div className="flex-1 flex flex-col md:flex-row max-w-6xl mx-auto w-full px-4 py-8 md:py-16 relative z-10 gap-8 items-center justify-center">
        {/* Left Side: Mockup / Branding */}
        <div className="flex-1 hidden md:flex flex-col justify-center text-left max-w-md">
          <div className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-cyan-400">
            <Sparkles className="h-4 w-4" aria-hidden />
            Interactive Learning
          </div>
          <h2 className="font-display text-3xl lg:text-4xl font-extrabold text-white leading-tight tracking-tight">
            Design Your Journey <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
              Start Free Today
            </span>
          </h2>
          <p className="mt-4 text-sm text-slate-400 leading-relaxed font-medium">
            Join thousands of high schoolers exploring realistic careers. Test drive occupations, make choices, and see their outcomes in a safe digital space.
          </p>

          {/* Feature list */}
          <div className="mt-8 space-y-4">
            {[
              'Comprehensive Spark personality assessment',
              'Database-backed profile saving and resumption',
              'Collaborative galaxy mapping',
              'Interactive scenario outcomes and scoring',
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i }}
                className="flex items-center gap-3 text-xs font-semibold text-slate-300"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-400">
                  ✓
                </div>
                {feature}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-full max-w-md relative">
          <div className="absolute -top-16 -left-16 h-48 w-48 bg-purple-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-16 -right-16 h-48 w-48 bg-cyan-500/10 rounded-full blur-3xl" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card padding="lg" className="border-white/[0.05] relative z-10">
              <div className="mb-8 text-center md:text-left">
                <Link href="/" className="inline-flex md:hidden items-center gap-2 font-display font-bold text-white mb-6">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
                    <Compass className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span>PathSim AI</span>
                </Link>
                <h1 className="font-display text-2xl font-bold text-white tracking-tight">
                  Create Your Account
                </h1>
                <p className="mt-1.5 text-xs text-slate-400">
                  Start your career simulation pathways today.
                </p>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-rose-500/20 bg-rose-500/5 p-3.5 text-xs font-semibold text-rose-400">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name field */}
                <div className="space-y-1.5">
                  <label htmlFor="name" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="name"
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                {/* Email field */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="email"
                      type="email"
                      required
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                {/* Password field */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Password (6+ chars)
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="password"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className="text-xs font-bold text-slate-400 uppercase tracking-wide">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                    <input
                      id="confirmPassword"
                      type="password"
                      required
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11 pl-10 pr-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:bg-white/[0.04] transition-all"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  loading={isLoading}
                  className="w-full mt-2 font-bold shadow-[0_0_20px_rgba(6,182,212,0.15)] btn-premium-primary"
                  icon={<ArrowRight className="h-4 w-4" />}
                  iconPosition="right"
                >
                  Sign Up
                </Button>
              </form>

              {/* Redirect to login */}
              <div className="mt-6 text-center text-xs text-slate-400">
                Already have an account?{' '}
                <Link href="/login" className="text-cyan-400 font-semibold hover:underline">
                  Log in here
                </Link>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
