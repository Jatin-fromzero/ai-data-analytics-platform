'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { BrainCircuit, MessageSquare, Zap, Settings2, Sparkles, Database, MoreHorizontal, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/frontend/lib/api-client';

export default function AIMentorPage() {
  const [activeTab, setActiveTab] = useState<'prompt' | 'workflows'>('prompt');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [globalPrompt, setGlobalPrompt] = useState('');
  const [lessonAware, setLessonAware] = useState(true);
  const [codeVerify, setCodeVerify] = useState(false);
  const [socraticMethod, setSocraticMethod] = useState(true);

  const loadConfig = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>('/api/admin/ai');
      if (res.success && res.data) {
        setGlobalPrompt(res.data.globalPrompt);
        setLessonAware(res.data.lessonAware);
        setCodeVerify(res.data.codeVerify);
        setSocraticMethod(res.data.socraticMethod);
      } else {
        setError(res.error || 'Failed to load AI configuration.');
      }
    } catch (err) {
      setError('Connection to AI config server failed.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  const handleDeploy = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await apiClient.post<any>('/api/admin/ai', {
        globalPrompt,
        lessonAware,
        codeVerify,
        socraticMethod,
      });
      if (res.success) {
        setSuccess('AI Mentor updates successfully deployed globally!');
      } else {
        setError(res.error || 'Deployment failed.');
      }
    } catch (err) {
      setError('An error occurred during prompt validations.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <PageHeader title="AI Mentor Control Center" description="Loading AI engine prompt definitions..." />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
          ))}
        </div>
        <div className="h-80 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader 
        title="AI Mentor Control Center" 
        description="Manage AI personality, global system prompts, and lesson-aware context logic."
        actions={
          <button 
            onClick={handleDeploy}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-background transition-all hover:bg-brand/90 disabled:bg-brand/40 shadow-[0_0_15px_rgba(255,107,53,0.3)]"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />}
            Deploy Updates
          </button>
        }
      />
      
      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="Total Queries Answered"
          value="14,592"
          icon={MessageSquare}
          trend={{ value: 12.5, isPositive: true }}
          subtitle="past 30 days"
        />
        <StatCard
          title="Active Model"
          value="gemini-2.5-flash"
          icon={BrainCircuit}
          subtitle="Google AI Studio"
        />
        <StatCard
          title="Avg Response Time"
          value="1.2s"
          icon={Zap}
          trend={{ value: 0.3, isPositive: false }}
          subtitle="latency improved"
        />
      </div>

      {error && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-3 text-sm text-rose-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-3 text-sm text-emerald-400">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-white/10 mb-6">
        {[
          { id: 'prompt', label: 'System Prompts', icon: Sparkles },
          { id: 'workflows', label: 'AI Workflows & Data', icon: Database }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 text-sm font-medium border-b-2 transition-colors",
              activeTab === tab.id 
                ? "border-brand text-brand" 
                : "border-transparent text-muted-foreground hover:text-slate-300"
            )}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Editor */}
        <div className="lg:col-span-2 rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm flex flex-col">
          {activeTab === 'prompt' ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Global System Prompt</h3>
                <span className="inline-flex items-center rounded-full bg-brand/10 px-2.5 py-0.5 text-xs font-medium text-brand border border-brand/20">
                  Production
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                This prompt defines the core personality and behavior constraints for the AI Mentor across the entire platform.
              </p>
              <div className="relative flex-1">
                <textarea
                  value={globalPrompt}
                  onChange={(e) => setGlobalPrompt(e.target.value)}
                  className="h-full min-h-[400px] w-full resize-none rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-5 text-sm text-slate-300 font-mono focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all leading-relaxed shadow-inner"
                  spellCheck={false}
                />
              </div>
            </>
          ) : (
            <>
               <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-medium text-white">Context Injection Settings</h3>
              </div>
              <div className="space-y-6">
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Lesson Context Schema</h4>
                  <p className="text-xs text-muted-foreground mb-4">Select which fields from the current lesson are fed to the AI.</p>
                  <div className="flex gap-2 flex-wrap">
                    {['Lesson Title', 'Lesson Transcript', 'User SQL Queries', 'Quiz Results'].map(tag => (
                      <span key={tag} className="px-3 py-1 rounded-full bg-white/10 text-xs text-slate-300 border border-white/5">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                  <h4 className="text-sm font-medium text-slate-200 mb-2">Fallback Mechanisms</h4>
                  <p className="text-xs text-muted-foreground">Define what happens if the primary Gemini model fails to respond.</p>
                  <select className="mt-3 w-full bg-[#0A0A0A] border border-white/10 rounded-lg p-2 text-sm text-slate-300 focus:border-brand/50 focus:outline-none">
                    <option>Switch to Gemini 1.5 Pro</option>
                    <option>Switch to Claude 3.5 Sonnet</option>
                    <option>Return Graceful Error</option>
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-6">
              <Settings2 className="h-5 w-5 text-brand" />
              <h3 className="text-md font-medium text-white">Behavior Toggles</h3>
            </div>
            <div className="space-y-6">
              
              <div className="flex items-start justify-between group">
                <div className="pr-4">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Lesson-Aware Context</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Injects current lesson content into prompt</p>
                </div>
                <button 
                  onClick={() => setLessonAware(!lessonAware)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                    lessonAware ? "bg-brand shadow-[0_0_8px_rgba(255,107,53,0.4)]" : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
                    lessonAware ? "translate-x-[9px]" : "-translate-x-[9px]"
                  )} />
                </button>
              </div>

              <div className="flex items-start justify-between group">
                <div className="pr-4">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Strict Code Verification</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Validates SQL/Python before responding</p>
                </div>
                <button 
                  onClick={() => setCodeVerify(!codeVerify)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                    codeVerify ? "bg-brand shadow-[0_0_8px_rgba(255,107,53,0.4)]" : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
                    codeVerify ? "translate-x-[9px]" : "-translate-x-[9px]"
                  )} />
                </button>
              </div>

              <div className="flex items-start justify-between group">
                <div className="pr-4">
                  <p className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">Socratic Method</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">Asks guiding questions instead of direct answers</p>
                </div>
                <button 
                  onClick={() => setSocraticMethod(!socraticMethod)}
                  className={cn(
                    "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                    socraticMethod ? "bg-brand shadow-[0_0_8px_rgba(255,107,53,0.4)]" : "bg-white/10 hover:bg-white/20"
                  )}
                >
                  <span className={cn(
                    "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
                    socraticMethod ? "translate-x-[9px]" : "-translate-x-[9px]"
                  )} />
                </button>
              </div>

            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
            <h3 className="text-md font-medium text-white mb-4">Prompt Templates</h3>
            <div className="space-y-2">
              {['Debugging Flow', 'Portfolio Review', 'Career Advice', 'SQL Optimization'].map((template, idx) => (
                <button key={idx} className="w-full flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all">
                  {template}
                  <MoreHorizontal className="h-4 w-4 text-muted-foreground opacity-50" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
