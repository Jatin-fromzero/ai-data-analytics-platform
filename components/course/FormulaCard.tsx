'use client';

import React, { useState } from 'react';
import { FormulaBlock } from '@/types/course';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

interface FormulaCardProps {
  block: FormulaBlock;
}

export function FormulaCard({ block }: FormulaCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (block.aiPrompt) {
      navigator.clipboard.writeText(block.aiPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <Card className="overflow-hidden border border-border/60 bg-surface/50 shadow-lg hover:border-brand/40 transition-all duration-300 rounded-[1.5rem]">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/50 bg-surface/80 px-6 py-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-brand shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-brand font-mono">
              {block.category}
            </span>
          </div>
          <h4 className="text-lg font-bold text-foreground">{block.name}</h4>
        </div>
        {block.replaces && (
          <Badge variant="outline" className="border-border text-muted text-xs">
            Replaces: {block.replaces}
          </Badge>
        )}
      </div>

      {/* Body */}
      <div className="p-6 space-y-6">
        {/* Math Syntax */}
        <div className="rounded-xl border border-brand/20 bg-brand/5 p-4 text-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-brand mb-1">Mathematical Syntax</p>
          <code className="text-xl sm:text-2xl font-bold text-brand font-mono break-all leading-tight">
            {block.syntax}
          </code>
        </div>

        {/* Detailed Metadata Grid */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">What it does</p>
            <p className="text-sm leading-relaxed text-slate-300">{block.whatItDoes}</p>
          </div>
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Business Application</p>
            <p className="text-sm leading-relaxed text-slate-300">{block.businessUse}</p>
          </div>
        </div>

        {/* Example Details */}
        <div className="rounded-xl border border-border bg-background/60 p-4 space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">Real-World Case Example</p>
          <div className="space-y-1">
            <p className="text-xs font-semibold text-foreground">{block.example.desc}</p>
            <pre className="rounded-lg bg-background p-3 text-xs font-mono text-emerald-400 overflow-x-auto border border-border/50 leading-relaxed">
              {block.example.formula}
            </pre>
            {block.example.notes && (
              <p className="text-[10px] text-muted italic pt-1">💡 {block.example.notes}</p>
            )}
          </div>
        </div>

        {/* AI Pair Prompt */}
        {block.aiPrompt && (
          <div className="relative rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 space-y-2 group">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <span>🤖</span> AI Pair Prompt
              </span>
              <button
                onClick={handleCopy}
                className="text-[10px] font-bold uppercase tracking-wider text-purple-400 hover:text-purple-300 transition-colors"
              >
                {copied ? 'Copied! ✓' : 'Copy Prompt'}
              </button>
            </div>
            <p className="text-xs font-mono italic text-purple-300 leading-relaxed pr-8">
              {block.aiPrompt}
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}
