'use client';

import React from 'react';
import { ScrollReveal } from '@/components/ui/motion';
import { Card } from '@/components/ui/card';

const journeyPhases = [
  {
    phase: 'Phase 1: The Foundation',
    title: 'Stop guessing. Start building.',
    desc: 'You\'ll start by mastering the absolute core of your chosen tech track. No complex theory, just learning how to use the fundamental tools and frameworks correctly.',
    icon: '🏗️',
    time: 'Weeks 1-3'
  },
  {
    phase: 'Phase 2: Advanced Execution',
    title: 'Make your work impossible to ignore.',
    desc: 'Move past the basics. Learn to design, develop, or analyze at an industry level, creating assets and logic that businesses actually value.',
    icon: '🎨',
    time: 'Weeks 4-6'
  },
  {
    phase: 'Phase 3: Automation & Scale',
    title: 'Work 10x faster than the average professional.',
    desc: 'Instead of doing manual repetitive work, you will learn to write scripts, automate pipelines, and use advanced tools to scale your output instantly.',
    icon: '⚡',
    time: 'Weeks 7-9'
  },
  {
    phase: 'Phase 4: AI-First Workflows',
    title: 'Your secret weapon.',
    desc: 'We are the only platform that natively integrates GenAI into every discipline. Use Copilot, ChatGPT, and Midjourney as your junior assistants to debug, generate, and execute.',
    icon: '🤖',
    time: 'Weeks 10-12'
  },
  {
    phase: 'Phase 5: The Capstone Portfolio',
    title: 'Build undeniable proof.',
    desc: 'You won\'t just get a certificate. You will build 4 real-world business projects and host them live on your personal portfolio to prove your capability.',
    icon: '🚀',
    time: 'Weeks 13-15'
  },
  {
    phase: 'Phase 6: Career Launch',
    title: 'Get past the ATS scanners.',
    desc: 'We optimize your resume, teach you how to pass live technical interviews, and use industry-standard frameworks to crush behavioral questions.',
    icon: '🎯',
    time: 'Week 16'
  }
];

export function TransformationStory() {
  return (
    <section className="px-4 sm:px-6 lg:px-8 py-24 relative">
      <div className="mx-auto max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight mb-4">
              Your 16-Week Transformation
            </h2>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              We don&apos;t just teach syntax. We rewire how you solve problems, moving you from a complete beginner to a highly confident, portfolio-ready professional.
            </p>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* Vertical Timeline Line */}
          <div className="absolute left-[28px] sm:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-brand/50 to-transparent sm:-translate-x-1/2" />

          <div className="space-y-12">
            {journeyPhases.map((item, i) => {
              const isEven = i % 2 === 0;
              return (
                <ScrollReveal key={i} delay={0.1}>
                  <div className={`relative flex items-center ${isEven ? 'sm:flex-row-reverse' : 'sm:flex-row'}`}>
                    
                    {/* Timeline Node */}
                    <div className="absolute left-0 sm:left-1/2 w-14 h-14 -translate-x-0 sm:-translate-x-1/2 rounded-full bg-background border-4 border-surface shadow-glow flex items-center justify-center text-xl z-10">
                      {item.icon}
                    </div>

                    {/* Content Card */}
                    <div className={`pl-20 sm:pl-0 sm:w-1/2 ${isEven ? 'sm:pr-16 text-left sm:text-right' : 'sm:pl-16 text-left'}`}>
                      <Card className="p-6 sm:p-8 border-border bg-surface hover:border-brand/40 transition-colors shadow-sm">
                        <span className="text-xs font-bold uppercase tracking-wider text-brand mb-2 block">
                          {item.time} • {item.phase}
                        </span>
                        <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-3 leading-tight">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted leading-relaxed">
                          {item.desc}
                        </p>
                      </Card>
                    </div>

                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
