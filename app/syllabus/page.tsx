import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const syllabusPhases = [
  {
    phase: 1,
    title: 'Excel & Statistical Foundations',
    duration: 'Weeks 1–3',
    difficulty: 'Beginner',
    color: '#81C784',
    objective: 'Master data cleaning, advanced formulas, ETL pipelines in Power Query, and essential business statistics.',
    modules: [
      { week: 'Week 1', topic: 'Data Analytics in the AI Era & Excel Basics' },
      { week: 'Week 2', topic: 'Statistics Supercharged with AI' },
      { week: 'Week 3', topic: 'Advanced Excel & Power Query Pipelines' }
    ],
    capstone: 'RetailCo Sales Performance Analyzer',
    tools: ['Excel', 'Microsoft Copilot']
  },
  {
    phase: 2,
    title: 'SQL & Cloud Data Warehousing',
    duration: 'Weeks 4–6',
    difficulty: 'Intermediate',
    color: '#4FC3F7',
    objective: 'Write relational database queries from scratch, execute multi-layer joins, window functions, and optimize queries.',
    modules: [
      { week: 'Week 4', topic: 'SQL Mastery & Relational Databases' },
      { week: 'Week 5', topic: 'Advanced Queries & Window Functions' },
      { week: 'Week 6', topic: 'AI-Powered SQL Workflows in BigQuery' }
    ],
    capstone: 'E-Commerce Funnel Analytics Engine',
    tools: ['SQL', 'BigQuery', 'Gemini AI']
  },
  {
    phase: 3,
    title: 'Python & Automated Analytics',
    duration: 'Weeks 7–10',
    difficulty: 'Advanced',
    color: '#FF6B35',
    objective: 'Build algorithmic data pipelines in Pandas, perform programmatic EDA, and deploy interactive web applications.',
    modules: [
      { week: 'Week 7', topic: 'Python Fundamentals & Pair Programming' },
      { week: 'Week 8', topic: 'Pandas Data Wrangling & Pipelines' },
      { week: 'Week 9', topic: 'Automated EDA & Visualizations' },
      { week: 'Week 10', topic: 'Predictive Modeling & SHAP Explainability' }
    ],
    capstone: 'Customer Intelligence Platform',
    tools: ['Python', 'Streamlit', 'Scikit-Learn', 'SHAP']
  },
  {
    phase: 4,
    title: 'Business Intelligence & Storytelling',
    duration: 'Weeks 11–13',
    difficulty: 'Intermediate',
    color: '#FF8A65',
    objective: 'Create stakeholder-ready dashboards, configure time-intelligence calculations, and master narrative reporting.',
    modules: [
      { week: 'Week 11', topic: 'Tableau Dashboards & Parameters' },
      { week: 'Week 12', topic: 'Power BI, DAX & Time Intelligence' },
      { week: 'Week 13', topic: 'Data Storytelling & Executive Narratives' }
    ],
    capstone: 'Executive Enterprise BI Suite',
    tools: ['Tableau', 'Power BI', 'Looker Studio']
  },
  {
    phase: 5,
    title: 'Modern Data Engineering & AI Ops',
    duration: 'Weeks 14–15',
    difficulty: 'Advanced',
    color: '#CE93D8',
    objective: 'Orchestrate scheduled cloud workflows, write SQL transformation layers, and build smart data retrieval tools.',
    modules: [
      { week: 'Week 14', topic: 'dbt Transformations & Airflow DAGs' },
      { week: 'Week 15', topic: 'LLMs, Vector DBs & RAG Chatbots' }
    ],
    capstone: 'Orchestrated AI Chatbot Stack',
    tools: ['dbt', 'Apache Airflow', 'LangChain', 'FAISS']
  },
  {
    phase: 6,
    title: 'Employer Portfolio & Placement',
    duration: 'Week 16',
    difficulty: 'Career',
    color: '#FFD700',
    objective: 'Consolidate projects into an elite employer-facing portfolio, optimize resumes for ATS scanners, and practice negotiation.',
    modules: [
      { week: 'Week 16', topic: 'Portfolio Launch, ATS Resumes & Interviews' }
    ],
    capstone: 'Placement-Ready Analyst Portfolio',
    tools: ['GitHub', 'LinkedIn', 'ATS Optimizer']
  }
];

export default function SyllabusPage() {
  return (
    <div className="space-y-16 lg:space-y-24 pb-16">
      {/* HEADER */}
      <section className="space-y-6 pt-10 text-center px-2">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Structured Curriculum</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
          The 16-Week <span className="text-brand">Data Analytics</span> Path.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted sm:text-lg">
          A comprehensive blueprint from fundamental spreadsheets to orchestrating AI-powered data pipelines in the cloud.
        </p>
      </section>

      {/* SYLLABUS GRID */}
      <section className="mx-auto max-w-4xl space-y-12">
        {syllabusPhases.map((phase) => (
          <div key={phase.phase} className="relative pl-8 md:pl-0">
            {/* Timeline Line (mobile) */}
            <div className="absolute left-[15px] top-0 bottom-[-48px] w-[2px] bg-slate-800/60 md:hidden" />
            
            <Card className="relative z-10 overflow-hidden border-border/80 bg-surface/50 p-6 shadow-xl backdrop-blur-sm transition-all hover:border-border/80 sm:p-8">
              {/* Decorative accent line */}
              <div 
                className="absolute left-0 top-0 bottom-0 w-1.5" 
                style={{ backgroundColor: phase.color }} 
              />
              
              <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span 
                      className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-slate-950"
                      style={{ backgroundColor: phase.color }}
                    >
                      {phase.phase}
                    </span>
                    <Badge variant="secondary" className="border-border bg-background/50 text-muted">
                      {phase.duration}
                    </Badge>
                    <Badge className="bg-slate-800 text-muted hover:bg-slate-700 border-none">{phase.difficulty}</Badge>
                  </div>
                  
                  <div>
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">{phase.title}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{phase.objective}</p>
                  </div>

                  {/* Modules */}
                  <div className="mt-6 space-y-3 rounded-2xl bg-background/60 p-5 border border-border/50">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Weekly Breakdown</h3>
                    <ul className="space-y-3">
                      {phase.modules.map((mod) => (
                        <li key={mod.week} className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-3 border-b border-border/40 pb-2 last:border-0 last:pb-0">
                          <span className="text-xs font-mono font-medium text-brand min-w-[4rem]">{mod.week}</span>
                          <span className="text-sm text-muted">{mod.topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Right Column: Capstone & Tools */}
                <div className="w-full shrink-0 space-y-6 md:w-64 md:pl-6 md:border-l border-border/50 mt-6 md:mt-0">
                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Capstone Project</h3>
                    <div className="rounded-xl border border-border/50 bg-background/80 p-4">
                      <p className="text-sm font-bold text-foreground leading-tight">
                        <span className="mr-2">📁</span>
                        {phase.capstone}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">Tools Mastered</h3>
                    <div className="flex flex-wrap gap-2">
                      {phase.tools.map((tool) => (
                        <Badge 
                          key={tool} 
                          variant="secondary" 
                          className="border-border bg-surface text-xs text-muted font-mono"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-4xl text-center space-y-6 pt-12 border-t border-border/50">
        <h2 className="text-2xl font-bold text-foreground">Ready to master the analytics stack?</h2>
        <Button size="lg" className="shadow-lg shadow-brand/20">Enroll in the Complete Path</Button>
      </section>
    </div>
  );
}
