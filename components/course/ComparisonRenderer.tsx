'use client';

import React from 'react';
import { ComparisonBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface ComparisonRendererProps {
  block: ComparisonBlock;
}

export function ComparisonRenderer({ block }: ComparisonRendererProps) {
  const leftAccent = getAccentClasses(block.left.color ?? 'orange');
  const rightAccent = getAccentClasses(block.right.color ?? 'green');

  const renderPanel = (
    panel: ComparisonBlock['left'],
    accent: ReturnType<typeof getAccentClasses>
  ) => (
    <div className={cn('rounded-2xl border overflow-hidden', accent.twBorder)}>
      <div className={cn('px-4 py-2.5 border-b', accent.twBg, accent.twBorder)}>
        <span className={cn('text-[9px] font-bold uppercase tracking-[0.18em] font-mono', accent.twText)}>
          {panel.label}
        </span>
      </div>
      <div className="p-4">
        {panel.isCode ? (
          <pre className={cn(
            'text-xs font-mono leading-[1.7] overflow-x-auto whitespace-pre-wrap',
            accent.twText
          )}>
            {panel.content}
          </pre>
        ) : (
          <p className="text-sm text-slate-300 leading-relaxed">
            {panel.content}
          </p>
        )}
      </div>
    </div>
  );

  return (
    <div className="my-6 space-y-3">
      {block.title && (
        <h4 className="text-sm font-bold text-foreground mb-3">{block.title}</h4>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        {renderPanel(block.left, leftAccent)}
        {renderPanel(block.right, rightAccent)}
      </div>

      {block.note && (
        <div className="rounded-xl border border-border/40 bg-surface/30 px-4 py-3">
          <p className="text-xs text-muted leading-relaxed">{block.note}</p>
        </div>
      )}
    </div>
  );
}
