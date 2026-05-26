import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion';

export default function AboutPage() {
  return (
    <PageReveal>
      <div className="space-y-24 lg:space-y-36 pb-20 overflow-hidden">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <section className="relative pt-24 pb-16 text-center border-b border-border/50 bg-surface/30">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-brand/5 blur-[120px] pointer-events-none rounded-full" />
          <FadeUp>
            <div className="max-w-4xl mx-auto px-4 relative z-10">
              <p className="text-[11px] font-bold tracking-[0.3em] text-brand uppercase mb-6">Our Mission</p>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                Redefining how <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-orange-400">data analytics</span> is taught.
              </h1>
              <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted mt-8 font-light leading-relaxed">
                The industry changed the moment AI workflows went mainstream. Traditional spreadsheet courses are no longer enough to get hired. We built the curriculum for the future.
              </p>
            </div>
          </FadeUp>
        </section>

        {/* ── PLATFORM PILLARS ───────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4">
          <StaggerContainer className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Outcome-Driven",
                desc: "Every module ends with a physical asset. You don't just 'learn' Python; you deploy a predictive churn app to Streamlit Cloud.",
                icon: "🎯"
              },
              {
                title: "AI Co-Pilot Native",
                desc: "We don't ignore LLMs. We teach you how to write prompts that generate SQL, analyze CSVs, and orchestrate dbt models with ChatGPT.",
                icon: "⚡"
              },
              {
                title: "Rigorous & Honest",
                desc: "No fake metrics. Real, dirty datasets with null values, broken schemas, and business ambiguities exactly like the real world.",
                icon: "🛡️"
              }
            ].map((pillar) => (
              <StaggerItem key={pillar.title}>
                <Card className="h-full p-8 md:p-10 border-border/60 bg-surface/30 hover:bg-surface/60 transition-all duration-500 hover:border-brand/30 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 blur-[50px] group-hover:bg-brand/10 transition-colors" />
                  <span className="text-4xl mb-6 block relative z-10">{pillar.icon}</span>
                  <h3 className="text-xl font-bold text-foreground mb-4 relative z-10">{pillar.title}</h3>
                  <p className="text-sm text-muted leading-relaxed relative z-10">{pillar.desc}</p>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* ── THE PARADIGM SHIFT ─────────────────────────────────────────── */}
        <section className="mx-auto max-w-6xl px-4">
          <FadeUp>
            <div className="overflow-hidden rounded-[2.5rem] border border-border/60 bg-background shadow-2xl lg:flex relative">
              {/* Left Content */}
              <div className="flex-1 p-10 md:p-16 space-y-8 bg-gradient-to-br from-surface to-background relative z-10">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-brand font-bold mb-4">The Paradigm Shift</p>
                  <h2 className="text-3xl md:text-4xl font-bold text-foreground leading-[1.2] tracking-tight">
                    Why AI-first learning <br/> matters in 2026.
                  </h2>
                </div>
                <div className="space-y-6 text-muted font-light leading-relaxed text-base">
                  <p>
                    Five years ago, a Junior Analyst spent 60% of their day writing boilerplate SQL and fighting with Excel crashes.
                  </p>
                  <p>
                    Today, tools like <strong className="text-foreground font-semibold">GitHub Copilot</strong>, <strong className="text-foreground font-semibold">Gemini</strong>, and <strong className="text-foreground font-semibold">Looker Studio AI</strong> can draft a 100-line CTE or visualize a trend in seconds. The role of the analyst has shifted from &quot;code monkey&quot; to &quot;business strategic partner&quot;.
                  </p>
                  <p>
                    Analysts who refuse to adopt AI workflows will be replaced by those who do. Our methodology embraces this reality.
                  </p>
                </div>
              </div>

              {/* Right Tech Stack */}
              <div className="flex-1 bg-surface/30 p-10 md:p-16 border-t lg:border-t-0 lg:border-l border-border/80 flex flex-col justify-center relative">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,107,53,0.03),transparent_70%)]" />
                <div className="space-y-8 relative z-10">
                  <h3 className="text-xl font-semibold text-foreground tracking-tight">Modern Analytics Tech Stack</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {['BigQuery', 'Snowflake', 'dbt', 'Airflow', 'Python', 'Pandas', 'Looker', 'Power BI', 'Streamlit', 'LangChain', 'OpenAI', 'SHAP'].map((tool) => (
                      <span key={tool} className="px-4 py-2 rounded-full border border-border/80 bg-background text-xs font-semibold text-muted tracking-wide shadow-sm hover:border-brand/40 hover:text-foreground transition-colors cursor-default">
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeUp>
        </section>

        {/* ── CTA ────────────────────────────────────────────────────────── */}
        <section className="mx-auto max-w-5xl px-4">
          <FadeUp>
            <Card className="relative overflow-hidden rounded-[2.5rem] border-brand/20 bg-surface/40 p-12 md:p-20 text-center shadow-[0_0_50px_rgba(255,107,53,0.05)]">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[600px] bg-brand/5 blur-[100px] pointer-events-none rounded-full" />
              <div className="relative z-10 space-y-8">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground tracking-tight">Join the modern workforce.</h2>
                <p className="text-lg text-muted max-w-xl mx-auto font-light">
                  Skip the outdated tutorials. Learn the stack that hiring managers are actually looking for.
                </p>
                <div className="pt-4">
                  <Button size="lg" asChild className="shadow-[0_0_40px_rgba(255,107,53,0.3)] h-14 px-12 rounded-full text-lg font-medium">
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
