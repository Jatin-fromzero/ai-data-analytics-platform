'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { ScrollReveal, FadeUp } from '@/components/ui/motion';
import { Code2, Megaphone, Database, Sparkles } from 'lucide-react';

const successStories = [
  {
    name: 'Sarah J.',
    oldRole: 'Marketing Assistant',
    newRole: 'Fullstack Developer',
    hours: '140 Hours',
    quote: 'The AI workflows I learned here allowed me to pass the technical interview easily. I built my first full Next.js SaaS in 2 weeks.',
    icon: <Code2 className="h-6 w-6 text-brand" />,
    color: 'from-brand/20',
    border: 'group-hover:border-brand/40'
  },
  {
    name: 'Michael T.',
    oldRole: 'Recent Graduate',
    newRole: 'Growth Marketing Lead',
    hours: '210 Hours',
    quote: 'My programmatic ad portfolio from the capstone projects was the exact reason I got my foot in the door.',
    icon: <Megaphone className="h-6 w-6 text-orange-400" />,
    color: 'from-orange-500/20',
    border: 'group-hover:border-orange-500/40'
  },
  {
    name: 'Elena R.',
    oldRole: 'Operations Manager',
    newRole: 'Data Scientist',
    hours: '185 Hours',
    quote: 'I didn\'t want to learn Python from scratch. Learning how to use Copilot to write my ML pipelines changed everything.',
    icon: <Database className="h-6 w-6 text-purple-400" />,
    color: 'from-purple-500/20',
    border: 'group-hover:border-purple-500/40'
  }
];

export function StudentSuccess() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 md:py-32 relative overflow-hidden bg-[#020202]">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-gradient-to-b from-brand/10 to-transparent blur-[150px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl relative z-10">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-inner">
              <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
              Real Career Transformations
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-450 leading-[0.95]">
              Don&apos;t just learn theory. <br className="hidden sm:block" />
              <span className="italic font-light bg-gradient-to-r from-brand via-orange-400 to-amber-300 bg-clip-text text-transparent">Become a working professional.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 font-light leading-relaxed max-w-2xl mx-auto">
              See the exact hours and pathways our students took to pivot their careers using AI-first workflows and project-based milestones.
            </p>
          </div>
        </ScrollReveal>

        {/* Asymmetrical Grid Layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
          {successStories.map((story, i) => (
            <FadeUp key={story.name} delay={i * 0.15} className={i === 1 ? 'lg:mt-16' : i === 2 ? 'lg:mt-8' : ''}>
              <Card className={`relative p-8 sm:p-10 rounded-[2.5rem] border border-white/[0.03] bg-slate-950/20 backdrop-blur-2xl overflow-hidden group transition-all duration-700 shadow-[0_20px_80px_rgba(0,0,0,0.4)] hover:shadow-[0_20px_80px_rgba(255,107,53,0.1)] ${story.border} h-full flex flex-col`}>
                {/* Subtle top gradient */}
                <div className={`absolute top-0 left-0 w-full h-[150px] bg-gradient-to-b ${story.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 blur-[50px] rounded-full group-hover:bg-white/10 transition-colors duration-700" />
                
                <div className="relative z-10 flex flex-col h-full gap-8">
                  <div className="flex justify-between items-start">
                    <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-white/[0.08] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500">
                      {story.icon}
                    </div>
                    <div className="rounded-full bg-white/[0.03] border border-white/[0.05] px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-slate-400">
                      {story.hours}
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-2xl font-black text-slate-100 tracking-tight">{story.name}</h3>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider line-through decoration-slate-600/50">{story.oldRole}</span>
                      <span className="text-brand font-black">→</span>
                      <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-md">{story.newRole}</span>
                    </div>
                  </div>
                  
                  <div className="mt-auto border-t border-white/[0.04] pt-6 relative">
                    <Sparkles className="absolute -top-3 left-1/2 -translate-x-1/2 w-5 h-5 text-brand/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[#020202] px-1" />
                    <p className="text-sm font-light leading-relaxed text-slate-400">
                      &quot;{story.quote}&quot;
                    </p>
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
