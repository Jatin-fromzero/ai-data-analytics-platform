'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem, HoverCard } from '@/components/ui/motion';

const courseCategories = [
  { key: 'ai-data-analytics', label: 'Data Analytics', icon: '📊' },
  { key: 'ai-digital-marketing', label: 'Digital Marketing', icon: '📢' },
  { key: 'ai-data-science', label: 'Data Science', icon: '🧬' },
  { key: 'ai-web-development', label: 'Web Dev', icon: '💻' },
  { key: 'ai-graphic-design', label: 'Graphic Design', icon: '🎨' },
];

const portfolioProjectsByCourse = {
  'ai-data-analytics': [
    {
      id: 'da1',
      title: 'Retail Sales Performance Analyzer',
      difficulty: 'Core Foundation',
      category: 'Business Analytics',
      description: 'Analyze two years of raw sales data to uncover seasonal trends, top-performing product categories, and regional sales drops.',
      deliverable: 'Automated Excel Dashboard with Pivot Tables and Power Query ETL pipelines.',
      skills: ['Data Cleaning', 'Power Query', 'Pivot Tables', 'Descriptive Statistics'],
      tools: ['Excel', 'Microsoft Copilot']
    },
    {
      id: 'da2',
      title: 'E-Commerce Funnel Analytics Engine',
      difficulty: 'Intermediate',
      category: 'Cloud Data Warehousing',
      description: 'Process a multi-million row e-commerce database to build RFM (Recency, Frequency, Monetary) customer segments and identify funnel drop-offs.',
      deliverable: 'BigQuery SQL Pipeline + Interactive Looker Studio Executive Report.',
      skills: ['Window Functions', 'CTEs', 'Cohort Analysis', 'RFM Segmentation'],
      tools: ['SQL', 'BigQuery', 'Looker Studio']
    },
    {
      id: 'da3',
      title: 'Customer Intelligence Platform',
      difficulty: 'Advanced',
      category: 'Data Pipelines',
      description: 'Build a scalable customer segmentation and cohort analysis system to cluster users programmatically.',
      deliverable: 'Python Pandas Pipeline + Streamlit interactive web application.',
      skills: ['Exploratory Data Analysis', 'Pandas Data Wrangling', 'Automated Visualization'],
      tools: ['Python', 'Pandas', 'Streamlit']
    },
    {
      id: 'da4',
      title: 'Executive Enterprise BI Suite',
      difficulty: 'Intermediate',
      category: 'Business Intelligence',
      description: 'Design stakeholder-ready dashboards featuring year-over-year growth, moving averages, and dynamic parameters for regional managers.',
      deliverable: 'Published Tableau Story & Power BI Dashboard with DAX measures.',
      skills: ['DAX', 'LOD Expressions', 'Data Storytelling', 'Time Intelligence'],
      tools: ['Tableau', 'Power BI', 'Looker Studio']
    },
    {
      id: 'da5',
      title: 'Orchestrated AI Chatbot Stack',
      difficulty: 'Capstone AI',
      category: 'Data Engineering',
      description: 'Build a modern data stack where raw data is transformed daily and queried via an LLM to answer natural language business questions.',
      deliverable: 'Airflow DAG + dbt models + Streamlit RAG Chatbot.',
      skills: ['Data Orchestration', 'dbt Modeling', 'Vector Embeddings', 'Prompt Engineering'],
      tools: ['dbt', 'Airflow', 'LangChain', 'FAISS']
    },
    {
      id: 'da6',
      title: 'Placement-Ready Analyst Portfolio',
      difficulty: 'Career Launch',
      category: 'Career Placement',
      description: 'Consolidate all previous projects into a single, beautifully deployed portfolio site tailored specifically for hiring managers and ATS systems.',
      deliverable: 'Live GitHub Pages Portfolio + Optimized Resume + LinkedIn Revamp.',
      skills: ['Technical Writing', 'ATS Optimization', 'Interview Strategy'],
      tools: ['GitHub', 'ATS Scanners', 'Markdown']
    }
  ],
  'ai-digital-marketing': [
    {
      id: 'dm1',
      title: 'Programmatic Copywriting Pipeline',
      difficulty: 'Intermediate',
      category: 'Generative Marketing',
      description: 'Build an automated visual ad content pipeline that generates and customizes high-converting marketing copywriting at scale.',
      deliverable: 'Zapier Automation Loops + Mailchimp CRM sequences.',
      skills: ['Copy-Generation AI', 'Automated Email Nurtures', 'Conversion Architectures'],
      tools: ['Microsoft Copilot', 'Zapier', 'Mailchimp']
    },
    {
      id: 'dm2',
      title: 'Cross-Channel Ad Allocation Engine',
      difficulty: 'Advanced',
      category: 'Paid Traffic Optimization',
      description: 'Design a cross-platform budget allocation engine that evaluates real-time CPC and CPA values to distribute budgets across networks.',
      deliverable: 'Algorithmic campaign allocation report and sheets dashboard.',
      skills: ['Paid Search Bidding', 'Algorithmic Distribution', 'ROAS Analysis'],
      tools: ['Google Ads', 'Meta Manager', 'AdCreative AI']
    },
    {
      id: 'dm3',
      title: 'LTV/CPA Executive Dashboard',
      difficulty: 'Advanced',
      category: 'Advanced Analytics',
      description: 'Configure GA4 custom tracking scripts and model multi-touch attribution algorithms to define customer lifetime value over acquisition costs.',
      deliverable: 'Looker Studio Dashboard + BigQuery transaction analysis.',
      skills: ['GA4 Custom Events', 'Multi-Touch Attribution', 'Cohort Revenue Mapping'],
      tools: ['GA4', 'Looker Studio', 'BigQuery']
    },
    {
      id: 'dm4',
      title: 'SEO Organic Capture Blueprint',
      difficulty: 'Intermediate',
      category: 'Organic Marketing',
      description: 'Perform keyword gap clustering and plan content structures to capture high-intent search traffic.',
      deliverable: 'Keyword Cluster Map + On-Page Core Web Vitals optimization guide.',
      skills: ['SEO Keyword Clustering', 'Site Crawl Audits', 'Core Web Vitals Mapping'],
      tools: ['Semrush', 'Screaming Frog', 'Figma']
    }
  ],
  'ai-data-science': [
    {
      id: 'ds1',
      title: 'Relational Cohort Algorithm Engine',
      difficulty: 'Intermediate',
      category: 'Statistical Modeling',
      description: 'Create rigorous hypothesis tests, linear/logistic regressions, and probability matrices to identify cohort changes.',
      deliverable: 'Jupyter notebook with cohort analysis visualizations and statistical matrices.',
      skills: ['Probability Matrices', 'Regressions from scratch', 'ANOVA Testing'],
      tools: ['Python', 'SciPy', 'Statsmodels']
    },
    {
      id: 'ds2',
      title: 'Predictive Customer Churn Engine',
      difficulty: 'Advanced',
      category: 'Machine Learning',
      description: 'Deploy classification algorithms using ensemble methods to predict at-risk customers with high precision.',
      deliverable: 'XGBoost predictive pipeline and validation matrices.',
      skills: ['Ensemble Techniques', 'Hyperparameter Tuning', 'Feature Engineering'],
      tools: ['Python', 'Scikit-Learn', 'XGBoost']
    },
    {
      id: 'ds3',
      title: 'Neural Image Classifier Pipeline',
      difficulty: 'Advanced',
      category: 'Deep Learning',
      description: 'Architect convolutional neural networks using pre-trained weights to categorize catalog imagery.',
      deliverable: 'TensorFlow CNN trained on custom imagery sets.',
      skills: ['CNN Architectures', 'Transfer Learning', 'Backpropagation Logic'],
      tools: ['TensorFlow', 'Keras', 'Python']
    },
    {
      id: 'ds4',
      title: 'Explainable AI Model Platform',
      difficulty: 'Capstone AI',
      category: 'Model Interpretability',
      description: 'Configure SHAP values to map feature contributions, serialize Scikit-learn pipelines, and deploy user models.',
      deliverable: 'Live Streamlit Cloud showcasing SHAP force plots.',
      skills: ['SHAP Interpretability', 'Pipeline Serialization', 'Cloud App Deployment'],
      tools: ['SHAP', 'Streamlit', 'GitHub']
    }
  ],
  'ai-web-development': [
    {
      id: 'wd1',
      title: 'Premium Glassmorphic Dashboard UI',
      difficulty: 'Beginner',
      category: 'Frontend Engineering',
      description: 'Construct a stunning, high-performance web dashboard featuring dark mode layouts and physics-based interactions.',
      deliverable: 'Deploys responsive React elements with layout states.',
      skills: ['Tailwind Autolayouts', 'React Hooks', 'Spring animations'],
      tools: ['React', 'Tailwind CSS', 'Framer Motion']
    },
    {
      id: 'wd2',
      title: 'Dynamic REST API Database Portal',
      difficulty: 'Intermediate',
      category: 'Fullstack Systems',
      description: 'Design Next.js App Router endpoints that safely execute database CRUD operations through a clean UI.',
      deliverable: 'Fullstack Next.js database manager.',
      skills: ['Next.js App Router', 'RESTful API controllers', 'MySQL Relational Map'],
      tools: ['Next.js', 'Prisma', 'MySQL', 'Zod']
    },
    {
      id: 'wd3',
      title: 'Audited Secure E-Commerce Backend',
      difficulty: 'Advanced',
      category: 'System Security',
      description: 'Secure server layouts with JWT session configurations and build checkout webhooks for secure purchases.',
      deliverable: 'Stripe-integrated backend portal with JWT shielding.',
      skills: ['JWT Session validation', 'Middleware route guards', 'Stripe checkout maps'],
      tools: ['NextAuth.js', 'Stripe API', 'JWT']
    },
    {
      id: 'wd4',
      title: 'Orchestrated Deployed Web OS',
      difficulty: 'Capstone AI',
      category: 'DevOps & AI Ops',
      description: 'Configure secure serverless edge environments, deploy automated GitHub Action tests, and optimize code via dynamic AI reviews.',
      deliverable: 'Vercel edge app + CI/CD automated test suite.',
      skills: ['Edge Runtime configurations', 'GitHub Actions automation', 'AI pair programming'],
      tools: ['Vercel', 'GitHub Actions', 'Copilot']
    }
  ],
  'ai-graphic-design': [
    {
      id: 'gd1',
      title: 'Brand Identity Vector Guideline',
      difficulty: 'Beginner',
      category: 'Branding Systems',
      description: 'Design vectorized brand logos, construct robust color swatches, and map comprehensive corporate guideline sheets.',
      deliverable: 'Adobe Illustrator Vector Assets + corporate style sheets.',
      skills: ['Illustrator Path layouts', 'Photoshop Complex masking', 'Branding design codes'],
      tools: ['Adobe Illustrator', 'Photoshop']
    },
    {
      id: 'gd2',
      title: 'Premium SaaS Console UI Prototype',
      difficulty: 'Intermediate',
      category: 'UI/UX Design',
      description: 'Build clean design systems featuring local properties, component variants, and high-fidelity screen flows.',
      deliverable: 'Figma interactive mockup dashboard.',
      skills: ['Figma Auto-Layout configurations', 'Component variants', 'Dynamic prototyping flows'],
      tools: ['Figma UI System']
    },
    {
      id: 'gd3',
      title: 'Generative Visual Design Portfolio',
      difficulty: 'Capstone AI',
      category: 'Creative AI Ops',
      description: 'Formulate advanced Midjourney art configurations, compile high-resolution assets, and publish digital showcase galleries.',
      deliverable: 'Midjourney creative vector set + Deployed Dribbble/Behance collection.',
      skills: ['Midjourney prompt formulas', 'Asset upscalers', 'Digital publishing'],
      tools: ['Midjourney', 'Figma', 'GitHub Pages']
    }
  ]
};

