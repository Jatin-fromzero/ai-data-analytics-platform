'use client';

import React, { useState } from 'react';
import { AccordionBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface AccordionRendererProps {
  block: AccordionBlock;
}

export function AccordionRenderer({ block }: AccordionRendererProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const singleOpen = block.singleOpen !== false;

  const toggle = (i: number) => {
    setOpenIndex(prev => (prev === i ? null : i));
  };

  return (
    <div className="space-y-3 my-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono mb-4">
          {block.title}
        </h4>
      )}
      {block.items.map((item, i) => {
        const open = singleOpen ? openIndex === i : openIndex === i;
        const accent = getAccentClasses(item.color);

        return (
          <div
            key={i}
            className={cn(
              'rounded-2xl border overflow-hidden transition-all duration-300',
              open ? accent.twBorder : 'border-border/50'
            )}
          >
            {/* Header button */}
            <button
              onClick={() => toggle(i)}
              className={cn(
                'w-full flex items-center gap-4 px-5 py-4 text-left transition-colors duration-200',
                open ? accent.twBg : 'bg-surface/40 hover:bg-surface/70'
              )}
            >
              {item.icon && <span className="text-xl shrink-0">{item.icon}</span>}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-foreground truncate">
                  {item.title}
                </div>
                {!open && item.preview && (
                  <div className="text-xs text-muted mt-0.5 truncate">
                    {item.preview}
                  </div>
                )}
              </div>
              <span
                className={cn(
                  'text-lg shrink-0 transition-transform duration-300',
                  accent.twText,
                  open && 'rotate-45'
                )}
              >
                +
              </span>
            </button>

            {/* Detail panel */}
            {open && (
              <div className={cn('px-5 pb-5 pt-0 animate-in fade-in slide-in-from-top-2 duration-300', accent.twBg)}>
                <div className={cn('h-px mb-4', accent.twBorder.replace('border', 'bg'))} />
                <div className="space-y-4">
                  {item.details.map((detail, j) => (
                    <div key={j}>
                      <span className={cn('text-[9px] font-bold uppercase tracking-[0.18em] font-mono', accent.twText)}>
                        {detail.label}
                      </span>
                      {detail.isCode ? (
                        <pre className={cn(
                          'mt-2 rounded-xl border bg-background/60 p-4 text-xs font-mono leading-relaxed overflow-x-auto',
                          accent.twBorder, accent.twText
                        )}>
                          {detail.content}
                        </pre>
                      ) : (
                        <p className="mt-1.5 text-sm text-slate-300 leading-relaxed">
                          {detail.content}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
