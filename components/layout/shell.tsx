'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
  const pathname = usePathname();

  // If we are inside the Admin, Dashboard, Auth panels, or course lessons, bypass marketing layouts to render full screen
  const isDashboardOrAdmin = pathname ? (
    pathname.startsWith('/admin') || 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/courses') ||
    pathname.includes('/lesson/') ||
    ['/login', '/signup', '/forgot-password'].includes(pathname)
  ) : false;

  if (isDashboardOrAdmin) {
    return (
      <div className="min-h-screen bg-[#07070E] text-slate-100 flex flex-col">
        <LoadingScreen />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[var(--bg)] text-[var(--text)]">
      <LoadingScreen />
      <SiteHeader />
      {/* 
        Add pt-20 to ensure content isn't hidden behind the fixed header. 
        Main takes up remaining vertical space so footer is pushed down.
      */}
      <main className="flex-1 container pt-24 pb-10 lg:pt-32 lg:pb-14">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
