import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
    <div className="space-y-16 lg:space-y-24 pb-16">
      <section className="space-y-6 pt-10 text-center">
        <p className="text-sm font-semibold tracking-[0.2em] text-brand uppercase">Portfolio Showcase</p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl xl:text-6xl">
          Build <span className="text-brand">Real-World</span> Analytics Assets.
        </h1>
        <p className="mx-auto max-w-2xl text-base text-muted sm:text-lg">
          Move beyond passive tutorials. You will build, deploy, and showcase 6 premium capstone projects to prove your technical depth to employers.
        </p>
      </section>

      <section className="mx-auto max-w-6xl grid gap-6 grid-cols-1 md:grid-cols-2">
        {portfolioProjects.map((project) => (
          <Card key={project.id} className="flex flex-col border-border/80 bg-surface/40 p-6 md:p-8 hover:border-border transition-colors">
            <div className="space-y-4 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="secondary" className="text-brand border-brand/20 bg-brand/5 uppercase tracking-wider text-[10px]">
                  {project.category}
                </Badge>
                <Badge className="bg-slate-800 text-muted hover:bg-slate-700 border-none">
                  {project.difficulty}
                </Badge>
              </div>
              
              <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
              <p className="text-sm leading-relaxed text-muted">
                {project.description}
              </p>

              <div className="pt-4 border-t border-border/50 space-y-4">
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">What you&apos;ll deliver</h3>
                  <p className="text-sm font-medium text-muted">
                    <span className="mr-2">📁</span>{project.deliverable}
                  </p>
                </div>
                
                <div>
                  <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Key Skills Mastered</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.skills.map(skill => (
                      <li key={skill} className="text-xs text-muted flex items-center">
                        <span className="text-brand mr-1.5">•</span>{skill}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-border/50">
              <div className="flex flex-wrap gap-2">
                {project.tools.map(tool => (
                  <Badge key={tool} variant="secondary" className="bg-background text-muted border border-border font-mono text-xs">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
          </Card>
        ))}
      </section>

      <section className="mx-auto max-w-4xl text-center space-y-6 pt-12 border-t border-border/50">
        <h2 className="text-2xl font-bold text-foreground">Ready to build your portfolio?</h2>
        <p className="text-muted max-w-xl mx-auto">
          Start the curriculum today and finish with 6 deployed assets that hiring managers can explore and interact with.
        </p>
        <Button size="lg" asChild className="shadow-lg shadow-brand/20">
          <Link href="/syllabus">View the Syllabus</Link>
        </Button>
      </section>
    </div>
  );
}
