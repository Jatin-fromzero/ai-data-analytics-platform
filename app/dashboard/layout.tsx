'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { 
  LayoutDashboard, 
  BookOpen, 
  Briefcase, 
  Sparkles, 
  FolderHeart, 
  LogOut, 
  Menu,
  BrainCircuit,
  Compass,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigation = [
    { name: 'My Path', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Syllabus', href: '/dashboard/syllabus', icon: BookOpen },
    { name: 'Projects', href: '/dashboard/projects', icon: Briefcase },
    { name: 'AI Mentor', href: '/learning', icon: Sparkles }, // AI Mentor learning portal
    { name: 'Saved Snippets', href: '/learning/saved', icon: FolderHeart },
  ];

  return (
    <ProtectedRoute allowedRoles={['user']}>
      <div className="flex min-h-screen bg-[#07070E] text-slate-100 font-sans">
        
        {/* ── LEFT SIDEBAR (Apple Glassmorphism style) ──────────────────── */}
        <aside className="hidden lg:flex w-64 flex-col border-r border-white/[0.04] bg-[#0A0A0F]/80 backdrop-blur-2xl p-6 justify-between fixed h-screen z-30">
          
          <div className="space-y-8">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground group">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-foreground shadow-[0_0_15px_rgba(255,107,53,0.3)] shrink-0 transition-transform group-hover:scale-105">AI</span>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-tight text-slate-100">Educare OS</span>
                <span className="text-[10px] font-medium tracking-[0.2em] text-brand uppercase">Operating System</span>
              </div>
            </Link>

            {/* Nav Group */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-500 px-3 mb-2">Learning Hub</p>
              {navigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group duration-200",
                      isActive 
                        ? "bg-brand/10 text-brand border border-brand/20 shadow-[0_0_15px_rgba(255,107,53,0.05)]" 
                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]"
                    )}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 transition-transform group-hover:scale-110",
                      isActive ? "text-brand" : "text-slate-400"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User profile tag & Logout */}
          <div className="border-t border-white/[0.04] pt-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-slate-800 border border-white/10 overflow-hidden shrink-0">
                {user?.avatar && (
                  <Image 
                    src={user.avatar} 
                    alt="Avatar" 
                    width={36} 
                    height={36} 
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200 truncate">{user?.name}</p>
                <p className="text-[10px] text-brand/80 font-medium truncate capitalize">
                  {user?.role === 'demo_user' ? 'Demo Student' : 'Data Analyst'}
                </p>
              </div>
            </div>

            <button 
              onClick={logout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all group border border-transparent hover:border-red-500/10"
            >
              <LogOut className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
              Sign out
            </button>
          </div>

        </aside>

        {/* ── MAIN SCREEN CANVAS ────────────────────────────────────────── */}
        <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
          {/* Top header on mobile / breadcrumbs on desktop */}
          <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.03] bg-[#07070E]/80 px-6 backdrop-blur-xl lg:px-8">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-brand" />
              <span className="text-xs font-semibold tracking-wider uppercase text-slate-400">Student Portal</span>
              <span className="text-xs text-slate-600">/</span>
              <span className="text-xs font-medium text-slate-200">
                {pathname === '/dashboard' ? 'My Workspace' : pathname.replace('/', '')}
              </span>
            </div>
            
            <div className="flex items-center gap-4 lg:hidden">
              <button 
                onClick={logout}
                className="text-xs font-medium text-slate-400 hover:text-foreground"
              >
                Sign out
              </button>
            </div>
          </header>

          <main className="flex-1 p-6 lg:p-8">
            {children}
          </main>
        </div>

      </div>
    </ProtectedRoute>
  );
}
