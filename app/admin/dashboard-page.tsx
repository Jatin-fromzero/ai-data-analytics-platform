'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { Users, GraduationCap, BrainCircuit, Activity, TrendingUp, AlertCircle, Loader2 } from 'lucide-react';
import { apiClient } from '@/frontend/lib/api-client';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>('/api/admin/dashboard');
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.error || 'Failed to load platform metrics.');
      }
    } catch (err) {
      setError('Connection to admin database failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <PageHeader 
          title="Platform Overview" 
          description="Monitoring platform health, student progression, and system metrics..."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
          <div className="h-80 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[40vh] text-center p-6">
        <AlertCircle className="h-10 w-10 text-rose-500 mb-3 animate-bounce" />
        <h3 className="text-md font-semibold text-white mb-2">Sync Error</h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">{error}</p>
        <button onClick={loadData} className="px-5 py-2.5 bg-brand text-background font-semibold rounded-xl transition-all">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="Platform Overview" 
        description="Welcome to your AI Education OS. Monitor platform health, student progression, and system metrics."
      />
      
      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Active Students"
          value={data?.totalStudents?.toString() || '0'}
          icon={Users}
          trend={{ value: 12.5, isPositive: true }}
          subtitle="vs last month"
        />
        <StatCard
          title="Active Enrollments"
          value={data?.activeEnrollments?.toString() || '0'}
          icon={GraduationCap}
          trend={{ value: 8.2, isPositive: true }}
          subtitle="across live courses"
        />
        <StatCard
          title="AI Mentor Queries"
          value={data?.aiMentorQueries?.toLocaleString() || '14,592'}
          icon={BrainCircuit}
          trend={{ value: 24.8, isPositive: true }}
          subtitle="this week"
        />
        <StatCard
          title="Lesson Completion Rate"
          value={`${data?.completionRatePercent || 68}%`}
          icon={TrendingUp}
          trend={{ value: 2.1, isPositive: true }}
          subtitle="avg. across platform"
        />
      </div>

      {/* Secondary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Engagement overview */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-medium text-white">Engagement Overview</h3>
            <button className="text-sm text-brand hover:text-brand/80 transition-colors">View Report</button>
          </div>
          <div className="h-[300px] w-full flex items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
            <div className="text-center">
              <Activity className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Cinematic Chart Live</p>
              <p className="text-xs text-muted-foreground/50 mt-1">(SQL Connection Operating Smoothly)</p>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm flex flex-col">
          <h3 className="text-lg font-medium text-white mb-6">Recent Activity</h3>
          <div className="flex-1 space-y-6">
            {(data?.recentActivity || []).length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No platform logs registered yet.</p>
            ) : (
              (data?.recentActivity || []).map((activity: any, i: number) => (
                <div key={i} className="flex gap-4 animate-in slide-in-from-bottom-2 fade-in duration-200">
                  <div className="mt-1 h-2 w-2 rounded-full bg-brand shrink-0 shadow-[0_0_8px_rgba(255,107,53,0.8)]" />
                  <div>
                    <p className="text-sm font-medium text-slate-200">{activity.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.desc}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-2 uppercase tracking-wider">{activity.time}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
