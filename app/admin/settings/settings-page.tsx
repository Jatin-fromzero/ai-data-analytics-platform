'use client';

import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Globe, Palette, Shield, Key, Bell, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiClient } from '@/frontend/lib/api-client';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form states
  const [platformName, setPlatformName] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Globe },
    { id: 'branding', label: 'Branding', icon: Palette },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'api', label: 'API Keys', icon: Key },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const loadSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiClient.get<any>('/api/admin/settings');
      if (res.success && res.data) {
        setPlatformName(res.data.platformName);
        setSupportEmail(res.data.supportEmail);
        setMaintenanceMode(res.data.maintenanceMode);
      } else {
        setError(res.error || 'Failed to load configuration parameters.');
      }
    } catch (err) {
      setError('Connection to configuration service timed out.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await apiClient.post<any>('/api/admin/settings', {
        platformName,
        supportEmail,
        maintenanceMode,
      });
      if (res.success) {
        setSuccess('Settings successfully updated and flushed to cache.');
      } else {
        setError(res.error || 'Failed to save settings.');
      }
    } catch (err) {
      setError('An error occurred during save validation.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <PageHeader title="Platform Settings" description="Loading parameters..." />
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 h-48 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
          <div className="flex-1 h-64 bg-slate-900/40 border border-white/[0.03] rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader 
        title="Platform Settings" 
        description="Configure global platform behavior, integrations, and security."
      />
      
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Settings Nav */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border border-transparent",
                activeTab === tab.id 
                  ? "bg-brand/10 text-brand border-brand/20 shadow-sm" 
                  : "text-muted-foreground hover:bg-white/5 hover:text-slate-200"
              )}
            >
              <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-brand" : "text-muted-foreground")} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 space-y-6">
          
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

          {activeTab === 'general' && (
            <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm animate-in fade-in duration-300">
              <h3 className="text-lg font-medium text-white mb-6">General Configuration</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Platform Name</label>
                  <input 
                    type="text" 
                    value={platformName}
                    onChange={(e) => setPlatformName(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Support Email</label>
                  <input 
                    type="email" 
                    value={supportEmail}
                    onChange={(e) => setSupportEmail(e.target.value)}
                    className="w-full max-w-md rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                  />
                </div>
                <div className="pt-6 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-medium text-slate-200">Maintenance Mode</h4>
                      <p className="text-xs text-muted-foreground mt-1">Locks out non-admin users and shows a maintenance screen.</p>
                    </div>
                    <button 
                      onClick={() => setMaintenanceMode(!maintenanceMode)}
                      className={cn(
                        "relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
                        maintenanceMode ? "bg-brand shadow-[0_0_8px_rgba(255,107,53,0.4)]" : "bg-white/10 hover:bg-white/20"
                      )}
                    >
                      <span className={cn(
                        "inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ease-in-out",
                        maintenanceMode ? "translate-x-[9px]" : "-translate-x-[9px]"
                      )} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branding' && (
            <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm animate-in fade-in duration-300">
              <h3 className="text-lg font-medium text-white mb-6">Brand Identity</h3>
              <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
                <Palette className="h-8 w-8 text-muted-foreground/50 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Brand color palette and logo uploads will appear here.</p>
              </div>
            </div>
          )}

          {(activeTab !== 'general' && activeTab !== 'branding') && (
            <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm animate-in fade-in duration-300">
              <h3 className="text-lg font-medium text-white mb-6 capitalize">{activeTab} Settings</h3>
              <p className="text-sm text-muted-foreground">This module is part of the future scalable architecture.</p>
            </div>
          )}

          {activeTab === 'general' && (
            <div className="flex justify-end pt-4">
              <button 
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-2.5 bg-brand hover:bg-brand/90 disabled:bg-brand/40 text-background font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(255,107,53,0.3)] flex items-center gap-2"
              >
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
