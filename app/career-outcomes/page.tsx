'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useInView, useScroll, useTransform, AnimatePresence } from 'framer-motion';

const EASE = [0.25, 0.1, 0.25, 1] as const;

// ── Course tabs ──────────────────────────────────────────────────────────────
const courseTabs = [
  { key: 'analytics', label: 'Data Analytics', icon: '📊' },
  { key: 'marketing', label: 'Digital Marketing', icon: '📢' },
  { key: 'datascience', label: 'Data Science', icon: '🧬' },
  { key: 'webdev', label: 'Web Development', icon: '💻' },
  { key: 'design', label: 'Graphic Design', icon: '🎨' },
];

// ── Per-course data ──────────────────────────────────────────────────────────
type CourseKey = 'analytics' | 'marketing' | 'datascience' | 'webdev' | 'design';

interface SalaryTier {
  level: string;
  role: string;
  desc: string;
  salary: string;
  range: string;
  highlight: boolean;
  icon: string;
  gradient: string;
  border: string;
  width: string;
}

interface JourneyPhase {
  phase: string;
  title: string;
  desc: string;
  icon: string;
  time: string;
  color: string;
}

interface ProductivityItem {
  task: string;
  manual: string;
  ai: string;
  multiplier: string;
}

interface HighlightStat {
  value: string;
  label: string;
  sub: string;
}

interface CourseData {
  salaryTiers: SalaryTier[];
  journey: JourneyPhase[];
  productivity: ProductivityItem[];
  highlights: HighlightStat[];
}

