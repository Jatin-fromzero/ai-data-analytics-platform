'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SyllabusStage {
  phase: number;
  duration: string;
  title: string;
  icon: string;
  color: string;
  objective: string;
  capstone: {
    name: string;
    deliverable: string;
  };
  skills: string[];
  tools: string[];
}

const SYLLABUS_STAGES: SyllabusStage[] = [
  {
    phase: 1,
    duration: 'Weeks 1–3',
    title: 'Excel & Statistical Foundations',
    icon: '📊',
    color: '#81C784',
    objective: 'Master data cleaning, advanced formulas, ETL pipelines in Power Query, and essential business statistics.',
    capstone: {
      name: 'RetailCo Sales Performance Analyzer',
      deliverable: 'An automated workbook featuring dynamic trends, Cohort Pivot tables, and AI-assisted performance insights.'
    },
    skills: ['Pivot Tables', 'Power Query ETL', 'Descriptive Stats'],
    tools: ['Excel', 'Microsoft Copilot']
  },
  {
    phase: 2,
    duration: 'Weeks 4–6',
    title: 'SQL & Cloud Data Warehousing',
    icon: '🗄️',
    color: '#4FC3F7',
    objective: 'Write relational database queries from scratch, execute multi-layer joins, window functions, and optimize queries.',
    capstone: {
      name: 'E-Commerce Funnel Analytics Engine',
      deliverable: 'A structured BigQuery pipeline analyzing cohort retention, user funnel drop-offs, and RFM segments.'
    },
    skills: ['Window Functions', 'CTEs & Subqueries', 'RFM Segmentation'],
    tools: ['SQL', 'BigQuery', 'Gemini AI']
  },
  {
    phase: 3,
    duration: 'Weeks 7–10',
    title: 'Python & Automated Analytics',
    icon: '🐍',
    color: '#FF6B35', // Primary brand highlight
    objective: 'Build algorithmic data pipelines in Pandas, perform programmatic EDA, and deploy interactive web applications.',
    capstone: {
      name: 'Customer Intelligence Platform',
      deliverable: 'A live Streamlit web application running predictive churn intelligence models backed by SHAP explainability charts.'
    },
    skills: ['Pandas & NumPy', 'Auto-EDA Frameworks', 'Predictive Modeling'],
    tools: ['Python', 'Streamlit', 'Scikit-Learn', 'SHAP']
  },
  {
    phase: 4,
    duration: 'Weeks 11–13',
    title: 'Business Intelligence & Storytelling',
    icon: '📈',
    color: '#FF8A65',
    objective: 'Create stakeholder-ready dashboards, configure time-intelligence calculations, and master narrative reporting.',
    capstone: {
      name: 'Executive Enterprise BI Suite',
      deliverable: 'An end-to-end dashboard collection featuring Tableau stories, DAX measures in Power BI, and interactive Looker reports.'
    },
    skills: ['LOD Expressions', 'DAX Measures', 'Pyramid Data Storytelling'],
    tools: ['Tableau', 'Power BI', 'Looker Studio']
  },
  {
    phase: 5,
    duration: 'Weeks 14–15',
    title: 'Modern Data Engineering & AI Ops',
    icon: '☁️',
    color: '#CE93D8',
    objective: 'Orchestrate scheduled cloud workflows, write SQL transformation layers, and build smart data retrieval tools.',
    capstone: {
      name: 'Orchestrated AI Chatbot Stack',
      deliverable: 'A robust cloud data stack running dbt transformations and Airflow DAGs, queried via an LLM RAG chatbot.'
    },
    skills: ['dbt Modeling', 'DAG Orchestration', 'RAG pipelines'],
    tools: ['dbt', 'Apache Airflow', 'LangChain', 'FAISS']
  },
  {
    phase: 6,
    duration: 'Week 16',
    title: 'Employer Portfolio & Placement',
    icon: '🎓',
    color: '#FFD700',
    objective: 'Consolidate projects into an elite employer-facing portfolio, optimize resumes for ATS scanners, and practice negotiation.',
    capstone: {
      name: 'Placement-Ready Analyst Portfolio',
      deliverable: 'A deployed technical hub hosting all five capstones with employer walkthroughs, CV, and interview playbooks.'
    },
    skills: ['Technical Portfolios', 'ATS Resume Tuning', 'Salary Negotiation'],
    tools: ['GitHub', 'LinkedIn', 'ATS Optimizer']
  }
];

