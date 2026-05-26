'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';
import { PageReveal, FadeUp, HoverCard } from '@/components/ui/motion';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <PageReveal>
      <div className="space-y-12 max-w-[1400px] mx-auto px-4 pb-20 mt-8">
        
        {/* ── WELCOME & CONTEXT (Linear-style Header) ──────────────────── */}
        <FadeUp>
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border/40 pb-8">
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-widest text-brand">Student Operating System</p>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                Welcome back, {user?.name?.split(' ')[0] || 'Analyst'}.
              </h1>
              <p className="text-sm text-muted font-medium">
                You are currently navigating <span className="text-foreground">Phase 2: SQL & Cloud Data Warehousing</span>.
              </p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="h-10 border border-border/50 bg-surface/50 font-medium hover:bg-surface">
                View Roadmap
              </Button>
              <Button size="sm" className="h-10 shadow-[0_0_20px_rgba(255,107,53,0.2)] bg-brand text-background hover:bg-brand/90 font-semibold px-6">
                Resume Module <span className="ml-2">→</span>
              </Button>
            </div>
          </header>
        </FadeUp>

        <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
          
          {/* ── MAIN WORKSPACE ────────────────────────────────────────────── */}
          <div className="space-y-8">
            
            {/* Active Module (Premium Progress Tracker) */}
            <FadeUp delay={0.1}>
              <Card className="p-8 border-border/40 bg-surface/20 hover:border-brand/30 transition-colors shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand/10 transition-colors duration-700" />
                
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted mb-1">Active Module</h2>
                      <h3 className="text-2xl font-bold text-foreground tracking-tight">Advanced SQL Window Functions</h3>
                    </div>
                    <div className="text-right">
                      <span className="text-3xl font-extrabold text-foreground tracking-tighter">64<span className="text-lg text-muted">%</span></span>
                    </div>
                  </div>
                  
                  {/* Premium Segmented Progress Bar */}
                  <div className="flex gap-1 h-3 w-full mb-6">
                    {[1, 2, 3, 4, 5].map((segment, i) => (
                      <div key={i} className="flex-1 rounded-full bg-slate-800 overflow-hidden relative">
                        {i < 3 && <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 1, delay: i * 0.1 }} className="h-full bg-brand" />}
                        {i === 3 && <motion.div initial={{ width: 0 }} animate={{ width: '40%' }} transition={{ duration: 1, delay: 0.3 }} className="h-full bg-brand relative"><div className="absolute right-0 top-0 bottom-0 w-2 bg-white/30 animate-pulse" /></motion.div>}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm font-medium">
                    <span className="flex items-center gap-2 text-muted"><div className="w-2 h-2 rounded-full bg-emerald-500" /> 3/5 Lessons Complete</span>
                    <span className="text-border">|</span>
                    <span className="text-muted">Est. time remaining: 45 mins</span>
                  </div>
                </div>
              </Card>
            </FadeUp>

            {/* Bento Workspace */}
            <FadeUp delay={0.2}>
              <div className="grid sm:grid-cols-2 gap-4">
                {/* Projects Bento */}
                <HoverCard>
                  <Card className="h-full p-6 border-border/40 bg-surface/20 flex flex-col justify-between group cursor-pointer hover:bg-surface/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 border border-border flex items-center justify-center text-xl shadow-sm">
                          🛒
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded border border-emerald-400/20">Active Capstone</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg tracking-tight group-hover:text-brand transition-colors">E-Commerce Funnel</h3>
                      <p className="text-xs text-muted mt-2 font-medium">BigQuery & Tableau</p>
                    </div>
                    <div className="mt-8 flex items-center text-xs font-semibold text-muted group-hover:text-foreground transition-colors uppercase tracking-wider">
                      Open Workspace <span className="ml-2">→</span>
                    </div>
                  </Card>
                </HoverCard>

                {/* Resources Bento */}
                <HoverCard>
                  <Card className="h-full p-6 border-border/40 bg-surface/20 flex flex-col justify-between group cursor-pointer hover:bg-surface/40 transition-colors">
                    <div>
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-10 w-10 rounded-xl bg-slate-800 border border-border flex items-center justify-center text-xl shadow-sm">
                          📚
                        </div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted bg-surface px-2 py-1 rounded border border-border/50">Reference</span>
                      </div>
                      <h3 className="font-semibold text-foreground text-lg tracking-tight group-hover:text-brand transition-colors">Saved Snippets</h3>
                      <p className="text-xs text-muted mt-2 font-medium">14 SQL & Python templates</p>
                    </div>
                    <div className="mt-8 flex items-center text-xs font-semibold text-muted group-hover:text-foreground transition-colors uppercase tracking-wider">
                      View Library <span className="ml-2">→</span>
                    </div>
                  </Card>
                </HoverCard>
              </div>
            </FadeUp>
          </div>

          {/* ── SIDEBAR SYSTEM ────────────────────────────────────────────── */}
          <div className="space-y-6">
            
            {/* AI Assistant Integration Widget */}
            <FadeUp delay={0.3}>
              <Card className="p-6 border-border/40 bg-gradient-to-b from-brand/5 to-transparent relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand/10 blur-[40px] rounded-full pointer-events-none" />
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-brand mb-6">Global AI Mentor</h3>
                
                <div className="flex items-start gap-4">
                  <div className="relative shrink-0">
                    <div className="h-12 w-12 rounded-full bg-surface border border-brand/20 flex items-center justify-center text-xl shadow-inner">
                      🤖
                    </div>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-emerald-500 border-2 border-background animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground leading-tight">I noticed you&apos;re learning Window Functions.</p>
                    <p className="text-xs text-muted mt-1 leading-relaxed">Want me to quiz you on `ROW_NUMBER()` vs `RANK()`?</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-brand/10">
                  <Button variant="ghost" className="w-full text-xs font-semibold border border-brand/20 text-brand hover:bg-brand/10 hover:text-brand transition-colors h-9">
                    Start AI Quiz
                  </Button>
                </div>
              </Card>
            </FadeUp>

            {/* Career Readiness Checklist */}
            <FadeUp delay={0.4}>
              <Card className="p-6 border-border/40 bg-surface/20">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted mb-6">Career Protocol</h3>
                <ul className="space-y-4">
                  {[
                    { text: 'Profile & Goals configuration', done: true },
                    { text: 'Complete Phase 1 Capstone', done: true },
                    { text: 'Deploy GitHub Portfolio', done: false },
                    { text: 'Schedule Mock Interview', done: false },
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border transition-colors ${item.done ? 'bg-brand border-brand' : 'border-border/60 bg-surface/50 group-hover:border-brand/50'}`}>
                        {item.done && <svg className="h-3 w-3 text-background" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className={`text-sm font-medium transition-colors ${item.done ? 'text-muted line-through decoration-muted/50' : 'text-foreground'}`}>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </FadeUp>
            
          </div>

        </div>
      </div>
    </PageReveal>
  );
}
