'use client';

import React from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Search, Globe, Image as ImageIcon } from 'lucide-react';

export default function SEOPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <PageHeader 
        title="SEO Management" 
        description="Configure global meta tags, OpenGraph imagery, and indexing settings."
        actions={
          <button className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand/90 shadow-[0_0_15px_rgba(255,107,53,0.3)]">
            Save SEO Settings
          </button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Nav (Simulated) */}
        <div className="hidden md:flex flex-col gap-2">
          {['Global Metadata', 'OpenGraph / Social', 'Robots & Indexing', 'Sitemap Generation'].map((item, idx) => (
            <button key={item} className={`text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${idx === 0 ? 'bg-white/10 text-white' : 'text-muted-foreground hover:text-slate-300 hover:bg-white/5'}`}>
              {item}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="md:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm space-y-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <Globe className="h-5 w-5 text-brand" />
              Global Metadata
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Meta Title</label>
                <input 
                  type="text" 
                  defaultValue="AI Education OS | Learn AI Skills"
                  className="w-full rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-2.5 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Default Meta Description</label>
                <textarea 
                  defaultValue="Master modern technical and creative paths with AI-powered workflows and structured curriculums."
                  className="w-full h-24 resize-none rounded-xl border border-white/10 bg-[#0A0A0A] px-4 py-3 text-sm text-white placeholder:text-muted-foreground focus:border-brand/50 focus:outline-none focus:ring-1 focus:ring-brand/50 transition-all"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-xs text-muted-foreground">Recommended: 150-160 characters.</span>
                  <span className="text-xs text-emerald-400 font-medium">85 / 160</span>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm space-y-6">
            <h3 className="text-lg font-medium text-white flex items-center gap-2">
              <ImageIcon className="h-5 w-5 text-brand" />
              Social Sharing (OpenGraph)
            </h3>
            
            <div className="aspect-video w-full rounded-xl border-2 border-dashed border-white/10 bg-[#0A0A0A] flex flex-col items-center justify-center text-muted-foreground hover:bg-white/[0.02] hover:border-brand/30 transition-all cursor-pointer">
              <ImageIcon className="h-8 w-8 mb-2 opacity-50" />
              <p className="text-sm">Click to upload default OG Image</p>
              <p className="text-xs opacity-50 mt-1">1200 x 630px recommended</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
