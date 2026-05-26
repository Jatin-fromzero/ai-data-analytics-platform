'use client';

import React, { useState } from 'react';
import { RubricBlock } from '@/types/course';
import { cn } from '@/lib/utils';

interface RubricRendererProps {
  block: RubricBlock;
}

export function RubricRenderer({ block }: RubricRendererProps) {
  const [scores, setScores] = useState<Record<string, number>>({});
  const maxTotal = block.rows.reduce((a, r) => a + r.maxScore, 0);
  const currentTotal = Object.values(scores).reduce((a, v) => a + v, 0);
  const pct = maxTotal > 0 ? Math.round((currentTotal / maxTotal) * 100) : 0;

  const setScore = (task: string, val: number) => {
    setScores(prev => ({ ...prev, [task]: Math.min(val, block.rows.find(r => r.task === task)?.maxScore ?? val) }));
  };

  return (
    <div className="my-6 rounded-2xl border border-border/60 bg-surface/30 overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40 bg-surface/50 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-amber-400">
            SELF-ASSESSMENT
          </span>
          <h4 className="text-base font-bold text-foreground mt-0.5">
            {block.title ?? 'Marking Rubric'}
          </h4>
        </div>
        <div className="flex items-center gap-3">
          <span className={cn(
            'text-2xl font-extrabold font-mono',
            pct >= 80 ? 'text-emerald-400' : pct >= 60 ? 'text-amber-400' : 'text-red-400'
          )}>
            {currentTotal}/{maxTotal}
          </span>
          <span className="text-xs text-muted font-mono">({pct}%)</span>
        </div>
      </div>

      {/* Score progress bar */}
      <div className="h-1.5 bg-surface">
        <div
          className={cn(
            'h-full transition-all duration-500',
            pct >= 80 ? 'bg-emerald-400' : pct >= 60 ? 'bg-amber-400' : 'bg-red-400'
          )}
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Rubric rows */}
      <div>
        {block.rows.map((row, i) => (
          <div
            key={i}
            className={cn(
              'grid grid-cols-[1fr_70px_70px] gap-4 px-5 py-4 items-center border-b border-border/20 last:border-0',
              i % 2 === 0 ? 'bg-background/30' : 'bg-surface/10'
            )}
          >
            <div className="min-w-0">
              <div className="text-sm font-bold text-foreground truncate">{row.task}</div>
              <div className="text-xs text-muted mt-0.5 line-clamp-2">{row.criteria}</div>
            </div>
            <div className="text-center">
              <span className="text-xs font-mono text-muted">/{row.maxScore}</span>
            </div>
            <div className="flex justify-center">
              <input
                type="number"
                min={0}
                max={row.maxScore}
                value={scores[row.task] ?? ''}
                onChange={e => setScore(row.task, Number(e.target.value))}
                placeholder="—"
                className="w-14 h-8 rounded-lg border border-border/50 bg-surface/40 text-center text-sm font-mono text-foreground placeholder:text-muted/50 focus:outline-none focus:border-brand/50 focus:ring-1 focus:ring-brand/20 transition-all"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
