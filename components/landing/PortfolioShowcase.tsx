'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, FadeUp } from '@/components/ui/motion';

export function PortfolioShowcase() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 bg-surface-2 border-y border-border/50 relative overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-center">
          
          {/* LEFT: Copy & Story */}
          <div className="space-y-8">
            <ScrollReveal>
              <Badge variant="outline" className="mb-4 border-emerald-500/30 text-emerald-600 dark:text-emerald-400">The Ultimate Proof</Badge>
              <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight leading-[1.15]">
                Employers don&apos;t read certificates. <br />
                <span className="italic font-light">They review portfolios.</span>
              </h2>
              <p className="text-lg text-muted mt-6 leading-relaxed">
                Our curriculum isn&apos;t about passing multiple-choice quizzes. It&apos;s about building a robust, interactive portfolio of real business projects that prove you can do the job on day one.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <div className="space-y-4 mt-8">
                {[
                  { icon: '📊', title: 'Interactive Power BI Dashboards', desc: 'Hosted live and linked on your resume.' },
                  { icon: '💻', title: 'Clean Python GitHub Repos', desc: 'Fully documented EDA and machine learning models.' },
                  { icon: '📝', title: 'Executive Summary Briefs', desc: 'Because translating data to business language is key.' }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl bg-surface border border-border/50 shadow-sm transition-colors hover:border-border">
                    <div className="h-12 w-12 shrink-0 rounded-xl bg-background border border-border flex items-center justify-center text-xl">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground text-sm sm:text-base">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-muted mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          {/* RIGHT: Bento Box Visuals */}
          <div className="relative h-[500px] sm:h-[600px] w-full">
            {/* Main Dashboard Preview */}
            <FadeUp delay={0.2} className="absolute inset-x-0 top-0 bottom-16 rounded-[2rem] border border-border bg-surface shadow-2xl overflow-hidden">
              <div className="h-12 border-b border-border/50 bg-background/50 flex items-center px-6 justify-between">
                <div className="flex gap-2">
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                  <div className="h-3 w-3 rounded-full bg-slate-300 dark:bg-slate-700" />
                </div>
                <div className="text-[10px] font-mono text-muted uppercase tracking-wider">Executive Sales Overview</div>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4 h-full">
                <div className="col-span-2 h-32 rounded-xl bg-gradient-to-r from-brand/10 to-transparent border border-brand/20 relative overflow-hidden">
                  <svg className="absolute bottom-0 w-full h-full text-brand opacity-50" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <path d="M0 40 L0 30 Q 10 20, 20 25 T 40 15 T 60 20 T 80 5 T 100 10 L 100 40 Z" fill="currentColor" />
                  </svg>
                </div>
                <div className="h-24 rounded-xl bg-background border border-border flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-brand/40 border-t-brand" />
                </div>
                <div className="h-24 rounded-xl bg-background border border-border flex items-center justify-center">
                  <div className="h-12 w-12 rounded-full border-4 border-emerald-500/40 border-t-emerald-500" />
                </div>
              </div>
            </FadeUp>

            {/* GitHub Repo Card Overlay */}
            <FadeUp delay={0.4} className="absolute -left-4 sm:-left-8 bottom-4 w-64 rounded-xl border border-border/80 bg-background/95 backdrop-blur-xl p-5 shadow-xl">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-xs">GH</div>
                <div>
                  <p className="text-xs font-bold text-foreground">customer-churn-model</p>
                  <p className="text-[10px] text-muted">Updated 2 days ago</p>
                </div>
              </div>
              <div className="flex gap-2 text-[10px] font-mono">
                <span className="flex items-center gap-1 text-muted"><span className="h-2 w-2 rounded-full bg-yellow-400" /> Jupyter</span>
                <span className="flex items-center gap-1 text-muted"><span className="h-2 w-2 rounded-full bg-blue-400" /> Python</span>
              </div>
            </FadeUp>

            {/* Certificate Overlay */}
            <FadeUp delay={0.6} className="absolute -right-4 sm:-right-8 bottom-12 w-48 rounded-xl border border-border/80 bg-surface/95 backdrop-blur-xl p-4 shadow-xl text-center">
              <div className="mx-auto h-10 w-10 mb-2 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-xl">🏆</div>
              <p className="text-xs font-bold text-foreground">Capstone Completed</p>
              <p className="text-[10px] text-muted mt-1">Verified Portfolio</p>
            </FadeUp>
          </div>

        </div>
      </div>
    </section>
  );
}
