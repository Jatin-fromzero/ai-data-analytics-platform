'use client';

import React from 'react';
import { CourseContent } from '@/types/course';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CourseSidebarProps {
  content: CourseContent;
  activeSectionId: string;
  onSectionSelect: (id: string) => void;
  showQuiz: boolean;
  onQuizSelect: (show: boolean) => void;
}

export function CourseSidebar({
  content,
  activeSectionId,
  onSectionSelect,
  showQuiz,
  onQuizSelect
}: CourseSidebarProps) {
  return (
    <Card className="border border-border/60 bg-surface/30 p-5 rounded-[2rem] h-fit shadow-md backdrop-blur-sm sticky top-24">
      <div className="space-y-6">
        {/* Course Meta */}
        <div className="space-y-1 pb-4 border-b border-border/50">
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-brand">
            Phase {content.phase} · Part {content.part}
          </span>
          <h4 className="text-sm font-bold text-foreground leading-tight tracking-tight">
            {content.title}
          </h4>
        </div>

        {/* Section Links */}
        <div className="space-y-1">
          <p className="text-[9px] font-bold uppercase tracking-widest text-muted mb-3">Syllabus Chapters</p>
          <div className="space-y-1.5">
            {content.sections.map((section) => {
              const isActive = activeSectionId === section.id && !showQuiz;

              return (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => {
                    onSectionSelect(section.id);
                    onQuizSelect(false);
                  }}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 focus:outline-none text-left",
                    isActive
                      ? "border-brand bg-brand/5 text-brand"
                      : "border-transparent text-muted hover:text-foreground hover:bg-white/5"
                  )}
                >
                  <span className="text-xs shrink-0">✦</span>
                  <span className="truncate">{section.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz Link */}
        {content.quiz.length > 0 && (
          <div className="pt-2 border-t border-border/50">
            <button
              type="button"
              onClick={() => onQuizSelect(true)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-xs font-bold border transition-all duration-200 focus:outline-none text-left",
                showQuiz
                  ? "border-purple-500 bg-purple-500/5 text-purple-400"
                  : "border-transparent bg-background/40 text-muted hover:text-foreground hover:border-border"
              )}
            >
              <span className="flex items-center gap-2.5">
                <span className="text-xs shrink-0">🧠</span>
                <span>Self-Assessment Quiz</span>
              </span>
              <span className="px-2 py-0.5 rounded bg-background text-[9px] font-mono text-muted uppercase">
                {content.quiz.length} Qs
              </span>
            </button>
          </div>
        )}
      </div>
    </Card>
  );
}
export type { CourseSidebarProps };