export default function ProjectsPage() {
  const [activeTab, setActiveTab] = useState<keyof typeof portfolioProjectsByCourse>('ai-data-analytics');

  const selectedProjects = portfolioProjectsByCourse[activeTab];

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
                Move beyond passive tutorials. Choose your program domain and discover the exact capstone assets you will build, deploy, and showcase to employers.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── COURSE SELECTION TABS ── */}
        <FadeUp delay={0.05}>
          <div className="flex flex-wrap items-center justify-center gap-2 p-2 bg-[#09090D] border border-white/5 rounded-2xl max-w-4xl mx-auto px-4">
            {courseCategories.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as keyof typeof portfolioProjectsByCourse)}
                  className="relative px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all duration-300 focus:outline-none"
                  style={{ color: isActive ? '#050508' : '#94A3B8' }}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activePublicProjectsTab"
                      transition={{ type: 'spring', stiffness: 150, damping: 20 }}
                      className="absolute inset-0 bg-brand rounded-xl shadow-[0_0_20px_rgba(255,107,53,0.3)] z-0"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </FadeUp>

        {/* ── PROJECTS LIST ──────────────────────────────────────────────── */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <StaggerContainer key={activeTab} className="grid gap-6 grid-cols-1 lg:grid-cols-2">
            {selectedProjects.map((project, i) => (
              <StaggerItem key={project.id} className={i === 0 || i === 4 ? "lg:col-span-2" : ""}>
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
              Start the curriculum today and finish with premium, deployed assets that hiring managers can explore and interact with.
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