const courseData: Record<CourseKey, CourseData> = {
  analytics: {
    highlights: [
      { value: '16', label: 'Weeks', sub: 'structured program' },
      { value: '4', label: 'Projects', sub: 'portfolio-ready' },
      { value: '10x', label: 'Faster', sub: 'with AI workflows' },
      { value: '$90K+', label: 'Target', sub: 'average salary' },
    ],
    salaryTiers: [
      { level: 'Entry Level', role: 'Junior Data Analyst', desc: 'Focuses on reporting, simple SQL queries, and Excel data cleaning.', salary: '$65K', range: '— $85K', highlight: false, icon: '📊', gradient: 'from-slate-500/10 to-slate-600/5', border: 'border-white/[0.05]', width: '55%' },
      { level: 'Our Target', role: 'AI-Augmented Analyst', desc: 'Leverages Copilot, dbt, and Python to automate reporting 10x faster.', salary: '$90K', range: '— $120K', highlight: true, icon: '🚀', gradient: 'from-brand/10 to-orange-400/5', border: 'border-brand/20', width: '80%' },
      { level: 'Senior Level', role: 'Analytics Engineer', desc: 'Architects cloud data warehouses and manages enterprise BI systems.', salary: '$125K', range: '— $160K+', highlight: false, icon: '⚡', gradient: 'from-blue-500/10 to-blue-600/5', border: 'border-white/[0.05]', width: '100%' },
    ],
    journey: [
      { phase: 'Phase 1', title: 'Stop guessing. Start querying.', desc: 'Master SQL and Excel — the non-negotiable core of all data roles.', icon: '🏗️', time: 'Weeks 1–3', color: 'from-blue-500 to-cyan-400' },
      { phase: 'Phase 2', title: 'Make data impossible to ignore.', desc: 'Build stunning interactive dashboards with Tableau and Power BI.', icon: '🎨', time: 'Weeks 4–6', color: 'from-purple-500 to-pink-400' },
      { phase: 'Phase 3', title: 'Work 10x faster.', desc: 'Write 10 lines of Python to clean 1M rows in 3 seconds.', icon: '⚡', time: 'Weeks 7–10', color: 'from-yellow-400 to-orange-500' },
      { phase: 'Phase 4', title: 'Your AI secret weapon.', desc: 'Use GenAI to write SQL, debug Python, and generate exec summaries.', icon: '🤖', time: 'Weeks 11–13', color: 'from-brand to-purple-600' },
      { phase: 'Phase 5', title: 'Build undeniable proof.', desc: '4 real-world projects — Churn, Forecasting, and more, live on GitHub.', icon: '🚀', time: 'Weeks 14–15', color: 'from-emerald-400 to-teal-500' },
      { phase: 'Phase 6', title: 'Get past the ATS.', desc: 'Optimized resume, SQL interview prep, and STAR behavioral coaching.', icon: '🎯', time: 'Week 16', color: 'from-red-500 to-orange-400' },
    ],
    productivity: [
      { task: 'Complex SQL JOINs', manual: '45 min', ai: '3 min', multiplier: '15x' },
      { task: 'Python Debugging', manual: '2 hrs', ai: '5 min', multiplier: '24x' },
      { task: 'Interactive Dashboards', manual: '3 days', ai: '4 hrs', multiplier: '18x' },
      { task: 'Pipeline Documentation', manual: '1 day', ai: '10 min', multiplier: '144x' },
    ],
  },

  marketing: {
    highlights: [
      { value: '12', label: 'Weeks', sub: 'structured program' },
      { value: '3', label: 'Projects', sub: 'portfolio-ready' },
      { value: '5x', label: 'ROAS', sub: 'target return' },
      { value: '$85K+', label: 'Target', sub: 'average salary' },
    ],
    salaryTiers: [
      { level: 'Entry Level', role: 'Marketing Associate', desc: 'Manages social media posts, basic email campaigns, and content scheduling.', salary: '$50K', range: '— $65K', highlight: false, icon: '📱', gradient: 'from-slate-500/10 to-slate-600/5', border: 'border-white/[0.05]', width: '45%' },
      { level: 'Our Target', role: 'AI Growth Marketer', desc: 'Automates funnels, scales programmatic ads, and optimizes attribution with AI.', salary: '$85K', range: '— $115K', highlight: true, icon: '📢', gradient: 'from-pink-500/10 to-rose-400/5', border: 'border-pink-500/20', width: '78%' },
      { level: 'Senior Level', role: 'Head of Growth / CMO', desc: 'Leads cross-channel strategy, team management, and budget allocation.', salary: '$120K', range: '— $180K+', highlight: false, icon: '🏆', gradient: 'from-rose-500/10 to-pink-600/5', border: 'border-white/[0.05]', width: '100%' },
    ],
    journey: [
      { phase: 'Phase 1', title: 'AI copywriting that converts.', desc: 'Generate ad copy, landing pages, and lead magnets at scale with AI.', icon: '✍️', time: 'Weeks 1–3', color: 'from-pink-500 to-rose-400' },
      { phase: 'Phase 2', title: 'Scale paid traffic profitably.', desc: 'Master Google Ads, Meta campaigns, and algorithmic budget allocation.', icon: '📈', time: 'Weeks 4–7', color: 'from-fuchsia-500 to-purple-400' },
      { phase: 'Phase 3', title: 'Track every dollar.', desc: 'Configure GA4, multi-touch attribution, and LTV/CPA dashboards.', icon: '🎯', time: 'Weeks 8–10', color: 'from-violet-400 to-indigo-500' },
      { phase: 'Phase 4', title: 'Own organic search.', desc: 'SEO keyword clustering, content strategy, and Core Web Vitals.', icon: '🔍', time: 'Weeks 11–12', color: 'from-amber-400 to-orange-500' },
    ],
    productivity: [
      { task: 'Ad Copy Variations', manual: '4 hrs', ai: '5 min', multiplier: '48x' },
      { task: 'Campaign Reporting', manual: '3 hrs', ai: '10 min', multiplier: '18x' },
      { task: 'Audience Segmentation', manual: '1 day', ai: '30 min', multiplier: '16x' },
      { task: 'SEO Content Outlines', manual: '2 hrs', ai: '3 min', multiplier: '40x' },
    ],
  },

  datascience: {
    highlights: [
      { value: '16', label: 'Weeks', sub: 'structured program' },
      { value: '4', label: 'Projects', sub: 'portfolio-ready' },
      { value: '94%', label: 'AUC', sub: 'model accuracy target' },
      { value: '$110K+', label: 'Target', sub: 'average salary' },
    ],
    salaryTiers: [
      { level: 'Entry Level', role: 'Junior Data Scientist', desc: 'Runs basic statistical analysis, cleans datasets, and builds simple models.', salary: '$75K', range: '— $95K', highlight: false, icon: '📐', gradient: 'from-slate-500/10 to-slate-600/5', border: 'border-white/[0.05]', width: '50%' },
      { level: 'Our Target', role: 'ML Engineer', desc: 'Builds production ML pipelines, deploys models, and optimizes with SHAP.', salary: '$110K', range: '— $145K', highlight: true, icon: '🧬', gradient: 'from-violet-500/10 to-purple-400/5', border: 'border-violet-500/20', width: '85%' },
      { level: 'Senior Level', role: 'Principal Data Scientist', desc: 'Leads research teams, designs ML architectures, and drives company-wide AI strategy.', salary: '$150K', range: '— $220K+', highlight: false, icon: '🔬', gradient: 'from-purple-500/10 to-indigo-600/5', border: 'border-white/[0.05]', width: '100%' },
    ],
    journey: [
      { phase: 'Phase 1', title: 'Statistics are your foundation.', desc: 'Probability, regression, hypothesis testing — the math that powers ML.', icon: '📐', time: 'Weeks 1–4', color: 'from-violet-500 to-purple-400' },
      { phase: 'Phase 2', title: 'Build ML pipelines.', desc: 'Random Forest, XGBoost, cross-validation, and feature engineering.', icon: '⚙️', time: 'Weeks 5–8', color: 'from-indigo-500 to-blue-400' },
      { phase: 'Phase 3', title: 'Go deep with neural nets.', desc: 'Backpropagation, CNNs, transfer learning, and TensorFlow.', icon: '🧠', time: 'Weeks 9–12', color: 'from-purple-500 to-pink-400' },
      { phase: 'Phase 4', title: 'Explain and deploy.', desc: 'SHAP interpretability, model serialization, and Streamlit dashboards.', icon: '🚀', time: 'Weeks 13–16', color: 'from-emerald-400 to-teal-500' },
    ],
    productivity: [
      { task: 'Feature Engineering', manual: '1 day', ai: '20 min', multiplier: '36x' },
      { task: 'Model Tuning', manual: '8 hrs', ai: '30 min', multiplier: '16x' },
      { task: 'EDA Reports', manual: '4 hrs', ai: '10 min', multiplier: '24x' },
      { task: 'Documentation', manual: '3 hrs', ai: '5 min', multiplier: '36x' },
    ],
  },

  webdev: {
    highlights: [
      { value: '14', label: 'Weeks', sub: 'structured program' },
      { value: '4', label: 'Projects', sub: 'portfolio-ready' },
      { value: '99.9%', label: 'Uptime', sub: 'deployment target' },
      { value: '$95K+', label: 'Target', sub: 'average salary' },
    ],
    salaryTiers: [
      { level: 'Entry Level', role: 'Junior Developer', desc: 'Builds UI components, fixes bugs, and works on small feature implementations.', salary: '$60K', range: '— $80K', highlight: false, icon: '🖥️', gradient: 'from-slate-500/10 to-slate-600/5', border: 'border-white/[0.05]', width: '48%' },
      { level: 'Our Target', role: 'Fullstack Engineer', desc: 'Ships end-to-end features with Next.js, APIs, databases, and CI/CD.', salary: '$95K', range: '— $130K', highlight: true, icon: '💻', gradient: 'from-emerald-500/10 to-teal-400/5', border: 'border-emerald-500/20', width: '82%' },
      { level: 'Senior Level', role: 'Staff Engineer', desc: 'Architects systems, mentors teams, and drives technical decisions at scale.', salary: '$140K', range: '— $200K+', highlight: false, icon: '🏗️', gradient: 'from-teal-500/10 to-cyan-600/5', border: 'border-white/[0.05]', width: '100%' },
    ],
    journey: [
      { phase: 'Phase 1', title: 'Build beautiful interfaces.', desc: 'React components, Tailwind layouts, and Framer Motion animations.', icon: '🎨', time: 'Weeks 1–4', color: 'from-emerald-400 to-teal-500' },
      { phase: 'Phase 2', title: 'Go fullstack.', desc: 'Next.js App Router, Prisma ORM, REST APIs, and MySQL databases.', icon: '⚙️', time: 'Weeks 5–8', color: 'from-teal-500 to-cyan-400' },
      { phase: 'Phase 3', title: 'Enterprise-grade security.', desc: 'JWT auth, middleware shields, and Stripe payment integrations.', icon: '🔒', time: 'Weeks 9–11', color: 'from-blue-500 to-indigo-400' },
      { phase: 'Phase 4', title: 'Ship to production.', desc: 'Vercel edge deployment, GitHub Actions CI/CD, and AI-assisted debugging.', icon: '🚀', time: 'Weeks 12–14', color: 'from-violet-500 to-purple-400' },
    ],
    productivity: [
      { task: 'Component Scaffolding', manual: '2 hrs', ai: '5 min', multiplier: '24x' },
      { task: 'API Route Debugging', manual: '3 hrs', ai: '10 min', multiplier: '18x' },
      { task: 'Database Migrations', manual: '1 hr', ai: '3 min', multiplier: '20x' },
      { task: 'CI/CD Setup', manual: '1 day', ai: '15 min', multiplier: '32x' },
    ],
  },

  design: {
    highlights: [
      { value: '10', label: 'Weeks', sub: 'structured program' },
      { value: '3', label: 'Projects', sub: 'portfolio-ready' },
      { value: '2x', label: 'Conversions', sub: 'design impact' },
      { value: '$75K+', label: 'Target', sub: 'average salary' },
    ],
    salaryTiers: [
      { level: 'Entry Level', role: 'Junior Designer', desc: 'Creates social media graphics, basic layouts, and supports the design team.', salary: '$50K', range: '— $65K', highlight: false, icon: '🖌️', gradient: 'from-slate-500/10 to-slate-600/5', border: 'border-white/[0.05]', width: '45%' },
      { level: 'Our Target', role: 'Senior UI/UX Designer', desc: 'Designs systems, leads brand identities, and creates data-driven UI.', salary: '$75K', range: '— $105K', highlight: true, icon: '🎨', gradient: 'from-amber-500/10 to-orange-400/5', border: 'border-amber-500/20', width: '75%' },
      { level: 'Senior Level', role: 'Creative Director', desc: 'Leads the design org, sets visual strategy, and oversees all creative output.', salary: '$110K', range: '— $160K+', highlight: false, icon: '👑', gradient: 'from-orange-500/10 to-red-600/5', border: 'border-white/[0.05]', width: '100%' },
    ],
    journey: [
      { phase: 'Phase 1', title: 'Master the creative suite.', desc: 'Adobe Illustrator vectors, Photoshop compositing, and brand guidelines.', icon: '🖌️', time: 'Weeks 1–3', color: 'from-amber-400 to-orange-500' },
      { phase: 'Phase 2', title: 'Build design systems.', desc: 'Figma auto-layouts, component variants, and interactive prototypes.', icon: '📐', time: 'Weeks 4–7', color: 'from-orange-500 to-red-400' },
      { phase: 'Phase 3', title: 'AI-generated assets.', desc: 'Midjourney prompts, generative art, and portfolio publishing.', icon: '🤖', time: 'Weeks 8–10', color: 'from-pink-500 to-rose-400' },
    ],
    productivity: [
      { task: 'Logo Concepts', manual: '2 days', ai: '30 min', multiplier: '32x' },
      { task: 'Color Palette Generation', manual: '2 hrs', ai: '1 min', multiplier: '120x' },
      { task: 'UI Mockups', manual: '1 day', ai: '2 hrs', multiplier: '4x' },
      { task: 'Social Media Templates', manual: '4 hrs', ai: '15 min', multiplier: '16x' },
    ],
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function PhaseCard({ phase, index }: { phase: JourneyPhase; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);
  const isEven = index % 2 === 0;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: isEven ? -30 : 30 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
      className={`relative flex ${isEven ? 'sm:flex-row' : 'sm:flex-row-reverse'} items-center gap-0`}
    >
      <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      <motion.div
        animate={{ scale: hovered ? 1.15 : 1 }}
        transition={{ duration: 0.2 }}
        className={`relative shrink-0 z-10 mx-4 sm:mx-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${phase.color} flex items-center justify-center text-xl shadow-lg`}
      >
        {phase.icon}
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-bold uppercase tracking-widest text-muted whitespace-nowrap">{phase.time}</div>
      </motion.div>
      <div className={`flex-1 ${isEven ? 'sm:mr-8' : 'sm:ml-8'} pl-6 sm:pl-0`}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
          className="rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5"
          style={{ boxShadow: hovered ? '0 16px 48px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)' }}
        >
          <div className={`text-[10px] font-bold uppercase tracking-widest bg-gradient-to-r ${phase.color} bg-clip-text text-transparent mb-1.5`}>{phase.phase}</div>
          <h3 className="text-base font-bold text-foreground mb-1.5">{phase.title}</h3>
          <p className="text-sm text-muted leading-relaxed">{phase.desc}</p>
        </motion.div>
      </div>
    </motion.div>
  );
}

function SalaryCard({ tier, index }: { tier: SalaryTier; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.12 }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`relative rounded-3xl border ${tier.border} bg-gradient-to-br ${tier.gradient} backdrop-blur-xl overflow-hidden h-full`}
        style={{
          boxShadow: tier.highlight
            ? hovered ? '0 40px 100px rgba(255,107,53,0.25), 0 0 0 1px rgba(255,107,53,0.3)' : '0 20px 60px rgba(255,107,53,0.12)'
            : hovered ? '0 32px 80px rgba(0,0,0,0.4)' : '0 8px 32px rgba(0,0,0,0.2)',
        }}
      >
        {tier.highlight && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand to-transparent" />}
        {tier.highlight && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand/15 border border-brand/25 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-brand">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />Our Target
            </span>
          </div>
        )}
        <div className="p-7 flex flex-col h-full">
          <div className="text-3xl mb-5">{tier.icon}</div>
          <div className="text-[10px] text-muted uppercase tracking-widest font-bold mb-2">{tier.level}</div>
          <h3 className="text-xl font-black text-foreground tracking-tight mb-3">{tier.role}</h3>
          <p className="text-sm text-muted leading-relaxed flex-1">{tier.desc}</p>
          <div className="mt-6 pt-5 border-t border-white/[0.06]">
            <div className="flex items-baseline gap-1 mb-2">
              <span className={`text-3xl font-black tracking-tight ${tier.highlight ? 'text-foreground' : 'text-muted'}`}>{tier.salary}</span>
              <span className="text-base text-muted font-light">{tier.range}</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={isInView ? { width: tier.width } : { width: 0 }}
                transition={{ duration: 1, ease: 'easeOut', delay: 0.3 + index * 0.15 }}
                className={`h-full rounded-full ${tier.highlight ? 'bg-gradient-to-r from-brand to-orange-400' : 'bg-white/20'}`}
              />
            </div>
            <div className="text-[10px] text-muted uppercase tracking-widest font-semibold mt-1.5">Average Base Salary · US Market</div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProductivityRow({ item, index }: { item: ProductivityItem; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.08 }}
    >
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.01 }}
        className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl p-5 overflow-hidden"
        style={{ boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,107,53,0.1)' : '0 4px 20px rgba(0,0,0,0.2)' }}
      >
        <motion.div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-transparent pointer-events-none" animate={{ opacity: hovered ? 1 : 0 }} transition={{ duration: 0.3 }} />
        <div className="relative z-10">
          <p className="text-sm font-bold text-foreground mb-4">{item.task}</p>
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <div className="text-[10px] uppercase tracking-widest text-muted/60 font-bold mb-1">Manual</div>
              <div className="text-lg font-semibold text-muted line-through decoration-muted/30">{item.manual}</div>
            </div>
            <div className="text-brand/60"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></div>
            <div className="flex-1 text-right">
              <div className="text-[10px] uppercase tracking-widest text-brand/70 font-bold mb-1">AI Flow</div>
              <div className="text-xl font-black text-brand">{item.ai}</div>
            </div>
            <div className="shrink-0 rounded-xl bg-brand/10 border border-brand/20 px-2.5 py-1.5 text-center">
              <div className="text-lg font-black text-brand">{item.multiplier}</div>
              <div className="text-[8px] uppercase tracking-widest text-brand/70 font-bold">faster</div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SectionLabel({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 24 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: EASE }} className="text-center max-w-2xl mx-auto">
      <div className="inline-flex items-center gap-2 mb-3 text-[11px] font-bold uppercase tracking-widest text-brand">
        <span className="w-1.5 h-1.5 rounded-full bg-brand" />{eyebrow}
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-[-0.02em] leading-tight mb-3">{title}</h2>
      <p className="text-muted text-base font-light leading-relaxed">{subtitle}</p>
    </motion.div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CareerOutcomesPage() {
  const [activeCourse, setActiveCourse] = useState<CourseKey>('analytics');
  const data = courseData[activeCourse];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 60]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen overflow-hidden">

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-[70vh] flex flex-col items-center justify-center text-center pt-16 pb-8 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-brand/[0.04] rounded-full blur-[140px]" />
          <div className="absolute top-1/2 left-[20%] w-[350px] h-[350px] bg-emerald-500/[0.04] rounded-full blur-[100px]" />
          <div className="absolute top-1/4 right-[20%] w-[250px] h-[250px] bg-blue-500/[0.04] rounded-full blur-[80px]" />
          <div className="absolute inset-0 opacity-[0.015]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: '80px 80px', maskImage: 'radial-gradient(ellipse 80% 60% at 50% 40%, black 30%, transparent 100%)' }} />
        </div>

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE }} className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-brand mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />Career Outcomes
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE, delay: 0.1 }} className="text-5xl sm:text-7xl lg:text-8xl font-black text-foreground tracking-[-0.03em] leading-[0.95] mb-6">
            Scale your earning.<br /><span className="italic font-light text-muted/60">Across every domain.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: EASE, delay: 0.2 }} className="text-lg sm:text-xl text-muted max-w-2xl mx-auto font-light leading-relaxed mb-10">
            Career trajectories, salary benchmarks, and AI productivity advantages — tailored for all 5 AI-powered courses.
          </motion.p>

          {/* Course Selector */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, ease: EASE, delay: 0.3 }} className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/[0.01] border border-white/[0.05] rounded-2xl max-w-3xl mx-auto">
            {courseTabs.map((tab) => {
              const isActive = activeCourse === tab.key;
              return (
                <button key={tab.key} onClick={() => setActiveCourse(tab.key as CourseKey)} className="relative px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none" style={{ color: isActive ? '#050508' : '#94A3B8' }}>
                  {isActive && <motion.div layoutId="activeOutcomeTab" transition={{ type: 'spring', stiffness: 150, damping: 20 }} className="absolute inset-0 bg-brand rounded-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] z-0" />}
                  <span className="relative z-10 flex items-center gap-1.5"><span>{tab.icon}</span><span className="hidden sm:inline">{tab.label}</span></span>
                </button>
              );
            })}
          </motion.div>
        </motion.div>
      </section>

      {/* ── ANIMATED CONTENT ────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div key={activeCourse} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: EASE }}>

          {/* Highlight Stats */}
          <section className="py-4 px-4">
            <div className="max-w-3xl mx-auto rounded-3xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-xl divide-x divide-white/[0.06] flex flex-wrap" style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.3)' }}>
              {data.highlights.map((h, i) => (
                <div key={i} className="flex-1 min-w-[120px] px-6 py-5 text-center">
                  <div className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">{h.value}</div>
                  <div className="text-xs font-bold text-brand uppercase tracking-wider mt-0.5">{h.label}</div>
                  <div className="text-[10px] text-muted mt-0.5">{h.sub}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Salary Trajectory */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20">
            <SectionLabel eyebrow="Career Trajectory" title="Where you'll land." subtitle="Data-backed compensation benchmarks for this domain." />
            <div className="mt-12 grid md:grid-cols-3 gap-5">
              {data.salaryTiers.map((tier, i) => <SalaryCard key={tier.role} tier={tier} index={i} />)}
            </div>
          </section>

          {/* Journey */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto py-20">
            <SectionLabel eyebrow="The Transformation" title="From zero to hired." subtitle="Your structured journey through this program." />
            <div className="mt-14 space-y-8">
              {data.journey.map((phase, i) => <PhaseCard key={i} phase={phase} index={i} />)}
            </div>
          </section>

          {/* Productivity */}
          <section className="px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto py-20">
            <SectionLabel eyebrow="AI Productivity Advantage" title="Velocity is the new skill." subtitle="See how AI-first workflows transform standard execution times." />
            <div className="mt-12 grid sm:grid-cols-2 gap-4">
              {data.productivity.map((item, i) => <ProductivityRow key={item.task} item={item} index={i} />)}
            </div>
          </section>

        </motion.div>
      </AnimatePresence>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="px-4 sm:px-6 max-w-4xl mx-auto py-20">
        <FinalCTA />
      </section>
    </div>
  );
}

function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 40 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: EASE }} className="relative rounded-[2.5rem] border border-brand/20 bg-gradient-to-br from-brand/5 via-transparent to-emerald-500/5 p-12 md:p-16 text-center overflow-hidden" style={{ boxShadow: '0 0 100px rgba(255,107,53,0.1), 0 40px 100px rgba(0,0,0,0.4)' }}>
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-80 bg-brand/10 rounded-full blur-[80px]" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />
      </div>
      <div className="relative z-10">
        <div className="text-5xl mb-6">🎯</div>
        <h2 className="text-3xl sm:text-4xl font-black text-foreground tracking-[-0.02em] mb-4 leading-tight">Ready to secure your role?</h2>
        <p className="text-muted text-lg font-light max-w-xl mx-auto mb-10 leading-relaxed">Join thousands building the exact AI-augmented portfolio that top companies are hiring for — in any domain.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/syllabus" className="inline-flex items-center gap-2 rounded-full bg-brand px-10 py-4 text-base font-bold text-white shadow-[0_0_40px_rgba(255,107,53,0.45)] hover:bg-brand/90 hover:shadow-[0_0_60px_rgba(255,107,53,0.55)] transition-all duration-300">
            Start Your Journey
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
          </Link>
          <Link href="/learning" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-10 py-4 text-base font-semibold text-foreground hover:bg-white/[0.08] transition-all duration-300">Explore Learning Hubs</Link>
        </div>
      </div>
    </motion.div>
  );
}
