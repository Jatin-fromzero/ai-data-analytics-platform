'use client';

import React from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageReveal, FadeUp } from '@/components/ui/motion';
import { CheckCircle2, ChevronRight } from 'lucide-react';

const educareCourses = [
  {
    id: 'ai-data-analytics',
    title: 'AI-Powered Data Analytics',
    icon: '📊',
    difficulty: 'Core Foundation',
    category: 'Data & Analytics',
    timeline: 'Weeks 1–16',
    description: 'Master cloud databases, write relational SQL queries, build executive Tableau dashboards, and automate ETL data pipelines using BigQuery and generative AI.',
    skills: ['SQL CTEs & Joins', 'Window Functions', 'Tableau Dashboards', 'Airflow & dbt ETL'],
    tools: ['SQL', 'BigQuery', 'Tableau', 'dbt', 'Airflow']
  },
  {
    id: 'ai-digital-marketing',
    title: 'AI-Powered Digital Marketing',
    icon: '📣',
    difficulty: 'Career Accelerator',
    category: 'Growth & Marketing',
    timeline: 'Weeks 1–12',
    description: 'Build automated lead-gen funnels, programmatic ad scaling, copywriting pipelines, programmatic search campaigns, and multi-touch web attribution.',
    skills: ['Copy-Generation AI', 'Ad Campaign Automation', 'Funnel Optimization', 'Web Attribution Models'],
    tools: ['Microsoft Copilot', 'Google Ads', 'Meta Manager', 'Analytics 4']
  },
  {
    id: 'ai-data-science',
    title: 'AI-Powered Data Science',
    icon: '🔬',
    difficulty: 'Advanced Tech',
    category: 'Algorithms & ML',
    timeline: 'Weeks 1–16',
    description: 'Build robust machine learning models, programmatic EDA scripts, predictive customer classifiers, neural network pipelines, and SHAP explainers.',
    skills: ['Supervised Learning', 'Random Forest & XGBoost', 'SHAP Explainability', 'Pandas & NumPy EDA'],
    tools: ['Python', 'Pandas', 'Scikit-Learn', 'SHAP', 'Streamlit']
  },
  {
    id: 'ai-web-development',
    title: 'AI-Powered Web Development',
    icon: '💻',
    difficulty: 'Fullstack Tech',
    category: 'Software Engineering',
    timeline: 'Weeks 1–14',
    description: 'Architect dynamic APIs, secure Next.js student portals, middleware routers, dynamic React layouts, and deploy scalable edge microservices with AI.',
    skills: ['Next.js App Router', 'RESTful API Design', 'Tailwind CSS UI', 'Prisma ORM & MySQL'],
    tools: ['React', 'Next.js', 'Prisma', 'MySQL', 'GitHub Copilot']
  },
  {
    id: 'ai-graphic-design',
    title: 'AI-Powered Graphic Design',
    icon: '🎨',
    difficulty: 'Creative Suite',
    category: 'Design & UI/UX',
    timeline: 'Weeks 1–10',
    description: 'Design dynamic Figma UI prototypes, layout branding guides, custom SVG animations, vectorized logos, and build custom generative artwork assets.',
    skills: ['Figma Auto-Layouts', 'Branding & UI Systems', 'Generative Vector Design', 'Figma Prototyping'],
    tools: ['Figma', 'Adobe Illustrator', 'Midjourney', 'Photoshop']
  }
];

export default function CoursesPage() {
  return (
    <PageReveal>
      <div className="space-y-12 pb-20">
        
        {/* ── HEADER ── */}
        <div className="space-y-4 pt-10 pb-6 border-b border-white/[0.04] bg-white/[0.01] p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand/5 blur-[80px] rounded-full pointer-events-none" />
          <FadeUp>
            <div className="space-y-2">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand">Course Suite Catalog</p>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-100">
                Structured Technical Curriculum.
              </h1>
              <p className="max-w-2xl text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
                Choose from our elite technical tracks. All courses feature modular dynamic lessons, locked/unlocked milestone tracking, and modern AI developer tools.
              </p>
            </div>
          </FadeUp>
        </div>

        {/* ── COURSE GRID ── */}
        <div className="grid gap-8 sm:grid-cols-1 lg:grid-cols-2">
          {educareCourses.map((course) => (
            <FadeUp key={course.id}>
              <Card className="flex flex-col h-full border border-white/[0.03] bg-white/[0.01] hover:border-brand/20 transition-all duration-300 p-6 sm:p-8 rounded-2xl relative overflow-hidden group">
                <div className="absolute right-0 top-0 w-32 h-32 bg-brand/5 blur-[40px] rounded-full pointer-events-none group-hover:bg-brand/10 transition-colors" />
                
                <div className="space-y-6 flex-1 relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{course.icon}</span>
                      <div>
                        <p className="text-[9px] font-bold text-brand uppercase tracking-wider">{course.category}</p>
                        <h2 className="text-xl font-bold text-slate-100 tracking-tight">{course.title}</h2>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Badge variant="secondary" className="border-white/5 bg-slate-900 text-slate-300 text-[9px] py-0.5 px-2.5 rounded-full capitalize">
                        {course.difficulty}
                      </Badge>
                      <Badge className="bg-slate-800 text-slate-300 border-none text-[9px] py-0.5 px-2.5 rounded-full">
                        {course.timeline}
                      </Badge>
                    </div>
                  </div>
                  
                  <p className="text-xs sm:text-sm leading-relaxed text-slate-400 font-light">{course.description}</p>
                  
                  <div className="pt-6 border-t border-white/[0.04] grid sm:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Key Skills Mastered</h3>
                      <ul className="grid grid-cols-1 gap-1.5">
                        {course.skills.map((skill) => (
                          <li key={skill} className="text-xs text-slate-300 flex items-center gap-1.5 font-light">
                            <CheckCircle2 className="h-3 w-3 text-brand shrink-0 opacity-70" />
                            {skill}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="text-[9px] font-bold uppercase tracking-wider text-slate-500 mb-2">Industry Tools Mastered</h3>
                      <div className="flex flex-wrap gap-1.5">
                        {course.tools.map((tool) => (
                          <Badge key={tool} variant="outline" className="bg-slate-900 text-slate-400 border-white/5 font-mono text-[9px] tracking-wider uppercase py-0.5 px-2">
                            {tool}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-white/[0.04] flex justify-end relative z-10">
                  <Button asChild className="rounded-xl px-5 h-9 bg-brand text-background hover:bg-brand/90 font-bold text-xs flex items-center gap-1 shadow-sm">
                    <Link href="/signup">
                      Unlock Course <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            </FadeUp>
          ))}
        </div>
      </div>
    </PageReveal>
  );
}
