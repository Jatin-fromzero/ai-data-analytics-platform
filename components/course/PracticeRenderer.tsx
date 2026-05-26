'use client';

import React, { useState } from 'react';
import { PracticeBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface PracticeRendererProps {
  block: PracticeBlock;
}

const LEVEL_COLORS = {
  Beginner: 'green',
  Intermediate: 'yellow',
  Advanced: 'orange',
} as const;

export function PracticeRenderer({ block }: PracticeRendererProps) {
  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});

  const toggleExercise = (i: number) => {
    setExpandedIdx(prev => (prev === i ? null : i));
    // Reset solution visibility when collapsing
    if (expandedIdx === i) {
      setShowSolution(prev => ({ ...prev, [i]: false }));
    }
  };

  const toggleSolution = (i: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSolution(prev => ({ ...prev, [i]: !prev[i] }));
  };

  return (
    <div className="my-6 space-y-3">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono mb-4">
          {block.title}
        </h4>
      )}

      {block.exercises.map((ex, i) => {
        const open = expandedIdx === i;
        const solutionVisible = showSolution[i];
        const levelColor = ex.color ?? LEVEL_COLORS[ex.level];
        const accent = getAccentClasses(levelColor);

        return (
          <div
            key={i}
            className={cn(
              'rounded-2xl border overflow-hidden transition-all duration-300',
              open ? accent.twBorder : 'border-border/50'
            )}
          >
            {/* Header */}
            <button
              onClick={() => toggleExercise(i)}
              className={cn(
                'w-full flex items-center gap-4 px-5 py-4 text-left transition-colors',
                open ? accent.twBg : 'bg-surface/40 hover:bg-surface/70'
              )}
            >
              <span className={cn(
                'text-[9px] font-mono font-bold px-2.5 py-1 rounded-md shrink-0',
                accent.twBg, accent.twText
              )}>
                {ex.level}
              </span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground truncate">{ex.title}</div>
                {!open && (
                  <div className="text-xs text-muted mt-0.5 truncate">
                    {ex.scenario.substring(0, 80)}...
                  </div>
                )}
              </div>
              <span className={cn(
                'text-lg shrink-0 transition-transform duration-300',
                accent.twText,
                open && 'rotate-45'
              )}>
                +
              </span>
            </button>

            {/* Expanded content */}
            {open && (
              <div className={cn('px-5 pb-5 pt-0 space-y-4 animate-in fade-in duration-300', accent.twBg)}>
                <div className={cn('h-px', accent.twBorder.replace('border', 'bg'))} />

                {/* Scenario */}
                <div>
                  <span className={cn('text-[9px] font-bold uppercase tracking-[0.18em] font-mono', accent.twText)}>
                    SCENARIO
                  </span>
                  <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">{ex.scenario}</p>
                </div>

                {/* Hint */}
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-4">
                  <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-amber-400">
                    💡 HINT
                  </span>
                  <p className="mt-1.5 text-xs text-amber-200/80 leading-relaxed font-mono">{ex.hint}</p>
                </div>

                {/* Solution toggle */}
                <button
                  onClick={(e) => toggleSolution(i, e)}
                  className={cn(
                    'w-full rounded-xl border py-3 text-xs font-mono font-bold uppercase tracking-wider transition-all',
                    solutionVisible
                      ? `${accent.twBorder} ${accent.twBg} ${accent.twText}`
                      : 'border-border/50 bg-surface/60 text-muted hover:text-foreground hover:border-border'
                  )}
                >
                  {solutionVisible ? '▾ HIDE SOLUTION' : '▸ SHOW SOLUTION'}
                </button>

                {solutionVisible && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <pre className={cn(
                      'rounded-xl border bg-background/60 p-4 text-xs font-mono leading-[1.75] overflow-x-auto',
                      accent.twBorder, accent.twText
                    )}>
                      {ex.solution}
                    </pre>
                    {ex.expectedOutput && (
                      <div className="mt-3 rounded-lg border border-border/30 bg-surface/30 px-4 py-2.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted font-mono">
                          EXPECTED OUTPUT
                        </span>
                        <p className="mt-1 text-xs text-slate-400 font-mono">{ex.expectedOutput}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
