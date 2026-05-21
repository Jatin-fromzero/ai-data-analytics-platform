'use client';

import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { mainNav } from '@/config/site';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/70 bg-slate-950/95 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-brand text-white shadow-glow">AI</span>
          <span>AnalyticsHub</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {mainNav.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
              {item.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild size="sm">
            <Link href="/courses">Browse</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
