'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SectionHeading } from './SectionHeading';
import { LandingCard } from './LandingCard';
import { CareerProgressTracker } from './CareerProgressTracker';
import { AIMentorVisual } from './AIMentorVisual';
import { AIMentorChat } from './AIMentorChat';
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
  outcomes,
  aiTools,
  roadmap,
  projects,
  features,
  testimonials
} from '@/data/landing-data';

export default function LandingPage() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [initialChatMessage, setInitialChatMessage] = useState<string | undefined>();

  const handleOpenChat = (msg?: string) => {
    setInitialChatMessage(msg);
    setIsChatOpen(true);
  };

  return (
    <PageReveal>
      <div className="space-y-20 md:space-y-28 lg:space-y-36">
        <AIMentorChat 
          isOpen={isChatOpen} 
          onClose={() => setIsChatOpen(false)} 
          initialMessage={initialChatMessage} 
        />

        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section className="hero-grid-bg relative overflow-hidden rounded-[2rem] border border-border/50 bg-gradient-to-br from-slate-950 via-slate-950 to-brand/[0.02] px-6 py-14 sm:px-10 md:py-20 lg:px-14">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_420px] lg:gap-16">

            {/* LEFT — Text content */}
            <div className="space-y-8 min-w-0">
              <FadeUp delay={0}>
                <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand/5 px-4 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/10">
                  <span className="flex h-2 w-2 rounded-full bg-brand animate-pulse shrink-0" />
                  <span>New for 2026: GenAI &amp; FAISS Vector Chatbots added</span>
                </div>
              </FadeUp>

              <FadeUp delay={0.08}>
                <div className="space-y-5">
                  <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl xl:text-6xl">
                    Go from zero to{' '}
                    <span className="text-brand">job-ready data analyst</span>{' '}
                    with AI-first workflows.
                  </h1>
                  <p className="max-w-lg text-base leading-7 text-muted sm:text-lg">
                    Master SQL, Python, Tableau, and cloud databases. Build a resume-ready portfolio of 5 real-world capstones using modern AI developer tools to work 10x faster.
                  </p>
                </div>
              </FadeUp>

              <FadeUp delay={0.15}>
                <div className="flex flex-wrap gap-3">
                  <Button size="lg" className="shadow-lg shadow-brand/20">
                    Explore Syllabus
                  </Button>
                  <Button variant="secondary" size="lg" asChild>
                    <Link href="/career-outcomes">See Career Path</Link>
                  </Button>
                </div>
              </FadeUp>

              <FadeUp delay={0.22}>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                  {quickHighlights.map((h) => (
                    <div
                      key={h}
                      className="rounded-2xl border border-border/70 bg-white/[0.03] px-4 py-3 text-sm font-medium text-muted transition-colors hover:border-border/70"
                    >
                      {h}
                    </div>
                  ))}
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
              <AIMentorVisual onOpenChat={handleOpenChat} />
            </FadeUp>
          </div>
        </section>

        {/* ── CURRICULUM PREVIEW (Career Progress Tracker) ──────────────── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <ScrollReveal>
              <SectionHeading
                badge="Curriculum Preview"
                title="Your 16-week journey to job-ready"
                description="Explore the structured, phase-by-phase curriculum that takes you from analytics basics to deploying AI-powered data pipelines."
              />
            </ScrollReveal>
            <ScrollReveal delay={0.1} className="mt-10">
              <CareerProgressTracker />
            </ScrollReveal>
          </div>
        </section>

        {/* ── OUTCOMES SECTION ─────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                badge="Trusted by learners"
                title="Real outcomes from a modern analytics experience"
                description="A clear path from beginner to job-ready, with practical projects, AI workflows, and hiring tools built into every step."
              />
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {outcomes.map((item) => (
                <StaggerItem key={item.title}>
                  <HoverCard>
                    <LandingCard
                      icon={item.icon}
                      title={item.title}
                      description={item.description}
                      className="h-full transition-colors hover:border-border/80"
                    />
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── AI TOOLS SECTION ─────────────────────────────────────────────── */}
        <section className="border-y border-border/50 bg-background/95 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                title="AI tools for every analytics workflow"
                description="Use the tools modern teams rely on to speed analysis, automate tasks, and produce polished results."
              />
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {aiTools.map((tool) => (
                <StaggerItem key={tool.name}>
                  <HoverCard>
                    <LandingCard
                      icon={tool.icon}
                      title={tool.name}
                      description={tool.description}
                      className="h-full transition-colors hover:border-border/80"
                    />
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── ROADMAP SECTION ──────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                badge="Learning roadmap"
                title="A clear path from first lesson to first hire"
                description="Each stage focuses on outcomes: skill foundation, hands-on projects, and career launch preparation."
              />
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {roadmap.map((step) => (
                <StaggerItem key={step.step}>
                  <HoverCard>
                    <LandingCard
                      icon={<span className="text-sm font-mono font-bold text-brand">{step.step}</span>}
                      title={step.title}
                      description={step.description}
                      className="h-full transition-colors hover:border-border/80"
                    />
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── PROJECTS SECTION ─────────────────────────────────────────────── */}
        <section className="border-y border-border/50 bg-background/95 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                badge="Real-world projects"
                title="Build portfolio-ready analytics work"
                description="Apply every skill with project-based learning that mirrors real business problems and hiring expectations."
              />
            </ScrollReveal>
            <StaggerContainer className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <StaggerItem key={project.title}>
                  <HoverCard className="h-full">
                    <Card className="h-full rounded-[2rem] p-6 transition-colors hover:border-border/60">
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand">
                        Project Showcase
                      </p>
                      <h3 className="mt-4 text-xl font-bold text-foreground">{project.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted">{project.highlight}</p>
                    </Card>
                  </HoverCard>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </section>

        {/* ── FEATURES SECTION ─────────────────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl space-y-10">
            <ScrollReveal>
              <SectionHeading
                title="Job-ready platform features"
                description="Everything is designed to help you move from learning to hiring with focus, portfolio work, and modern analytics workflows."
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
                title="Hear how learners are accelerating their analytics careers"
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
                Ready to launch your analytics career?
              </p>
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Start building skills, projects, and confidence today.
              </h2>
              <p className="mx-auto max-w-xl text-sm leading-7 text-muted sm:text-base">
                Join the platform designed for modern analytics talent, with AI workflows and career momentum built into every lesson.
              </p>
              <div className="flex flex-col items-center justify-center gap-4 pt-2 sm:flex-row">
                <Button size="lg" className="shadow-lg shadow-brand/20">
                  Explore the platform
                </Button>
                <Button variant="secondary" size="lg" asChild>
                  <Link href="/syllabus">View full syllabus</Link>
                </Button>
              </div>
            </div>
          </section>
        </ScrollReveal>

      </div>
    </PageReveal>
  );
}
