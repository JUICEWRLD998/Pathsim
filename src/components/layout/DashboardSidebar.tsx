'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LayoutDashboard, Gamepad2, Compass, Map, FileBarChart2, LogOut, User as UserIcon, X, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/store/userStore';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  activeKey: 'overview' | 'catalog' | 'galaxy' | 'roadmap' | 'report';
  children: React.ReactNode;
}

export function DashboardSidebar({ activeKey, children }: SidebarProps) {
  const router = useRouter();
  const { user, logout } = useUserStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
    router.refresh();
  };

  const menuItems = [
    { key: 'overview', label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
    { key: 'catalog', label: 'Simulation Catalog', href: '/dashboard?tab=catalog', icon: Gamepad2 },
    { key: 'galaxy', label: 'Career Galaxy', href: '/galaxy', icon: Compass },
    { key: 'roadmap', label: 'Personalized Roadmap', href: '/roadmap', icon: Map },
    { key: 'report', label: 'Latest Match Report', href: '/dashboard?tab=report', icon: FileBarChart2 },
  ] as const;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#030712] border-r border-white/[0.05] p-5 justify-between">
      <div>
        {/* Brand */}
        <div className="flex items-center gap-2.5 font-display font-bold text-white mb-8 px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
            <Compass className="h-4 w-4 text-white" />
          </div>
          <span>PathSim AI</span>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-1.5" aria-label="Dashboard navigation">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = activeKey === item.key;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200',
                  active
                    ? 'bg-purple-500/10 text-purple-300 border-l-2 border-purple-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.03]'
                )}
              >
                <Icon className={cn('h-4 w-4 shrink-0', active ? 'text-purple-400' : 'text-slate-500')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* User info & Logout */}
      {user && (
        <div className="border-t border-white/[0.05] pt-4 mt-6">
          <div className="flex items-center gap-3 px-2 mb-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <UserIcon className="h-4.5 w-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-200 truncate">{user.name}</p>
              <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-slate-500 hover:text-rose-400 hover:bg-rose-500/5 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex min-h-screen bg-void text-white">
      {/* Desktop Sidebar (Left side, fixed width) */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile top bar + navigation */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden flex h-14 items-center justify-between px-4 bg-[#030712] border-b border-white/[0.05]">
          <div className="flex items-center gap-2 font-display font-bold text-white">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500">
              <Compass className="h-3.5 w-3.5 text-white" />
            </div>
            <span>PathSim</span>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-slate-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </header>

        {/* Mobile menu modal drawer */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 bg-black z-30 md:hidden"
              />
              <motion.aside
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed inset-y-0 left-0 w-64 z-40 md:hidden"
              >
                {sidebarContent}
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 min-h-screen p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
