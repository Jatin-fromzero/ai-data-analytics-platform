'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { getLearningHubBySlug, learningHubs, type LearningHub, type LearningModule } from '@/data/learning-paths';
import { notFound } from 'next/navigation';
import { motion, useInView } from 'framer-motion';
import { use } from 'react';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const difficultyConfig = {
  Beginner: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  Intermediate: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-400' },
  Advanced: { color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20', dot: 'bg-red-400' },
};

function ModuleCard({ mod, index, hub }: { mod: LearningModule; index: number; hub: LearningHub }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.08 }}
      className="relative flex gap-6"
    >
      {/* Timeline connector */}
      {index < 10 && (
        <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-brand/30 via-white/[0.04] to-transparent" />
      )}

      {/* Node */}
      <motion.div
        animate={{ scale: hovered ? 1.1 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative shrink-0 z-10 h-10 w-10 rounded-full border-2 border-brand/40 bg-background flex items-center justify-center text-sm font-black text-brand"
        style={{ boxShadow: hovered ? '0 0 20px rgba(255,107,53,0.4)' : undefined }}
      >
        {index + 1}
      </motion.div>

      {/* Card */}
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-5 transition-all duration-300"
        style={{ boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.35), 0 0 0 1px rgba(255,107,53,0.1)' : '0 4px 16px rgba(0,0,0,0.15)' }}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <h4 className="text-base font-bold text-foreground">{mod.title}</h4>
          <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
            {mod.duration}
          </span>
        </div>
        <p className="text-sm text-muted leading-relaxed mb-4">{mod.description}</p>
        <div className="flex flex-wrap gap-2">
          {mod.tools.map((tool) => (
            <span
              key={tool}
              className="inline-flex items-center rounded-lg bg-white/[0.04] border border-white/[0.06] px-2.5 py-1 text-[11px] font-mono text-muted/80"
            >
              {tool}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LearningHubPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const hub = getLearningHubBySlug(resolvedParams.slug);

  if (!hub) {
    notFound();
  }

  return (
    <div className="min-h-screen pb-20">

      {/* ── HERO SECTION ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16">
        {/* Background orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-[500px] h-[500px] bg-gradient-to-br ${hub.color} opacity-[0.06] rounded-full blur-[100px]`} />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-brand/[0.04] rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-2 text-xs text-muted mb-8"
          >
            <Link href="/learning" className="hover:text-foreground transition-colors">Learning Hubs</Link>
            <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-foreground/60">{hub.title}</span>
          </motion.nav>

          <div className="grid lg:grid-cols-[1fr_380px] gap-12 items-start">
            {/* Left: Hero content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: EASE }}
            >
              <div className="flex items-center gap-4 mb-8">
                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-br ${hub.color} text-4xl shadow-2xl`}
                  style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }}
                >
                  {hub.icon}
                </div>
                <div>
                  <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand">
                    {hub.category}
                  </span>
                  <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-1.5">
                    {hub.modules.length} Modules · {hub.projects.length} Projects
                  </div>
                </div>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-[-0.025em] leading-[1] mb-6">
                {hub.title}
              </h1>
              <h2 className="text-xl font-semibold text-foreground/70 mb-4 leading-snug">{hub.subtitle}</h2>
              <p className="text-base text-muted leading-relaxed max-w-2xl mb-8">{hub.description}</p>

              <div className="flex flex-wrap gap-4">
                <button className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(255,107,53,0.35)] hover:bg-brand/90 hover:shadow-[0_0_60px_rgba(255,107,53,0.45)] transition-all duration-300">
                  Start Learning Now
                </button>
                <button className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-white/[0.07] transition-all duration-300">
                  Save for Later
                </button>
              </div>
            </motion.div>

            {/* Right: Outcomes card */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
              className="relative rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-8"
              style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}
            >
              <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${hub.color} opacity-60`} />
              <h3 className="text-base font-bold text-foreground mb-6 flex items-center gap-2">
                <span className="text-brand">✦</span> You&apos;ll Be Able To
              </h3>
              <div className="space-y-3">
                {hub.outcomes.map((outcome, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.3 + i * 0.07 }}
                    className="flex items-start gap-3"
                  >
                    <div className="mt-0.5 shrink-0 h-5 w-5 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-foreground/80 leading-relaxed">{outcome}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── MAIN CONTENT ────────────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1fr_340px] gap-12 items-start">

          {/* LEFT: Curriculum */}
          <div className="space-y-16">

            {/* Curriculum */}
            <div>
              <SectionLabel eyebrow="Curriculum Roadmap" title="What you'll learn" />
              <div className="mt-8 relative">
                {hub.modules.map((mod, i) => (
                  <ModuleCard key={i} mod={mod} index={i} hub={hub} />
                ))}
              </div>
            </div>

            {/* AI Tips */}
            <div>
              <SectionLabel eyebrow="AI Mentor Tips" title="Work smarter" />
              <div className="mt-8 grid gap-4">
                {hub.aiTips.map((tip, i) => (
                  <TipCard key={i} tip={tip} index={i} />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Sidebar */}
          <div className="space-y-6 lg:sticky lg:top-24">

            {/* Projects */}
            <SidebarCard title="Hands-On Projects" eyebrow={`${hub.projects.length} Projects`}>
              <div className="space-y-4">
                {hub.projects.map((project, i) => {
                  const diff = difficultyConfig[project.difficulty];
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, ease: EASE, delay: 0.5 + i * 0.1 }}
                      className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-4"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
                        <span className={`text-[10px] font-bold uppercase tracking-widest ${diff.color}`}>
                          {project.difficulty}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm text-foreground mb-1">{project.title}</h4>
                      <p className="text-xs text-muted leading-relaxed">{project.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </SidebarCard>

            {/* AI Mentor */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
              className="relative rounded-3xl border border-brand/20 bg-gradient-to-br from-brand/5 via-transparent to-purple-500/5 p-6 overflow-hidden"
              style={{ boxShadow: '0 0 60px rgba(255,107,53,0.08), 0 16px 40px rgba(0,0,0,0.3)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
              <div className="absolute -right-6 -top-6 text-7xl opacity-[0.08] select-none">🤖</div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand">AI Mentor</span>
                </div>
                <h3 className="text-base font-bold text-foreground mb-5">Ask me anything about this path</h3>

                <div className="space-y-3 mb-6">
                  {hub.aiTips.slice(0, 2).map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="text-brand shrink-0 mt-0.5 text-sm">💡</span>
                      <p className="text-xs text-muted/90 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>

                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full rounded-2xl bg-brand px-6 py-3 text-sm font-bold text-white shadow-[0_0_30px_rgba(255,107,53,0.3)] hover:bg-brand/90 transition-all duration-300"
                >
                  Chat with Mentor
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </motion.div>

            {/* Other paths */}
            <SidebarCard title="More Learning Hubs" eyebrow="Keep exploring">
              <div className="space-y-3">
                {learningHubs
                  .filter(h => h.slug !== hub.slug)
                  .slice(0, 3)
                  .map((h, i) => (
                    <Link key={h.slug} href={`/learning/${h.slug}`} className="flex items-center gap-3 group">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.04] border border-white/[0.06] text-lg group-hover:border-brand/30 transition-colors">
                        {h.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors truncate">{h.title}</p>
                        <p className="text-[11px] text-muted">{h.modules.length} modules</p>
                      </div>
                      <svg className="w-3.5 h-3.5 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))}
              </div>
            </SidebarCard>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionLabel({ eyebrow, title }: { eyebrow: string; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE }}
    >
      <div className="inline-flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-brand">
        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
        {eyebrow}
      </div>
      <h2 className="text-2xl font-black text-foreground tracking-tight">{title}</h2>
    </motion.div>
  );
}

function TipCard({ tip, index }: { tip: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 16 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: EASE, delay: index * 0.1 }}
      className="flex items-start gap-4 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <div className="shrink-0 h-8 w-8 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center text-base">
        💡
      </div>
      <p className="text-sm text-muted leading-relaxed">{tip}</p>
    </motion.div>
  );
}

function SidebarCard({ title, eyebrow, children }: { title: string; eyebrow: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-1">{eyebrow}</div>
      <h3 className="text-sm font-bold text-foreground mb-5">{title}</h3>
      {children}
    </motion.div>
  );
}
