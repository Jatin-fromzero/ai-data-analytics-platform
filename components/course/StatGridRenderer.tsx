'use client';

import React from 'react';
import { StatGridBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface StatGridRendererProps {
  block: StatGridBlock;
}

export function StatGridRenderer({ block }: StatGridRendererProps) {
  // Determine standard columns layout or custom number
  const gridColsClass = block.columns 
    ? {
        2: 'grid-cols-1 sm:grid-cols-2',
        3: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3',
        4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
      }[block.columns] || 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
    : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

  return (
    <div className="my-8 space-y-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono">
          {block.title}
        </h4>
      )}

      <div className={cn("grid gap-4", gridColsClass)}>
        {block.stats.map((stat, idx) => {
          const accent = getAccentClasses(stat.color ?? 'coral');

          return (
            <div
              key={idx}
              className={cn(
                "rounded-2xl border bg-surface/20 p-5 transition-all duration-300 hover:scale-[1.02] hover:bg-surface/30 flex flex-col justify-between",
                accent.twBorder
              )}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-1">
                  {stat.label}
                </span>
                <h5 className="text-3xl font-extrabold text-foreground tracking-tight select-all">
                  {stat.value}
                </h5>
              </div>
              {stat.note && (
                <p className="mt-3 text-xs text-slate-400 leading-relaxed italic">
                  {stat.note}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
