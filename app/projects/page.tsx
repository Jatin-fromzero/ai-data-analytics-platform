import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/motion';

const portfolioProjects = [
  {
    id: 'p1',
    title: 'Retail Sales Performance Analyzer',
    difficulty: 'Core Foundation',
    category: 'Business Analytics',
    description: 'Analyze two years of raw sales data to uncover seasonal trends, top-performing product categories, and regional sales drops.',
    deliverable: 'Automated Excel Dashboard with Pivot Tables and Power Query ETL pipelines.',
    skills: ['Data Cleaning', 'Power Query', 'Pivot Tables', 'Descriptive Statistics'],
    tools: ['Excel', 'Microsoft Copilot']
  },
  {
    id: 'p2',
    title: 'E-Commerce Funnel Analytics Engine',
    difficulty: 'Intermediate',
    category: 'Cloud Data Warehousing',
    description: 'Process a multi-million row e-commerce database to build RFM (Recency, Frequency, Monetary) customer segments and identify funnel drop-offs.',
    deliverable: 'BigQuery SQL Pipeline + Interactive Looker Studio Executive Report.',
    skills: ['Window Functions', 'CTEs', 'Cohort Analysis', 'RFM Segmentation'],
    tools: ['SQL', 'BigQuery', 'Looker Studio']
  },
  {
    id: 'p3',
    title: 'Customer Churn Prediction Platform',
    difficulty: 'Advanced',
    category: 'Predictive Modeling',
    description: 'Build a machine learning pipeline that predicts which telecom customers will cancel their subscription and explains why using SHAP values.',
    deliverable: 'Deployed Streamlit Web Application with interactive prediction charts.',
    skills: ['Data Wrangling', 'Random Forest', 'SHAP Explainability', 'Web App Deployment'],
    tools: ['Python', 'Pandas', 'Scikit-Learn', 'Streamlit']
  },
  {
    id: 'p4',
    title: 'Executive Enterprise BI Suite',
    difficulty: 'Intermediate',
    category: 'Business Intelligence',
    description: 'Design stakeholder-ready dashboards featuring year-over-year growth, moving averages, and dynamic parameters for regional managers.',
    deliverable: 'Published Tableau Story & Power BI Dashboard with DAX measures.',
    skills: ['DAX', 'LOD Expressions', 'Data Storytelling', 'Time Intelligence'],
    tools: ['Tableau', 'Power BI']
  },
  {
    id: 'p5',
    title: 'Orchestrated AI Chatbot Stack',
    difficulty: 'Capstone AI',
    category: 'Data Engineering',
    description: 'Build a modern data stack where raw data is transformed daily and queried via an LLM to answer natural language business questions.',
    deliverable: 'Airflow DAG + dbt models + Streamlit RAG Chatbot.',
    skills: ['Data Orchestration', 'dbt Modeling', 'Vector Embeddings', 'Prompt Engineering'],
    tools: ['dbt', 'Airflow', 'LangChain', 'OpenAI']
  },
  {
    id: 'p6',
    title: 'Placement-Ready Analyst Portfolio',
    difficulty: 'Career Launch',
    category: 'Career Placement',
    description: 'Consolidate all previous projects into a single, beautifully deployed portfolio site tailored specifically for hiring managers and ATS systems.',
    deliverable: 'Live GitHub Pages Portfolio + Optimized Resume + LinkedIn Revamp.',
    skills: ['Technical Writing', 'ATS Optimization', 'Interview Strategy'],
    tools: ['GitHub', 'ATS Scanners', 'Markdown']
  }
];

export default function ProjectsPage() {
  return (
    <PageReveal>
      <div className="space-y-16 lg:space-y-24 pb-20">
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <div className="relative pt-20 pb-16 text-center border-b border-border/50 bg-surface/30 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand/5 blur-[100px] pointer-events-none" />
          <FadeUp>
            <div className="max-w-3xl mx-auto px-4">
              <Badge variant="outline" className="mb-6 border-brand/30 text-brand uppercase tracking-widest">Portfolio Showcase</Badge>
              <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Build <span className="text-brand italic font-light">Real-World</span> Assets.
              </h1>
              <p className="text-lg sm:text-xl text-muted mt-6 max-w-2xl mx-auto font-light">
                Move beyond passive tutorials. You will build, deploy, and showcase 6 premium capstone projects to prove your technical depth to employers.
              </p>
            </div>
          </FadeUp>
        </div>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer className="grid gap-6 grid-cols-1 lg:grid-cols-2">
          {portfolioProjects.map((project, i) => (
            <StaggerItem key={project.id} className={i === 0 || i === 3 ? "lg:col-span-2" : ""}>
              <HoverCard className="h-full">
                <Card className="flex flex-col h-full border-border bg-surface p-8 sm:p-10 hover:border-brand/40 transition-colors shadow-sm overflow-hidden relative group">
                  <div className="absolute right-0 top-0 w-1/2 h-full bg-gradient-to-bl from-brand/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="space-y-6 flex-1 relative z-10">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <Badge variant="secondary" className="text-brand border-border bg-background uppercase tracking-wider text-[10px]">
                        {project.category}
                      </Badge>
                      <Badge className="bg-slate-800 text-muted hover:bg-slate-700 border-none">
                        {project.difficulty}
                      </Badge>
                    </div>
                    
                    <h2 className="text-2xl sm:text-3xl font-bold text-foreground group-hover:text-brand transition-colors">{project.title}</h2>
                    <p className="text-base leading-relaxed text-muted max-w-3xl">
                      {project.description}
                    </p>

                    <div className="pt-6 border-t border-border/50 grid sm:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">What you&apos;ll deliver</h3>
                        <p className="text-sm font-medium text-foreground bg-background/50 p-3 rounded-xl border border-border/50">
                          <span className="mr-2 text-brand">📁</span>{project.deliverable}
                        </p>
                      </div>
                      
                      <div>
                        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-3">Key Skills Mastered</h3>
                        <ul className="grid grid-cols-1 gap-2">
                          {project.skills.map(skill => (
                            <li key={skill} className="text-sm text-muted flex items-center">
                              <span className="text-brand mr-2 opacity-50">✦</span>{skill}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 mt-8 border-t border-border/50 relative z-10">
                    <div className="flex flex-wrap gap-2">
                      {project.tools.map(tool => (
                        <Badge key={tool} variant="outline" className="bg-background text-muted border-border/50 font-mono text-[10px] tracking-wider uppercase">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              </HoverCard>
            </StaggerItem>
          ))}
          </StaggerContainer>
        </section>

        <FadeUp>
          <section className="mx-auto max-w-4xl text-center space-y-8 pt-16 border-t border-border/50 px-4">
            <h2 className="text-3xl font-bold text-foreground">Ready to build your portfolio?</h2>
            <p className="text-lg text-muted max-w-2xl mx-auto font-light">
              Start the curriculum today and finish with 6 deployed assets that hiring managers can explore and interact with.
            </p>
            <Button size="lg" asChild className="shadow-[0_0_40px_rgba(255,107,53,0.3)] h-12 px-10 rounded-full text-base">
              <Link href="/syllabus">View the Syllabus</Link>
            </Button>
          </section>
        </FadeUp>
      </div>
    </PageReveal>
  );
}
