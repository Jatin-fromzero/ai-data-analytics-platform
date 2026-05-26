'use client';

import React, { useState } from 'react';
import { AIToolBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface AIToolRendererProps {
  block: AIToolBlock;
}

export function AIToolRenderer({ block }: AIToolRendererProps) {
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const handleCopy = (promptText: string) => {
    navigator.clipboard.writeText(promptText);
    setCopiedPrompt(promptText);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  return (
    <div className="my-8 space-y-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono">
          {block.title}
        </h4>
      )}

      <div className="space-y-6">
        {block.tools.map((tool, idx) => {
          const accent = getAccentClasses(tool.color ?? 'purple');

          return (
            <div
              key={idx}
              className={cn(
                "rounded-2xl border bg-surface/20 overflow-hidden transition-all duration-300",
                accent.twBorder
              )}
            >
              {/* Header */}
              <div className={cn("px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/40", accent.twBg)}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl leading-none">{tool.icon}</span>
                  <div>
                    <h5 className="text-base font-bold text-foreground flex items-center gap-2">
                      {tool.name}
                      {tool.type && (
                        <span className={cn(
                          "text-[9px] font-mono font-bold px-2 py-0.5 rounded-md",
                          accent.twBg, accent.twText
                        )}>
                          {tool.type}
                        </span>
                      )}
                    </h5>
                    <p className="text-xs text-slate-400 mt-0.5">{tool.description}</p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Left Column: Guides */}
                  <div className="space-y-4">
                    {tool.bestFor && (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono">
                          🎯 BEST FOR
                        </span>
                        <p className="mt-1 text-sm text-slate-300 leading-relaxed">
                          {tool.bestFor}
                        </p>
                      </div>
                    )}
                    {tool.howToUse && (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono">
                          ⚙️ HOW TO USE
                        </span>
                        <p className="mt-1 text-sm text-slate-350 leading-relaxed">
                          {tool.howToUse}
                        </p>
                      </div>
                    )}
                    {tool.setup && (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono">
                          🔧 SETUP & ACCESS
                        </span>
                        <p className="mt-1 text-sm text-slate-350 leading-relaxed font-mono bg-black/30 p-2.5 rounded-lg border border-border/40">
                          {tool.setup}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Prompts */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono block">
                      🤖 TARGETED PROMPTS
                    </span>
                    {tool.prompts.map((prompt, pIdx) => {
                      const isCopied = copiedPrompt === prompt;
                      return (
                        <div 
                          key={pIdx} 
                          className="group relative rounded-xl border border-border/50 bg-black/25 p-4 transition-colors hover:border-brand/40"
                        >
                          <p className="text-xs text-emerald-400 font-mono leading-relaxed pr-8 whitespace-pre-wrap">
                            {prompt}
                          </p>
                          <button
                            onClick={() => handleCopy(prompt)}
                            className="absolute top-3 right-3 text-[10px] font-mono text-muted hover:text-foreground bg-surface/50 border border-border/40 px-2 py-0.5 rounded transition-all active:scale-95"
                          >
                            {isCopied ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Warning / Notes */}
                {tool.warning && (
                  <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex gap-3 items-start">
                    <span className="text-lg leading-none shrink-0">⚠️</span>
                    <div>
                      <span className="text-[9px] font-bold uppercase tracking-widest text-red-400 font-mono">
                        CRITICAL LIMITATION / WARNING
                      </span>
                      <p className="mt-1 text-xs text-red-300/80 leading-relaxed">
                        {tool.warning}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
