'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PageReveal, FadeUp, ScrollReveal } from '@/components/ui/motion';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, BookOpen, GraduationCap, Compass, Briefcase } from 'lucide-react';
import Link from 'next/link';

// Detailed premium syllabi dataset for all 5 tracks
const courseSyllabi = {
  'ai-data-analytics': {
    title: 'AI-Powered Data Analytics',
    description: 'A comprehensive 16-week path from fundamental spreadsheets to orchestrating cloud data transformations and AI operations.',
    phases: [
      {
        phase: 1,
        title: 'Excel & Statistical Foundations',
        duration: 'Weeks 1–3',
        objective: 'Master data cleaning, advanced spreadsheet formulas, Power Query ETL pipelines, and essential descriptive statistics.',
        modules: [
          { topic: 'Data Analytics in the AI Era & Spreadsheet Foundations' },
          { topic: 'Statistics Supercharged with Generative AI' },
          { topic: 'Advanced Excel & Power Query Automation Pipelines' }
        ],
        capstone: 'RetailCo Sales Performance Analyzer',
        tools: ['Excel', 'Microsoft Copilot']
      },
      {
        phase: 2,
        title: 'SQL & Cloud Data Warehousing',
        duration: 'Weeks 4–6',
        objective: 'Write relational database queries from scratch, execute multi-layer joins, window functions, and optimize query scans.',
        modules: [
          { topic: 'SQL Mastery & Relational Database Schemas' },
          { topic: 'Advanced CTEs & Window Functions' },
          { topic: 'AI-Powered SQL Workflows in Google BigQuery' }
        ],
        capstone: 'E-Commerce Funnel Analytics Engine',
        tools: ['SQL', 'BigQuery', 'Gemini AI']
      },
      {
        phase: 3,
        title: 'Python & Automated Analytics',
        duration: 'Weeks 7–10',
        objective: 'Build algorithmic data pipelines in Pandas, perform programmatic EDA, and deploy interactive web applications.',
        modules: [
          { topic: 'Python Fundamentals & Pair Programming Loops' },
          { topic: 'Pandas Data Wrangling & Cleaning' },
          { topic: 'Automated EDA & Web App Deploys' }
        ],
        capstone: 'Customer Intelligence Platform',
        tools: ['Python', 'Streamlit', 'Pandas']
      },
      {
        phase: 4,
        title: 'Business Intelligence & Storytelling',
        duration: 'Weeks 11–13',
        objective: 'Create stakeholder-ready dashboards, configure time-intelligence calculations, and master narrative reporting.',
        modules: [
          { topic: 'Tableau Dashboards, Storyboards & Parameters' },
          { topic: 'Power BI, DAX Measures & Time Intelligence' },
          { topic: 'Data Storytelling & Executive Presentations' }
        ],
        capstone: 'Executive Enterprise BI Suite',
        tools: ['Tableau', 'Power BI', 'Looker Studio']
      },
      {
        phase: 5,
        title: 'Modern Data Engineering & AI Ops',
        duration: 'Weeks 14–15',
        objective: 'Orchestrate scheduled cloud workflows, write SQL transformation layers, and build smart retrieval tools.',
        modules: [
          { topic: 'dbt Transformations & Airflow DAGs' },
          { topic: 'LLMs, Vector DBs & RAG Chatbots' }
        ],
        capstone: 'Orchestrated AI Chatbot Stack',
        tools: ['dbt', 'Apache Airflow', 'LangChain', 'FAISS']
      },
      {
        phase: 6,
        title: 'Employer Portfolio & Placement',
        duration: 'Week 16',
        objective: 'Consolidate projects into an elite employer-facing portfolio, optimize resumes for ATS scanners, and practice salary negotiation.',
        modules: [
          { topic: 'Portfolio Launch, ATS Resumes & LinkedIn Optimisations' }
        ],
        capstone: 'Placement-Ready Analyst Portfolio',
        tools: ['GitHub', 'LinkedIn', 'ATS Optimizer']
      }
    ]
  },
  'ai-digital-marketing': {
    title: 'AI-Powered Digital Marketing',
    description: 'A modern 12-week blueprint covering conversion funnel creation, programmatic ad networks scaling, and multi-touch web attribution.',
    phases: [
      {
        phase: 1,
        title: 'Funnel Automation & Copywriting',
        duration: 'Weeks 1–3',
        objective: 'Master landing page architecture, build high-converting lead magnets, and automate generative ad copywriting systems.',
        modules: [
          { topic: 'AI Copy-Generation & Narrative Frameworks' },
          { topic: 'Visual Landing Page Conversion Architectures' },
          { topic: 'Lead Generation loops & email CRM automation' }
        ],
        capstone: 'Programmatic Copywriting Pipeline',
        tools: ['Microsoft Copilot', 'Zapier', 'Mailchimp']
      },
      {
        phase: 2,
        title: 'Paid Traffic Scaling & Programmatic Ads',
        duration: 'Weeks 4–7',
        objective: 'Architect scalable Google Search campaigns, configure Meta budget systems, and write algorithmic ad templates.',
        modules: [
          { topic: 'Google Ads Search Campaigns & Keyword Clustering' },
          { topic: 'Meta Business Suite & Dynamic Budget Allocations' },
          { topic: 'Programmatic Creative Ad Generative Frameworks' }
        ],
        capstone: 'Cross-Channel Ad Allocation engine',
        tools: ['Google Ads', 'Meta Manager', 'AdCreative AI']
      },
      {
        phase: 3,
        title: 'Advanced Web Analytics & Attribution',
        duration: 'Weeks 8–10',
        objective: 'Configure custom Google Analytics 4 event loops, track user journeys, and model multi-touch attribution.',
        modules: [
          { topic: 'Google Analytics 4 custom event tracking schemas' },
          { topic: 'Multi-touch Marketing Attribution models' },
          { topic: 'Cohort analysis and CPA/LTV dashboard integrations' }
        ],
        capstone: 'LTV/CPA Executive Dashboard',
        tools: ['GA4', 'Looker Studio', 'BigQuery']
      },
      {
        phase: 4,
        title: 'SEO & Brand Content Optimization',
        duration: 'Weeks 11–12',
        objective: 'Generate data-driven SEO content structures, optimize page indexing speed, and build creative generative asset loops.',
        modules: [
          { topic: 'SEO Keyword Clustering & Content Maps' },
          { topic: 'Core Web Vitals & Landing Page Optimization' }
        ],
        capstone: 'SEO Organic Capture Blueprint',
        tools: ['Semrush', 'Screaming Frog', 'Figma']
      }
    ]
  },
  'ai-data-science': {
    title: 'AI-Powered Data Science',
    description: 'An advanced 16-week curriculum on statistical regression, machine learning pipelines, deep learning weights, and ML model explainability.',
    phases: [
      {
        phase: 1,
        title: 'Statistics & Advanced Modeling',
        duration: 'Weeks 1–4',
        objective: 'Establish rigorous statistical foundations, write supervised linear/logistic regressions, and build cohort algorithms.',
        modules: [
          { topic: 'Probability Matrices & Advanced Descriptive Statistics' },
          { topic: 'Linear & Logistic Regression models from scratch' },
          { topic: 'ANOVA & Hypothesis Testing frameworks' }
        ],
        capstone: 'Relational Cohort Algorithm Engine',
        tools: ['Python', 'SciPy', 'Statsmodels']
      },
      {
        phase: 2,
        title: 'Machine Learning Pipelines',
        duration: 'Weeks 5–8',
        objective: 'Master advanced ensemble modeling, deploy random forest classifiers, and write robust preprocessing data pipelines.',
        modules: [
          { topic: 'Ensemble Learning: Random Forest & XGBoost' },
          { topic: 'Hyperparameter Tuning & Cross-Validation pipelines' },
          { topic: 'Feature Engineering & Outlier sanitisation' }
        ],
        capstone: 'Predictive Customer Churn Engine',
        tools: ['Python', 'Scikit-Learn', 'XGBoost']
      },
      {
        phase: 3,
        title: 'Deep Learning & Neural Networks',
        duration: 'Weeks 9–12',
        objective: 'Architect neural network structures, train convolutional networks, and optimize artificial text weights.',
        modules: [
          { topic: 'Deep Learning Basics & Backpropagation loops' },
          { topic: 'TensorFlow/Keras architectures for image/text classification' },
          { topic: 'Transfer Learning & Pre-Trained Weights deployment' }
        ],
        capstone: 'Neural Image Classifier Pipeline',
        tools: ['TensorFlow', 'Keras', 'Python']
      },
      {
        phase: 4,
        title: 'Interpretability & Model Deployment',
        duration: 'Weeks 13–16',
        objective: 'Explain predictive features using SHAP, deploy models via Scikit-Learn pipelines, and build Streamlit dashboards.',
        modules: [
          { topic: 'SHAP Explainability & Feature Attribution' },
          { topic: 'Scikit-Learn pipeline serialization & deployment' },
          { topic: 'Streamlit Cloud interactive ML model showcases' }
        ],
        capstone: 'Explainable AI Model Platform',
        tools: ['SHAP', 'Streamlit', 'GitHub']
      }
    ]
  },
  'ai-web-development': {
    title: 'AI-Powered Web Development',
    description: 'A high-octane 14-week fullstack track building Next.js dynamic student portals, secure REST APIs, Prisma databases, and CI/CD pipelines.',
    phases: [
      {
        phase: 1,
        title: 'Frontend Autolayouts & Styling',
        duration: 'Weeks 1–4',
        objective: 'Master responsive Tailwind UI layouts, build modular client pages, and handle complex React states.',
        modules: [
          { topic: 'Tailwind CSS Grid & Flexbox auto-layouts' },
          { topic: 'React hooks (useState, useEffect, useRef, useContext)' },
          { topic: 'Framer Motion spring physics and layout transitions' }
        ],
        capstone: 'Premium Glassmorphic Dashboard UI',
        tools: ['React', 'Tailwind CSS', 'Framer Motion']
      },
      {
        phase: 2,
        title: 'Fullstack Architecture Loops',
        duration: 'Weeks 5–8',
        objective: 'Configure Next.js App Router pathings, build stateless HTTP API controllers, and query Prisma databases.',
        modules: [
          { topic: 'Next.js App Router dynamic route handlers' },
          { topic: 'Prisma ORM schema definition & MySQL connections' },
          { topic: 'Stateless REST API development & validation schemas' }
        ],
        capstone: 'Dynamic REST API Database Portal',
        tools: ['Next.js', 'Prisma', 'MySQL', 'Zod']
      },
      {
        phase: 3,
        title: 'Enterprise Security & Integrations',
        duration: 'Weeks 9–11',
        objective: 'Configure JWT session tokens, secure endpoints with middleware route shields, and process Stripe webhooks.',
        modules: [
          { topic: 'JSON Web Token (JWT) session validation checks' },
          { topic: 'Next.js Middleware route security controllers' },
          { topic: 'Stripe Webhooks & checkout session maps' }
        ],
        capstone: 'Audited Secure E-Commerce backend',
        tools: ['NextAuth.js', 'Stripe API', 'JWT']
      },
      {
        phase: 4,
        title: 'Edge Deployment & AI Workflows',
        duration: 'Weeks 12–14',
        objective: 'Deploy scalable serverless edge functions to Vercel, write GitHub Action configurations, and compile code via AI.',
        modules: [
          { topic: 'Vercel Edge runtime & serverless configurations' },
          { topic: 'GitHub Actions CI/CD pipeline automation' },
          { topic: 'AI-assisted code debugging & copilot loops' }
        ],
        capstone: 'Orchestrated Deployed Web OS',
        tools: ['Vercel', 'GitHub Actions', 'Copilot']
      }
    ]
  },
  'ai-graphic-design': {
    title: 'AI-Powered Graphic Design',
    description: 'A premier 10-week visual arts curriculum on Adobe branding frameworks, Figma dynamic components auto-layouts, and Midjourney vector loops.',
    phases: [
      {
        phase: 1,
        title: 'Creative Suite Branding',
        duration: 'Weeks 1–3',
        objective: 'Design vectorized brand logos, construct color palettes, and master Photoshop brush layers.',
        modules: [
          { topic: 'Adobe Illustrator Vector layouts & paths' },
          { topic: 'Photoshop complex masking & color overlays' },
          { topic: 'Corporate Brand Guidelines & visual systems' }
        ],
        capstone: 'Brand Identity Vector Guideline',
        tools: ['Adobe Illustrator', 'Photoshop']
      },
      {
        phase: 2,
        title: 'Figma Component Systems',
        duration: 'Weeks 4–7',
        objective: 'Construct responsive Figma auto-layouts, define parent master UI components, and build dynamic prototypes.',
        modules: [
          { topic: 'Figma Auto-Layout dynamic spacing rules' },
          { topic: 'Master UI Component variants & local properties' },
          { topic: 'High-fidelity dynamic prototyping & transitions' }
        ],
        capstone: 'Premium SaaS Console UI Prototype',
        tools: ['Figma UI System']
      },
      {
        phase: 3,
        title: 'Generative Asset Engineering',
        duration: 'Weeks 8–10',
        objective: 'Generate Midjourney vector art prompts, optimize page grids, and publish digital portfolio galleries.',
        modules: [
          { topic: 'Midjourney Prompt Engineering for Visual Brands' },
          { topic: 'Layout Optimization & Digital Portfolios launch' }
        ],
        capstone: 'Generative Visual Design Portfolio',
        tools: ['Midjourney', 'Figma', 'GitHub Pages']
      }
    ]
  }
};

