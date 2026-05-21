import Link from 'next/link';
import { mainNav, siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800/70 bg-slate-950/95 px-4 py-14 text-slate-400 sm:px-6 lg:px-8">
      <div className="container grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4">
          <p className="text-lg font-semibold text-white">{siteConfig.name}</p>
          <p className="max-w-md text-sm leading-7 text-slate-500">{siteConfig.description}</p>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Explore</p>
          <div className="space-y-3">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="block transition hover:text-white">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">Connect</p>
          <div className="space-y-3">
            <Link href={siteConfig.links.github} className="block transition hover:text-white" target="_blank" rel="noreferrer">
              GitHub
            </Link>
            <Link href={siteConfig.links.twitter} className="block transition hover:text-white" target="_blank" rel="noreferrer">
              Twitter
            </Link>
          </div>
        </div>
      </div>

      <div className="container mt-12 border-t border-slate-800/70 pt-6 text-sm text-slate-500">
        <p>Built for future-ready analytics teams. © 2026 {siteConfig.name}.</p>
      </div>
    </footer>
  );
}
