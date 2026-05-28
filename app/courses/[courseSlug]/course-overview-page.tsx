'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { PageReveal, FadeUp } from '@/components/ui/motion';
import { apiClient } from '@/frontend/lib/api-client';
import { 
  PlayCircle, 
  CheckCircle, 
  Circle, 
  Sparkles, 
  GraduationCap, 
  Lock, 
  ChevronRight, 
  BookOpen, 
  Award, 
  MessageSquare, 
  Send, 
  Loader2,
  ChevronLeft,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';

const EASE = [0.25, 0.1, 0.25, 1] as const;

// Syllabus details for all 5 tracks to display dynamic parts in the milestone tree
const localCourseDetails: Record<string, {
  timeline: string;
  category: string;
  difficulty: string;
  headline: string;
  tools: string[];
  skills: string[];
  parts: { slug: string; title: string; desc: string; order: number; duration: string }[];
  capstones: { title: string; desc: string; difficulty: string }[];
}> = {
  'ai-data-analytics': {
    timeline: '16 Weeks',
    category: 'Data & Analytics',
    difficulty: 'Core Foundation',
    headline: 'Master spreadsheets, write relational SQL queries, build executive BI dashboards, and orchestrate cloud data pipelines.',
    tools: ['Excel', 'BigQuery', 'dbt', 'Airflow', 'Tableau', 'Power BI'],
    skills: ['SQL CTEs & Joins', 'Power Query ETL', 'Data Storytelling', 'dbt Modeling'],
    parts: [
      { slug: 'part-1', title: 'Analytics Fundamentals in AI Era', desc: 'Descriptive vs Diagnostic metrics, descriptive statistics, and spreadsheet ETL automation.', order: 1, duration: 'Weeks 1–3' },
      { slug: 'part-2', title: 'SQL & Relational Warehousing', desc: 'Relational schemas, complex multi-table JOINs, CTEs, and window functions.', order: 2, duration: 'Weeks 4–6' },
      { slug: 'part-3', title: 'Python & Automated Analytics', desc: 'Pandas data wrangling, programmatic EDA, and Streamlit interactive web displays.', order: 3, duration: 'Weeks 7–10' },
      { slug: 'part-4', title: 'BI Dashboards & Storytelling', desc: 'DAX measures, Tableau parameters, time intelligence, and executive data presentation.', order: 4, duration: 'Weeks 11–13' }
    ],
    capstones: [
      { title: 'RetailCo Sales Performance Analyzer', desc: 'Build an automated Excel dashboard with Power Query ETL pipelines.', difficulty: 'Beginner' },
      { title: 'E-Commerce Funnel Analytics Engine', desc: 'Track user drop-offs across a multi-step checkout using CTEs.', difficulty: 'Intermediate' },
      { title: 'Customer Intelligence Platform', desc: 'Build a Python customer segmentation and cohort analysis system.', difficulty: 'Advanced' }
    ]
  },
  'ai-digital-marketing': {
    timeline: '12 Weeks',
    category: 'Growth & Marketing',
    difficulty: 'Career Accelerator',
    headline: 'Build automated lead-gen funnels, scale paid traffic campaigns with programmatic ad templates, and master attribution structures.',
    tools: ['Google Ads', 'Meta Manager', 'GA4', 'Zapier', 'Mailchimp'],
    skills: ['Copy-Generation AI', 'Ad Campaign Automation', 'Funnel Optimization', 'Web Attribution Models'],
    parts: [
      { slug: 'part-1', title: 'AI Marketing Strategies', desc: 'Generative copywriting, A/B ad creative templates, and Zapier funnel automation loops.', order: 1, duration: 'Weeks 1–3' },
      { slug: 'part-2', title: 'Paid Traffic Scaling', desc: 'Algorithmic CPC bidding, Meta Dynamic Creatives, and programmatic ad setup.', order: 2, duration: 'Weeks 4–7' },
      { slug: 'part-3', title: 'GA4 Web Analytics & Attribution', desc: 'Custom tracking events, multi-touch attribution, and cohort LTV dashboards.', order: 3, duration: 'Weeks 8–10' }
    ],
    capstones: [
      { title: 'Programmatic Copywriting Pipeline', desc: 'Generate, A/B test, and deploy 50+ ad copies using Zapier automations.', difficulty: 'Intermediate' },
      { title: 'Cross-Channel Ad Allocation engine', desc: 'Algorithmic budget distributor tracking Google and Meta margins.', difficulty: 'Advanced' }
    ]
  },
  'ai-data-science': {
    timeline: '16 Weeks',
    category: 'Algorithms & ML',
    difficulty: 'Advanced Tech',
    headline: 'Establish rigorous statistical models, design supervised ensemble classifiers, train deep neural networks, and configure SHAP interpretability.',
    tools: ['Python', 'Pandas', 'Scikit-Learn', 'SHAP', 'TensorFlow', 'Streamlit'],
    skills: ['Supervised Learning', 'Random Forest & XGBoost', 'SHAP Explainability', 'Pandas EDA'],
    parts: [
      { slug: 'part-1', title: 'Predictive Modeling Introduction', desc: 'Descriptive regressions, probability matrices, hypothesis testing, and ANOVA.', order: 1, duration: 'Weeks 1–4' },
      { slug: 'part-2', title: 'Machine Learning Pipelines', desc: 'Ensemble models, XGBoost, hyperparameter tuning, and data preprocessing.', order: 2, duration: 'Weeks 5–8' },
      { slug: 'part-3', title: 'Deep Learning & Neural Networks', desc: 'Convolutional neural networks (CNNs), backpropagation math, and transfer learning.', order: 3, duration: 'Weeks 9–12' }
    ],
    capstones: [
      { title: 'Relational Cohort Algorithm Engine', desc: 'Build statistical regressions to predict user cohort metrics.', difficulty: 'Intermediate' },
      { title: 'Predictive Customer Churn Engine', desc: 'Deploy an XGBoost classifier to forecast at-risk client drop-offs.', difficulty: 'Advanced' }
    ]
  },
  'ai-web-development': {
    timeline: '14 Weeks',
    category: 'Software Engineering',
    difficulty: 'Fullstack Tech',
    headline: 'Architect reactive frontend autolayouts, secure App Router API handlers, Prisma MySQL structures, and deploy edge serverless functions.',
    tools: ['Next.js', 'Prisma', 'MySQL', 'React', 'GitHub Copilot', 'Vercel'],
    skills: ['Next.js App Router', 'RESTful API Design', 'Tailwind CSS UI', 'Prisma ORM'],
    parts: [
      { slug: 'part-1', title: 'Next.js App Router Setup', desc: 'Frontend autolayouts, client vs server components, and Framer Motion spring actions.', order: 1, duration: 'Weeks 1–4' },
      { slug: 'part-2', title: 'REST API & Prisma Connections', desc: 'Stateless endpoints, Prisma schema migrations, and MySQL database CRUD loops.', order: 2, duration: 'Weeks 5–8' },
      { slug: 'part-3', title: 'Enterprise Security Integration', desc: 'NextAuth JWT configurations, route shields, and Stripe checkout webhooks.', order: 3, duration: 'Weeks 9–11' }
    ],
    capstones: [
      { title: 'Premium Glassmorphic Dashboard UI', desc: 'Build an elegant dark-mode dashboard with responsive autolayouts.', difficulty: 'Beginner' },
      { title: 'Dynamic REST API Database Portal', desc: 'Create a fullstack CRUD project console using Prisma ORM.', difficulty: 'Intermediate' }
    ]
  },
  'ai-graphic-design': {
    timeline: '10 Weeks',
    category: 'Design & UI/UX',
    difficulty: 'Creative Suite',
    headline: 'Design corporate brand vector guidelines, compile Figma component libraries, prototype layout screens, and generate visual assets.',
    tools: ['Figma', 'Illustrator', 'Midjourney', 'Photoshop', 'GitHub Pages'],
    skills: ['Figma Auto-Layouts', 'Branding & UI Systems', 'Generative Vector Design', 'Figma Prototyping'],
    parts: [
      { slug: 'part-1', title: 'Figma Layout Grids & Systems', desc: 'Auto-layout spacing guidelines, responsive UI constraints, and style guides.', order: 1, duration: 'Weeks 1–3' },
      { slug: 'part-2', title: 'Master UI Component variants', desc: 'Variant properties, responsive nested cards, and high-fidelity transitions.', order: 2, duration: 'Weeks 4–7' },
      { slug: 'part-3', title: 'Midjourney Prompt Engineering', desc: 'Generative vector artwork parameters, Photoshop layers, and visual publishing.', order: 3, duration: 'Weeks 8–10' }
    ],
    capstones: [
      { title: 'Brand Identity Vector Guideline', desc: 'Design corporate logos and color branding vector sheets.', difficulty: 'Beginner' },
      { title: 'Premium SaaS Console UI Prototype', desc: 'Prototype a premium SaaS visual console inside Figma.', difficulty: 'Intermediate' }
    ]
  }
};

export default function CourseOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params?.courseSlug as string;

  const details = localCourseDetails[courseSlug] || localCourseDetails['ai-data-analytics'];

  // Dynamic Dashboard States
  const [courseData, setCourseData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Socratic AI Mentor Chat States
  const [messages, setMessages] = useState<any[]>([
    {
      role: 'assistant',
      content: `Greetings! I am your AI Socratic Mentor for **${details.category}**. Ask me any technical questions, paste your error logs, or request feedback on your capstone deliverables, and I will guide you step-by-step through the concepts!`
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await apiClient.get<any>('/api/dashboard');
      if (res.success && res.data) {
        const found = res.data.courses.find((c: any) => c.slug === courseSlug);
        if (found) {
          setCourseData(found);
        } else {
          // If not enrolled or not found in dashboard, check details
          setCourseData({
            slug: courseSlug,
            title: details.headline,
            isUnlocked: false,
            progressPercent: 0,
            completedLessons: 0,
            totalLessons: 10
          });
        }
      } else {
        setError(res.error || 'Failed to connect to enrollment databases.');
      }
    } catch (err) {
      setError('Connection to course console timed out. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourseData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSlug]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = inputMessage.trim();
    if (!cleanInput || chatLoading) return;

    const newMessages = [...messages, { role: 'user', content: cleanInput }];
    setMessages(newMessages);
    setInputMessage('');
    setChatLoading(true);

    try {
      const res = (await apiClient.post<any>('/api/chat', {
        messages: newMessages.map(m => ({ role: m.role, content: m.content })),
        courseSlug: courseSlug
      })) as any;

      if (res && res.content) {
        setMessages(prev => [...prev, { role: 'assistant', content: res.content }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Connection with Socratic Engine interrupted. Please resend.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Gemini rate limits active. Please try again shortly.' }]);
    } finally {
      setChatLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070E] flex flex-col items-center justify-center p-6 animate-pulse">
        <div className="space-y-4 text-center max-w-sm">
          <Loader2 className="h-10 w-10 text-brand animate-spin mx-auto" />
          <p className="text-xs font-mono text-slate-500 tracking-widest uppercase animate-pulse">
            Configuring Tech Sandbox Console...
          </p>
        </div>
      </div>
    );
  }

  const isUnlocked = courseData?.isUnlocked || false;
  const progress = courseData?.progressPercent || 0;
  const completedLessons = courseData?.completedLessons || 0;
  const totalLessons = courseData?.totalLessons || 10;

  // SVG parameters for circular progress
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <PageReveal>
      <div className="min-h-screen bg-[#07070E] text-slate-200 font-sans pb-16">
        
        {/* ── BREADCRUMB HEADER ── */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/[0.03] bg-[#07070E]/80 px-6 sm:px-8 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <Link href="/dashboard" className="text-xs font-semibold text-slate-400 hover:text-white transition-all flex items-center gap-1.5 group">
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" /> Workspace Dashboard
            </Link>
            <span className="text-slate-700">/</span>
            <span className="text-xs text-slate-200 font-semibold">{details.category}</span>
          </div>

          <Button asChild variant="ghost" className="h-9 px-4 text-xs font-semibold border border-white/5 hover:bg-white/5 rounded-xl">
            <Link href="/dashboard">Return Dashboard</Link>
          </Button>
        </header>

        {/* ── MAIN LAYOUT GRID (Main workspace left, Chat sidebar right) ── */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-8 max-w-[1400px] mx-auto px-6 sm:px-8 pt-8 items-start">
          
          {/* ── LEFT CONTENT COLUMN ── */}
          <div className="space-y-10">
            
            {/* 1. HERO CONSOLE SUMMARY */}
            <FadeUp>
              <div className="relative rounded-3xl border border-white/[0.04] bg-white/[0.01] p-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 blur-[100px] rounded-full pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand/40 to-transparent" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="border-brand/30 text-brand uppercase tracking-wider text-[9px] font-bold py-0.5 px-2.5 rounded-full">
                        {details.category}
                      </Badge>
                      <Badge className="bg-slate-800 text-slate-300 border-none text-[9px] py-0.5 px-2.5 rounded-full">
                        {details.timeline}
                      </Badge>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-snug">
                      {courseData?.title || details.headline}
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed max-w-2xl">
                      Welcome to your tech workspace console. Complete socratic milestones, collaborate with your AI Mentor, and finalize your placement-ready projects catalog.
                    </p>

                    <div className="flex flex-wrap gap-2 pt-2">
                      {details.tools.map((tool) => (
                        <Badge key={tool} variant="outline" className="bg-slate-900 border-white/5 font-mono text-[9px] tracking-wider uppercase text-slate-400 py-0.5 px-2.5">
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* SVG Circular Progress Loader */}
                  {isUnlocked && (
                    <div className="shrink-0 flex flex-col items-center p-4 bg-slate-950/40 rounded-2xl border border-white/[0.02]">
                      <div className="relative h-24 w-24 flex items-center justify-center">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Background ring */}
                          <circle cx="48" cy="48" r={radius} fill="transparent" stroke="rgba(255,255,255,0.03)" strokeWidth="6" />
                          {/* Foreground ring */}
                          <motion.circle 
                            cx="48" 
                            cy="48" 
                            r={radius} 
                            fill="transparent" 
                            stroke="url(#brandGradient)" 
                            strokeWidth="6" 
                            strokeDasharray={circumference}
                            initial={{ strokeDashoffset: circumference }}
                            animate={{ strokeDashoffset }}
                            transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
                            strokeLinecap="round"
                          />
                          <defs>
                            <linearGradient id="brandGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FF6B35" />
                              <stop offset="100%" stopColor="#FF8A65" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-xl font-black text-white leading-none">{progress}%</span>
                          <span className="block text-[8px] text-slate-500 uppercase tracking-widest font-bold mt-0.5">done</span>
                        </div>
                      </div>
                      <div className="text-center mt-3 space-y-0.5">
                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{completedLessons}/{totalLessons} Lessons</span>
                        <p className="text-[8px] text-slate-500 uppercase tracking-wider font-semibold">Active Syllabus Progress</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </FadeUp>

            {/* 2. SYLLABUS MILESTONE TREE */}
            <FadeUp delay={0.05}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand" /> Interactive Syllabus Roadmap
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Progress through locked and unlocked milestones sequentially. Click unlocked items to open the Lesson Console.
                  </p>
                </div>

                <div className="relative pl-6 sm:pl-0 space-y-4">
                  {details.parts.map((part, idx) => {
                    // In a mock state, unlock the first part by default if course is unlocked
                    const isPartUnlocked = isUnlocked && (idx === 0 || (completedLessons >= idx * 2));
                    
                    return (
                      <div key={part.slug} className="relative flex gap-6 group">
                        
                        {/* Timeline branch line */}
                        {idx < details.parts.length - 1 && (
                          <div className="absolute left-5 top-12 bottom-0 w-px bg-gradient-to-b from-brand/20 via-white/[0.03] to-transparent" />
                        )}

                        {/* Timeline node */}
                        <div className={`relative shrink-0 z-10 h-10 w-10 rounded-full border-2 flex items-center justify-center text-xs font-black transition-all ${
                          isPartUnlocked 
                            ? 'border-brand/40 bg-slate-950 text-brand shadow-[0_0_15px_rgba(255,107,53,0.15)]' 
                            : 'border-white/[0.04] bg-[#0E0E14] text-slate-600'
                        }`}>
                          {idx + 1}
                        </div>

                        {/* Part summary card */}
                        <Card className={`flex-1 p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden ${
                          isPartUnlocked 
                            ? 'border-white/[0.06] bg-white/[0.02] hover:border-brand/30 shadow-md' 
                            : 'border-white/[0.02] bg-slate-950/20 opacity-60'
                        }`}>
                          {isPartUnlocked && (
                            <div className="absolute top-0 left-0 w-0.5 h-full bg-gradient-to-b from-brand to-orange-400" />
                          )}

                          <div className="space-y-1.5 flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-[10px] font-bold text-brand uppercase tracking-wider">{part.duration}</span>
                              <Badge className="bg-slate-900 text-slate-400 text-[8px] font-bold py-0.5 px-2 rounded-full">Part {part.order}</Badge>
                            </div>
                            <h3 className="text-sm font-bold text-slate-200 group-hover:text-brand transition-colors leading-snug">{part.title}</h3>
                            <p className="text-xs text-slate-400 leading-relaxed truncate max-w-xl">{part.desc}</p>
                          </div>

                          <div className="shrink-0 self-start sm:self-center">
                            {isPartUnlocked ? (
                              <Button asChild className="h-8 px-4 rounded-xl text-xs bg-brand text-background hover:bg-brand/90 font-bold transition-all shadow-sm flex items-center gap-1">
                                <Link href={`/courses/${courseSlug}/${part.slug}`}>
                                  Resume Module <ArrowRight className="h-3 w-3" />
                                </Link>
                              </Button>
                            ) : (
                              <Badge variant="outline" className="border-white/5 bg-slate-900 text-slate-500 text-[10px] py-1 px-3 rounded-xl flex items-center gap-1.5 font-semibold">
                                <Lock className="h-3 w-3 shrink-0" /> Locked Part
                              </Badge>
                            )}
                          </div>
                        </Card>

                      </div>
                    );
                  })}
                </div>
              </div>
            </FadeUp>

            {/* 3. CAPSTONES LIST PANEL */}
            <FadeUp delay={0.1}>
              <div className="space-y-6">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                    <Award className="h-4 w-4 text-brand" /> Capstone Deliverable Checklist
                  </h2>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">
                    Develop and deploy these specific portfolio pieces throughout the milestones to prove your technical depth to recruiters.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {details.capstones.map((project, i) => (
                    <Card key={i} className="p-5 border border-white/[0.04] bg-[#0E0E14]/40 rounded-2xl flex flex-col justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center gap-2">
                          <span className="text-[9px] font-bold text-brand uppercase tracking-wider">Placement Asset</span>
                          <Badge className="bg-slate-900 text-[8px] text-slate-400 border-none font-bold py-0.5 px-2 rounded-full">{project.difficulty}</Badge>
                        </div>
                        <h3 className="text-sm font-bold text-white tracking-tight">{project.title}</h3>
                        <p className="text-xs text-slate-400 leading-relaxed">{project.desc}</p>
                      </div>

                      <div className="pt-3 border-t border-white/[0.03] flex items-center justify-between text-[10px] text-slate-500">
                        <span>Status: <span className={isUnlocked ? "text-amber-400 font-bold" : "text-slate-600"}>{isUnlocked ? "In Progress" : "Locked"}</span></span>
                        <div className="h-4 w-4 rounded bg-slate-950 border border-white/5 flex items-center justify-center text-[8px] text-brand">
                          {isUnlocked ? "✦" : ""}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </FadeUp>

          </div>

          {/* ── RIGHT SOCRATIC AI MENTOR SIDEBAR ── */}
          <FadeUp delay={0.15}>
            <aside className="sticky top-24 rounded-[2rem] border border-white/[0.05] bg-slate-950/25 backdrop-blur-2xl overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.85)] flex flex-col h-[78vh] z-10">
              
              {/* Sidebar Header */}
              <div className="p-5 border-b border-white/[0.04] bg-white/[0.01] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-brand/5 blur-[35px] rounded-full pointer-events-none" />
                
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-brand/20 to-transparent border border-brand/20 flex items-center justify-center text-lg shadow-inner">
                      🤖
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-[10px] font-bold text-slate-200 flex items-center gap-1.5 uppercase tracking-widest">
                      Socratic AI Mentor
                    </h3>
                    <p className="text-[8px] text-slate-500 font-semibold tracking-wider mt-0.5">Dynamic Persona: {details.category}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages Log */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 scrollbar-hide text-xs">
                {messages.map((msg, i) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div key={i} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-3 leading-relaxed border ${
                        isUser 
                          ? 'bg-brand/10 border-brand/20 text-slate-200 rounded-tr-none' 
                          : 'bg-white/[0.02] border-white/[0.04] text-slate-300 rounded-tl-none'
                      }`}>
                        {/* Display message content with support for styling/bullets */}
                        <div className="space-y-1.5">
                          {msg.content.split('\n\n').map((para: string, idx: number) => (
                            <p key={idx} dangerouslySetInnerHTML={{ __html: para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
                {chatLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white/[0.02] border border-white/[0.04] rounded-2xl rounded-tl-none px-4 py-3 max-w-[80%] flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-brand animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Box */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-white/[0.04] bg-white/[0.01]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask AI Mentor a question..."
                    disabled={chatLoading}
                    className="flex-1 bg-slate-950/40 border border-white/[0.05] rounded-full px-5 py-2.5 text-[11px] text-white placeholder:text-slate-600 focus:border-brand/40 focus:outline-none transition-all disabled:opacity-50"
                  />
                  <Button 
                    type="submit" 
                    disabled={chatLoading || !inputMessage.trim()}
                    className="bg-brand text-slate-950 hover:bg-brand/90 font-bold h-10 w-10 shrink-0 p-0 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,107,53,0.2)] transition-all disabled:opacity-50 hover:scale-105"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </form>

            </aside>
          </FadeUp>

        </div>
      </div>
    </PageReveal>
  );
}