export function CareerProgressTracker() {
  const [activeIdx, setActiveIdx] = useState<number>(2); // Default to Phase 3 (Python)
  const currentStage = SYLLABUS_STAGES[activeIdx];

  return (
    <Card className="rounded-[2rem] border border-border/80 bg-surface/40 p-6 md:p-8 shadow-xl shadow-slate-950/20 hover:border-border transition-all duration-300 backdrop-blur-sm">
      <div className="space-y-6">
        {/* Clean Header */}
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-brand">Curriculum Preview</span>
          <h3 className="text-xl font-bold text-foreground tracking-tight">Structured 16-Week Syllabus</h3>
          <p className="text-xs text-muted">Click any stage below to inspect the syllabus goals, tools, and hands-on capstone projects.</p>
        </div>

        {/* Phase Step Selector */}
        <div className="grid grid-cols-6 gap-1.5 p-1.5 rounded-2xl bg-background/60 border border-slate-900">
          {SYLLABUS_STAGES.map((stage, idx) => {
            const isSelected = activeIdx === idx;
            
            return (
              <button
                key={stage.phase}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={cn(
                  "flex flex-col items-center justify-center py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 group focus:outline-none",
                  isSelected
                    ? "bg-surface text-foreground shadow-sm"
                    : "bg-transparent text-muted border-transparent hover:text-muted hover:bg-white/5"
                )}
                style={{
                  borderColor: isSelected ? stage.color : undefined
                }}
              >
                <span className="text-sm font-mono leading-none">{stage.phase}</span>
                <span className="hidden sm:inline text-[9px] uppercase tracking-wider text-muted mt-1 font-semibold">Stage</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Curriculum Details */}
        <div className="space-y-5 rounded-2xl bg-background/80 border border-border/40 p-5 transition-all duration-300">
          {/* Header Metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3.5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-lg leading-none">{currentStage.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: currentStage.color }}>
                  Stage {currentStage.phase} · {currentStage.duration}
                </span>
              </div>
              <h4 className="text-base font-bold text-foreground leading-tight">{currentStage.title}</h4>
            </div>
          </div>

          {/* Stage Objective */}
          <div className="space-y-1">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Learning Objective</p>
            <p className="text-xs leading-relaxed text-muted">{currentStage.objective}</p>
          </div>

          {/* Real-World Capstone Project */}
          <div className="space-y-1.5">
            <p className="text-[9px] font-bold uppercase tracking-wider text-muted font-semibold">Hands-on Capstone Deliverable</p>
            <div className="rounded-xl bg-surface/40 border border-border/30 p-4 space-y-1">
              <p className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <span className="text-[10px]" style={{ color: currentStage.color }}>📁</span>
                {currentStage.capstone.name}
              </p>
              <p className="text-[11px] leading-relaxed text-muted">
                {currentStage.capstone.deliverable}
              </p>
            </div>
          </div>

          {/* Skills & Tools Grids */}
          <div className="grid gap-4 sm:grid-cols-2 pt-1 border-t border-slate-900">
            <div className="space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Key Competency focus</p>
              <div className="flex flex-wrap gap-1">
                {currentStage.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded bg-surface border border-border/60 px-2 py-0.5 text-[10px] font-medium text-muted"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-[9px] font-bold uppercase tracking-wider text-muted">Industry Tools Stack</p>
              <div className="flex flex-wrap gap-1">
                {currentStage.tools.map((tool) => (
                  <span
                    key={tool}
                    className="rounded bg-surface/60 border border-slate-850 px-2 py-0.5 text-[10px] font-medium text-muted font-mono"
                    style={{ color: currentStage.color }}
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
