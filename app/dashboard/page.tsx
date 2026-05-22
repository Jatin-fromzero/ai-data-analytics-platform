'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Welcome Section */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Welcome back, {user?.name?.split(' ')[0]}</h1>
          <p className="text-muted mt-1">You are currently in Week 4: SQL & Cloud Data Warehousing.</p>
        </div>
        <Button size="lg" className="shadow-glow">Continue Learning</Button>
      </section>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Progress Area */}
        <div className="md:col-span-2 space-y-6">
          <Card className="p-6 border-border/60 bg-surface/40">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Path Progress</h2>
              <span className="text-brand font-bold">25% Completed</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-brand rounded-full relative" style={{ width: '25%' }}>
                <div className="absolute top-0 right-0 bottom-0 w-4 bg-white/20 animate-pulse" />
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">Up Next</h3>
              <div className="rounded-xl border border-brand/30 bg-brand/5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors hover:border-brand/60 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-lg bg-surface flex items-center justify-center text-xl shadow-inner border border-border">
                    🐘
                  </div>
                  <div>
                    <p className="text-sm font-bold text-foreground">Advanced SQL Joins & Subqueries</p>
                    <p className="text-xs text-muted mt-0.5">Module 2 • Lesson 4</p>
                  </div>
                </div>
                <Button size="sm" variant="secondary" className="shrink-0 bg-surface hover:bg-slate-800">Start Lesson</Button>
              </div>
            </div>
          </Card>

          <h2 className="text-xl font-bold text-foreground mt-8 mb-4">Your Active Projects</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card className="p-5 border-border/60 bg-surface/40 hover:border-border transition-colors cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">🛒</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded">In Progress</span>
              </div>
              <h3 className="font-semibold text-foreground group-hover:text-brand transition-colors">E-Commerce Funnel</h3>
              <p className="text-xs text-muted mt-1">BigQuery & Tableau</p>
            </Card>
            <Card className="p-5 border-border/60 bg-surface/40 opacity-60">
              <div className="flex justify-between items-start mb-4">
                <span className="text-2xl">🤖</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted bg-slate-800 px-2 py-1 rounded">Locked</span>
              </div>
              <h3 className="font-semibold text-foreground">Customer Churn Predictor</h3>
              <p className="text-xs text-muted mt-1">Python & Scikit-Learn</p>
            </Card>
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card className="p-5 border-border/60 bg-surface/40">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">AI Mentor</h3>
            <div className="text-center py-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 mb-3 relative">
                <span className="h-2 w-2 rounded-full bg-brand absolute top-1 right-1 animate-pulse" />
                <span className="text-brand font-bold text-xl">✦</span>
              </div>
              <p className="text-sm text-muted font-medium mb-3">Stuck on a SQL query?</p>
              <Button variant="ghost" className="w-full text-xs h-8 border border-brand/30 text-brand hover:bg-brand/10">Ask Mentor</Button>
            </div>
          </Card>

          <Card className="p-5 border-border/60 bg-surface/40">
            <h3 className="text-sm font-semibold text-muted uppercase tracking-wider mb-4">Career Checklist</h3>
            <ul className="space-y-3">
              {[
                { text: 'Complete Profile setup', done: true },
                { text: 'Finish Module 1 Capstone', done: true },
                { text: 'Build GitHub Portfolio', done: false },
                { text: 'Mock Interview Practice', done: false },
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2">
                  <div className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border ${item.done ? 'bg-brand border-brand' : 'border-border bg-surface'}`}>
                    {item.done && <svg className="h-3 w-3 text-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                  </div>
                  <span className={`text-xs ${item.done ? 'text-muted line-through' : 'text-muted'}`}>{item.text}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
}
