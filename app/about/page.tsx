'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Code2, Database, Palette, Cpu, Sparkles, Terminal } from 'lucide-react';

export default function AboutPage() {
  return (
    <PageReveal>
      <div className="space-y-24 lg:space-y-36 pb-20 overflow-hidden">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <section className="relative pt-32 pb-20 text-center bg-slate-950/20 border-b border-white/[0.03]">
          {/* Ambient Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-brand/10 to-transparent rounded-full blur-[140px] pointer-events-none" />
          
          <FadeUp>
            <div className="max-w-4xl mx-auto px-6 relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5 text-[9px] font-bold uppercase tracking-widest text-slate-400 shadow-inner">
                <span className="w-1.5 h-1.5 rounded-full bg-brand animate-pulse" />
                Our Mission
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-[-0.04em] text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-slate-450 leading-[0.95]">
                Redefining how <br/>
                <span className="italic font-light bg-gradient-to-r from-brand via-orange-400 to-amber-300 bg-clip-text text-transparent">modern tech</span> is mastered.
              </h1>
              <p className="mx-auto max-w-3xl text-base sm:text-lg text-slate-400 mt-8 font-light leading-relaxed">
                The industry changed the moment generative AI workflows went mainstream. Traditional theory-based courses are no longer enough to succeed. We built the ultimate AI-integrated student OS to train placement-ready professionals across engineering, analytics, marketing, and design.
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ── PLATFORM PILLARS ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-6">
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Outcome-Driven",
                desc: "Every module ends with a high-fidelity deployment. Whether it's a live Next.js portal, a custom Python ML classifier, an executive Tableau dashboard, or a professional Figma SaaS mockup.",
                icon: <Code2 className="h-6 w-6 text-brand" />
              },
              {
                title: "AI Co-Pilot Native",
                desc: "We don't ban AI; we make it your superpower. Learn socratic prompt engineering, code auditing with LLMs, ad copywriting automations, and Figma component generations.",
                icon: <Sparkles className="h-6 w-6 text-orange-400" />
              },
              {
                title: "Rigorous & Honest",
                desc: "No mock metrics. Build real-world applications under industry constraints with dirty datasets, complex schemas, API rate limiting, and multi-day marketing latency metrics.",
                icon: <Terminal className="h-6 w-6 text-purple-400" />
              }
            ].map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Card className="h-full p-8 md:p-10 border border-white/[0.03] bg-slate-950/20 backdrop-blur-2xl hover:border-brand/35 transition-all duration-500 shadow-2xl relative overflow-hidden group rounded-[2rem]">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[50px] group-hover:bg-brand/10 transition-colors" />
                  <div className="h-12 w-12 rounded-xl bg-slate-950 border border-white/[0.06] flex items-center justify-center mb-6 relative z-10 shadow-lg">
                    {pillar.icon}
                  </div>
                  <h3 className="text-lg font-bold text-slate-100 mb-4 relative z-10">{pillar.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed relative z-10 font-light">{pillar.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── THE PARADIGM SHIFT ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-6">
          <FadeUp>
            <div className="overflow-hidden rounded-[2.5rem] border border-white/[0.03] bg-slate-950/20 backdrop-blur-2xl shadow-[0_35px_100px_rgba(0,0,0,0.8)] lg:flex relative">
              {/* Left Content */}
              <div className="flex-1 p-10 md:p-16 space-y-8 bg-gradient-to-br from-slate-950/30 to-transparent relative z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand font-bold mb-4">The Paradigm Shift</p>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-slate-100 leading-[1.1] tracking-tight">
                    Why AI-first learning <br/> matters in 2026.
                  </h2>
                </div>
                <div className="space-y-6 text-slate-450 font-light leading-relaxed text-sm sm:text-base">
                  <p>
                    Five years ago, a developer, marketer, or designer spent 60% of their day on boilerplate code, manual funnels, or asset tracing.
                  </p>
                  <p>
                    Today, tools like <strong className="text-slate-100 font-semibold">GitHub Copilot</strong>, <strong className="text-slate-100 font-semibold">Gemini</strong>, and <strong className="text-slate-100 font-semibold">Midjourney</strong> can scaffold fullstack applications or draft master graphics in seconds. The technical professional's role has shifted from a mere executor to a high-leverage architect.
                  </p>
                  <p>
                    Those who refuse to adopt AI workflows will be replaced by those who do. Our socratic Educare OS methodology embraces this reality.
                  </p>
                </div>
              </div>

              {/* Right Tech Stack */}
              <div className="flex-1 bg-slate-950/40 p-10 md:p-16 border-t lg:border-t-0 lg:border-l border-white/[0.04] flex flex-col justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.03),transparent_70%)] pointer-events-none" />
                <div className="space-y-8 relative z-10">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Unified 5-Domain Tech Stack</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-brand mb-2.5">Engineering & Architecture</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Next.js', 'React', 'Prisma ORM', 'MySQL', 'REST APIs', 'Vercel'].map((tool) => (
                          <span key={tool} className="px-3 py-1.5 rounded-lg border border-white/5 bg-slate-900/60 text-[10px] font-semibold text-slate-400 tracking-wide hover:border-brand/40 hover:text-foreground transition-all cursor-default shadow-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 mb-2.5">Data Science & Analytics</h4>
                      <div className="flex flex-wrap gap-2">
                        {['BigQuery', 'SQL', 'Python', 'Pandas', 'Scikit-Learn', 'SHAP', 'Tableau'].map((tool) => (
                          <span key={tool} className="px-3 py-1.5 rounded-lg border border-white/5 bg-slate-900/60 text-[10px] font-semibold text-slate-400 tracking-wide hover:border-emerald-400/40 hover:text-foreground transition-all cursor-default shadow-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-400 mb-2.5">Creative Suite & Design</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Figma', 'Illustrator', 'Midjourney', 'Photoshop', 'Auto-Layout'].map((tool) => (
                          <span key={tool} className="px-3 py-1.5 rounded-lg border border-white/5 bg-slate-900/60 text-[10px] font-semibold text-slate-400 tracking-wide hover:border-purple-400/40 hover:text-foreground transition-all cursor-default shadow-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-wider text-blue-400 mb-2.5">Growth & Funnels</h4>
                      <div className="flex flex-wrap gap-2">
                        {['Google Ads', 'Meta Ads', 'GA4', 'Zapier', 'Mailchimp'].map((tool) => (
                          <span key={tool} className="px-3 py-1.5 rounded-lg border border-white/5 bg-slate-900/60 text-[10px] font-semibold text-slate-400 tracking-wide hover:border-blue-400/40 hover:text-foreground transition-all cursor-default shadow-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-6">
          <FadeUp>
            <Card className="relative overflow-hidden rounded-[2.5rem] border border-white/[0.04] bg-slate-950/20 backdrop-blur-2xl p-12 md:p-20 text-center shadow-[0_0_80px_rgba(255,107,53,0.08),0_32px_80px_rgba(0,0,0,0.3)]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] bg-brand/5 blur-[100px] pointer-events-none rounded-full" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl md:text-5xl font-black text-slate-100 tracking-tight leading-tight">Join the modern technical workforce.</h2>
                <p className="text-xs sm:text-base text-slate-400 max-w-xl mx-auto font-light leading-relaxed">
                  Skip the outdated tutorials. Master the complete cross-functional stack that hiring managers are actually looking for.
                </p>
                <div className="pt-4">
                  <Button size="lg" asChild className="rounded-full bg-gradient-to-r from-brand to-orange-500 px-10 py-4 h-12 text-xs font-bold uppercase tracking-widest text-slate-950 shadow-[0_0_35px_rgba(255,107,53,0.3)] border-none transition-all duration-300 hover:scale-105">
                    <Link href="/syllabus">Explore the Syllabus</Link>
                  </Button>
                </div>
              </div>
            </Card>
          </FadeUp>
        </section>
        
      </div>
    </PageReveal>
  );
}
