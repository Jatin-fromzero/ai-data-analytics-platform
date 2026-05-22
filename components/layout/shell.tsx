import { ReactNode } from 'react';
import { SiteFooter } from './site-footer';
import { SiteHeader } from './site-header';
import { LoadingScreen } from '@/components/ui/LoadingScreen';

interface ShellProps {
  children: ReactNode;
}

export function Shell({ children }: ShellProps) {
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
