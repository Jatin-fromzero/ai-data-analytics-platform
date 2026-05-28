'use client';

import React from 'react';
import { CourseContent, Block, getAccentClasses, AccentColor } from '@/types/course';
import { FormulaCard } from './FormulaCard';
import { ChartRenderer } from './ChartRenderer';
import { AccordionRenderer } from './AccordionRenderer';
import { StepsRenderer } from './StepsRenderer';
import { ComparisonRenderer } from './ComparisonRenderer';
import { PracticeRenderer } from './PracticeRenderer';
import { DatasetRenderer } from './DatasetRenderer';
import { TaskRenderer } from './TaskRenderer';
import { RubricRenderer } from './RubricRenderer';
import { FlashcardRenderer } from './FlashcardRenderer';
import { AIToolRenderer } from './AIToolRenderer';
import { WorkflowRenderer } from './WorkflowRenderer';
import { StatGridRenderer } from './StatGridRenderer';
import { OverviewCardsRenderer } from './OverviewCardsRenderer';
import { cn } from '@/lib/utils';

interface LessonRendererProps {
  content: CourseContent;
  activeSectionId: string;
}

export function LessonRenderer({ content, activeSectionId }: LessonRendererProps) {
  const activeSection = content.sections.find((s) => s.id === activeSectionId) || content.sections[0];

  const renderBlock = (block: Block, index: number) => {
    switch (block.type) {
      case 'text': {
        // A simple markdown processor for bold (**), inline code (`), and lists
        const formattedContent = block.content.split('\n').map((line, lIdx) => {
          if (line.trim().startsWith('- ')) {
            return (
              <li key={lIdx} className="ml-5 list-disc text-sm text-slate-350 leading-relaxed py-1">
                {parseInlineFormatting(line.substring(2))}
              </li>
            );
          }
          return (
            <p key={lIdx} className="text-sm sm:text-base text-slate-350 leading-relaxed mb-4">
              {parseInlineFormatting(line)}
            </p>
          );
        });

        return (
          <div key={index} className="space-y-1 py-1">
            {formattedContent}
          </div>
        );
      }

      case 'callout': {
        // Resolve default icon & accent color if not explicitly provided
        let categoryColor: AccentColor = 'coral';
        let defaultIcon = '💡';

        if (block.category === 'warning') {
          categoryColor = 'red';
          defaultIcon = '⚠️';
        } else if (block.category === 'prompt') {
          categoryColor = 'purple';
          defaultIcon = '🤖';
        } else if (block.category === 'insight') {
          categoryColor = 'green';
          defaultIcon = '🎯';
        } else if (block.category === 'important') {
          categoryColor = 'orange';
          defaultIcon = '📢';
        } else if (block.category === 'note') {
          categoryColor = 'blue';
          defaultIcon = '📝';
        } else if (block.category === 'tip') {
          categoryColor = 'pink';
          defaultIcon = '💡';
        }

        const accent = getAccentClasses(block.color ?? categoryColor);

        return (
          <div 
            key={index}
            className={cn(
              "rounded-2xl border p-5 flex gap-4 items-start shadow-sm my-5 transition-all hover:bg-opacity-15",
              accent.twBorder,
              accent.twBg
            )}
          >
            <span className="text-xl leading-none shrink-0">
              {block.icon || defaultIcon}
            </span>
            <div className="space-y-1">
              {block.title && (
                <h5 className={cn("text-xs font-bold uppercase tracking-wider", accent.twText)}>
                  {block.title}
                </h5>
              )}
              <div className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {parseInlineFormatting(block.content)}
              </div>
            </div>
          </div>
        );
      }

      // Legacy fallback for course contents with type 'info'
      case 'info': {
        const legacyBlock = block;
        let boxStyles = "border-brand/20 bg-brand/5 text-brand";
        if (legacyBlock.category === 'warning') {
          boxStyles = "border-red-500/20 bg-red-500/5 text-red-400";
        } else if (legacyBlock.category === 'prompt') {
          boxStyles = "border-purple-500/20 bg-purple-500/5 text-purple-400";
        }

        return (
          <div 
            key={index}
            className={cn(
              "rounded-2xl border p-5 flex gap-4 items-start shadow-sm my-4",
              boxStyles
            )}
          >
            {legacyBlock.icon && <span className="text-xl leading-none shrink-0">{legacyBlock.icon}</span>}
            <div className="space-y-1">
              {legacyBlock.title && (
                <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {legacyBlock.title}
                </h5>
              )}
              <p className="text-xs sm:text-sm leading-relaxed text-slate-300">
                {legacyBlock.content}
              </p>
            </div>
          </div>
        );
      }

      case 'formula':
        return <FormulaCard key={index} block={block} />;

      case 'concept-table':
        return (
          <div key={index} className="overflow-x-auto rounded-[1.25rem] border border-border bg-surface/30 my-6 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border/80 bg-surface/75">
                  {block.headers.map((h, hIdx) => {
                    const rowAccent = block.rowColors?.[0] ? getAccentClasses(block.rowColors[0]) : null;
                    return (
                      <th key={hIdx} className={cn("px-5 py-3.5 font-bold text-foreground", rowAccent?.twText)}>
                        {h}
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {block.rows.map((row, rIdx) => {
                  const rowAccent = block.rowColors?.[rIdx] ? getAccentClasses(block.rowColors[rIdx]) : null;
                  return (
                    <tr 
                      key={rIdx} 
                      className="border-b border-border/40 last:border-0 hover:bg-surface/20 transition-colors"
                    >
                      {row.map((cell, cIdx) => (
                        <td 
                          key={cIdx} 
                          className={cn(
                            "px-5 py-4 text-slate-350 leading-relaxed font-medium",
                            cIdx === 0 && rowAccent?.twText
                          )}
                        >
                          {parseInlineFormatting(cell)}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        );

      case 'code':
        return (
          <div key={index} className="rounded-[1.25rem] border border-border bg-black/40 overflow-hidden my-5 shadow-inner">
            {block.label && (
              <div className="border-b border-border bg-surface/50 px-5 py-2.5 flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted font-mono">
                  {block.label}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-brand font-mono">
                  {block.language}
                </span>
              </div>
            )}
            <div className="relative">
              <pre className="p-5 overflow-x-auto text-xs sm:text-sm text-emerald-400 font-mono leading-relaxed">
                <code>{block.code}</code>
              </pre>
            </div>
            {block.annotation && (
              <div className="border-t border-border bg-surface/30 px-5 py-3 text-xs text-slate-400 leading-relaxed italic">
                {block.annotation}
              </div>
            )}
          </div>
        );

      case 'visual':
        return <ChartRenderer key={index} block={block} />;

      case 'accordion':
        return <AccordionRenderer key={index} block={block} />;

      case 'steps':
        return <StepsRenderer key={index} block={block} />;

      case 'comparison':
        return <ComparisonRenderer key={index} block={block} />;

      case 'practice':
        return <PracticeRenderer key={index} block={block} />;

      case 'dataset':
        return <DatasetRenderer key={index} block={block} />;

      case 'task':
        return <TaskRenderer key={index} block={block} />;

      case 'rubric':
        return <RubricRenderer key={index} block={block} />;

      case 'flashcard':
        return <FlashcardRenderer key={index} block={block} />;

      case 'ai-tool':
        return <AIToolRenderer key={index} block={block} />;

      case 'workflow':
        return <WorkflowRenderer key={index} block={block} />;

      case 'stat-grid':
        return <StatGridRenderer key={index} block={block} />;

      case 'overview-cards':
        return <OverviewCardsRenderer key={index} block={block} />;

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mb-2">
          {activeSection.title}
        </h3>
        <div className="h-0.5 w-12 bg-brand rounded-full" />
      </div>
      <div className="space-y-6">
        {activeSection.blocks.map((block, idx) => renderBlock(block, idx))}
      </div>
    </div>
  );
}

// Inline markdown helper parser
function parseInlineFormatting(text: string) {
  if (!text) return '';
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={index} className="px-1.5 py-0.5 rounded bg-surface border border-border text-brand font-mono text-[0.85em] font-medium mx-0.5">
          {part.slice(1, -1)}
        </code>
      );
    }
    return part;
  });
}

export type { LessonRendererProps };
