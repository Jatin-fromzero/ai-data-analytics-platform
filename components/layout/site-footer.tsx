import Link from 'next/link';
import { siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/70 bg-slate-950/95 px-4 py-10 text-slate-400 sm:px-6 lg:px-8">
      <div className="container grid gap-6 md:flex md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-100">{siteConfig.name}</p>
          <p className="mt-2 text-sm text-slate-500">{siteConfig.description}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <Link href="/courses" className="transition hover:text-white">
            Courses
          </Link>
          <Link href="/career" className="transition hover:text-white">
            Career
          </Link>
          <Link href="/dashboard" className="transition hover:text-white">
            Dashboard
          </Link>
        </div>
      </div>
      <div className="container mt-8 border-t border-slate-800/70 pt-6 text-sm text-slate-500">
        <p>Built for future-ready analytics teams. © 2026 {siteConfig.name}.</p>
      </div>
    </footer>
  );
}
