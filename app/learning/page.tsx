'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { learningHubs, type LearningHub } from '@/data/learning-paths';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ── Stats Bar ────────────────────────────────────────────────────────────────
const stats = [
  { label: 'AI Courses', value: '5' },
  { label: 'Modules', value: '25+' },
  { label: 'Hands-On Projects', value: '20+' },
  { label: 'AI-Powered Tips', value: '∞' },
];

// ── Category pill colors ─────────────────────────────────────────────────────
const categoryStyle: Record<string, string> = {
  Path: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  Tool: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  Concept: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
};

function StatCounter({ value, label }: { value: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
      className="text-center px-8 py-6 relative group"
    >
      <div className="text-3xl sm:text-4xl font-black text-foreground tabular-nums tracking-tight">
        {value}
      </div>
      <div className="text-xs text-muted uppercase tracking-widest font-semibold mt-1">{label}</div>
    </motion.div>
  );
}

function HubCard({ hub, index }: { hub: LearningHub; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
    >
      <Link href={`/learning/${hub.slug}`} className="block group h-full">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ y: -6, scale: 1.01 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative h-full rounded-3xl border border-white/[0.03] bg-slate-950/20 backdrop-blur-2xl overflow-hidden cursor-pointer"
          style={{ boxShadow: hovered ? '0 32px 80px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,107,53,0.2)' : '0 8px 32px rgba(0,0,0,0.3)' }}
        >
          {/* Gradient shimmer overlay on hover */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br ${hub.color} pointer-events-none`}
            animate={{ opacity: hovered ? 0.08 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {/* Top accent bar */}
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${hub.color} opacity-40`} />

          <div className="relative z-10 p-8 flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-8">
              <motion.div
                animate={{ scale: hovered ? 1.08 : 1, rotate: hovered ? -3 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-950 border border-white/[0.06] text-3xl shadow-xl"
              >
                {hub.icon}
              </motion.div>
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${categoryStyle[hub.category]}`}>
                {hub.category}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mb-2">
                {hub.modules.length} modules
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3 leading-snug group-hover:text-brand transition-colors duration-300">
                {hub.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed line-clamp-3">
                {hub.subtitle}
              </p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-white/[0.05] flex items-center justify-between">
              <div className="flex -space-x-1">
                {hub.outcomes.slice(0, 3).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 w-6 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-[8px] text-muted"
                  >
                    {['✓', '✓', '✓'][i]}
                  </div>
                ))}
                {hub.outcomes.length > 3 && (
                  <div className="h-6 w-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center text-[8px] text-brand font-bold">
                    +{hub.outcomes.length - 3}
                  </div>
                )}
              </div>
              <motion.div
                className="flex items-center gap-1.5 text-xs font-semibold text-brand"
                animate={{ x: hovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                Explore
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

function FeaturedPathCard({ hub, index }: { hub: LearningHub; index: number }) {
  const [hovered, setHovered] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: index * 0.12 }}
    >
      <Link href={`/learning/${hub.slug}`} className="block group">
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ y: -5 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="relative rounded-[2rem] border border-white/[0.03] bg-slate-950/25 backdrop-blur-2xl overflow-hidden"
          style={{ boxShadow: hovered ? '0 40px 100px rgba(0,0,0,0.65), 0 0 0 1px rgba(255,107,53,0.25)' : '0 16px 48px rgba(0,0,0,0.35)' }}
        >
          {/* Giant background gradient */}
          <motion.div
            className={`absolute -right-20 -top-20 w-96 h-96 bg-gradient-to-br ${hub.color} rounded-full blur-3xl pointer-events-none`}
            animate={{ opacity: hovered ? 0.15 : 0.05 }}
            transition={{ duration: 0.5 }}
          />
          <div className={`absolute top-0 left-0 right-0 h-px bg-gradient-to-r ${hub.color} opacity-40`} />

          <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center p-8 sm:p-10 lg:p-12">
            {/* Icon */}
            <motion.div
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.3 }}
              className="flex h-24 w-24 shrink-0 items-center justify-center rounded-[1.5rem] bg-slate-950 border border-white/[0.06] text-5xl shadow-2xl"
            >
              {hub.icon}
            </motion.div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${categoryStyle[hub.category]}`}>
                  {hub.category}
                </span>
                <span className="text-[10px] text-muted uppercase tracking-widest font-semibold">
                  {hub.modules.length} Modules · Comprehensive
                </span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors duration-300 leading-tight">
                {hub.title}
              </h3>
              <p className="text-base text-muted max-w-2xl leading-relaxed">{hub.subtitle}</p>
              
              {/* Tool pills */}
              <div className="flex flex-wrap gap-2 mt-4">
                {[...new Set(hub.modules.flatMap(m => m.tools))].slice(0, 5).map((tool, i) => (
                  <span key={`${tool}-${i}`} className="inline-flex items-center rounded-full bg-white/[0.05] border border-white/[0.08] px-3 py-1 text-[11px] font-mono text-muted">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* CTA */}
            <motion.div
              animate={{ x: hovered ? 6 : 0 }}
              transition={{ duration: 0.25 }}
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-brand tracking-wide uppercase shrink-0 whitespace-nowrap"
            >
              Start Path
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </motion.div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}

// Slugs for the 5 main AI-powered course paths
const COURSE_PATH_SLUGS = ['ai-data-analytics', 'ai-digital-marketing', 'ai-data-science', 'ai-web-development', 'ai-graphic-design'];

export default function LearningIndexPage() {
  const coursePaths = learningHubs.filter(h => COURSE_PATH_SLUGS.includes(h.slug));
  const otherPaths = learningHubs.filter(h => h.category === 'Path' && !COURSE_PATH_SLUGS.includes(h.slug));
  const tools = learningHubs.filter(h => h.category === 'Tool');
  const concepts = learningHubs.filter(h => h.category === 'Concept');

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[70vh] flex flex-col items-center justify-center text-center overflow-hidden pt-12 pb-0"
      >
        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/10 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand/10 to-transparent rounded-full blur-[140px]" />
          <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-blue-500/[0.05] rounded-full blur-[120px] animate-pulse" />
          <div className="absolute top-1/3 right-1/4 w-[350px] h-[350px] bg-purple-500/[0.05] rounded-full blur-[100px]" />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
              backgroundSize: '70px 70px',
              maskImage: 'radial-gradient(ellipse 90% 70% at 50% 40%, black 40%, transparent 100%)',
            }}
          />
        </div>

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-8 shadow-inner"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
            The Ecosystem
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
            className="text-5xl sm:text-7xl lg:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-450 tracking-[-0.04em] leading-[0.92] mb-6"
          >
            Master Modern Skills.{' '}
            <span className="italic font-light bg-gradient-to-r from-brand via-orange-400 to-amber-300 bg-clip-text text-transparent">
              <br />Skip the busywork.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
            className="text-base sm:text-lg text-slate-450 max-w-2xl mx-auto font-light leading-relaxed mb-12"
          >
            Structured career roadmaps, deep-dive tool masterclasses, and modern AI workflows.
            Everything you need to become a high-impact data professional.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="#paths"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-brand to-orange-500 px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_40px_rgba(255,107,53,0.3)] hover:scale-105 transition-all duration-300 border-none"
            >
              Explore Paths
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              </svg>
            </Link>
            <Link
              href="/career-outcomes"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-8 py-3.5 text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/[0.06] hover:scale-105 transition-all duration-300"
            >
              View Career Outcomes
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="flex flex-col items-center gap-2"
          >
            <div className="w-px h-12 bg-gradient-to-b from-transparent via-border to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-muted/50" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── STATS BAR (Apple Bento Style Grid) ─────────────────────────────────── */}
      <section className="py-6 px-4 max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5, scale: 1.02 }}
              transition={{ duration: 0.5, cubicBezier: [0.25, 0.1, 0.25, 1], delay: 0.4 + i * 0.08 }}
              className="rounded-3xl border border-white/[0.03] bg-slate-950/20 backdrop-blur-2xl px-6 py-8 text-center relative group overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Inner ambient card glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              <div className="text-4xl sm:text-5xl font-black bg-gradient-to-b from-white to-slate-350 bg-clip-text text-transparent tracking-tight leading-none mb-2">
                {stat.value}
              </div>
              <div className="text-[9px] text-slate-500 uppercase tracking-widest font-extrabold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── AI-POWERED COURSE PATHS ─────────────────────────────────────────── */}
      <section id="paths" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-28 pb-8">
        <SectionHeader
          eyebrow="AI-Powered Courses"
          title="Choose your domain."
          subtitle="5 industry-ready AI-powered programs — each designed to get you hired."
          delay={0}
        />
        <div className="mt-12 grid gap-5">
          {coursePaths.map((hub, i) => (
            <FeaturedPathCard key={hub.slug} hub={hub} index={i} />
          ))}
        </div>
      </section>

      {/* ── TOOL MASTERCLASSES ────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-8">
        <SectionHeader
          eyebrow="Tool Masterclasses"
          title="Industry tools, mastered."
          subtitle="Deep dives into the most powerful tools data professionals use every day."
          delay={0}
          accentColor="text-blue-400"
          dotColor="bg-blue-400"
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {tools.map((hub, i) => (
            <HubCard key={hub.slug} hub={hub} index={i} />
          ))}
        </div>
      </section>

      {/* ── CONCEPTS ──────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-8">
        <SectionHeader
          eyebrow="AI & Core Concepts"
          title="Think like a 10x professional."
          subtitle="Advanced AI workflows and theoretical foundations that separate good from great."
          delay={0}
          accentColor="text-purple-400"
          dotColor="bg-purple-400"
        />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {concepts.map((hub, i) => (
            <HubCard key={hub.slug} hub={hub} index={i} />
          ))}
        </div>
      </section>

      {/* ── ADDITIONAL PATHS ──────────────────────────────────────────────────── */}
      {otherPaths.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-24 pb-8">
          <SectionHeader
            eyebrow="Getting Started"
            title="Absolute beginner?"
            subtitle="Start here with zero-prerequisite foundational paths."
            delay={0}
            accentColor="text-emerald-400"
            dotColor="bg-emerald-400"
          />
          <div className="mt-12 grid gap-5">
            {otherPaths.map((hub, i) => (
              <FeaturedPathCard key={hub.slug} hub={hub} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* ── BOTTOM CTA ────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto pt-28 pb-24">
        <BottomCTA />
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  subtitle,
  delay,
  accentColor = 'text-brand',
  dotColor = 'bg-brand',
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  delay: number;
  accentColor?: string;
  dotColor?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay }}
      className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
    >
      <div>
        <div className={`inline-flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-widest ${accentColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
          {eyebrow}
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-tight">{title}</h2>
      </div>
      <p className="text-sm text-muted max-w-sm leading-relaxed sm:text-right">{subtitle}</p>
    </motion.div>
  );
}

function BottomCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: EASE }}
      className="relative rounded-[2.5rem] border border-brand/20 bg-gradient-to-br from-brand/5 via-transparent to-purple-500/5 p-12 md:p-16 text-center overflow-hidden"
      style={{ boxShadow: '0 0 80px rgba(255,107,53,0.08), 0 32px 80px rgba(0,0,0,0.3)' }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand/10 rounded-full blur-[80px]" />
      </div>
      <div className="relative z-10">
        <div className="text-5xl mb-6">🚀</div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-4">
          Ready to transform your career?
        </h2>
        <p className="text-muted text-lg font-light max-w-xl mx-auto mb-10 leading-relaxed">
          Join thousands of professionals who upgraded their skills with AI-powered learning paths and landed high-paying roles.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/syllabus"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-10 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(255,107,53,0.4)] hover:bg-brand/90 hover:shadow-[0_0_60px_rgba(255,107,53,0.5)] transition-all duration-300"
          >
            Start Learning Free
          </Link>
          <Link
            href="/career-outcomes"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-10 py-4 text-base font-semibold text-foreground hover:bg-white/[0.08] transition-all duration-300"
          >
            See Career Outcomes
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
