'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { careerGuides, careerDomains, getGuidesByDomain, type CareerGuide } from '@/data/career-guides';
import { motion, useInView, AnimatePresence } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

const guideColorMap: Record<string, { accent: string; glow: string; badge: string }> = {
  // Analytics
  'analytics-resume': { accent: 'from-blue-500 to-indigo-600', glow: 'rgba(99,102,241,0.25)', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  'analytics-portfolio': { accent: 'from-slate-400 to-slate-700', glow: 'rgba(148,163,184,0.2)', badge: 'bg-slate-500/10 text-slate-300 border-slate-500/20' },
  'analytics-interview': { accent: 'from-emerald-500 to-teal-700', glow: 'rgba(52,211,153,0.2)', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  // Marketing
  'marketing-resume': { accent: 'from-pink-500 to-rose-600', glow: 'rgba(236,72,153,0.25)', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  'marketing-portfolio': { accent: 'from-fuchsia-500 to-pink-600', glow: 'rgba(217,70,239,0.2)', badge: 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/20' },
  'marketing-interview': { accent: 'from-rose-500 to-red-600', glow: 'rgba(244,63,94,0.2)', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  // Data Science
  'datascience-resume': { accent: 'from-violet-500 to-purple-700', glow: 'rgba(139,92,246,0.25)', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  'datascience-portfolio': { accent: 'from-indigo-500 to-violet-600', glow: 'rgba(99,102,241,0.2)', badge: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' },
  'datascience-interview': { accent: 'from-purple-600 to-indigo-700', glow: 'rgba(147,51,234,0.2)', badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
  // Web Dev
  'webdev-resume': { accent: 'from-emerald-500 to-teal-600', glow: 'rgba(16,185,129,0.25)', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  'webdev-portfolio': { accent: 'from-teal-500 to-cyan-600', glow: 'rgba(20,184,166,0.2)', badge: 'bg-teal-500/10 text-teal-400 border-teal-500/20' },
  'webdev-interview': { accent: 'from-green-500 to-emerald-600', glow: 'rgba(34,197,94,0.2)', badge: 'bg-green-500/10 text-green-400 border-green-500/20' },
  // Design
  'design-resume': { accent: 'from-amber-500 to-orange-600', glow: 'rgba(245,158,11,0.25)', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  'design-portfolio': { accent: 'from-orange-500 to-red-500', glow: 'rgba(249,115,22,0.2)', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
  'design-interview': { accent: 'from-yellow-500 to-amber-600', glow: 'rgba(234,179,8,0.2)', badge: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' },
};

function GuideCard({ guide, index }: { guide: CareerGuide; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });
  const [hovered, setHovered] = useState(false);
  const colors = guideColorMap[guide.slug] ?? { accent: 'from-brand to-orange-400', glow: 'rgba(255,107,53,0.2)', badge: 'bg-brand/10 text-brand border-brand/20' };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.65, ease: EASE, delay: index * 0.06 }}
      className="h-full"
    >
      <Link href={`/career/guide/${guide.slug}`} className="block group h-full">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ y: -8, scale: 1.015 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative h-full rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl overflow-hidden cursor-pointer"
          style={{
            boxShadow: hovered
              ? `0 40px 100px rgba(0,0,0,0.45), 0 0 0 1px ${colors.glow}`
              : '0 8px 32px rgba(0,0,0,0.2)',
          }}
        >
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${colors.accent} opacity-70`} />
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${colors.accent} pointer-events-none`}
            animate={{ opacity: hovered ? 0.05 : 0 }}
            transition={{ duration: 0.4 }}
          />

          <div className="relative z-10 p-7 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <motion.div
                animate={{ scale: hovered ? 1.1 : 1, rotate: hovered ? -5 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.05] border border-white/[0.08] text-2xl"
              >
                {guide.icon}
              </motion.div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${colors.badge}`}>
                  {guide.readingTime}
                </span>
                <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                  {guide.domain}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-2">
                {guide.steps.length} steps · {guide.commonMistakes.length} pitfalls covered
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-brand transition-colors duration-300 leading-snug">
                {guide.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">{guide.description}</p>
            </div>

            {/* Steps preview */}
            <div className="mt-5">
              <div className="flex gap-1.5">
                {guide.steps.map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ scaleX: hovered ? 1 : 0.7, opacity: hovered ? 1 : 0.4 }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                    className={`h-1 flex-1 rounded-full bg-gradient-to-r ${colors.accent}`}
                  />
                ))}
              </div>
            </div>

            {/* CTA */}
            <div className="mt-5 pt-4 border-t border-white/[0.05] flex items-center justify-between">
              <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">Career Guide</span>
              <motion.div
                className="flex items-center gap-1.5 text-xs font-bold text-brand"
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                Read Guide
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

export default function CareerHubPage() {
  const [activeDomain, setActiveDomain] = useState('all');
  const filteredGuides = getGuidesByDomain(activeDomain);

  return (
    <div className="min-h-screen">

      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section className="relative text-center pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-brand/[0.05] rounded-full blur-[120px]" />
          <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] bg-blue-500/[0.04] rounded-full blur-[80px]" />
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '80px 80px',
              maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)',
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand mb-8"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            Career Development
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="text-5xl sm:text-7xl font-black text-foreground tracking-[-0.03em] leading-[0.95] mb-6"
          >
            Get Hired
            <br />
            <span className="italic font-light text-muted/60">in Any Domain.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Actionable career guides for analytics, marketing, data science, web development, and design. Resume building, portfolio creation, and interview mastery — for every domain.
          </motion.p>

          {/* Quick stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { label: `${careerGuides.length} Guides`, icon: '📖' },
              { label: `${careerGuides.reduce((a, g) => a + g.steps.length, 0)} Action Steps`, icon: '✅' },
              { label: '5 Domains Covered', icon: '🎯' },
            ].map((badge) => (
              <span key={badge.label} className="inline-flex items-center gap-2 rounded-full border border-white/[0.06] bg-white/[0.03] px-4 py-2 text-sm text-muted">
                <span>{badge.icon}</span>
                <span className="font-medium text-foreground/70">{badge.label}</span>
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── DOMAIN FILTER TABS ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/[0.01] border border-white/[0.05] rounded-2xl max-w-4xl mx-auto"
        >
          {careerDomains.map((domain) => {
            const isActive = activeDomain === domain.key;
            return (
              <button
                key={domain.key}
                onClick={() => setActiveDomain(domain.key)}
                className="relative px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none"
                style={{ color: isActive ? '#050508' : '#94A3B8' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeCareerTab"
                    transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                    className="absolute inset-0 bg-brand rounded-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] z-0"
                  />
                )}
                <span className="relative z-10 flex items-center gap-1.5">
                  <span>{domain.icon}</span>
                  <span className="hidden sm:inline">{domain.label}</span>
                </span>
              </button>
            );
          })}
        </motion.div>
      </section>

      {/* ── GUIDES GRID ───────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDomain}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredGuides.map((guide, i) => (
              <GuideCard key={guide.slug} guide={guide} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>
      </section>

      {/* ── PRO CTA ───────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-3xl mx-auto pb-24">
        <ProCTA />
      </section>
    </div>
  );
}

function ProCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative rounded-[2.5rem] border border-brand/20 bg-gradient-to-br from-brand/5 via-transparent to-purple-500/5 p-10 md:p-12 text-center overflow-hidden"
      style={{ boxShadow: '0 0 80px rgba(255,107,53,0.1), 0 32px 80px rgba(0,0,0,0.4)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-64 bg-brand/10 rounded-full blur-[60px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 border border-brand/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
          Pro Feature
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mb-4">
          Need a personalized review?
        </h2>
        <p className="text-muted font-light max-w-xl mx-auto mb-8 leading-relaxed">
          Upgrade to Pro for 1-on-1 resume tear-downs and mock interviews with our elite AI Mentor — trained on thousands of successful job applications across all domains.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/syllabus"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-3.5 text-sm font-bold text-white shadow-[0_0_40px_rgba(255,107,53,0.4)] hover:bg-brand/90 transition-all duration-300"
          >
            Upgrade to Pro
          </Link>
          <Link
            href="/career-outcomes"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-8 py-3.5 text-sm font-semibold text-foreground hover:bg-white/[0.08] transition-all duration-300"
          >
            View Career Outcomes
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
