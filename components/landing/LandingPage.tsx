'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SectionHeading } from './SectionHeading';
import { LandingCard } from './LandingCard';
import { AIMentorShowcase } from './AIMentorShowcase';
import { AIMentorVisual } from './AIMentorVisual';
import { StudentSuccess } from './StudentSuccess';
import { PortfolioShowcase } from './PortfolioShowcase';
import { TransformationStory } from './TransformationStory';
import {
  FadeUp,
  ScrollReveal,
  StaggerContainer,
  StaggerItem,
  HoverCard,
  PageReveal,
} from '@/components/ui/motion';

import {
  trustStats,
  quickHighlights,
  features,
  testimonials
} from '@/data/landing-data';
import { Lock, Unlock, Sparkles, BookOpen, GraduationCap, ChevronRight, CheckCircle2 } from 'lucide-react';

const educareCourses = [
  {
    slug: 'ai-data-analytics',
    title: 'AI-Powered Data Analytics',
    icon: '📊',
    difficulty: 'Core Foundation',
    timeline: 'Weeks 1–16',
    description: 'Master cloud databases, write relational SQL queries, build executive Tableau dashboards, and automate ETL data pipelines using BigQuery and generative AI.',
    skills: ['SQL CTEs & Joins', 'Window Functions', 'Tableau Dashboards', 'Airflow & dbt ETL'],
    tools: ['SQL', 'BigQuery', 'Tableau', 'dbt', 'Airflow']
  },
  {
    slug: 'ai-digital-marketing',
    title: 'AI-Powered Digital Marketing',
    icon: '📣',
    difficulty: 'Career Accelerator',
    timeline: 'Weeks 1–12',
    description: 'Build automated lead-gen funnels, programmatic ad scaling, copywriting pipelines, programmatic search campaigns, and multi-touch web attribution.',
    skills: ['Copy-Generation AI', 'Ad Campaign Automation', 'Funnel Optimization', 'Web Attribution Models'],
    tools: ['Microsoft Copilot', 'Google Ads', 'Meta Manager', 'Analytics 4']
  },
  {
    slug: 'ai-data-science',
    title: 'AI-Powered Data Science',
    icon: '🔬',
    difficulty: 'Advanced Tech',
    timeline: 'Weeks 1–16',
    description: 'Build robust machine learning models, programmatic EDA scripts, predictive customer classifiers, neural network pipelines, and SHAP explainers.',
    skills: ['Supervised Learning', 'Random Forest & XGBoost', 'SHAP Explainability', 'Pandas & NumPy EDA'],
    tools: ['Python', 'Pandas', 'Scikit-Learn', 'SHAP', 'Streamlit']
  },
  {
    slug: 'ai-web-development',
    title: 'AI-Powered Web Development',
    icon: '💻',
    difficulty: 'Fullstack Tech',
    timeline: 'Weeks 1–14',
    description: 'Architect dynamic APIs, secure Next.js student portals, middleware routers, dynamic React layouts, and deploy scalable edge microservices with AI.',
    skills: ['Next.js App Router', 'RESTful API Design', 'Tailwind CSS UI', 'Prisma ORM & MySQL'],
    tools: ['React', 'Next.js', 'Prisma', 'MySQL', 'GitHub Copilot']
  },
  {
    slug: 'ai-graphic-design',
    title: 'AI-Powered Graphic Design',
    icon: '🎨',
    difficulty: 'Creative Suite',
    timeline: 'Weeks 1–10',
    description: 'Design dynamic Figma UI prototypes, layout branding guides, custom SVG animations, vectorized logos, and build custom generative artwork assets.',
    skills: ['Figma Auto-Layouts', 'Branding & UI Systems', 'Generative Vector Design', 'Figma Prototyping'],
    tools: ['Figma', 'Adobe Illustrator', 'Midjourney', 'Photoshop']
  }
];

