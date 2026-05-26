'use client';

import React from 'react';
import { Card } from '@/components/ui/card';
import { PageReveal, FadeUp, StaggerContainer, StaggerItem } from '@/components/ui/motion';
import { Button } from '@/components/ui/button';

const mockUsers = [
  { id: 'usr-001', name: 'Alex Student', email: 'student@analytics.com', status: 'Active', progress: '45%', plan: 'Pro' },
  { id: 'usr-002', name: 'Sarah Jenkins', email: 'sarah@example.com', status: 'Active', progress: '82%', plan: 'Pro' },
  { id: 'usr-003', name: 'Michael Chen', email: 'michael@example.com', status: 'Inactive', progress: '12%', plan: 'Basic' },
  { id: 'usr-004', name: 'Emma Watson', email: 'emma@example.com', status: 'Active', progress: '100%', plan: 'Pro' },
  { id: 'usr-005', name: 'David Kim', email: 'david@example.com', status: 'Active', progress: '24%', plan: 'Basic' },
];

export default function AdminDashboardPage() {
  return (
    <PageReveal>
      <div className="space-y-10 max-w-[1400px] mx-auto px-4 pb-20 mt-8">
        
        {/* ── HEADER ──────────────────────────────────────────────────────── */}
        <FadeUp>
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6">
            <div className="space-y-1">
              <h1 className="text-3xl font-semibold text-foreground tracking-tight">Overview</h1>
              <p className="text-sm text-muted font-medium">High-level metrics and platform health.</p>
            </div>
            
            <div className="flex gap-3">
              <Button variant="secondary" size="sm" className="h-9 text-xs border border-border/50 bg-surface/50 font-medium hover:bg-surface">
                Export CSV
              </Button>
              <Button size="sm" className="h-9 text-xs shadow-sm bg-foreground text-background hover:bg-foreground/90 font-semibold px-4">
                Add Student
              </Button>
            </div>
          </header>
        </FadeUp>

        {/* ── METRICS GRID (Stripe Style) ────────────────────────────────── */}
        <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Total Revenue', value: '$45,230', trend: '+12.5%', isUp: true },
            { label: 'Active Students', value: '1,248', trend: '+8.2%', isUp: true },
            { label: 'Avg. Completion', value: '68%', trend: '-2.1%', isUp: false },
            { label: 'AI API Cost', value: '$342.50', trend: 'Stable', isUp: true },
          ].map((metric) => (
            <StaggerItem key={metric.label}>
              <Card className="p-6 border-border/40 bg-surface/30 shadow-sm hover:bg-surface/50 transition-colors cursor-pointer group">
                <p className="text-[11px] font-semibold tracking-wide text-muted uppercase mb-3">{metric.label}</p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-semibold text-foreground tracking-tight group-hover:text-brand transition-colors">{metric.value}</p>
                  <span className={`text-[11px] font-bold ${metric.isUp ? 'text-emerald-500' : 'text-red-500'}`}>
                    {metric.trend}
                  </span>
                </div>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* ── DATA TABLE ─────────────────────────────────────────────────── */}
        <FadeUp delay={0.2}>
          <div className="space-y-4 pt-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">Recent Students</h2>
              <button className="text-[11px] font-bold text-brand uppercase tracking-wider hover:text-brand/80 transition-colors">View all →</button>
            </div>
            
            <Card className="border border-border/40 bg-surface/20 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-muted">
                  <thead className="bg-surface/40 border-b border-border/40 text-[10px] uppercase tracking-wider text-muted font-bold">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Student</th>
                      <th className="px-6 py-4 font-semibold">Plan</th>
                      <th className="px-6 py-4 font-semibold">Status</th>
                      <th className="px-6 py-4 font-semibold">Progress</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/30">
                    {mockUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-surface/60 transition-colors group">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-semibold text-foreground tracking-tight">{user.name}</div>
                          <div className="text-[11px] text-muted font-medium mt-0.5">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex rounded-[4px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider border
                            ${user.plan === 'Pro' ? 'bg-brand/10 text-brand border-brand/20' : 'bg-surface text-muted border-border/50'}
                          `}>
                            {user.plan}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-2 w-2">
                              {user.status === 'Active' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                              <span className={`relative inline-flex rounded-full h-2 w-2 ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'}`}></span>
                            </span>
                            <span className="text-xs font-medium">{user.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3 w-40">
                            <span className="w-8 text-xs font-semibold text-foreground">{user.progress}</span>
                            <div className="h-1 w-full rounded-full bg-slate-800/50 overflow-hidden">
                              <div 
                                className="h-full rounded-full bg-foreground transition-all duration-1000" 
                                style={{ width: user.progress }} 
                              />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <button className="text-[11px] uppercase tracking-wider font-bold text-muted hover:text-foreground transition-colors opacity-0 group-hover:opacity-100">
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </FadeUp>

      </div>
    </PageReveal>
  );
}
