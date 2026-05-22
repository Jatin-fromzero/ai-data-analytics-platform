'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function ContactPage() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      <section className="space-y-6 pt-10 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Get in touch</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Contact our <span className="text-brand">admissions team.</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          Have questions about the curriculum, career support, or AI tooling? Reach out below and a human will respond within 24 hours.
        </p>
      </section>

      <section className="mx-auto max-w-5xl grid gap-12 md:grid-cols-2 items-start">
        {/* Contact Form */}
        <Card className="p-8 border-border/80 bg-surface/60 shadow-xl backdrop-blur-sm">
          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="space-y-4">
              <div className="grid gap-2">
                <label htmlFor="name" className="text-sm font-medium text-muted">Full Name</label>
                <input 
                  id="name" 
                  type="text" 
                  placeholder="Jane Doe" 
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-600 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                />
              </div>
              
              <div className="grid gap-2">
                <label htmlFor="email" className="text-sm font-medium text-muted">Email Address</label>
                <input 
                  id="email" 
                  type="email" 
                  placeholder="jane@example.com" 
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-600 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                />
              </div>

              <div className="grid gap-2">
                <label htmlFor="background" className="text-sm font-medium text-muted">Current Background</label>
                <select 
                  id="background" 
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors appearance-none"
                >
                  <option value="">Select your background...</option>
                  <option value="beginner">Complete Beginner</option>
                  <option value="student">University Student</option>
                  <option value="excel">Excel / Business User</option>
                  <option value="tech">Software / Tech Professional</option>
                </select>
              </div>

              <div className="grid gap-2">
                <label htmlFor="message" className="text-sm font-medium text-muted">Your Message</label>
                <textarea 
                  id="message" 
                  rows={4}
                  placeholder="How can we help you?" 
                  className="w-full rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground placeholder:text-slate-600 focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors resize-none"
                />
              </div>
            </div>
            
            <Button size="lg" className="w-full shadow-lg shadow-brand/20">Send Message</Button>
            <p className="text-center text-xs text-muted">
              No backend integrated yet. Form operates in frontend demo mode.
            </p>
          </form>
        </Card>

        {/* FAQs */}
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
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
                <div key={i} className="rounded-2xl border border-border/60 bg-surface/20 p-5 hover:border-border/60 transition-colors">
                  <h3 className="text-sm font-bold text-foreground">{faq.q}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-6 text-center">
            <h3 className="text-lg font-bold text-foreground mb-2">Prefer to talk directly?</h3>
            <p className="text-sm text-muted mb-4">Book a 15-minute discovery call with our enrollment team.</p>
            <Button variant="secondary" className="bg-background text-foreground border border-border hover:bg-slate-800">
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