export default function LandingPage() {
  const scrollToCatalog = () => {
    const element = document.getElementById('catalog');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <PageReveal>
      <div className="space-y-20 md:space-y-28 lg:space-y-36">

        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="hero-grid-bg relative overflow-hidden rounded-[2.5rem] border border-border/50 bg-gradient-to-br from-surface via-background to-brand/5 px-6 py-16 sm:px-12 md:py-24 lg:px-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] animate-in fade-in duration-700">
          <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_1fr] lg:gap-20">

            {/* LEFT — Text content */}
            <div className="space-y-8 min-w-0">
              <FadeUp delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/10 cursor-pointer" onClick={scrollToCatalog}>
                  <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse shrink-0" />
                  <span>AI Tech Educare OS: 5 Premium Course Tracks Seeded</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.08}>
                <div className="space-y-6">
                  <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-[1.15]">
                    Master the Future <br />
                    of Tech with{' '}
                    <span className="text-brand relative inline-block">
                      AI-Powered Education.
                      <svg className="absolute -bottom-2 left-0 w-full h-3 text-brand/30" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="none"/></svg>
                    </span>
                  </h1>
                  <p className="max-w-xl text-lg leading-relaxed text-muted sm:text-xl font-light">
                    Build high-paying technical skills and deploy real-world projects. Choose from our elite AI-powered tracks: **Data Analytics, Digital Marketing, Data Science, Web Development, or Graphic Design**.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="flex flex-col sm:flex-row gap-4 pt-2">
                  <Button size="lg" className="h-12 px-8 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-brand to-orange-500 hover:from-brand/95 hover:to-orange-500/95 text-slate-950 shadow-[0_0_35px_rgba(255,107,53,0.3)] border-none transition-all duration-300 hover:scale-[1.02]" onClick={scrollToCatalog}>
                    Explore Course Suite ↓
                  </Button>
                  <Button variant="secondary" size="lg" className="h-12 px-8 rounded-full text-xs font-bold uppercase tracking-wider border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/20 text-white transition-all duration-300 hover:scale-[1.02]" asChild>
                    <Link href="/signup">Access Student Portal</Link>
                  </Button>
                </div>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  <div className="rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-border/70 flex items-center gap-2">
                    🎯 Project-driven learning
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-border/70 flex items-center gap-2">
                    🤖 AI-copilot integration
                  </div>
                  <div className="rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-border/70 flex items-center gap-2">
                    📁 6+ Deployed portfolio assets
                  </div>
                </div>
              </FadeUp>

              <FadeUp delay={0.28}>
                <div className="grid grid-cols-3 gap-3">
                  {trustStats.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-4"
                    >
                      <p className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        {item.value}
                      </p>
                      <p className="mt-1 text-[10px] font-medium uppercase tracking-wider text-muted">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </FadeUp>
            </div>

            {/* RIGHT — AI Mentor Visual */}
            <FadeUp delay={0.2} className="flex items-center justify-center pb-14 lg:pb-16">
              <AIMentorVisual />
            </FadeUp>
          </div>
        </section>

        {/* ── COURSE SUITE CATALOG SHOWCASE (Brings clarity to course catalog) ── */}
        <section id="catalog" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mx-auto max-w-7xl space-y-12">
            <ScrollReveal>
              <SectionHeading
                badge="AI-POWERED EDUCATIONAL SUITE"
                title="5 Dynamic Tech Tracks"
                description="Explore our elite, project-driven technical modules. Initialize your student operating system workspace by enrolling in any path."
              />
            </ScrollReveal>

            <StaggerContainer className="grid gap-8 grid-cols-1 lg:grid-cols-2">
              {educareCourses.map((course, idx) => (
                <StaggerItem key={course.slug} className={idx === 0 ? "lg:col-span-2" : ""}>
                  <HoverCard className="h-full">
                    <Card className="flex flex-col h-full border border-white/[0.03] bg-slate-950/25 backdrop-blur-2xl p-8 sm:p-10 hover:border-brand/30 transition-all duration-500 shadow-[0_30px_100px_rgba(0,0,0,0.5)] overflow-hidden relative group rounded-[2rem]">
                      <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      <div className="space-y-6 flex-1 relative z-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <span className="text-4xl filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.15)]">{course.icon}</span>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-brand border-white/5 bg-white/[0.02] uppercase tracking-[0.2em] text-[8px] font-bold py-1 px-3 rounded-full">
                              {course.difficulty}
                            </Badge>
                            <Badge className="bg-slate-900 text-slate-400 border-none text-[9px] py-1 px-3 rounded-full font-semibold">
                              {course.timeline}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100 group-hover:text-brand transition-colors tracking-tight">
                            {course.title}
                          </h2>
                          <p className="text-xs sm:text-sm leading-relaxed text-slate-400 font-light">
                            {course.description}
                          </p>
                        </div>

                        <div className="pt-6 border-t border-border/50 grid sm:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">Key Skills Mastered</h3>
                            <ul className="grid grid-cols-1 gap-2">
                              {course.skills.map(skill => (
                                <li key={skill} className="text-xs text-muted flex items-center gap-1.5 font-light">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-brand shrink-0 opacity-70" />
                                  {skill}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h3 className="text-[9px] font-bold uppercase tracking-widest text-slate-500 mb-3">Industry Tools Mastered</h3>
                            <div className="flex flex-wrap gap-2">
                              {course.tools.map(tool => (
                                <Badge key={tool} variant="outline" className="bg-[#09090D] text-slate-400 border-white/5 font-mono text-[8px] tracking-widest uppercase py-1 px-2.5 rounded-lg">
                                  {tool}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 mt-8 border-t border-white/[0.04] relative z-10 flex justify-end">
                        <Button size="sm" asChild className="rounded-xl px-6 h-9 font-bold text-[10px] uppercase tracking-wider bg-brand text-slate-950 hover:bg-brand/90 hover:scale-[1.02] transition-all flex items-center gap-1.5 shadow-[0_0_20px_rgba(255,107,53,0.15)]">
                          <Link href="/signup">
                            Unlock workspace catalog <ChevronRight className="h-3.5 w-3.5" />
                          </Link>
                        </Button>
                      </div>
                    </Card>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── INTERACTIVE AI MENTOR SHOWCASE (Better & Upgraded Showcase Component) ── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <AIMentorShowcase />
            </ScrollReveal>
          </div>
        </section>

        {/* ── STUDENT SUCCESS (Social Proof) ─────────────────────────────── */}
        <StudentSuccess />

        {/* ── TRANSFORMATION STORY (Scroll Journey) ──────────────────────── */}
        <TransformationStory />

        {/* ── PORTFOLIO SHOWCASE (Bento Box) ─────────────────────────────── */}
        <PortfolioShowcase />

        {/* ── FEATURES SECTION ─────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                title="Dynamic Tech Educare OS Features"
                description="Everything is designed to help you move from zero learning to technical confidence with AI copilot support."
              />
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {features.map((feature) => (
                <StaggerItem key={feature.title}>
                  <HoverCard>
                    <LandingCard
                      icon={feature.icon}
                      title={feature.title}
                      description={feature.description}
                      className="h-full transition-colors hover:border-border/80"
                    />
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── TESTIMONIALS SECTION ─────────────────────────────────────────── */}
        <section className="border-y border-border/50 bg-background/95 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                badge="Testimonials"
                title="Hear how learners are accelerating their career tracks"
                description="Real stories of learners who moved from basic study to high technical confidence, projects, and interviews."
              />
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t) => (
                <StaggerItem key={t.name}>
                  <HoverCard className="h-full">
                    <Card className="h-full space-y-5 rounded-[2rem] p-6 transition-colors hover:border-border/60">
                      <p className="text-sm italic leading-7 text-muted">
                        &ldquo;{t.quote}&rdquo;
                      </p>
                      <div className="border-t border-border/50 pt-3">
                        <p className="font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs font-medium text-muted">{t.role}</p>
                      </div>
                    </Card>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── FINAL CTA ────────────────────────────────────────────────────── */}
        <ScrollReveal className="px-4 sm:px-6 lg:px-8">
          <section className="rounded-[2rem] border border-white/10 bg-gradient-to-r from-brand/10 via-slate-950/80 to-slate-900/90 px-6 py-16 text-foreground sm:px-10 lg:py-20 lg:px-14">
            <div className="mx-auto max-w-3xl space-y-8 text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand">
                Ready to launch your technical career?
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Start building skills, deploying projects, and gaining confidence today.
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-muted sm:text-base">
                Join the platform designed for AI-powered technical talent, with dynamic milestone checks and socratic mentoring.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
                <Button size="lg" className="shadow-lg shadow-brand/20" onClick={scrollToCatalog}>
                  Explore the Course Suite
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/dashboard/syllabus">View Milestone Roadmap</Link>
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </PageReveal>
  );
}