export default function SyllabusPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof courseSyllabi>('ai-data-analytics');

  const selectedSyllabus = courseSyllabi[activeTab];

  return (
    <PageReveal>
      <div className="space-y-16 lg:space-y-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── HEADER ── */}
        <div className="relative pt-20 pb-12 text-center border-b border-border/50 bg-surface/30 rounded-[2rem] overflow-hidden p-6 sm:p-10 shadow-sm">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-brand/5 blur-[100px] pointer-events-none" />
          <FadeUp>
            <div className="max-w-3xl mx-auto">
              <Badge variant="outline" className="mb-4 border-brand/30 text-brand uppercase tracking-widest text-[9px] font-bold">
                Platform Curriculums
              </Badge>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight leading-[1.15]">
                Curriculum Milestone <span className="text-brand italic font-light">Roadmaps.</span>
              </h1>
              <p className="text-sm sm:text-base text-muted mt-4 max-w-xl mx-auto font-light leading-relaxed">
                Explore the structured technical blueprints across all AI-powered subjects. Choose a domain to inspect the 10-16 week roadmap.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── COURSE SELECTION TABS (Premium Glass Tabs selector) ── */}
        <FadeUp delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#09090D] border border-white/5 rounded-2xl max-w-4xl mx-auto">
            {(Object.keys(courseSyllabi) as Array<keyof typeof courseSyllabi>).map((key) => {
              const isActive = activeTab === key;
              const titleShort = courseSyllabi[key].title.replace('AI-Powered ', '');
              
              return (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className="relative px-5 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none"
                  style={{ color: isActive ? '#050508' : '#94A3B8' }}
                >
                  {/* Dynamic sliding spring background tab indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeSyllabusTab"
                      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                      className="absolute inset-0 bg-brand rounded-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] z-0"
                    />
                  )}
                  <span className="relative z-10">{titleShort}</span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* ── ACTIVE ROADMAP SYLLABUS LISTING ── */}
        <section className="space-y-12 max-w-4xl mx-auto relative z-10">
          <FadeUp key={activeTab} delay={0.1}>
            <div className="space-y-2 text-center sm:text-left mb-8 pb-4 border-b border-white/[0.04]">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">{selectedSyllabus.title}</h2>
              <p className="text-xs sm:text-sm text-slate-400 font-light max-w-2xl">{selectedSyllabus.description}</p>
            </div>
          </FadeUp>

          {selectedSyllabus.phases.map((phase) => (
            <ScrollReveal key={phase.phase} delay={0.05}>
              <div className="relative pl-6 md:pl-0">
                {/* Timeline Line (mobile) */}
                <div className="absolute left-[11px] top-0 bottom-[-48px] w-[1px] bg-slate-800/60 md:hidden" />
                
                <Card className="relative z-10 overflow-hidden border-white/[0.03] bg-white/[0.01] p-6 shadow-xl backdrop-blur-sm transition-all hover:border-brand/20 sm:p-8 rounded-2xl">
                  {/* Decorative accent line */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand" />
                  
                  <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-slate-950 bg-brand shadow-[0_0_12px_rgba(255,107,53,0.3)]">
                          {phase.phase}
                        </span>
                        <Badge variant="secondary" className="border-white/5 bg-slate-900/60 text-slate-300">
                          {phase.duration}
                        </Badge>
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{phase.title}</h3>
                        <p className="mt-2 text-xs leading-relaxed text-slate-400 font-light">{phase.objective}</p>
                      </div>
                      
                      {/* Topics */}
                      <div className="mt-6 space-y-2 rounded-xl bg-slate-950/40 p-4 border border-white/[0.03]">
                        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Weekly Breakdown</h4>
                        <ul className="space-y-2">
                          {phase.modules.map((mod: any, idx: number) => (
                            <li key={idx} className="flex items-baseline gap-2 border-b border-white/[0.02] pb-2 last:border-0 last:pb-0">
                              <span className="text-[9px] font-mono font-bold text-brand min-w-[3.5rem]">Week {idx + 1}</span>
                              <span className="text-xs text-slate-300 font-light">{mod.topic}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right Column: Capstone & Tools */}
                    <div className="w-full shrink-0 space-y-6 md:w-60 md:pl-6 md:border-l border-white/[0.04] mt-6 md:mt-0">
                      <div className="space-y-3">
                        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Capstone Project</h4>
                        <div className="rounded-xl border border-white/[0.03] bg-slate-950/60 p-4">
                          <p className="text-xs font-bold text-slate-200 leading-tight">
                            <span className="mr-2">📁</span>
                            {phase.capstone}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Tools Mastered</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {phase.tools.map((tool: string) => (
                            <Badge 
                              key={tool} 
                              variant="secondary" 
                              className="border-white/5 bg-slate-900 text-[9px] text-slate-400 font-mono py-0.5 px-2"
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
            </ScrollReveal>
          ))}
        </section>

        {/* CTA Section */}
        <ScrollReveal>
          <section className="text-center space-y-8 pt-16 border-t border-white/[0.04] max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-foreground">Ready to master these AI-powered technical career loops?</h2>
            <Button size="lg" asChild className="shadow-[0_0_25px_rgba(255,107,53,0.15)] h-11 px-8 rounded-xl text-xs bg-brand text-background hover:bg-brand/90 font-semibold transition-all">
              <Link href="/signup">Unlock complete OS workspace catalog</Link>
            </Button>
          </section>
        </ScrollReveal>
      </div>
    </PageReveal>
  );
}
