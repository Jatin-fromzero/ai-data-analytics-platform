'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { mainNav } from '@/config/site';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isAuthenticated, user } = useAuth();

  // Scroll detection for floating pill effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isAuthPage = ['/login', '/signup', '/forgot-password'].includes(pathname);

  return (
    <>
      {/* 
        Header is strictly fixed to viewport. 
        It transforms into a floating glass pill on scroll. 
      */}
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-out',
          scrolled ? 'pt-4 px-4 sm:px-6' : 'pt-0 px-0'
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-16 items-center justify-between gap-4 transition-all duration-500',
            scrolled 
              ? 'max-w-5xl rounded-2xl border border-brand/20 bg-background/80 px-6 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.4),0_0_20px_rgba(255,107,53,0.1)]' 
              : 'container border-b border-border/70 bg-background/95 backdrop-blur-xl'
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-tight text-foreground group">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-sm text-foreground shadow-glow shrink-0 transition-transform group-hover:scale-105">AI</span>
            <span className={cn("transition-opacity duration-300", scrolled && "hidden sm:inline-block")}>AnalyticsHub</span>
          </Link>

          {/* Desktop nav */}
          {!isAuthPage && (
            <nav className="hidden items-center gap-6 lg:flex">
              {mainNav.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-foreground relative py-2',
                      isActive ? 'text-foreground' : 'text-muted'
                    )}
                  >
                    {item.title}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-3">
            <div className={cn("hidden transition-all duration-300", scrolled ? "sm:block" : "block")}>
              <ThemeToggle />
            </div>

            {isAuthPage ? (
              <Button asChild variant="secondary" size="sm" className="rounded-xl">
                <Link href="/">← Home</Link>
              </Button>
            ) : isAuthenticated ? (
              <Button asChild variant="secondary" size="sm" className="rounded-xl border border-border/50 bg-slate-800/50 hover:bg-slate-800 hover:border-slate-600">
                <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  {user?.role === 'admin' ? 'CEO Portal' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-xl hover:bg-slate-800/50">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="hidden sm:inline-flex rounded-xl shadow-glow">
                  <Link href="/signup">Get started</Link>
                </Button>
              </>
            )}

            {/* Hamburger — only on < lg */}
            {!isAuthPage && (
              <button
                onClick={() => setMobileOpen((v) => !v)}
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileOpen}
                className="flex lg:hidden h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-surface/80 transition-colors hover:bg-slate-800"
              >
                <motion.span
                  className="block h-[1.5px] w-4 bg-slate-300 origin-center"
                  animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
                <motion.span
                  className="block h-[1.5px] w-4 bg-slate-300"
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.15 }}
                />
                <motion.span
                  className="block h-[1.5px] w-4 bg-slate-300 origin-center"
                  animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.2 }}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Mobile menu panel ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileOpen(false)}
            />

            {/* Slide-down panel */}
            <motion.div
              key="panel"
              className={cn(
                "fixed left-0 right-0 z-[95] border-b border-border/70 bg-background/98 backdrop-blur-xl lg:hidden",
                scrolled ? "top-[88px] rounded-b-3xl border-t shadow-2xl" : "top-16"
              )}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <nav className="container flex flex-col gap-1 py-6">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center rounded-xl px-4 py-3.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand/10 text-brand'
                          : 'text-muted hover:bg-slate-800/60 hover:text-foreground'
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}

                {/* Auth CTAs */}
                <div className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-6">
                  {isAuthenticated ? (
                    <Button asChild variant="secondary" className="w-full h-11 rounded-xl">
                      <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                        {user?.role === 'admin' ? 'CEO Portal' : 'Dashboard'}
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="secondary" className="w-full h-11 rounded-xl">
                        <Link href="/login">Sign in</Link>
                      </Button>
                      <Button asChild className="w-full h-11 rounded-xl shadow-glow">
                        <Link href="/signup">Get started — free</Link>
                      </Button>
                    </>
                  )}
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
