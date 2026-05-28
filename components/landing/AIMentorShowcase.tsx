'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Code2, Database, Terminal, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MentorPersona {
  id: string;
  name: string;
  role: string;
  icon: React.ReactNode;
  color: string;
  glowColor: string;
  skills: string[];
  mockCode: string;
  language: string;
  socraticResponse: string;
  promptSuggestions: string[];
}

const PERSONAS: MentorPersona[] = [
  {
    id: 'data-analytics',
    name: 'Socratic SQL Auditor',
    role: 'Data Analytics Coach',
    icon: <Database className="h-4 w-4" />,
    color: '#81C784',
    glowColor: 'rgba(129,199,132,0.15)',
    skills: ['Query Optimization', 'Relational Schemas', 'dbt Pipelines'],
    language: 'sql',
    mockCode: `SELECT user_id, COUNT(id) 
FROM checkouts
WHERE created_at >= '2026-01-01'
GROUP BY 1;`,
    socraticResponse: "Your query executes successfully, but let's think about scale. If `checkouts` contains 100 million rows, how will your `GROUP BY 1` perform without index coverage or pre-aggregation? Look at your `WHERE` filter. What strategy could we use in Google BigQuery to partition or cluster this query's scan footprint?",
    promptSuggestions: [
      'How do I partition a BigQuery table?',
      'Optimize my checkout query scans',
      'Explain window joins in SQL'
    ]
  },
  {
    id: 'web-dev',
    name: 'Fullstack Code Reviewer',
    role: 'Web Development Coach',
    icon: <Code2 className="h-4 w-4" />,
    color: '#FF6B35',
    glowColor: 'rgba(255,107,53,0.15)',
    skills: ['Next.js App Router', 'REST APIs', 'JWT Security'],
    language: 'typescript',
    mockCode: `// app/api/session/route.ts
export async function GET(req: Request) {
  const token = req.headers.get('Authorization');
  const session = jwt.verify(token, 'secret');
  return Response.json(session);
}`,
    socraticResponse: "Great start on the session controller! However, notice where your secret key is stored. What happens if this code is committed to a public GitHub repository? Also, how are you handling session expirations or malformed signature errors? How would you refactor this to load keys securely from environment variables?",
    promptSuggestions: [
      'Set up Vercel environment variables',
      'Secure routes using Next.js Middleware',
      'Handle JWT expiration failures'
    ]
  },
  {
    id: 'data-science',
    name: 'ML Pipeline Architect',
    role: 'Data Science Coach',
    icon: <Cpu className="h-4 w-4" />,
    color: '#CE93D8',
    glowColor: 'rgba(206,147,216,0.15)',
    skills: ['Ensemble Modeling', 'SHAP Explainability', 'EDA Pipelines'],
    language: 'python',
    mockCode: `# Fit customer churn model
model = XGBClassifier(max_depth=6)
model.fit(X_train, y_train)
predictions = model.predict(X_test)`,
    socraticResponse: "Your XGBoost classifier is fully trained! But before deploying it to production, how do you explain *why* it predicts a customer will churn? If a stakeholder asks for the top feature driving this decision, how would you configure a SHAP explainer to visualize feature attribution vectors?",
    promptSuggestions: [
      'Write a SHAP summary plot pipeline',
      'Tune XGBoost hyper-parameters',
      'Handle highly imbalanced dataset ratios'
    ]
  },
  {
    id: 'marketing',
    name: 'Growth Funnel Architect',
    role: 'Digital Marketing Coach',
    icon: <ShieldAlert className="h-4 w-4" />,
    color: '#4FC3F7',
    glowColor: 'rgba(79,195,247,0.15)',
    skills: ['Attribution Modeling', 'Ad Copy Automations', 'CPA Analysis'],
    language: 'javascript',
    mockCode: `// Custom GA4 Purchase Event
gtag('event', 'purchase', {
  transaction_id: 'TX-90234',
  value: 299.00,
  currency: 'USD'
});`,
    socraticResponse: "Excellent event configuration. To turn this raw telemetry into growth insights, how are you mapping conversion values back to search keywords? If your paid ads acquisition funnel has a multi-day conversion latency, what touchpoint attribution model would you configure to ensure accurate CPA calculation?",
    promptSuggestions: [
      'Map keyword sources to GA4 purchases',
      'Compare First-Touch vs Data-Driven attribution',
      'Automate copywriting creatives generation'
    ]
  }
];

