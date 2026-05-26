'use client';

import React from 'react';
import { OverviewCardsBlock, getAccentClasses } from '@/types/course';
import { cn } from '@/lib/utils';

interface OverviewCardsRendererProps {
  block: OverviewCardsBlock;
}

export function OverviewCardsRenderer({ block }: OverviewCardsRendererProps) {
  const handleScrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="my-8 space-y-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono">
          {block.title}
        </h4>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {block.cards.map((card, idx) => {
          const accent = getAccentClasses(card.color ?? 'coral');
          const isClickable = !!card.targetSectionId;

          const CardWrapper = isClickable ? 'button' : 'div';
          const wrapperProps = isClickable 
            ? { 
                onClick: () => handleScrollToSection(card.targetSectionId!), 
                className: "w-full text-left" 
              } 
            : {};

          return (
            <CardWrapper key={idx} {...wrapperProps}>
              <div
                className={cn(
                  "rounded-2xl border bg-surface/20 p-5 transition-all duration-300 flex items-start gap-4 h-full",
                  isClickable 
                    ? "cursor-pointer hover:border-brand hover:bg-surface/30 active:scale-[0.99]" 
                    : "hover:border-border/80 hover:bg-surface/25",
                  accent.twBorder
                )}
              >
                {/* Icon box */}
                <div 
                  className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-xl border",
                    accent.twBg, accent.twBorder
                  )}
                >
                  {card.icon}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <h5 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-1.5 leading-snug">
                    {card.title}
                    {isClickable && (
                      <span className="text-[10px] text-brand opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </span>
                    )}
                  </h5>
                  <p className="text-xs sm:text-sm text-slate-350 leading-relaxed">
                    {card.description}
                  </p>
                </div>
              </div>
            </CardWrapper>
          );
        })}
      </div>
    </div>
  );
}
