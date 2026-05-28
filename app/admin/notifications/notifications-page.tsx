'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Bell, Megaphone, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function NotificationsPage() {
  const [bannerText, setBannerText] = useState('New feature: AI Mentor now supports Portfolio Reviews!');
  const [bannerType, setBannerType] = useState<'info' | 'success' | 'warning'>('info');

  return (
    <div className="space-y-8 max-w-6xl">
      <PageHeader 
        title="Announcements & Notifications" 
        description="Broadcast global platform banners or send targeted notifications to student cohorts."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand/90 shadow-[0_0_15px_rgba(255,107,53,0.3)]">
            <Send className="h-4 w-4" />
            Publish Banner
          </button>
        }
      />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Composer */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-6">
              <Megaphone className="h-5 w-5 text-brand" />
              Global Banner Draft
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Banner Message</label>
                <input 
                  type="text" 
                  value={bannerText}
                  onChange={(e) => setBannerText(e.target.value)}
                  placeholder="e.g. Platform maintenance scheduled for tomorrow..."
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Banner Type</label>
                <div className="flex gap-3">
                  {(['info', 'success', 'warning'] as const).map(type => (
                    <button
                      key={type}
                      onClick={() => setBannerType(type)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg text-sm font-medium capitalize transition-all border",
                        bannerType === type 
                          ? type === 'info' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                            type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                            'bg-amber-500/20 text-amber-400 border-amber-500/30'
                          : 'bg-white/[0.02] text-muted-foreground border-white/5 hover:bg-white/5'
                      )}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-white flex items-center gap-2 mb-2">
              <Bell className="h-5 w-5 text-brand" />
              Targeted Notifications
            </h3>
            <p className="text-sm text-muted-foreground mb-6">Send an in-app ping to specific users.</p>
            
            <div className="flex flex-col gap-4">
              <select className="bg-[#0A0A0A] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-slate-300 focus:outline-none">
                <option>All Enrolled Students</option>
                <option>Students in Phase 1</option>
                <option>Inactive Students (&gt;30 days)</option>
              </select>
              <textarea 
                placeholder="Write notification message..."
                className="w-full h-24 resize-none rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
              />
              <button className="self-end px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-sm font-medium rounded-xl transition-colors">
                Send Notification
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview */}
        <div>
          <div className="sticky top-24 rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-white mb-6 flex items-center gap-2">
              <EyeIcon />
              Live Preview
            </h3>
            
            <div className="rounded-xl border border-white/10 bg-[#0A0A0A] overflow-hidden flex flex-col min-h-[300px]">
              {/* Fake Banner */}
              <div className={cn(
                "px-4 py-2 text-xs font-medium text-center w-full shadow-sm",
                bannerType === 'info' ? 'bg-blue-600 text-white' :
                bannerType === 'success' ? 'bg-emerald-600 text-white' :
                'bg-amber-500 text-amber-950'
              )}>
                {bannerText || 'Your banner message will appear here...'}
              </div>
              
              {/* Fake App Navbar */}
              <div className="h-12 border-b border-white/5 flex items-center justify-between px-4">
                <div className="h-3 w-20 bg-white/10 rounded" />
                <div className="flex gap-2">
                  <div className="h-6 w-6 rounded-full bg-white/5" />
                  <div className="h-6 w-6 rounded-full bg-brand/20" />
                </div>
              </div>
              
              {/* Fake App Content */}
              <div className="p-6 opacity-30 pointer-events-none">
                <div className="h-6 w-1/3 bg-white/20 rounded mb-4" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-white/10 rounded" />
                  <div className="h-3 w-5/6 bg-white/10 rounded" />
                  <div className="h-3 w-4/6 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EyeIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-brand">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  )
}
