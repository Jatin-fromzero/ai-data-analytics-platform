'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Activity, Users, TrendingUp, Target, BarChart2 } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <PageHeader 
        title="Platform Analytics" 
        description="Deep insights into student engagement, course progression, and platform retention."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10">
            Export Report
          </button>
        }
      />
      
      {/* High-level KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Avg. Daily Active Users"
          value="452"
          icon={Users}
          trend={{ value: 5.4, isPositive: true }}
          subtitle="DAU / MAU ratio: 42%"
        />
        <StatCard
          title="Avg. Time to Completion"
          value="14 Days"
          icon={Target}
          trend={{ value: 2.1, isPositive: true }}
          subtitle="across major phases"
        />
        <StatCard
          title="Total Video Minutes"
          value="84,592"
          icon={Activity}
          trend={{ value: 18.2, isPositive: true }}
          subtitle="streamed this month"
        />
        <StatCard
          title="Progression Bottleneck"
          value="SQL Joins"
          icon={TrendingUp}
          subtitle="highest drop-off rate"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Engagement Trends */}
        <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-6">User Engagement Trends</h3>
          <div className="h-[250px] w-full flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
            <div className="text-center">
              <BarChart2 className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Area Chart Placeholder</p>
              <p className="text-xs text-muted-foreground/50 mt-1">DAU over 30 days</p>
            </div>
          </div>
        </div>

        {/* Popular Lessons Table */}
        <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
          <h3 className="text-lg font-medium text-white mb-6">Most Popular Lessons</h3>
          <div className="space-y-4">
            {[
              { rank: 1, title: 'Introduction to Pandas', views: '2,405', completion: '94%' },
              { rank: 2, title: 'Advanced CTEs in SQL', views: '1,892', completion: '78%' },
              { rank: 3, title: 'Data Cleaning Workflows', views: '1,540', completion: '88%' },
              { rank: 4, title: 'Building a Portfolio Dashboard', views: '1,205', completion: '91%' },
            ].map((lesson, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded bg-brand/10 text-xs font-bold text-brand">
                    {lesson.rank}
                  </span>
                  <span className="text-sm font-medium text-slate-200">{lesson.title}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{lesson.views} views</span>
                  <span className="w-12 text-right font-medium text-slate-300">{lesson.completion}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
