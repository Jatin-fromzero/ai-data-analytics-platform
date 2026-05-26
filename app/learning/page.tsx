import React from 'react';
import Link from 'next/link';
import { learningHubs } from '@/data/learning-paths';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/motion';

export const metadata = {
  title: 'Learning Hubs - AI AnalyticsHub',
  description: 'Explore our comprehensive, AI-powered data analytics learning paths and tool hubs.',
};

export default function LearningIndexPage() {
  const paths = learningHubs.filter(h => h.category === 'Path');
  const tools = learningHubs.filter(h => h.category === 'Tool');
  const concepts = learningHubs.filter(h => h.category === 'Concept');

  return (
    <PageReveal>
      <div className="space-y-24 pb-20">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="relative pt-20 pb-16 text-center border-b border-border/50 bg-surface/30 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand/5 blur-[100px] pointer-events-none" />
          <FadeUp>
            <div className="max-w-3xl mx-auto px-4">
              <Badge variant="outline" className="mb-6 border-brand/30 text-brand">The Ecosystem</Badge>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Master Analytics. <br />
                <span className="italic font-light text-muted-foreground">Skip the busywork.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mt-6 max-w-2xl mx-auto font-light">
                Structured career roadmaps, deep-dive tool masterclasses, and modern AI workflows. 
                Everything you need to become a high-impact data professional.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── CAREER PATHS (Featured Full Width) ─────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeUp delay={0.1}>
            <div className="mb-10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-xl">
                🛣️
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Structured Career Paths</h2>
                <p className="text-sm text-muted">End-to-end curriculums from beginner to hired.</p>
              </div>
            </div>
          </FadeUp>
          
          <div className="grid gap-6">
            {paths.map((hub, i) => (
              <FadeUp key={hub.slug} delay={0.15 + (i * 0.1)}>
                <Link href={`/learning/${hub.slug}`} className="block group">
                  <Card className="relative overflow-hidden border-border bg-surface hover:border-brand/50 transition-all duration-500 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                    <div className={`absolute right-0 top-0 w-1/2 h-full bg-gradient-to-l ${hub.color} to-transparent opacity-[0.03] group-hover:opacity-10 transition-opacity duration-500`} />
                    <div className="p-8 sm:p-10 flex flex-col sm:flex-row gap-8 items-start sm:items-center">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-background border border-border text-4xl shadow-sm group-hover:scale-110 transition-transform duration-500">
                        {hub.icon}
                      </div>
                      <div className="flex-1">
                        <Badge variant="secondary" className="mb-3 border-border text-xs bg-background">
                          {hub.modules.length} Modules • Comprehensive
                        </Badge>
                        <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-2 group-hover:text-brand transition-colors">
                          {hub.title}
                        </h3>
                        <p className="text-base text-muted max-w-2xl">
                          {hub.subtitle}
                        </p>
                      </div>
                      <div className="hidden sm:flex items-center text-sm font-semibold text-brand tracking-wide uppercase shrink-0">
                        Start Path <span className="ml-2 text-lg group-hover:translate-x-2 transition-transform">→</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </FadeUp>
            ))}
          </div>
        </section>

        {/* ── TOOL MASTERCLASSES (Bento Grid) ────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeUp delay={0.2}>
            <div className="mb-10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xl">
                ⚡
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Tool Masterclasses</h2>
                <p className="text-sm text-muted">Deep dives into the industry&apos;s most powerful tools.</p>
              </div>
            </div>
          </FadeUp>
          
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {tools.map(hub => (
              <StaggerItem key={hub.slug}>
                <HoverCard className="h-full">
                  <HubCard hub={hub} />
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── AI & CONCEPTS (Bento Grid) ─────────────────────────────────── */}
        <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <FadeUp delay={0.2}>
            <div className="mb-10 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-xl">
                🧠
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">AI & Core Concepts</h2>
                <p className="text-sm text-muted">Advanced workflows and theoretical foundations.</p>
              </div>
            </div>
          </FadeUp>
          
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {concepts.map(hub => (
              <StaggerItem key={hub.slug}>
                <HoverCard className="h-full">
                  <HubCard hub={hub} />
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

      </div>
    </PageReveal>
  );
}

function HubCard({ hub }: { hub: any }) {
  return (
    <Link href={`/learning/${hub.slug}`} className="block group h-full">
      <Card className="h-full p-8 border-border bg-surface transition-all duration-500 hover:border-brand/40 relative overflow-hidden shadow-sm">
        <div className={`absolute inset-0 bg-gradient-to-br ${hub.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="flex justify-between items-start mb-6">
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-background border border-border text-2xl shadow-sm group-hover:scale-110 transition-transform duration-500">
              {hub.icon}
            </span>
            <Badge variant="secondary" className="bg-background border-border text-[10px] tracking-wider uppercase">
              {hub.modules.length} Modules
            </Badge>
          </div>
          
          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-brand transition-colors">
            {hub.title}
          </h3>
          <p className="text-sm text-muted mb-8 leading-relaxed flex-1">
            {hub.subtitle}
          </p>

          <div className="flex items-center text-xs font-semibold uppercase tracking-wider text-muted group-hover:text-brand transition-colors mt-auto border-t border-border/50 pt-4">
            Explore <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