export function AIMentorShowcase() {
  const [activeTab, setActiveTab] = useState<string>('data-analytics');
  const [typedPrompt, setTypedPrompt] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [customResponse, setCustomResponse] = useState<string | null>(null);

  const selectedPersona = PERSONAS.find(p => p.id === activeTab) || PERSONAS[0];

  const handleSuggestionClick = (prompt: string) => {
    setIsTyping(true);
    setTypedPrompt('');
    setCustomResponse(null);
    
    // Simulate interactive prompt typing animation
    let currentText = '';
    const speed = 25;
    let idx = 0;
    
    const interval = setInterval(() => {
      if (idx < prompt.length) {
        currentText += prompt[idx];
        setTypedPrompt(currentText);
        idx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsTyping(false);
          setCustomResponse(selectedPersona.socraticResponse);
        }, 600);
      }
    }, speed);
  };

  return (
    <Card className="rounded-[2.5rem] border border-white/5 bg-[#07070E]/60 p-6 md:p-10 shadow-2xl relative overflow-hidden backdrop-blur-sm">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand/5 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="grid gap-10 lg:grid-cols-12 relative z-10">
        
        {/* LEFT COLUMN: INTRO & PERSONA TABS */}
        <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
          <div className="space-y-4">
            <Badge variant="outline" className="border-brand/35 text-brand uppercase tracking-widest text-[9px] font-bold py-1 px-3">
              INTELLIGENT INTEGRATION
            </Badge>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-[1.15]">
              Socratic AI Mentor <span className="text-brand italic font-light">Interactive Sandbox.</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 font-light leading-relaxed">
              Experience the core intelligence driving your learning workspace. Unlike generic LLMs that hand you raw solutions, our Socratic Mentors challenge your logic, guide your syntax, and prompt you to construct deep conceptual models.
            </p>
          </div>

          {/* Persona selector tabs */}
          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Select an active domain mentor:</p>
            <div className="flex flex-col gap-2">
              {PERSONAS.map((p) => {
                const isActive = activeTab === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => {
                      setActiveTab(p.id);
                      setTypedPrompt('');
                      setCustomResponse(null);
                    }}
                    className={cn(
                      "flex items-center justify-between p-3.5 rounded-xl border text-left transition-all duration-300",
                      isActive 
                        ? "bg-white/[0.03] border-white/10 shadow-sm"
                        : "bg-transparent border-transparent hover:bg-white/[0.01]"
                    )}
                    style={{
                      borderLeftColor: isActive ? p.color : undefined,
                      borderLeftWidth: isActive ? '3px' : '1px'
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="p-2 rounded-lg bg-slate-950 border border-white/5" style={{ color: p.color }}>
                        {p.icon}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-foreground leading-none">{p.name}</h4>
                        <span className="text-[10px] text-slate-400 font-light mt-1 block">{p.role}</span>
                      </div>
                    </div>
                    {isActive && <Sparkles className="h-3.5 w-3.5 text-brand" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE CONSOLE */}
        <div className="lg:col-span-7 flex flex-col h-[520px] rounded-3xl border border-white/5 bg-slate-950/60 overflow-hidden relative shadow-inner">
          <div className="absolute inset-0 pointer-events-none rounded-3xl border border-white/[0.02]" />
          
          {/* Header toolbar */}
          <div className="bg-[#09090D] border-b border-white/5 px-5 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
              <span className="h-3 w-3 rounded-full bg-green-500/80" />
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-2">
                socratic_session_stdout
              </span>
            </div>
            <Badge variant="secondary" className="border-white/5 bg-slate-900/60 text-slate-400 font-mono text-[9px] uppercase">
              {selectedPersona.language} console
            </Badge>
          </div>

          {/* Interactive Chat Console Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-6 scrollbar-thin scrollbar-thumb-white/5">
            {/* Mock Code Block */}
            <div className="space-y-1.5">
              <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">Student Code Workspace</span>
              <div className="rounded-xl border border-white/[0.03] bg-black/40 p-4 font-mono text-xs text-emerald-400 overflow-x-auto">
                <pre><code>{selectedPersona.mockCode}</code></pre>
              </div>
            </div>

            {/* Conversational Dialog Bubble */}
            <AnimatePresence mode="wait">
              <div className="space-y-4">
                {/* Custom Typed Prompt */}
                {typedPrompt && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-end"
                  >
                    <div className="max-w-[85%] rounded-2xl bg-brand/10 border border-brand/20 p-3.5 text-xs text-slate-200">
                      <p className="font-semibold text-[9px] uppercase tracking-wider text-brand mb-1">You</p>
                      {typedPrompt}
                    </div>
                  </motion.div>
                )}

                {/* Socratic Response bubble */}
                {(isTyping || customResponse) && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex gap-3 items-start"
                  >
                    <div className="p-2 rounded-xl bg-slate-900 border border-white/5 text-brand mt-1 shadow-sm shrink-0">
                      {selectedPersona.icon}
                    </div>
                    <div className="max-w-[85%] rounded-2xl bg-white/[0.02] border border-white/5 p-4 space-y-2">
                      <h5 className="text-xs font-bold" style={{ color: selectedPersona.color }}>
                        {selectedPersona.name}
                      </h5>
                      <div className="text-xs leading-relaxed text-slate-350 font-light">
                        {isTyping ? (
                          <div className="flex items-center gap-1 py-1">
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        ) : (
                          customResponse
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Default state */}
                {!typedPrompt && !isTyping && !customResponse && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-6 space-y-2 border border-dashed border-white/5 rounded-2xl bg-white/[0.01]"
                  >
                    <span className="text-xl">🤖</span>
                    <h5 className="text-xs font-semibold text-slate-400">Socratic Mentor Ready</h5>
                    <p className="text-[10px] text-slate-500 font-light max-w-xs mx-auto">
                      Click any suggested prompt suggestion bubble below to test the mentor's Socratic reasoning!
                    </p>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>
          </div>

          {/* Prompt Suggestion Toolbar Footer */}
          <div className="bg-[#09090D] border-t border-white/5 p-4 space-y-3 shrink-0">
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 block">
              Socratic Prompt suggestions (Click to execute)
            </span>
            <div className="flex flex-wrap gap-2">
              {selectedPersona.promptSuggestions.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSuggestionClick(prompt)}
                  disabled={isTyping}
                  className="rounded-lg border border-white/5 bg-slate-900/60 hover:bg-slate-900 px-3 py-1.5 text-[10px] text-slate-400 hover:text-slate-200 transition-all duration-200 text-left cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}
