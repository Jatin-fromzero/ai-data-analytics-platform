import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* Editorial Header */}
      <section className="space-y-6 pt-10 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Our Mission</p>
        <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Redefining how <span className="text-brand">data analytics</span> is taught.
        </h1>
        <p className="mx-auto max-w-2xl text-lg text-muted">
          The industry changed the moment AI workflows went mainstream. We built this platform because traditional spreadsheet courses are no longer enough to get hired.
        </p>
      </section>

      {/* Platform Pillars */}
      <section className="mx-auto max-w-5xl">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Outcome-Driven",
              desc: "Every module ends with a physical asset. You don't just 'learn' Python; you deploy a predictive churn app to Streamlit Cloud.",
              icon: "🎯"
            },
            {
              title: "AI Co-Pilot Native",
              desc: "We don't ignore LLMs. We teach you how to write prompts that generate SQL, analyze CSVs with Julius AI, and orchestrate dbt models with ChatGPT.",
              icon: "⚡"
            },
            {
              title: "Rigorous & Honest",
              desc: "No fake metrics. No web3 hype. Real, dirty datasets with null values, broken schemas, and business ambiguities just like the real world.",
              icon: "🛡️"
            }
          ].map((pillar) => (
            <Card key={pillar.title} className="p-8 border-border/50 bg-surface/40 hover:bg-surface/60 transition-colors space-y-4">
              <span className="text-3xl">{pillar.icon}</span>
              <h3 className="text-xl font-bold text-foreground">{pillar.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{pillar.desc}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Why AI-First Section */}
      <section className="mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-border bg-background shadow-xl lg:flex">
        <div className="flex-1 p-8 md:p-12 space-y-6 bg-gradient-to-br from-slate-900 to-slate-950">
          <p className="text-sm uppercase tracking-[0.2em] text-brand font-semibold">The Paradigm Shift</p>
          <h2 className="text-3xl font-bold text-foreground leading-tight">
            Why AI-first analytics learning matters in 2026.
          </h2>
          <div className="space-y-4 text-muted leading-relaxed text-sm">
            <p>
              Five years ago, a Junior Analyst spent 60% of their day writing boilerplate SQL and fighting with Excel crashes.
            </p>
            <p>
              Today, tools like <strong className="text-foreground">GitHub Copilot</strong>, <strong className="text-foreground">Gemini</strong>, and <strong className="text-foreground">Looker Studio AI</strong> can draft a 100-line CTE or visualize a trend in seconds. The role of the analyst has shifted from &quot;code monkey&quot; to &quot;business strategic partner&quot;.
            </p>
            <p>
              Analysts who refuse to adopt AI workflows will be replaced by those who do. Our methodology embraces this reality.
            </p>
          </div>
        </div>
        <div className="flex-1 bg-surface/50 p-8 md:p-12 border-t lg:border-t-0 lg:border-l border-border/80 flex flex-col justify-center">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-foreground">Modern Analytics Tech Stack</h3>
            <div className="flex flex-wrap gap-2">
              {['BigQuery', 'Snowflake', 'dbt', 'Airflow', 'Python', 'Pandas', 'Looker', 'Power BI', 'Streamlit', 'LangChain', 'OpenAI', 'SHAP'].map((tool) => (
                <span key={tool} className="px-3 py-1.5 rounded-full border border-border bg-slate-800/50 text-xs font-medium text-muted">
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl text-center space-y-6 pt-12 border-t border-border/50">
        <h2 className="text-2xl font-bold text-foreground">Join the modern data workforce.</h2>
        <Button size="lg" asChild className="shadow-lg shadow-brand/20">
          <Link href="/syllabus">Explore the Syllabus</Link>
        </Button>
      </section>
    </div>
  );
}
