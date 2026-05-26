'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollReveal, FadeUp } from '@/components/ui/motion';

const successStories = [
  {
    name: 'Sarah J.',
    oldRole: 'Marketing Assistant',
    newRole: 'Data Analyst at TechCorp',
    hours: '140 Hours',
    quote: 'The AI workflows I learned here allowed me to pass the technical interview easily. I automated my old reports in 2 days.',
    avatar: '👩‍💼',
    color: 'from-emerald-500/20'
  },
  {
    name: 'Michael T.',
    oldRole: 'Recent Graduate',
    newRole: 'BI Developer',
    hours: '210 Hours',
    quote: 'My GitHub portfolio from the capstone projects was the only reason I got my foot in the door.',
    avatar: '👨‍💻',
    color: 'from-blue-500/20'
  },
  {
    name: 'Elena R.',
    oldRole: 'Operations Manager',
    newRole: 'Senior Operations Analyst',
    hours: '95 Hours',
    quote: 'I didn\'t want to learn to code from scratch. Learning how to use ChatGPT to write my SQL queries changed everything.',
    avatar: '👩‍🔬',
    color: 'from-purple-500/20'
  }
];

export function StudentSuccess() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[400px] bg-brand/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="outline" className="mb-4 border-brand/30 text-brand">Real Career Transformations</Badge>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Don&apos;t just learn analytics. <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-amber-500">Become a working analyst.</span>
            </h2>
            <p className="text-lg text-muted">
              See the exact hours and pathways our students took to pivot their careers using AI-first workflows.
            </p>
          </div>
        </ScrollReveal>

        {/* Asymmetrical Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {successStories.map((story, i) => (
            <FadeUp key={story.name} delay={i * 0.15} className={i === 1 ? 'lg:mt-12' : i === 2 ? 'lg:mt-6' : ''}>
              <Card className="relative p-6 sm:p-8 rounded-[2rem] border-border bg-surface overflow-hidden group hover:border-brand/40 transition-colors duration-500 shadow-sm hover:shadow-[0_8px_40px_rgba(255,107,53,0.08)]">
                {/* Subtle top gradient */}
                <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-b ${story.color} to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col h-full gap-6">
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-background border border-border flex items-center justify-center text-3xl shadow-sm">
                      {story.avatar}
                    </div>
                    <Badge variant="secondary" className="font-mono text-xs text-muted border-border">{story.hours}</Badge>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{story.name}</h3>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-sm text-muted line-through opacity-70">{story.oldRole}</span>
                      <span className="text-brand text-sm font-bold">→</span>
                      <span className="text-sm font-medium text-foreground">{story.newRole}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto border-t border-border/50 pt-4">
                    <p className="text-sm italic leading-relaxed text-muted">&quot;{story.quote}&quot;</p>
                  </div>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </section>
  );
}
