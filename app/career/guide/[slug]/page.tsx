'use client';

import React, { useRef, useState, use } from 'react';
import Link from 'next/link';
import { getCareerGuideBySlug, careerGuides } from '@/data/career-guides';
import { notFound } from 'next/navigation';
import { motion, useInView } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

function StepCard({ step, index, color }: { step: { title: string; content: string; actionItem: string }; index: number; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.1 }}
      className="relative flex gap-6"
    >
      {/* Connector */}
      {index < 10 && (
        <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-brand/30 via-white/[0.04] to-transparent" />
      )}

      {/* Step number */}
      <motion.div
        animate={{ scale: hovered ? 1.15 : 1 }}
        transition={{ duration: 0.2 }}
        className="relative shrink-0 z-10 h-10 w-10 rounded-full border-2 border-brand/40 bg-background flex items-center justify-center text-sm font-black text-brand"
        style={{ boxShadow: hovered ? '0 0 24px rgba(255,107,53,0.4)' : undefined }}
      >
        {index + 1}
      </motion.div>

      {/* Card */}
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="flex-1 rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 mb-5 overflow-hidden relative"
        style={{ boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.1)' : '0 4px 16px rgba(0,0,0,0.15)' }}
      >
        <div className={`absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b ${color}`} />
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${color} pointer-events-none`}
          animate={{ opacity: hovered ? 0.03 : 0 }}
          transition={{ duration: 0.3 }}
        />

        <div className="relative z-10">
          <h3 className="text-lg font-bold text-foreground mb-3">{step.title}</h3>
          <p className="text-sm text-muted leading-relaxed mb-5">{step.content}</p>

          {/* Action item */}
          <div className="rounded-xl bg-brand/5 border border-brand/15 p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-5 w-5 rounded-full bg-brand/15 border border-brand/25 flex items-center justify-center">
                <svg className="w-2.5 h-2.5 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs font-bold text-brand uppercase tracking-wider">Action Item</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{step.actionItem}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function CareerGuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const guide = getCareerGuideBySlug(resolvedParams.slug);

  if (!guide) {
    notFound();
  }

  const totalSteps = guide.steps.length;

  return (
    <div className="min-h-screen pb-20">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-12 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className={`absolute -top-20 right-0 w-[500px] h-[400px] bg-gradient-to-br ${guide.color} opacity-[0.05] rounded-full blur-[100px]`} />
          <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-brand/[0.04] rounded-full blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex items-center gap-2 text-xs text-muted mb-8"
          >
            <Link href="/career" className="hover:text-foreground transition-colors">Career Hub</Link>
            <svg className="w-3 h-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-foreground/60 truncate max-w-[200px]">{guide.title}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
              className={`inline-flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br ${guide.color} text-5xl mb-8 shadow-2xl`}
              style={{ boxShadow: '0 24px 60px rgba(0,0,0,0.5)' }}
            >
              {guide.icon}
            </motion.div>

            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="inline-flex items-center rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand">
                Career Guide
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                ⏱ {guide.readingTime}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">
                {totalSteps} Steps
              </span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-foreground tracking-[-0.025em] leading-[0.95] mb-6">
              {guide.title}
            </h1>
            <p className="text-lg text-muted max-w-2xl mx-auto font-light leading-relaxed">{guide.description}</p>

            {/* Progress bar */}
            <div className="mt-10 max-w-sm mx-auto">
              <div className="flex justify-between text-[10px] text-muted uppercase tracking-widest font-bold mb-2">
                <span>Progress</span>
                <span>0 / {totalSteps} steps</span>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
                <div className="h-full w-0 rounded-full bg-gradient-to-r from-brand to-orange-400" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STEPS ───────────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 mb-2 text-[11px] font-bold uppercase tracking-widest text-brand">
            <span className="w-1.5 h-1.5 rounded-full bg-brand" />
            Step-by-Step Breakdown
          </div>
          <h2 className="text-2xl font-black text-foreground tracking-tight">Your action plan</h2>
        </div>

        <div className="relative">
          {guide.steps.map((step, i) => (
            <StepCard key={i} step={step} index={i} color={guide.color} />
          ))}
        </div>
      </section>

      {/* ── MISTAKES TO AVOID ───────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <MistakesCard mistakes={guide.commonMistakes} />
      </section>

      {/* ── FOOTER CTA ──────────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <GuideCTA guide={guide} />
      </section>
    </div>
  );
}

function MistakesCard({ mistakes }: { mistakes: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className="relative rounded-3xl border border-red-500/15 bg-red-500/[0.03] p-8 overflow-hidden"
      style={{ boxShadow: '0 8px 40px rgba(239,68,68,0.05)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-red-500/30 to-transparent" />
      <div className="absolute -right-8 -top-8 text-[100px] opacity-[0.04] select-none">⚠️</div>

      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-xl">
            ⚠️
          </div>
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-0.5">Common Pitfalls</div>
            <h2 className="text-lg font-black text-foreground">Critical Mistakes to Avoid</h2>
          </div>
        </div>

        <ul className="space-y-4">
          {mistakes.map((mistake, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, ease: EASE, delay: 0.1 + i * 0.08 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-red-500/[0.03] border border-red-500/[0.08]"
            >
              <div className="shrink-0 h-5 w-5 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mt-0.5">
                <svg className="w-2.5 h-2.5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <span className="text-sm text-foreground/75 leading-relaxed">{mistake}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function GuideCTA({ guide }: { guide: ReturnType<typeof getCareerGuideBySlug> }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  const otherGuides = careerGuides.filter(g => g.slug !== guide!.slug);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE }}
      className="space-y-6"
    >
      {/* Next guides */}
      {otherGuides.length > 0 && (
        <div className="rounded-3xl border border-white/[0.06] bg-white/[0.02] p-6">
          <div className="text-[10px] font-bold uppercase tracking-widest text-brand mb-4">More Career Guides</div>
          <div className="grid sm:grid-cols-2 gap-3">
            {otherGuides.map((g) => (
              <Link
                key={g.slug}
                href={`/career/guide/${g.slug}`}
                className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.02] p-4 hover:border-brand/20 hover:bg-white/[0.04] transition-all group"
              >
                <span className="text-2xl">{g.icon}</span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors truncate">{g.title}</p>
                  <p className="text-[11px] text-muted">{g.readingTime}</p>
                </div>
                <svg className="w-3.5 h-3.5 text-muted group-hover:text-brand group-hover:translate-x-1 transition-all shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back + Action */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center pt-4">
        <Link
          href="/career"
          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.03] px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-white/[0.07] transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
          Return to Career Hub
        </Link>
        <Link
          href="/syllabus"
          className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(255,107,53,0.35)] hover:bg-brand/90 transition-all duration-300"
        >
          Start the Full Program
        </Link>
      </div>
    </motion.div>
  );
}
