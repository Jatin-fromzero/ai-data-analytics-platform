'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion';

export default function ContactPage() {
  return (
    <PageReveal>
      <div className="space-y-16 lg:space-y-24 pb-20 overflow-hidden mt-8">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <section className="relative pt-20 pb-12 text-center">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[400px] bg-brand/5 blur-[120px] pointer-events-none rounded-full" />
          <FadeUp>
            <div className="max-w-3xl mx-auto px-4 relative z-10">
              <p className="text-[10px] font-bold tracking-[0.3em] text-brand uppercase mb-6">Admissions & Support</p>
              <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Let&apos;s talk about <br/>
                <span className="text-muted-foreground font-light italic">your trajectory.</span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg text-muted mt-8 font-light leading-relaxed">
                Have questions about the curriculum, career support, or AI tooling? Reach out below and a human expert will respond within 24 hours.
              </p>
            </div>
          </FadeUp>
        </section>

        <section className="mx-auto max-w-[1200px] px-4 grid gap-12 lg:grid-cols-2 items-start relative z-10">
          
          {/* ── GLASSMORPHIC FORM ────────────────────────────────────────── */}
          <FadeUp delay={0.1}>
            <Card className="p-8 md:p-10 border-border/40 bg-surface/20 shadow-2xl backdrop-blur-md relative overflow-hidden group hover:border-brand/30 transition-colors duration-500">
              <div className="absolute -top-32 -left-32 w-64 h-64 bg-brand/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-brand/15 transition-colors duration-700" />
              
              <form className="relative z-10 space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-5">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-[11px] font-bold uppercase tracking-wider text-muted ml-1">Full Name</label>
                    <input 
                      id="name" 
                      type="text" 
                      placeholder="Jane Doe" 
                      className="w-full rounded-2xl border border-border/50 bg-background/40 px-5 py-4 text-sm text-foreground placeholder:text-slate-600 focus:border-brand/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-inner"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <label htmlFor="email" className="text-[11px] font-bold uppercase tracking-wider text-muted ml-1">Email Address</label>
                    <input 
                      id="email" 
                      type="email" 
                      placeholder="jane@example.com" 
                      className="w-full rounded-2xl border border-border/50 bg-background/40 px-5 py-4 text-sm text-foreground placeholder:text-slate-600 focus:border-brand/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-inner"
                    />
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="background" className="text-[11px] font-bold uppercase tracking-wider text-muted ml-1">Current Background</label>
                    <div className="relative">
                      <select 
                        id="background" 
                        className="w-full rounded-2xl border border-border/50 bg-background/40 px-5 py-4 text-sm text-muted focus:border-brand/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-inner appearance-none cursor-pointer"
                      >
                        <option value="">Select your background...</option>
                        <option value="beginner">Complete Beginner</option>
                        <option value="student">University Student</option>
                        <option value="excel">Excel / Business User</option>
                        <option value="tech">Software / Tech Professional</option>
                      </select>
                      <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-muted">
                        ▼
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <label htmlFor="message" className="text-[11px] font-bold uppercase tracking-wider text-muted ml-1">Your Message</label>
                    <textarea 
                      id="message" 
                      rows={5}
                      placeholder="How can we help you accelerate your career?" 
                      className="w-full rounded-2xl border border-border/50 bg-background/40 px-5 py-4 text-sm text-foreground placeholder:text-slate-600 focus:border-brand/50 focus:bg-background/80 focus:outline-none focus:ring-4 focus:ring-brand/10 transition-all shadow-inner resize-none"
                    />
                  </div>
                </div>
                
                <Button size="lg" className="w-full shadow-[0_0_30px_rgba(255,107,53,0.2)] h-14 rounded-full text-base font-semibold bg-brand text-background hover:bg-brand/90 transition-all hover:scale-[1.02]">
                  Send Message
                </Button>
                <p className="text-center text-[10px] uppercase tracking-wider text-muted/60 font-bold">
                  Demo Mode: No backend integrated
                </p>
              </form>
            </Card>
          </FadeUp>

          {/* ── FAQS ──────────────────────────────────────────────────────── */}
          <div className="space-y-10">
            <FadeUp delay={0.2}>
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-8 tracking-tight">Frequently Asked Questions</h2>
                <StaggerContainer className="space-y-4">
                  {[
                    {
                      q: "Is this course for complete beginners?",
                      a: "Yes. Phase 1 starts with foundational Excel and Statistics. We gradually introduce coding (SQL in Phase 2, Python in Phase 3)."
                    },
                    {
                      q: "Do I need paid AI accounts?",
                      a: "No. You can complete 95% of the curriculum using free tiers of ChatGPT, Gemini, and GitHub Copilot (free for students/trials)."
                    },
                    {
                      q: "How much time is required per week?",
                      a: "We recommend 10-15 hours per week to comfortably complete the modules, run the code, and build the capstone projects."
                    },
                    {
                      q: "Is there career or placement support?",
                      a: "Phase 6 is entirely dedicated to optimizing your ATS resume, LinkedIn profile, and practicing our 40-question technical interview bank."
                    }
                  ].map((faq, i) => (
                    <StaggerItem key={i}>
                      <div className="rounded-2xl border border-border/40 bg-surface/20 p-6 hover:bg-surface/40 hover:border-border/80 transition-colors">
                        <h3 className="text-sm font-semibold text-foreground tracking-tight">{faq.q}</h3>
                        <p className="mt-3 text-sm text-muted leading-relaxed font-light">{faq.a}</p>
                      </div>
                    </StaggerItem>
                  ))}
                </StaggerContainer>
              </div>
            </FadeUp>
            
            <FadeUp delay={0.3}>
              <div className="rounded-[2rem] border border-brand/20 bg-gradient-to-br from-brand/10 to-transparent p-8 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,107,53,0.05)_0%,transparent_100%)] pointer-events-none" />
                <div className="relative z-10">
                  <h3 className="text-xl font-bold text-foreground tracking-tight mb-2">Prefer to talk directly?</h3>
                  <p className="text-sm text-muted mb-6 font-light">Book a 15-minute discovery call with our enrollment team to discuss your goals.</p>
                  <Button variant="secondary" className="bg-background text-foreground border border-border/50 shadow-sm hover:bg-surface rounded-full px-8 h-12">
                    Schedule a Call
                  </Button>
                </div>
              </div>
            </FadeUp>
          </div>

        </section>
      </div>
    </PageReveal>
  );
}
