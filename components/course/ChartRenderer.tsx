'use client';

import React from 'react';
import { VisualBlock } from '@/types/course';
import { Card } from '@/components/ui/card';

interface ChartRendererProps {
  block: VisualBlock;
}

export function ChartRenderer({ block }: ChartRendererProps) {
  const { visualizationId, title, data } = block;

  const renderDistribution = (bars: number[], color: string) => {
    const maxVal = Math.max(...bars);
    return (
      <div className="flex items-end justify-between gap-1.5 sm:gap-2.5 h-40 pt-6 px-4">
        {bars.map((v, i) => {
          const pctHeight = (v / maxVal) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
              <div 
                style={{ height: `${pctHeight}%` }}
                className={`w-full rounded-t-md transition-all duration-500 opacity-80 group-hover:opacity-100 ${color}`}
              />
              <span className="text-[9px] font-mono text-muted">{v}%</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden border border-border/60 bg-surface/50 p-6 rounded-[1.5rem] shadow-md">
      <div className="space-y-6">
        <div>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand">Interactive Visualization</span>
          <h4 className="text-base font-bold text-foreground mt-1">{title}</h4>
        </div>

        {/* Dynamic Visualization Mapping */}
        {visualizationId === 'dispersion-comparison' && (
          <div className="grid gap-6 sm:grid-cols-2">
            {/* Team A (Low Volatility) */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-emerald-400">Team A (Consistent SLAs)</span>
                <span className="text-[10px] font-mono text-muted">Mean = 5m, σ = 1.1</span>
              </div>
              <div className="flex items-end justify-between gap-1 h-20">
                {(data?.teamA || []).map((v: number, i: number) => (
                  <div 
                    key={i} 
                    style={{ height: `${v}%` }}
                    className="flex-1 bg-emerald-500/70 rounded-t group-hover:bg-emerald-500 transition-colors"
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted italic">Predictable operations: handle durations tightly cluster around 5 minutes.</p>
            </div>

            {/* Team B (High Volatility) */}
            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono font-bold text-red-450 text-red-400">Team B (Highly Volatile)</span>
                <span className="text-[10px] font-mono text-muted">Mean = 5m, σ = 25.6</span>
              </div>
              <div className="flex items-end justify-between gap-1 h-20">
                {(data?.teamB || []).map((v: number, i: number) => (
                  <div 
                    key={i} 
                    style={{ height: `${v}%` }}
                    className="flex-1 bg-red-500/70 rounded-t group-hover:bg-red-500 transition-colors"
                  />
                ))}
              </div>
              <p className="text-[10px] text-muted italic">Highly volatile operations: customers wait up to 90 minutes.</p>
            </div>
          </div>
        )}

        {visualizationId === 'distribution-normal' && (
          <div className="rounded-2xl border border-brand/20 bg-brand/5 p-4">
            {renderDistribution(data || [], 'bg-brand')}
            <div className="flex justify-between text-[10px] font-mono text-muted mt-3 pt-2 border-t border-border/45">
              <span>-3σ (Low values)</span>
              <span>Mean / Median / Mode</span>
              <span>+3σ (High values)</span>
            </div>
          </div>
        )}

        {visualizationId === 'distribution-right-skewed' && (
          <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-4">
            {renderDistribution(data || [], 'bg-amber-500')}
            <div className="flex justify-between text-[10px] font-mono text-muted mt-3 pt-2 border-t border-border/45">
              <span>Mode (Peak)</span>
              <span>Median (Middle)</span>
              <span>Mean (Pulled by outliers) →</span>
            </div>
          </div>
        )}

        {visualizationId === 'distribution-left-skewed' && (
          <div className="rounded-2xl border border-pink-500/20 bg-pink-500/5 p-4">
            {renderDistribution(data || [], 'bg-pink-500')}
            <div className="flex justify-between text-[10px] font-mono text-muted mt-3 pt-2 border-t border-border/45">
              <span>← Mean (Pulled left)</span>
              <span>Median</span>
              <span>Mode (Peak)</span>
            </div>
          </div>
        )}

        {visualizationId === 'distribution-uniform' && (
          <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4">
            {renderDistribution(data || [], 'bg-blue-500')}
            <div className="text-center text-[10px] font-mono text-muted mt-3 pt-2 border-t border-border/45">
              All categories have roughly equal statistical probability
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
