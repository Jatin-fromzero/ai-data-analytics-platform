'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { AdminNav } from '@/app/admin/AdminNav';
import { AdminHeader } from '@/app/admin/AdminHeader';
import { usePathname } from 'next/navigation';

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Close sidebar on route change for mobile
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-slate-200 font-sans selection:bg-brand/30 selection:text-brand">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Premium Sidebar Wrapper (Desktop + Mobile Drawer) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/5 bg-[#0F0F11]/90 backdrop-blur-2xl transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        <Link href="/admin" className="flex h-[72px] shrink-0 items-center gap-3 px-8 group">
          <div className="relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand/20 to-brand/5 border border-brand/20 shadow-[0_0_15px_rgba(255,107,53,0.15)] transition-transform group-hover:scale-105">
            <span className="h-2 w-2 rounded-full bg-brand shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
          </div>
          <span className="text-[15px] font-semibold text-white tracking-wide group-hover:text-brand transition-colors">Platform OS</span>
        </Link>
        <div className="flex-1 overflow-y-auto py-6 scrollbar-hide">
          <AdminNav />
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col lg:pl-[280px] transition-all duration-300 w-full min-w-0">
        <AdminHeader onMenuClick={() => setIsSidebarOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-10 lg:p-12 mx-auto w-full max-w-7xl relative overflow-x-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand/5 via-transparent to-transparent opacity-20 pointer-events-none" />
          <div className="relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
