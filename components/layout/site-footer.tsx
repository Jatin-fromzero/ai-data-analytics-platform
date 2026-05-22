import Link from 'next/link';
import { mainNav, siteConfig } from '@/config/site';

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background/95 px-4 py-14 text-muted sm:px-6 lg:px-8">
      <div className="container grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div className="space-y-4 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm font-bold text-foreground shrink-0">
              AI
            </span>
            <p className="text-base font-semibold text-foreground">{siteConfig.name}</p>
          </div>
          <p className="max-w-sm text-sm leading-7 text-muted">{siteConfig.description}</p>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Explore</p>
          <div className="space-y-3">
            {mainNav.map((item) => (
              <Link key={item.href} href={item.href} className="block transition hover:text-foreground">
                {item.title}
              </Link>
            ))}
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-muted">Connect</p>
          <div className="space-y-3">
            <Link href={siteConfig.links.github} className="block transition hover:text-foreground" target="_blank" rel="noreferrer">
              GitHub
            </Link>
            <Link href={siteConfig.links.twitter} className="block transition hover:text-foreground" target="_blank" rel="noreferrer">
              Twitter
            </Link>
            <Link href="/contact" className="block transition hover:text-foreground">
              Contact us
            </Link>
          </div>
        </div>
      </div>

      <div className="container mt-12 flex flex-col gap-2 border-t border-border/70 pt-6 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 {siteConfig.name}. Built for future-ready analytics teams.</p>
        <div className="flex gap-4">
          <Link href="#" className="hover:text-muted transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-muted transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
