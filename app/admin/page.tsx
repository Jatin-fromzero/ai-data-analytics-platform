'use client';

import React from 'react';
import { Card } from '@/components/ui/card';

const mockUsers = [
  { id: 'usr-001', name: 'Alex Student', email: 'student@analytics.com', status: 'Active', progress: '45%', plan: 'Pro' },
  { id: 'usr-002', name: 'Sarah Jenkins', email: 'sarah@example.com', status: 'Active', progress: '82%', plan: 'Pro' },
  { id: 'usr-003', name: 'Michael Chen', email: 'michael@example.com', status: 'Inactive', progress: '12%', plan: 'Basic' },
  { id: 'usr-004', name: 'Emma Watson', email: 'emma@example.com', status: 'Active', progress: '100%', plan: 'Pro' },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">CEO Overview</h1>
        <p className="text-sm text-muted mt-1">High-level metrics and platform health.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Revenue', value: '$45,230', trend: '+12.5%', isUp: true },
          { label: 'Active Students', value: '1,248', trend: '+8.2%', isUp: true },
          { label: 'Avg. Completion', value: '68%', trend: '-2.1%', isUp: false },
          { label: 'AI API Cost', value: '$342.50', trend: 'Stable', isUp: true },
        ].map((metric) => (
          <Card key={metric.label} className="p-6 border-border/60 bg-surface/40">
            <p className="text-sm font-medium text-muted">{metric.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold text-foreground">{metric.value}</p>
              <span className={`text-xs font-medium ${metric.isUp ? 'text-emerald-400' : 'text-red-400'}`}>
                {metric.trend}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* User Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">Recent Students</h2>
          <button className="text-sm font-medium text-brand hover:underline">View all users →</button>
        </div>
        <div className="rounded-xl border border-border/60 bg-surface/40 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-muted">
              <thead className="bg-background/50 text-xs uppercase text-muted">
                <tr>
                  <th className="px-6 py-4 font-medium">Student</th>
                  <th className="px-6 py-4 font-medium">Plan</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Progress</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-200">{user.name}</div>
                      <div className="text-xs text-muted">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex rounded-full bg-slate-800 px-2 py-1 text-xs font-medium text-muted">
                        {user.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                        {user.status}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8">{user.progress}</span>
                        <div className="h-1.5 w-24 rounded-full bg-slate-800">
                          <div 
                            className="h-full rounded-full bg-brand" 
                            style={{ width: user.progress }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-muted hover:text-foreground font-medium">Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
