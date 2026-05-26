'use client';

import React, { useState } from 'react';
import { DatasetBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface DatasetRendererProps {
  block: DatasetBlock;
}

export function DatasetRenderer({ block }: DatasetRendererProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'schema' | 'stats'>('preview');
  const columnNames = block.columns.map(c => c.name);

  return (
    <div className="my-6 rounded-2xl border border-border/60 bg-surface/30 overflow-hidden shadow-md">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border/40 bg-surface/50">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] font-mono text-brand">
              DATASET
            </span>
            <h4 className="text-base font-bold text-foreground mt-0.5">{block.title}</h4>
            {block.description && (
              <p className="text-xs text-muted mt-1">{block.description}</p>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-muted">
            <span className="px-2.5 py-1 rounded-md bg-surface border border-border/40">
              {block.totalRows} rows
            </span>
            <span className="px-2.5 py-1 rounded-md bg-surface border border-border/40">
              {block.columns.length} cols
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 px-5 pt-3 pb-0">
        {(['preview', 'schema', ...(block.stats ? ['stats'] as const : [])] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={cn(
              'px-4 py-1.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider transition-all',
              activeTab === tab
                ? 'bg-brand text-background'
                : 'text-muted hover:text-foreground hover:bg-surface/80'
            )}
          >
            {tab === 'preview' ? 'DATA PREVIEW' : tab === 'schema' ? 'COLUMNS' : 'QUICK STATS'}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="p-5">
        {/* Preview tab — data table */}
        {activeTab === 'preview' && (
          <div className="rounded-xl border border-border/30 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface/60">
                  {columnNames.map((col, i) => (
                    <th
                      key={i}
                      className="px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-brand font-mono border-b border-border/30 whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {block.previewRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className={cn(
                      'border-b border-border/20 transition-colors hover:bg-surface/30',
                      rIdx % 2 === 0 ? 'bg-background/40' : 'bg-surface/10'
                    )}
                  >
                    {columnNames.map((col, cIdx) => (
                      <td
                        key={cIdx}
                        className="px-3 py-2 text-xs font-mono text-slate-400 whitespace-nowrap"
                      >
                        {String(row[col] ?? '—')}
                      </td>
                    ))}
                  </tr>
                ))}
                {block.totalRows > block.previewRows.length && (
                  <tr className="bg-surface/10">
                    <td
                      colSpan={columnNames.length}
                      className="px-3 py-2 text-xs text-muted italic text-center"
                    >
                      … {block.totalRows - block.previewRows.length} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Schema tab — column definitions */}
        {activeTab === 'schema' && (
          <div className="rounded-xl border border-border/30 overflow-hidden">
            {block.columns.map((col, i) => {
              const accent = getAccentClasses(col.color);
              return (
                <div
                  key={i}
                  className={cn(
                    'grid grid-cols-[120px_70px_1fr] gap-3 px-4 py-3 items-center border-b border-border/20 last:border-0',
                    i % 2 === 0 ? 'bg-background/40' : 'bg-surface/10'
                  )}
                >
                  <span className={cn('text-xs font-mono font-bold', accent.twText)}>{col.name}</span>
                  <span className="text-[10px] font-mono text-muted bg-surface px-2 py-0.5 rounded text-center">
                    {col.dataType}
                  </span>
                  <span className="text-xs text-slate-400">{col.description}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats tab — computed KPI cards */}
        {activeTab === 'stats' && block.stats && (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {block.stats.map((stat, i) => {
              const accent = getAccentClasses(stat.color);
              return (
                <div
                  key={i}
                  className={cn(
                    'rounded-xl border p-4',
                    accent.twBorder,
                    accent.twBg
                  )}
                  style={{ borderTopWidth: '3px' }}
                >
                  <div className={cn('text-[10px] font-mono tracking-wider mb-1.5', accent.twText)}>
                    {stat.label}
                  </div>
                  <div className="text-xl font-extrabold text-foreground">{stat.value}</div>
                  {stat.note && <div className="text-[10px] text-muted mt-1">{stat.note}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
