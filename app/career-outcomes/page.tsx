import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CareerOutcomesPage() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      <section className="space-y-6 pt-10 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Career Outcomes</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
          Scale your earning potential with <span className="text-brand">AI workflows.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted sm:text-lg">
          Our graduates don&apos;t just learn syntax—they master the modern AI-augmented workflows that top companies are aggressively hiring for.
        </p>
      </section>

      {/* Career Progression & Salary */}
      <section className="mx-auto max-w-5xl">
        <div className="grid gap-8 md:grid-cols-3">
          <Card className="flex flex-col border-border/80 bg-surface/40 p-6 hover:border-border/80 transition-colors">
            <Badge variant="secondary" className="w-fit text-brand border-brand/20 bg-brand/5 mb-4 uppercase tracking-wider text-[10px]">
              Entry Level
            </Badge>
            <h3 className="text-xl font-bold text-foreground">Junior Data Analyst</h3>
            <p className="text-sm text-muted mt-2 flex-1">
              Focuses on reporting, simple SQL queries, and Excel data cleaning. 
            </p>
            <div className="pt-4 mt-4 border-t border-border/50">
              <p className="text-2xl font-bold text-slate-200">$65K - $85K</p>
              <p className="text-xs text-muted uppercase tracking-wider mt-1">Average Salary</p>
            </div>
          </Card>

          <Card className="flex flex-col border-border/80 bg-surface/60 p-6 shadow-glow hover:border-brand/30 transition-colors relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
            <Badge className="w-fit bg-brand text-foreground hover:bg-brand border-none mb-4 uppercase tracking-wider text-[10px]">
              Our Target
            </Badge>
            <h3 className="text-xl font-bold text-foreground">AI-Augmented Analyst</h3>
            <p className="text-sm text-muted mt-2 flex-1">
              Leverages Copilot, dbt, and Python to automate reporting and build predictive insights 10x faster.
            </p>
            <div className="pt-4 mt-4 border-t border-border/50">
              <p className="text-2xl font-bold text-foreground">$90K - $120K</p>
              <p className="text-xs text-brand uppercase tracking-wider mt-1 font-semibold">Average Salary</p>
            </div>
          </Card>

          <Card className="flex flex-col border-border/80 bg-surface/40 p-6 hover:border-border/80 transition-colors">
            <Badge variant="secondary" className="w-fit text-muted border-border bg-slate-800 mb-4 uppercase tracking-wider text-[10px]">
              Senior Level
            </Badge>
            <h3 className="text-xl font-bold text-foreground">Analytics Engineer</h3>
            <p className="text-sm text-muted mt-2 flex-1">
              Architects cloud data warehouses, orchestrates pipelines, and manages enterprise BI systems.
            </p>
            <div className="pt-4 mt-4 border-t border-border/50">
              <p className="text-2xl font-bold text-slate-200">$125K - $160K+</p>
              <p className="text-xs text-muted uppercase tracking-wider mt-1">Average Salary</p>
            </div>
          </Card>
        </div>
      </section>

      {/* AI Productivity Advantage */}
      <section className="mx-auto max-w-5xl rounded-[2rem] border border-border/80 bg-background p-8 md:p-12 shadow-xl">
        <div className="text-center space-y-4 mb-10">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">The AI Productivity Advantage</h2>
          <p className="text-muted max-w-2xl mx-auto">
            Hiring managers don&apos;t just want skills; they want velocity. See how an AI-first workflow transforms standard tasks.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {[
            { task: 'Writing complex SQL JOINs', manual: '45 minutes', ai: '3 minutes (GitHub Copilot)' },
            { task: 'Debugging a broken Python script', manual: '2 hours', ai: '5 minutes (ChatGPT)' },
            { task: 'Building an interactive Dashboard', manual: '3 days', ai: '4 hours (Looker Gemini)' },
            { task: 'Documenting a data pipeline', manual: '1 day', ai: '10 minutes (dbt + AI)' }
          ].map((item, i) => (
            <div key={i} className="flex flex-col gap-3 rounded-2xl bg-surface/50 border border-border/50 p-5 hover:border-border/60 transition-colors">
              <p className="text-sm font-semibold text-foreground">{item.task}</p>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 border-r border-border/60">
                  <p className="text-[10px] uppercase tracking-wider text-muted font-bold">Traditional</p>
                  <p className="text-sm text-muted">{item.manual}</p>
                </div>
                <div className="space-y-1 pl-2">
                  <p className="text-[10px] uppercase tracking-wider text-brand font-bold">AI-Augmented</p>
                  <p className="text-sm font-medium text-slate-200">{item.ai}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Hiring Preparation Workflow */}
      <section className="mx-auto max-w-4xl space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-foreground tracking-tight">Your Hiring Preparation Workflow</h2>
          <p className="text-muted">Phase 6 of the curriculum is entirely dedicated to your job search execution.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { step: '01', title: 'ATS-Optimized Resume', desc: 'Pass the automated scanners with quantifiable, AI-reviewed bullet points.' },
            { step: '02', title: 'Employer-Facing Portfolio', desc: 'Publish a sleek GitHub Pages hub hosting your 5 capstone projects.' },
            { step: '03', title: 'Technical Interview Prep', desc: 'Master the top 40 SQL, Python, and BI questions asked by FAANG.' },
            { step: '04', title: 'Behavioral Pitch', desc: 'Nail the STAR method (Situation, Task, Action, Result) for behavioral rounds.' }
          ].map((item) => (
            <Card key={item.step} className="p-6 border-border/50 bg-surface/30 hover:border-border transition-colors">
              <div className="flex items-start gap-4">
                <span className="text-lg font-mono font-bold text-brand">{item.step}</span>
                <div>
                  <h3 className="text-lg font-bold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl text-center space-y-6 pt-12 border-t border-border/50">
        <h2 className="text-2xl font-bold text-foreground">Ready to secure your role?</h2>
        <Button size="lg" asChild className="shadow-lg shadow-brand/20">
          <Link href="/syllabus">Start Your Journey</Link>
        </Button>
      </section>
    </div>
  );
}
