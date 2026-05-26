'use client';

import React, { useState } from 'react';
import { StepsBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface StepsRendererProps {
  block: StepsBlock;
}

export function StepsRenderer({ block }: StepsRendererProps) {
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  const trackable = block.trackable ?? false;

  const toggleStep = (i: number) => {
    if (!trackable) return;
    setCompleted(prev => ({ ...prev, [i]: !prev[i] }));
  };

  const completedCount = Object.values(completed).filter(Boolean).length;

  return (
    <div className="my-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono mb-4">
          {block.title}
        </h4>
      )}

      {/* Progress bar for trackable steps */}
      {trackable && block.steps.length > 0 && (
        <div className="mb-5 space-y-2">
          <div className="flex justify-between text-[10px] font-mono text-muted">
            <span>PROGRESS</span>
            <span>{completedCount} / {block.steps.length}</span>
          </div>
          <div className="h-1.5 rounded-full bg-surface overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-400 transition-all duration-500"
              style={{ width: `${(completedCount / block.steps.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        {block.steps.map((step, i) => {
          const accent = getAccentClasses(step.color);
          const isDone = completed[i];

          return (
            <div
              key={i}
              onClick={() => toggleStep(i)}
              className={cn(
                'rounded-2xl border overflow-hidden transition-all duration-200',
                trackable && 'cursor-pointer',
                isDone ? `${accent.twBorder} ${accent.twBg}` : 'border-border/40'
              )}
            >
              <div className="flex items-start gap-4 px-5 py-4">
                {/* Step number or checkbox */}
                <div className={cn(
                  'w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-200',
                  isDone
                    ? `${accent.twBorder} ${accent.twBg}`
                    : `border-border/50 bg-surface/40`
                )}>
                  {isDone ? (
                    <span className={cn('text-xs font-bold', accent.twText)}>✓</span>
                  ) : (
                    <span className={cn('text-[10px] font-mono font-bold', accent.twText)}>
                      {step.step}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="text-sm font-bold text-foreground">
                    {step.title}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>

                  {/* Code block */}
                  {step.code && (
                    <pre className={cn(
                      'mt-2 rounded-xl border bg-background/60 p-3 text-xs font-mono leading-relaxed overflow-x-auto',
                      accent.twBorder, accent.twText
                    )}>
                      {step.code}
                    </pre>
                  )}

                  {/* Tip */}
                  {step.tip && (
                    <div className="rounded-lg border border-amber-400/20 bg-amber-400/5 px-3 py-2 mt-2">
                      <span className="text-xs text-amber-400">💡 {step.tip}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
