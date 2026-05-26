'use client';

import React, { useState } from 'react';
import { FlashcardBlock } from '@/types/course';
import { cn } from '@/lib/utils';

interface FlashcardRendererProps {
  block: FlashcardBlock;
}

export function FlashcardRenderer({ block }: FlashcardRendererProps) {
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (idx: number) => {
    setFlippedCards(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="my-8 space-y-6">
      {block.title && (
        <h4 className="text-sm font-bold uppercase tracking-wider text-muted font-mono">
          {block.title}
        </h4>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {block.cards.map((card, idx) => {
          const isFlipped = flippedCards[idx];

          return (
            <div
              key={idx}
              className="h-48 group [perspective:1000px] cursor-pointer"
              onClick={() => toggleFlip(idx)}
            >
              <div
                className={cn(
                  "relative w-full h-full rounded-2xl border transition-all duration-500 [transform-style:preserve-3d] shadow-lg",
                  isFlipped 
                    ? "[transform:rotateY(180deg)] border-purple-500/40 bg-purple-950/20" 
                    : "border-border/50 bg-surface/30 hover:border-brand/40 hover:bg-surface/50"
                )}
              >
                {/* Front Side */}
                <div className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden]">
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted font-mono">
                      FLASHCARD {idx + 1}
                    </span>
                    <span className="text-xs text-brand font-mono">Click to reveal</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center">
                    <h5 className="text-base font-semibold text-foreground leading-snug px-2">
                      {card.question}
                    </h5>
                  </div>
                  <div className="h-2" />
                </div>

                {/* Back Side */}
                <div 
                  className="absolute inset-0 w-full h-full p-6 flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)]"
                >
                  <div className="flex justify-between items-start">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-purple-400 font-mono">
                      EXPLANATION
                    </span>
                    <span className="text-xs text-purple-400 font-mono">Click to flip back</span>
                  </div>
                  <div className="flex-1 flex items-center justify-center text-center overflow-y-auto">
                    <p className="text-sm text-slate-200 leading-relaxed px-2 py-1">
                      {card.answer}
                    </p>
                  </div>
                  <div className="h-2" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
