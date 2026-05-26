import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/motion';
import { TransformationStory } from '@/components/landing/TransformationStory';

export default function CareerOutcomesPage() {
  return (
    <PageReveal>
      <div className="space-y-24 pb-20 overflow-hidden">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="relative pt-20 pb-16 text-center border-b border-border/50 bg-surface/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand/5 blur-[120px] pointer-events-none" />
          <FadeUp>
            <div className="max-w-3xl mx-auto px-4">
              <Badge variant="outline" className="mb-6 border-brand/30 text-brand uppercase tracking-widest font-semibold text-[10px]">Career Outcomes</Badge>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Scale your earning potential. <br />
                <span className="text-muted-foreground italic font-light">With AI workflows.</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted mt-6 max-w-2xl mx-auto font-light leading-relaxed">
                Our graduates don&apos;t just learn syntax—they master the modern, AI-augmented workflows that top technology companies are aggressively hiring for.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── THE JOURNEY ────────────────────────────────────────────────── */}
        <section className="px-4">
          <FadeUp delay={0.1}>
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-foreground">The 16-Week Transformation</h2>
              <p className="text-muted mt-4">From syntax confusion to an elite, placement-ready portfolio.</p>
            </div>
          </FadeUp>
          <TransformationStory />
        </section>

        {/* ── SALARY & PROGRESSION (Fintech Style) ────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4">
          <FadeUp delay={0.2}>
            <div className="mb-12 flex items-center justify-between border-b border-border/50 pb-6">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Career Trajectory</h2>
                <p className="text-muted mt-2">Data-backed compensation for modern AI-fluent analysts.</p>
              </div>
              <div className="hidden sm:flex h-12 w-12 items-center justify-center rounded-full bg-surface border border-border text-xl">
                📈
              </div>
            </div>
          </FadeUp>

          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              {
                level: "Entry Level",
                role: "Junior Data Analyst",
                desc: "Focuses on reporting, simple SQL queries, and Excel data cleaning.",
                salary: "$65K - $85K",
                highlight: false,
                color: "slate-800"
              },
              {
                level: "Our Target",
                role: "AI-Augmented Analyst",
                desc: "Leverages Copilot, dbt, and Python to automate reporting 10x faster.",
                salary: "$90K - $120K",
                highlight: true,
                color: "brand"
              },
              {
                level: "Senior Level",
                role: "Analytics Engineer",
                desc: "Architects cloud data warehouses and manages enterprise BI systems.",
                salary: "$125K - $160K+",
                highlight: false,
                color: "slate-800"
              }
            ].map((path) => (
              <StaggerItem key={path.role}>
                <HoverCard className="h-full">
                  <Card className={`relative flex flex-col h-full border overflow-hidden p-8 transition-all duration-500 shadow-sm
                    ${path.highlight ? 'border-brand/50 bg-surface/80 shadow-[0_0_30px_rgba(255,107,53,0.1)]' : 'border-border/80 bg-surface/30'}
                  `}>
                    {path.highlight && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand to-orange-400" />
                    )}
                    
                    <Badge className={`w-fit uppercase tracking-wider text-[10px] mb-6 font-bold
                      ${path.highlight ? 'bg-brand/10 text-brand border-brand/20' : 'bg-background text-muted border-border'}
                    `} variant={path.highlight ? 'default' : 'secondary'}>
                      {path.level}
                    </Badge>
                    
                    <h3 className="text-2xl font-bold text-foreground tracking-tight">{path.role}</h3>
                    <p className="text-sm text-muted mt-4 leading-relaxed flex-1">
                      {path.desc}
                    </p>
                    
                    <div className="pt-8 mt-8 border-t border-border/50">
                      <p className={`text-3xl font-extrabold tracking-tighter ${path.highlight ? 'text-foreground' : 'text-slate-300'}`}>
                        {path.salary}
                      </p>
                      <p className="text-[10px] text-muted uppercase tracking-widest mt-2 font-semibold">Average Base Salary</p>
                    </div>
                  </Card>
                </HoverCard>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── AI PRODUCTIVITY WORKFLOWS ──────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4">
          <FadeUp>
            <Card className="rounded-[2.5rem] border border-border/60 bg-gradient-to-br from-surface to-background p-8 md:p-14 shadow-2xl relative overflow-hidden">
              <div className="absolute -top-40 -right-40 w-96 h-96 bg-brand/10 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 grid lg:grid-cols-[1fr_1.5fr] gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-[1.1]">
                    The AI Productivity <br/><span className="text-brand">Advantage.</span>
                  </h2>
                  <p className="text-muted text-lg font-light leading-relaxed">
                    Hiring managers don&apos;t just want skills; they want velocity. See how an AI-first workflow transforms standard execution times.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { task: 'Complex SQL JOINs', manual: '45 mins', ai: '3 mins' },
                    { task: 'Debugging Python', manual: '2 hours', ai: '5 mins' },
                    { task: 'Interactive Dashboards', manual: '3 days', ai: '4 hours' },
                    { task: 'Pipeline Docs', manual: '1 day', ai: '10 mins' }
                  ].map((item) => (
                    <div key={item.task} className="flex flex-col rounded-2xl bg-background/50 border border-border/50 p-6 backdrop-blur-sm">
                      <p className="text-sm font-semibold text-foreground mb-4">{item.task}</p>
                      <div className="flex items-end justify-between">
                        <div className="space-y-1">
                          <p className="text-[10px] uppercase tracking-wider text-muted/60 font-bold">Manual</p>
                          <p className="text-sm text-muted line-through decoration-muted/40">{item.manual}</p>
                        </div>
                        <div className="w-px h-8 bg-border/50" />
                        <div className="space-y-1 text-right">
                          <p className="text-[10px] uppercase tracking-wider text-brand/80 font-bold">AI Flow</p>
                          <p className="text-lg font-bold text-brand">{item.ai}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </FadeUp>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <FadeUp>
          <section className="mx-auto max-w-4xl text-center space-y-8 pt-16 border-t border-border/50 px-4">
            <h2 className="text-3xl font-bold text-foreground">Ready to secure your role?</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto font-light">
              Join the ecosystem and build the exact portfolio hiring managers are looking for.
            </p>
            <Button size="lg" asChild className="shadow-[0_0_40px_rgba(255,107,53,0.3)] h-12 px-10 rounded-full text-base">
              <Link href="/syllabus">Start Your Journey</Link>
            </Button>
          </section>
        </FadeUp>
      </div>
    </PageReveal>
  );
}
