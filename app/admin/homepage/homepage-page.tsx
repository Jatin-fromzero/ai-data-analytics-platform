'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/admin/PageHeader';
import { Plus, GripVertical, Settings, Eye, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// Mock Sections
type SectionStatus = 'active' | 'hidden';

interface HomepageSection {
  id: string;
  name: string;
  type: string;
  status: SectionStatus;
}

const initialSections: HomepageSection[] = [
  { id: 's1', name: 'Main Hero', type: 'Hero Block', status: 'active' },
  { id: 's2', name: 'Platform Features', type: 'Grid Layout', status: 'active' },
  { id: 's3', name: 'Social Proof', type: 'Testimonial Carousel', status: 'hidden' },
  { id: 's4', name: 'Pricing Tiers', type: 'Pricing Cards', status: 'active' },
  { id: 's5', name: 'Final CTA', type: 'Call to Action', status: 'active' },
];

export default function HomepageBuilderPage() {
  const [sections, setSections] = useState(initialSections);

  const toggleStatus = (id: string) => {
    setSections(sections.map(s => 
      s.id === id ? { ...s, status: s.status === 'active' ? 'hidden' : 'active' } : s
    ));
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <PageHeader 
        title="Homepage Builder" 
        description="Manage the layout, visibility, and configuration of your marketing landing page."
        actions={
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition-all hover:bg-white/10">
              <Eye className="h-4 w-4" />
              Live Preview
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand/90 shadow-[0_0_15px_rgba(255,107,53,0.3)]">
              Publish Changes
            </button>
          </div>
        }
      />
      
      <div className="flex gap-8 flex-col lg:flex-row">
        {/* Sections List */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wider">Active Sections</h3>
            <button className="text-sm font-medium text-brand hover:text-brand/80 inline-flex items-center gap-1">
              <Plus className="h-4 w-4" /> Add Section
            </button>
          </div>

          <div className="space-y-3">
            {sections.map((section, idx) => (
              <div 
                key={section.id} 
                className={cn(
                  "flex items-center justify-between p-4 rounded-2xl border border-white/5 bg-[#121214]/80 backdrop-blur-sm transition-all group hover:bg-[#121214]",
                  section.status === 'hidden' && "opacity-50 grayscale-[0.5]"
                )}
              >
                <div className="flex items-center gap-4">
                  <div className="cursor-grab text-muted-foreground/50 hover:text-white transition-colors">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{section.name}</h4>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{section.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => toggleStatus(section.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/5 bg-white/[0.02] text-xs font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    {section.status === 'active' ? (
                      <><CheckCircle2 className="h-3 w-3 text-emerald-400" /> Visible</>
                    ) : (
                      <><Eye className="h-3 w-3" /> Hidden</>
                    )}
                  </button>
                  <button className="p-2 text-muted-foreground hover:text-white transition-colors rounded-lg hover:bg-white/5">
                    <Settings className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Configuration Panel (Placeholder) */}
        <div className="w-full lg:w-80 shrink-0">
          <div className="sticky top-24 rounded-2xl border border-white/5 bg-[#121214]/50 p-6 backdrop-blur-sm">
            <h3 className="text-sm font-medium text-white mb-6 flex items-center gap-2">
              <Settings className="h-4 w-4 text-brand" />
              Section Settings
            </h3>
            
            <div className="text-center py-12 px-4 border border-dashed border-white/10 rounded-xl bg-white/[0.01]">
              <p className="text-sm text-muted-foreground">Select a section to edit its properties, content, and design tokens.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
