'use client';

import React from 'react';
import { WorkflowBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface WorkflowRendererProps {
  block: WorkflowBlock;
}

export function WorkflowRenderer({ block }: WorkflowRendererProps) {
  const accent = getAccentClasses(block.color ?? 'coral');

  return (
    <div className="my-8 space-y-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono">
          {block.title}
        </h4>
      )}

      <div className="relative border-l border-border/60 ml-4 pl-8 space-y-8">
        {block.steps.map((step, idx) => {
          return (
            <div key={idx} className="relative group">
              {/* Step indicator node */}
              <div 
                className={cn(
                  "absolute -left-[45px] top-0 w-8 h-8 rounded-full border flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 group-hover:scale-110",
                  "bg-background text-foreground",
                  accent.twBorder, accent.twText
                )}
              >
                {step.step || (idx + 1)}
              </div>

              {/* Card */}
              <div className="rounded-2xl border border-border/40 bg-surface/10 p-5 transition-all duration-300 hover:border-border hover:bg-surface/20 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                  {/* Action */}
                  <div className="md:col-span-5">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-500 font-mono block mb-1">
                      ACTION / OPERATION
                    </span>
                    <h5 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      {step.action}
                    </h5>
                  </div>

                  {/* Divider line for desktop */}
                  <div className="hidden md:block col-span-1 h-12 w-px bg-border/40 justify-self-center self-center" />

                  {/* Rationale */}
                  <div className="md:col-span-6">
                    <span className={cn("text-[9px] font-bold uppercase tracking-widest font-mono block mb-1", accent.twText)}>
                      UNDERLYING RATIONALE & METRICS
                    </span>
                    <p className="text-xs sm:text-sm text-slate-350 leading-relaxed font-medium">
                      {step.rationale}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
