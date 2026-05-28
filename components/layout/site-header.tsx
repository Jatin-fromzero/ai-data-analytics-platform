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
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { isAuthenticated, user } = useAuth();

  // Scroll detection for dynamic styling
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

  // Stagger variants for mobile links
  const containerVariants = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
        staggerChildren: 0.05,
        delayChildren: 0.05
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
        staggerChildren: 0.03,
        staggerDirection: -1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
    exit: { opacity: 0, y: -5, transition: { duration: 0.2 } }
  };

  return (
    <>
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-[100] transition-all duration-500 ease-out',
          scrolled ? 'pt-3 px-4 sm:px-6' : 'pt-0 px-0'
        )}
      >
        <div
          className={cn(
            'mx-auto flex h-16 items-center justify-between transition-all duration-500',
            scrolled 
              ? 'max-w-7xl rounded-full border border-slate-200/50 dark:border-white/[0.08] bg-white/70 dark:bg-[#07070E]/60 px-5 sm:px-6 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.12)] dark:shadow-[0_12px_45px_rgba(0,0,0,0.5)] gap-2' 
              : 'container border-b border-border/25 bg-background/40 backdrop-blur-md px-6 sm:px-8 gap-4'
          )}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight group shrink-0">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-brand to-orange-500 text-sm font-black text-white shadow-[0_4px_16px_rgba(255,107,53,0.35)] shrink-0 transition-all duration-300 group-hover:scale-105 group-hover:rotate-[3deg]">
              AI
              <span className="absolute inset-0 rounded-xl border border-white/25" />
            </span>
            <span className={cn(
              "font-black tracking-tight text-base bg-gradient-to-r from-foreground via-foreground/90 to-foreground/80 bg-clip-text text-transparent transition-all duration-300 whitespace-nowrap",
              scrolled && "hidden sm:inline-block"
            )}>
              AI Educare OS
            </span>
          </Link>

          {/* Desktop nav */}
          {!isAuthPage && (
            <nav 
              className="hidden items-center gap-0.5 lg:flex relative shrink-0"
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {mainNav.map((item, index) => {
                const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onMouseEnter={() => setHoveredIndex(index)}
                    className={cn(
                      'relative rounded-full px-3.5 py-2 text-[15px] font-semibold transition-colors duration-300 whitespace-nowrap',
                      isActive 
                        ? 'text-brand dark:text-brand' 
                        : 'text-foreground/70 dark:text-slate-300 hover:text-foreground dark:hover:text-white'
                    )}
                  >
                    {/* Sliding Hover Capsule Indicator */}
                    <AnimatePresence>
                      {hoveredIndex === index && (
                        <motion.span
                          layoutId="hoverPill"
                          className="absolute inset-0 -z-10 rounded-full bg-slate-200/50 dark:bg-white/[0.06] backdrop-blur-sm"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                        />
                      )}
                    </AnimatePresence>
                    
                    {/* Active Route Dot/Line */}
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0.5 left-4 right-4 h-[2px] bg-brand rounded-full"
                        initial={false}
                        transition={{ type: "spring", stiffness: 350, damping: 25 }}
                      />
                    )}
                    {item.title}
                  </Link>
                );
              })}
            </nav>
          )}

          {/* Right actions */}
          <div className="flex items-center gap-2 shrink-0">
            <div className={cn("hidden transition-all duration-300", scrolled ? "sm:block" : "block")}>
              <ThemeToggle />
            </div>

            {isAuthPage ? (
              <Button asChild variant="secondary" size="sm" className="rounded-xl font-semibold shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-transform">
                <Link href="/">← Home</Link>
              </Button>
            ) : isAuthenticated ? (
              <Button asChild variant="secondary" size="sm" className="rounded-xl border border-border/50 bg-slate-800/40 hover:bg-slate-800/70 hover:border-slate-600 text-white font-semibold shadow-sm hover:scale-[1.03] active:scale-[0.97] transition-transform">
                <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                  {user?.role === 'admin' ? 'CEO Portal' : 'Dashboard'}
                </Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex rounded-xl text-foreground/80 hover:text-foreground font-semibold hover:scale-[1.03] active:scale-[0.97] transition-transform">
                  <Link href="/login">Sign in</Link>
                </Button>
                <Button asChild size="sm" className="hidden sm:inline-flex rounded-xl shadow-[0_4px_16px_rgba(255,107,53,0.35)] bg-gradient-to-r from-brand to-orange-500 hover:from-brand-600 hover:to-orange-600 font-semibold text-white hover:scale-[1.03] active:scale-[0.97] transition-transform">
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
                className="flex lg:hidden h-9 w-9 flex-col items-center justify-center gap-1.5 rounded-xl border border-border bg-background/80 transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95"
              >
                <motion.span
                  className="block h-[1.5px] w-4 bg-foreground/80 dark:bg-slate-300 origin-center"
                  animate={mobileOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                />
                <motion.span
                  className="block h-[1.5px] w-4 bg-foreground/80 dark:bg-slate-300"
                  animate={mobileOpen ? { opacity: 0, scaleX: 0 } : { opacity: 1, scaleX: 1 }}
                  transition={{ duration: 0.18 }}
                />
                <motion.span
                  className="block h-[1.5px] w-4 bg-foreground/80 dark:bg-slate-300 origin-center"
                  animate={mobileOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Mobile menu panel */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              className="fixed inset-0 z-[90] bg-background/60 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              key="panel"
              variants={containerVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              className={cn(
                "fixed left-4 right-4 z-[95] overflow-hidden border border-border/80 bg-background/95 backdrop-blur-xl lg:hidden rounded-2xl shadow-2xl",
                scrolled ? "top-[80px]" : "top-20"
              )}
            >
              <nav className="flex flex-col gap-1.5 p-6">
                {mainNav.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                  return (
                    <motion.div key={item.href} variants={itemVariants}>
                      <Link
                        href={item.href}
                        className={cn(
                          'flex items-center rounded-xl px-4 py-3.5 text-base font-semibold transition-all duration-200 active:scale-[0.98]',
                          isActive
                            ? 'bg-brand/10 text-brand'
                            : 'text-foreground/75 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-foreground'
                        )}
                      >
                        {item.title}
                      </Link>
                    </motion.div>
                  );
                })}

                <motion.div 
                  variants={itemVariants}
                  className="mt-4 flex flex-col gap-3 border-t border-border/60 pt-6"
                >
                  {isAuthenticated ? (
                    <Button asChild variant="secondary" className="w-full h-11 rounded-xl font-semibold">
                      <Link href={user?.role === 'admin' ? '/admin' : '/dashboard'}>
                        {user?.role === 'admin' ? 'CEO Portal' : 'Dashboard'}
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button asChild variant="secondary" className="w-full h-11 rounded-xl font-semibold">
                        <Link href="/login">Sign in</Link>
                      </Button>
                      <Button asChild className="w-full h-11 rounded-xl shadow-[0_4px_16px_rgba(255,107,53,0.3)] bg-gradient-to-r from-brand to-orange-500 font-semibold text-white">
                        <Link href="/signup">Get started — free</Link>
                      </Button>
                    </>
                  )}
                </motion.div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

